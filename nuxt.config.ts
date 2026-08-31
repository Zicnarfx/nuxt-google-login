export default defineNuxtConfig({
  modules: ['vuetify-nuxt-module'],

  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: 'mdi'
      }
    }
  },

  runtimeConfig: {
    public: {
      googleClientId: ''
    }
  }
})