<template>
  <div class="profile-page">
    <v-container class="py-8" style="max-width: 560px">
      <v-card v-if="user" class="profile-card pa-8 text-center">
        <v-avatar size="112" class="profile-avatar mb-4">
          <v-img v-if="user.picture" :src="user.picture" referrerpolicy="no-referrer" />
          <v-icon v-else icon="mdi-account" size="56" />
        </v-avatar>

        <h2 class="profile-name">{{ user.name }}</h2>
        <p class="profile-email">{{ user.email }}</p>

        <v-divider class="profile-divider my-6" />

        <v-btn
          block
          variant="tonal"
          class="logout-btn"
          prepend-icon="mdi-logout"
          @click="logout"
        >
          Logout
        </v-btn>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = ref<any>(null)

onMounted(() => {
  const savedUser = localStorage.getItem('google_user')
  if (savedUser) {
    user.value = JSON.parse(savedUser)
    console.log('user object:', user.value)
    console.log('picture url:', user.value.picture)
  }
})

const logout = () => {
  localStorage.removeItem('google_user')
  localStorage.removeItem('google_token')

  router.push('/login')
}
</script>

<!-- Not scoped on purpose: Vuetify's inner elements live outside this component's scope ID. -->
<style>
/* Green/dark theme for this page only (same palette as the other pages) */
.profile-page {
  --v-theme-primary: 53, 255, 154;
  --v-theme-surface: 6, 30, 22;
  --v-theme-on-surface: 240, 255, 248;
  --v-theme-background: 3, 20, 15;
  --v-theme-on-background: 240, 255, 248;
  --v-border-color: 7, 155, 94;
  --v-border-opacity: 1;

  min-height: calc(100vh - 64px);
  background: #03140f;
  color: #f0fff8;
}

.v-main:has(.profile-page) {
  background: #03140f;
}

/* Card */
.profile-page .profile-card {
  background: #061e16;
  color: #f0fff8;
  border: 1px solid #079b5e;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 255, 140, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Avatar */
.profile-page .profile-avatar {
  background: #073c2b;
  border: 3px solid #35ff9a;
  box-shadow: 0 0 18px rgba(53, 255, 154, 0.3);
}

.profile-page .profile-avatar .v-icon {
  color: #35ff9a;
}

/* Name + email */
.profile-name {
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 1.3;
  color: #f0fff8;
}

.profile-email {
  margin: 4px 0 0;
  color: #b9d9ca;
  word-break: break-all;
}

.profile-page .profile-divider {
  width: 100%;
  border-color: #104532;
  opacity: 1;
}

/* Logout button */
.profile-page .logout-btn {
  background: #073c2b;
  color: #36e991;
  border: 1px solid #08a663;
}

.profile-page .logout-btn:hover {
  background: #0b3827;
  border-color: #35ff9a;
}
</style>