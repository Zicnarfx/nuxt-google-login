<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'

const result = ref('')
const scannerRunning = ref(false)
const errorMessage = ref('')
const copied = ref(false)

let scanner = null

const startScanner = async () => {
  if (scannerRunning.value) return

  errorMessage.value = ''
  copied.value = false

  try {
    scanner = new Html5Qrcode('reader')

    await scanner.start(
      {
        facingMode: 'environment'
      },
      {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250
        },
        aspectRatio: 1.0
      },
      async (decodedText) => {
        // Show scanned QR text
        result.value = decodedText

        console.log('QR Code:', decodedText)

        // Stop camera after successful scan
        await stopScanner()
      },
      () => {
        // Normal scanning failures are ignored.
        // This callback fires when a frame doesn't contain a QR code.
      }
    )

    scannerRunning.value = true
  } catch (error) {
    console.error(error)

    errorMessage.value =
      'Unable to access the camera. Please allow camera permission.'

    scannerRunning.value = false
    scanner = null
  }
}

const stopScanner = async () => {
  if (!scanner) return

  try {
    if (scannerRunning.value) {
      await scanner.stop()
    }

    scanner.clear()
  } catch (error) {
    console.error('Error stopping scanner:', error)
  }

  scannerRunning.value = false
  scanner = null
}

const clearResult = () => {
  result.value = ''
  errorMessage.value = ''
  copied.value = false
}

const copyResult = async () => {
  if (!result.value) return

  try {
    await navigator.clipboard.writeText(result.value)

    copied.value = true

    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Copy failed:', error)
  }
}

onBeforeUnmount(async () => {
  await stopScanner()
})
</script>

<template>
  <div class="scanner-page">

    <div class="scanner-card">

      <!-- Title -->
      <h2 class="scanner-title">
        QR Code Scanner
      </h2>

      <!-- Camera -->
      <div class="scanner-box">
        <div id="reader"></div>

        <!-- Camera placeholder -->
        <div
          v-if="!scannerRunning"
          class="scanner-placeholder"
        >
          <div class="camera-icon">
            📷
          </div>

          <span>
            Camera is stopped
          </span>
        </div>
      </div>

      <!-- Error -->
      <div
        v-if="errorMessage"
        class="error-message"
      >
        {{ errorMessage }}
      </div>

      <!-- Result -->
      <div class="result-container">

        <div class="result-label">
          RESULT:
        </div>

        <div
          class="result-text"
          :class="{ empty: !result }"
        >
          {{ result || 'No QR code scanned' }}
        </div>

      </div>

      <!-- Buttons -->
      <div class="scanner-buttons">

        <button
          class="scanner-btn start-btn"
          :disabled="scannerRunning"
          @click="startScanner"
        >
          📷
          Start Scanner
        </button>

        <button
          class="scanner-btn stop-btn"
          :disabled="!scannerRunning"
          @click="stopScanner"
        >
          ■
          Stop Scanner
        </button>

      </div>

      <!-- Result Actions -->
      <div
        v-if="result"
        class="result-buttons"
      >

        <button
          class="action-btn copy-btn"
          @click="copyResult"
        >
          {{ copied ? '✓ Copied' : '📋 Copy Result' }}
        </button>

        <button
          class="action-btn clear-btn"
          @click="clearResult"
        >
          🗑 Clear
        </button>

      </div>

      <!-- Status -->
      <div class="scanner-status">
        <span
          class="status-dot"
          :class="{ active: scannerRunning }"
        ></span>

        {{ scannerRunning ? 'Scanner is running' : 'Scanner is stopped' }}
      </div>

    </div>

  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.scanner-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: #f5f5f5;
}

.scanner-card {
  width: 400px;
  max-width: 100%;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}

.scanner-title {
  margin: 0 0 18px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #222;
}

/* Camera */
.scanner-box {
  position: relative;
  width: 100%;
  height: 300px;
  margin-bottom: 20px;
  background: #000;
  border-radius: 40px;
  overflow: hidden;
  box-sizing: border-box;
}

/*
 * html5-qrcode creates the video dynamically.
 * :deep() is important because this is <style scoped>.
 */
.scanner-box :deep(#reader) {
  width: 100% !important;
  height: 100% !important;
  border: none !important;
}

.scanner-box :deep(video) {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
  object-fit: cover !important;
  display: block;
}

/* Remove default html5-qrcode borders */
.scanner-box :deep(#reader__scan_region) {
  border: none !important;
}

.scanner-box :deep(#reader__dashboard) {
  display: none !important;
}

.scanner-placeholder {
  position: absolute;
  inset: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: #aaa;
  background: #000;
  pointer-events: none;
}

.camera-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

/* Result */
.result-container {
  margin-bottom: 18px;
  text-align: center;
}

.result-label {
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.result-text {
  min-height: 45px;
  padding: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #ddd;
  border-radius: 6px;

  background: #fafafa;

  color: #222;
  font-size: 14px;

  word-break: break-all;
  overflow-wrap: anywhere;
}

.result-text.empty {
  color: #999;
}

/* Main buttons */
.scanner-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.scanner-btn {
  min-width: 140px;
  padding: 10px 14px;

  border: 1px solid #333;
  border-radius: 5px;

  background: white;
  color: #222;

  font-size: 14px;
  cursor: pointer;
}

.scanner-btn:hover:not(:disabled) {
  background: #f2f2f2;
}

.scanner-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.start-btn {
  border-color: #198754;
  color: #198754;
}

.stop-btn {
  border-color: #dc3545;
  color: #dc3545;
}

/* Result buttons */
.result-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 14px;
}

.action-btn {
  padding: 8px 14px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
}

.copy-btn {
  border: 1px solid #0d6efd;
  background: #0d6efd;
  color: white;
}

.clear-btn {
  border: 1px solid #dc3545;
  background: white;
  color: #dc3545;
}

/* Status */
.scanner-status {
  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 18px;

  font-size: 12px;
  color: #777;
}

.status-dot {
  width: 8px;
  height: 8px;
  margin-right: 6px;

  border-radius: 50%;
  background: #aaa;
}

.status-dot.active {
  background: #198754;
}

/* Error */
.error-message {
  margin-bottom: 15px;
  padding: 10px;

  border-radius: 5px;

  background: #fff0f0;
  color: #dc3545;

  text-align: center;
  font-size: 13px;
}

/* Mobile */
@media (max-width: 480px) {
  .scanner-page {
    padding: 12px;
  }

  .scanner-card {
    padding: 15px;
  }

  .scanner-box {
    height: 280px;
    border-radius: 30px;
  }

  .scanner-buttons {
    flex-direction: column;
  }

  .scanner-btn {
    width: 100%;
  }
}
</style>
