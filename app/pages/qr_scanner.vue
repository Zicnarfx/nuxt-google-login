<template>
  <div class="qr-page">
    <v-container class="py-6 pb-12" style="max-width: 760px">
      <h1 class="text-h5 font-weight-bold mb-1">QR Scanner</h1>
      <p class="qr-subtitle mb-4">
        Press Start, allow camera access, and hold a QR code inside the frame.
      </p>

      <v-alert v-if="error" type="error" variant="tonal" closable class="mb-4" @click:close="error = ''">
        {{ error }}
      </v-alert>

      <!-- Scanner viewport -->
      <v-card variant="outlined" class="qr-card pa-4">
        <div class="qr-status mb-3">
          <span class="status-dot" :class="{ on: scanning }" />
          {{ scanning ? 'Scanner is on' : 'Scanner is off' }}
        </div>

        <div class="qr-frame">
          <!-- html5-qrcode renders the camera feed into this element -->
          <div id="qr-reader" />

          <div v-if="!scanning" class="qr-placeholder">
            <v-progress-circular v-if="starting" indeterminate color="primary" />
            <template v-else>
              <v-icon icon="mdi-qrcode-scan" size="64" />
              <div class="mt-2">Camera is off</div>
            </template>
          </div>
        </div>

        <div class="d-flex ga-3 mt-4">
          <v-btn
            class="qr-btn"
            variant="tonal"
            prepend-icon="mdi-play"
            :disabled="scanning"
            :loading="starting"
            @click="startScanner"
          >
            Start scanner
          </v-btn>
          <v-btn
            class="qr-btn"
            variant="tonal"
            prepend-icon="mdi-stop"
            :disabled="!scanning"
            @click="stopScanner"
          >
            Stop scanner
          </v-btn>
        </div>
      </v-card>
    </v-container>

    <!-- Result popup -->
    <v-dialog v-model="dialog" max-width="440" content-class="qr-dialog">
      <v-card class="qr-result pa-5">
        <div class="d-flex align-center ga-3 mb-3">
          <v-avatar size="44" class="result-avatar">
            <v-icon icon="mdi-check" size="26" />
          </v-avatar>
          <div class="text-h6 font-weight-bold">Scan successful</div>
        </div>

        <div class="result-box">{{ result }}</div>

        <div class="d-flex flex-wrap ga-2 mt-4">
          <v-btn
            class="qr-btn"
            variant="tonal"
            :prepend-icon="copied ? 'mdi-check' : 'mdi-content-copy'"
            @click="copyResult"
          >
            {{ copied ? 'Copied' : 'Copy' }}
          </v-btn>
          <v-btn
            v-if="isUrl"
            class="qr-btn"
            variant="tonal"
            prepend-icon="mdi-open-in-new"
            :href="result"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open link
          </v-btn>
        </div>

        <div class="d-flex justify-end ga-2 mt-5">
          <v-btn variant="text" class="result-close" @click="dialog = false">Close</v-btn>
          <v-btn class="qr-btn" variant="tonal" prepend-icon="mdi-qrcode-scan" @click="scanAgain">
            Scan again
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
// Requires: npm install html5-qrcode
// The camera needs HTTPS (or localhost) to work in the browser.
const scanner = shallowRef(null)
const scanning = ref(false)
const starting = ref(false)
const error = ref('')

const dialog = ref(false)
const result = ref('')
const copied = ref(false)

const isUrl = computed(() => /^https?:\/\//i.test(result.value))

async function startScanner() {
  error.value = ''
  starting.value = true
  try {
    // Loaded on demand so it only runs in the browser (not during SSR)
    const { Html5Qrcode } = await import('html5-qrcode')
    scanner.value = new Html5Qrcode('qr-reader')
    await scanner.value.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 240, height: 240 } },
      onScanSuccess,
      () => {} // ignore "no code found in this frame"
    )
    scanning.value = true
  } catch (e) {
    const text = String(e)
    error.value =
      text.includes('NotAllowed') || text.includes('Permission')
        ? 'Camera access was denied. Allow camera permission in your browser and try again.'
        : text.includes('NotFound')
          ? 'No camera was found on this device.'
          : 'Could not start the camera. Make sure no other app is using it.'
    await stopScanner()
  } finally {
    starting.value = false
  }
}

async function stopScanner() {
  const instance = scanner.value
  scanner.value = null
  scanning.value = false
  if (!instance) return
  try {
    if (instance.isScanning) await instance.stop()
    instance.clear()
  } catch (e) {
    // camera was already stopped
  }
}

async function onScanSuccess(text) {
  if (dialog.value) return // ignore repeat reads while the popup is open
  result.value = text
  copied.value = false
  dialog.value = true
  await stopScanner()
}

async function copyResult() {
  try {
    await navigator.clipboard.writeText(result.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (e) {
    error.value = 'Could not copy to the clipboard.'
  }
}

function scanAgain() {
  dialog.value = false
  startScanner()
}

onBeforeUnmount(stopScanner)
</script>

<!-- Not scoped on purpose: Vuetify's inner elements, the camera feed and the dialog
     are rendered outside this component's scope ID. -->
<style>
/* Green/dark theme for this page only (same palette as the other pages) */
.qr-page,
.qr-dialog {
  --v-theme-primary: 53, 255, 154;
  --v-theme-surface: 6, 30, 22;
  --v-theme-on-surface: 240, 255, 248;
  --v-theme-background: 3, 20, 15;
  --v-theme-on-background: 240, 255, 248;
  --v-border-color: 7, 155, 94;
  --v-border-opacity: 1;
}

.qr-page {
  min-height: calc(100vh - 64px);
  background: #03140f;
  color: #f0fff8;
}

.v-main:has(.qr-page) {
  background: #03140f;
}

.qr-subtitle {
  color: #b9d9ca;
}

/* Scanner card */
.qr-page .qr-card {
  background: #061e16;
  color: #f0fff8;
  border: 1px solid #079b5e;
  border-radius: 12px;
}

.qr-status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #3cf0a0;
  font-weight: 600;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4a6b5c;
}

.status-dot.on {
  background: #35ff9a;
  box-shadow: 0 0 8px #35ff9a;
}

/* Camera frame */
.qr-frame {
  position: relative;
  min-height: 300px;
  border: 1px solid #08a663;
  border-radius: 10px;
  background: #03140f;
  overflow: hidden;
}

#qr-reader {
  width: 100%;
  border: none !important;
}

#qr-reader video {
  width: 100% !important;
  object-fit: cover;
}

.qr-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #7fb8a0;
  background: #03140f;
}

.qr-placeholder .v-icon {
  color: #39ed9b;
}

/* Buttons */
.qr-page .qr-btn,
.qr-dialog .qr-btn {
  background: #073c2b;
  color: #36e991;
  border: 1px solid #08a663;
}

/* Result popup */
.qr-dialog .qr-result {
  background: #061e16;
  color: #f0fff8;
  border: 1px solid #079b5e;
  border-radius: 12px;
}

.qr-dialog .result-avatar {
  background: #073c2b;
  border: 1px solid #08a663;
}

.qr-dialog .result-avatar .v-icon {
  color: #35ff9a;
}

.qr-dialog .result-box {
  padding: 12px 14px;
  border: 1px solid #104532;
  border-radius: 8px;
  background: #03140f;
  color: #f0fff8;
  word-break: break-all;
  max-height: 180px;
  overflow-y: auto;
}

.qr-dialog .result-close {
  color: #b9d9ca;
}
</style>