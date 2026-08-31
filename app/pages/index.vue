<template>
 <v-container class="pa-6">
  <v-row justify="center">
<v-col cols="12" md="6">
      <v-card v-if="user" class="pa-6">
 <v-avatar size="64">
  <v-img :src="user.picture" referrerpolicy="no-referrer" />
</v-avatar>
 <div>
 <h2>{{ user.name }}</h2>
 <p>{{ user.email }}</p>
 </div>
 <v-btn  block
  color="primary"
  class="my-4"
 @click="logout">
 Logout
</v-btn>
</v-card>
</v-col>
  </v-row>
 </v-container>
 
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