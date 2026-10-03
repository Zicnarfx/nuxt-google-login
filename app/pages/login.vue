<template>
  <div class="login-page">
    <v-container
      class="d-flex align-center justify-center"
      style="min-height: 100vh"
    >
      <v-card width="400" class="login-card pa-6 rounded-xl">
        <v-card-title class="text-center text-h5 login-title">
          Login
        </v-card-title>
        <v-card-subtitle class="text-center login-subtitle mb-4">
          Sign in to System Integration
        </v-card-subtitle>
        <v-card-text>
          <v-btn
            block
            variant="tonal"
            size="large"
            class="google-btn"
            prepend-icon="mdi-google"
            @click="loginWithGoogle"
          >
            Sign in with Google
          </v-btn>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
definePageMeta({
    layout: false,
    middleware: 'auth'
})

const config = useRuntimeConfig()
definePageMeta({ layout: false })

declare global {
  interface Window {
    google: any
  }
}

console.log('Google Client ID:', config.public.googleClientId)

const loginWithGoogle = () => {
  console.log('Using Client ID:', config.public.googleClientId)

  const client = window.google.accounts.oauth2.initTokenClient({
    client_id: config.public.googleClientId,
    scope: 'openid email profile',

    callback: async (response: any) => {
      const userInfo = await $fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${response.access_token}`
          }
        }
      )

      localStorage.setItem(
        'google_user',
        JSON.stringify(userInfo)
      )

      localStorage.setItem(
        'google_token',
        response.access_token
      )

      navigateTo('/dashboard')
    }
  })

  client.requestAccessToken()
}
</script>

<!-- Not scoped on purpose: Vuetify's inner elements live outside this component's scope ID. -->
<style>
/* Green/dark theme for this page only (same palette as the other pages) */
.login-page {
  --v-theme-primary: 53, 255, 154;
  --v-theme-surface: 6, 30, 22;
  --v-theme-on-surface: 240, 255, 248;
  --v-theme-background: 3, 20, 15;
  --v-theme-on-background: 240, 255, 248;
  --v-border-color: 7, 155, 94;
  --v-border-opacity: 1;

  min-height: 100vh;
  color: #f0fff8;
  background:
    radial-gradient(circle at 50% 35%, rgba(0, 158, 89, 0.28), transparent 55%),
    #03140f;
}

/* This page has no layout, so make sure the app wrapper is dark too */
.v-application:has(.login-page) {
  background: #03140f !important;
}

/* Card */
.login-page .login-card {
  background: #061e16;
  color: #f0fff8;
  border: 1px solid #079b5e;
  box-shadow: 0 5px 24px rgba(0, 255, 140, 0.15);
}

.login-page .login-title {
  color: #f0fff8;
}

.login-page .login-subtitle {
  color: #b9d9ca;
  opacity: 1;
}

/* Google button */
.login-page .google-btn {
  background: #073c2b;
  color: #36e991;
  border: 1px solid #08a663;
}

.login-page .google-btn:hover {
  background: #0b3827;
  border-color: #35ff9a;
}
</style>