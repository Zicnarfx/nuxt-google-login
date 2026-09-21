<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="scanner-card" elevation="2">

      <!-- Scanner Area -->
      <div class="scanner-box">
        <!-- QR scanner/camera will appear here -->
      </div>

      <!-- Result -->
      <div class="result">
        RESULT:
      </div>

      <!-- Buttons -->
      <div class="scanner-buttons">
        <v-btn
          class="scanner-btn"
          variant="outlined"
          @click="startScanner"
        >
          <v-icon start>mdi-qrcode-scan</v-icon>
          Start Scanner
        </v-btn>

        <v-btn
          class="scanner-btn"
          variant="outlined"
          @click="stopScanner"
        >
          <v-icon start>mdi-stop</v-icon>
          Stop Scanner
        </v-btn>
      </div>

    </v-card>
  </v-container>
</template>

<script setup lang="ts">

const startScanner = () => {
  console.log('Scanner started')
}

const stopScanner = () => {
  console.log('Scanner stopped')
}

</script>

<style scoped>
.scanner-card {
  width: 400px;
  padding: 16px;
}


.scanner-box {
  width: 100%;
  height: 155px;
  background: black;

  border: 5px solid #00ff00;
  border-radius: 50px;

  margin-bottom: 22px;
}

.result {
  text-align: center;
  font-size: 14px;
  margin-bottom: 14px;
}


.scanner-buttons {
  display: flex;

 
  gap: 16px;

  justify-content: center;
}


.scanner-btn {
  min-width: 137px;
  text-transform: none;
}
</style>