<template>
  <v-app>

    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      expand-on-hover
      @mouseenter="rail = false"
      @mouseleave="rail = true"
    >
      <!-- User -->
      <v-list>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
          subtitle="francisdavidmadla@gmail.com"
          title="Francis David Madla"
        />
      </v-list>

      <v-divider />

      <!-- Navigation -->
      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          to="/"
        />

        <v-list-item
          prepend-icon="mdi-qrcode-scan"
          title="QR Scanner"
          to="/qr-scanner"
        />

        <v-list-item
          prepend-icon="mdi-weather-cloudy"
          title="Weather Forecast"
          to="/weather"
        />
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar
      color="primary"
      elevation="2"
      :height="64"
    >
      <v-app-bar-nav-icon
        @click="rail = !rail"
      />

      <v-toolbar-title>
        System Integration
      </v-toolbar-title>

      <v-spacer />

      <!-- Optional actions -->
      <v-btn icon>
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Page Content -->
    <v-main>
      <slot />
    </v-main>

  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const drawer = ref(true)
const rail = ref(true)
</script>
