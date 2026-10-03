<<<<<<< HEAD

<template>
 <v-layout style="min-height: 100vh">
    <!-- Drawer comes first so it spans the full height -->
    <v-navigation-drawer
      permanent
      :rail="rail"
      @mouseenter="rail = false"
      @mouseleave="rail = true"
    >
      <v-list-item
  :height="headerHeight"
  to="/profile"
  prepend-avatar="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpT2kcLxK2YtohQlWUVKBgBonF06uspfuXVNyQcBymuA&s=10"
  subtitle="francis_madla@gmail.com"
  title="Francis Madla"
/>

      <v-divider />

   <v-list density="compact" nav>
  <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" value="dashboard" to="/dashboard" />
  <v-list-item prepend-icon="mdi-qrcode-scan" title="QR Scanner" value="qr-scanner" to="/qr_scanner" />
  <v-list-item prepend-icon="mdi-weather-partly-cloudy" title="Weather App" value="weather" to="/weather_app" />
</v-list>
    </v-navigation-drawer>

   <v-app-bar class="app-bar-gradient" flat>
  <v-app-bar-title>System Integration</v-app-bar-title>
</v-app-bar>
    <v-main>
      <slot />
    </v-main>
  </v-layout>
</template>
<script setup>
const rail = ref(true)
const headerHeight = 64
</script>
<style scoped>
.v-app-bar.app-bar-gradient {
  background: linear-gradient(90deg, #03140f 0%, #064d36 55%, #009e59 100%) !important;
  color: #f0fff8 !important;
  border-bottom: 1px solid #08a663;
  box-shadow: 0 2px 12px rgba(0, 255, 140, 0.12);
}

.v-app-bar.app-bar-gradient .v-icon,
.v-app-bar.app-bar-gradient .v-btn {
  color: #f0fff8;
}
/* Selected item text and icon */
.v-list-item--active {
  color: #4CAF50 !important;
  background-color: #000000 !important;
}

.v-list-item--active :deep(.v-icon) {
  color: #4CAF50 !important;
}v-list-item--active {
  color: green !important;
}

/* Selected icon */
.v-list-item--active :deep(.v-icon) {
  color: rgb(4, 251, 0) !important;

}
</style>
  

=======
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
>>>>>>> 68db33650be52af4408adde1512eae636ac6e28a
