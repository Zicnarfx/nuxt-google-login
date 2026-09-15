<template>
  <div>
    <h1>QR Scanner</h1>
    <v-card justify="center" align="center" class="mx-auto" max-width="400">
      <v-card-text>
        <!-- show qr scanner -->
        <video class="qr-video"></video>
        <p> RESULT: </p>
        <v-btn>
          <v-icon>mdi-qrcode-scan</v-icon>
          Start Scanner
        </v-btn>
        <v-btn>
          <v-icon>mdi-stop</v-icon>
          Stop Scanner
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>

</script>

<style>
  .qr-video {
    width: 100%;
    max-width: 400px;
    height: auto;
    border: 5px solid #01f801;
    border-radius: 50px;
    background-color: #000000;
  }
</style>