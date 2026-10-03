<template>
  <div class="weather-page">
    <v-container class="py-6 pb-12" style="max-width: 1100px">
      <h1 class="text-h5 font-weight-bold mb-4">Weather Forecast</h1>

      <!-- Search -->
      <v-row align="center" class="mb-2">
        <v-col cols="12" md="8">
          <v-autocomplete v-model="selected" v-model:search="query" :items="suggestions" item-title="label"
            return-object no-filter hide-no-data hide-details variant="outlined" density="comfortable"
            placeholder="Search for a city..." prepend-inner-icon="mdi-magnify"
            :menu-props="{ contentClass: 'weather-menu' }" @update:model-value="selectPlace" />
        </v-col>
        <v-col cols="12" md="4" class="d-flex align-center ga-2">
          <v-btn variant="tonal" prepend-icon="mdi-crosshairs-gps" @click="useMyLocation">
            My location
          </v-btn>
          <v-btn variant="tonal" icon="mdi-refresh" :loading="loading" @click="loadWeather" />
        </v-col>
      </v-row>

      <v-alert v-if="error" type="error" variant="tonal" closable class="mb-4">
        {{ error }}
      </v-alert>

      <div v-if="!weather && loading" class="text-center pa-10">
        <v-progress-circular indeterminate size="48" color="primary" />
      </div>

      <template v-if="weather">
        <!-- Current conditions -->
        <v-card class="hero pa-6 mb-4" :class="current.is_day ? 'hero-day' : 'hero-night'" elevation="3">
          <div class="d-flex flex-wrap justify-space-between align-center ga-4">
            <div>
              <div class="text-h6">{{ placeLabel }}</div>
              <div class="text-body-2 opacity-80">{{ today }}</div>
              <div class="hero-temp my-2">{{ Math.round(current.temperature_2m) }}°C</div>
              <div class="text-h6">{{ now.label }}</div>
              <div class="text-body-2 opacity-80">
                Feels like {{ Math.round(current.apparent_temperature) }}°C
              </div>
            </div>
            <v-icon :icon="now.icon" size="120" />
          </div>
        </v-card>

        <!-- Stats -->
        <v-row class="mb-2">
          <v-col v-for="s in stats" :key="s.label" cols="6" md="3">
            <v-card variant="outlined" class="pa-3 text-center h-100">
              <v-icon :icon="s.icon" size="28" />
              <div class="text-subtitle-1 font-weight-bold mt-1">{{ s.value }}</div>
              <div class="text-caption">{{ s.label }}</div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Hourly -->
        <v-card variant="outlined" class="pa-4 mb-4">
          <div class="text-subtitle-1 font-weight-bold mb-3 section-title">Next 12 hours</div>
          <div class="hourly">
            <div v-for="h in hourly" :key="h.time" class="hour">
              <div class="text-caption">{{ hourLabel(h.time) }}</div>
              <v-icon :icon="h.icon" size="28" class="my-2" />
              <div class="font-weight-bold">{{ h.temp }}°</div>
              <div class="text-caption text-primary">{{ h.rain }}%</div>
            </div>
          </div>
        </v-card>

        <!-- 7-day -->
        <v-card variant="outlined" class="pa-4">
          <div class="text-subtitle-1 font-weight-bold mb-2 section-title">7-day forecast</div>
          <div v-for="(d, i) in daily" :key="d.date" class="day-row">
            <div class="day-name">{{ dayLabel(d.date, i) }}</div>
            <v-icon :icon="d.icon" size="24" />
            <div class="text-caption text-primary day-rain">{{ d.rain }}%</div>
            <div class="day-temps">
              <span class="font-weight-bold">{{ d.max }}°</span>
              <span class="text-medium-emphasis"> / {{ d.min }}°</span>
            </div>
          </div>
        </v-card>

        <div class="text-caption text-medium-emphasis text-center mt-4">
          Updated {{ clock(updatedAt) }} · refreshes every 5 minutes · Data by Open-Meteo
        </div>
      </template>
    </v-container>
  </div>
</template>

<script setup>
const place = ref({
  name: 'San Fernando',
  admin1: 'Pampanga',
  country: 'Philippines',
  latitude: 15.0286,
  longitude: 120.6897,
})
const weather = ref(null)
const loading = ref(false)
const error = ref('')
const updatedAt = ref(null)

const query = ref('')
const selected = ref(null)
const suggestions = ref([])

let timer = null
let searchTimer = null

// Weather code -> label + icon
const codes = {
  0: ['Clear sky', 'mdi-weather-sunny'],
  1: ['Mainly clear', 'mdi-weather-sunny'],
  2: ['Partly cloudy', 'mdi-weather-partly-cloudy'],
  3: ['Overcast', 'mdi-weather-cloudy'],
  45: ['Fog', 'mdi-weather-fog'],
  48: ['Fog', 'mdi-weather-fog'],
  51: ['Light drizzle', 'mdi-weather-rainy'],
  53: ['Drizzle', 'mdi-weather-rainy'],
  55: ['Heavy drizzle', 'mdi-weather-rainy'],
  61: ['Light rain', 'mdi-weather-rainy'],
  63: ['Rain', 'mdi-weather-rainy'],
  65: ['Heavy rain', 'mdi-weather-pouring'],
  80: ['Light showers', 'mdi-weather-rainy'],
  81: ['Showers', 'mdi-weather-pouring'],
  82: ['Heavy showers', 'mdi-weather-pouring'],
  95: ['Thunderstorm', 'mdi-weather-lightning-rainy'],
  96: ['Thunderstorm', 'mdi-weather-lightning-rainy'],
  99: ['Severe thunderstorm', 'mdi-weather-lightning-rainy'],
}

function info(code, isDay = 1) {
  const [label, icon] = codes[code] ?? ['Unknown', 'mdi-weather-cloudy']
  return { label, icon: !isDay && icon === 'mdi-weather-sunny' ? 'mdi-weather-night' : icon }
}

async function loadWeather() {
  loading.value = true
  error.value = ''
  try {
    weather.value = await $fetch('https://api.open-meteo.com/v1/forecast', {
      query: {
        latitude: place.value.latitude,
        longitude: place.value.longitude,
        current:
          'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,is_day',
        hourly: 'temperature_2m,weather_code,precipitation_probability',
        daily:
          'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset',
        timezone: 'auto',
        forecast_days: 7,
      },
    })
    updatedAt.value = new Date()
  } catch (e) {
    error.value = 'Could not load weather data. Check your internet connection and try again.'
  } finally {
    loading.value = false
  }
}

// City search (debounced)
watch(query, (q) => {
  clearTimeout(searchTimer)
  if (!q || q.length < 2 || q === selected.value?.label) return
  searchTimer = setTimeout(async () => {
    try {
      const res = await $fetch('https://geocoding-api.open-meteo.com/v1/search', {
        query: { name: q, count: 6, language: 'en', format: 'json' },
      })
      suggestions.value = (res.results ?? []).map((r) => ({
        ...r,
        label: [r.name, r.admin1, r.country].filter(Boolean).join(', '),
      }))
    } catch (e) {
      suggestions.value = []
    }
  }, 350)
})

function selectPlace(item) {
  if (!item) return
  place.value = item
  loadWeather()
}

function useMyLocation() {
  if (!navigator.geolocation) {
    error.value = 'Your browser does not support location access.'
    return
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      place.value = {
        name: 'My location',
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      }
      selected.value = null
      loadWeather()
    },
    () => {
      error.value = 'Location access was denied. Search for a city instead.'
    }
  )
}

// Derived data
const current = computed(() => weather.value?.current)
const now = computed(() => (current.value ? info(current.value.weather_code, current.value.is_day) : null))
const placeLabel = computed(() =>
  [place.value.name, place.value.admin1, place.value.country].filter(Boolean).join(', ')
)
const today = computed(() =>
  new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
)

const hourly = computed(() => {
  if (!weather.value) return []
  const h = weather.value.hourly
  const nowKey = weather.value.current.time.slice(0, 13) + ':00'
  const start = Math.max(h.time.findIndex((t) => t >= nowKey), 0)
  return h.time.slice(start, start + 12).map((t, i) => {
    const hr = Number(t.slice(11, 13))
    return {
      time: t,
      temp: Math.round(h.temperature_2m[start + i]),
      rain: h.precipitation_probability[start + i],
      ...info(h.weather_code[start + i], hr >= 6 && hr < 18 ? 1 : 0),
    }
  })
})

const daily = computed(() => {
  if (!weather.value) return []
  const d = weather.value.daily
  return d.time.map((t, i) => ({
    date: t,
    max: Math.round(d.temperature_2m_max[i]),
    min: Math.round(d.temperature_2m_min[i]),
    rain: d.precipitation_probability_max[i],
    ...info(d.weather_code[i]),
  }))
})

const stats = computed(() =>
  current.value
    ? [
      { icon: 'mdi-water-percent', label: 'Humidity', value: `${current.value.relative_humidity_2m}%` },
      { icon: 'mdi-weather-windy', label: 'Wind', value: `${Math.round(current.value.wind_speed_10m)} km/h` },
      { icon: 'mdi-weather-pouring', label: 'Rain chance today', value: `${daily.value[0].rain}%` },
      { icon: 'mdi-weather-sunset', label: 'Sunset', value: clock(weather.value.daily.sunset[0]) },
    ]
    : []
)

// Formatters
const clock = (t) => new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
const hourLabel = (t) => new Date(t).toLocaleTimeString([], { hour: 'numeric' })
const dayLabel = (t, i) =>
  i === 0 ? 'Today' : new Date(t + 'T00:00').toLocaleDateString([], { weekday: 'long' })

onMounted(() => {
  loadWeather()
  timer = setInterval(loadWeather, 5 * 60 * 1000) // auto-refresh every 5 minutes
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<!-- Not scoped on purpose: Vuetify's inner elements and the dropdown menu
     live outside this component's scope ID. -->
<style>
/* Re-map Vuetify's theme colors to green/dark inside this page only */
.weather-page {
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

/* Dark area behind the page */
.v-main:has(.weather-page) {
  background: #03140f;
}

/* Title + search */
.weather-page h1 {
  color: #f0fff8;
}

.weather-page .v-field {
  background: #06251a;
  color: #fff;
  border-radius: 10px;
}

.weather-page .v-field--variant-outlined .v-field__outline {
  color: #079b5e;
}

.weather-page .v-field .v-icon {
  color: #39ed9b;
}

.weather-page input::placeholder {
  color: #7fb8a0;
  opacity: 1;
}

/* Buttons */
.weather-page .v-btn--variant-tonal {
  background: #073c2b;
  color: #36e991;
  border: 1px solid #08a663;
  height: 48px !important;
  border-radius: 10px;
}

.weather-page .v-btn--icon.v-btn--variant-tonal {
  width: 48px !important;
}

/* Hero card */
.weather-page .hero {
  color: #fff;
  border: 1px solid #10d77b;
  box-shadow: 0 5px 20px rgba(0, 255, 140, 0.12);
}

.weather-page .hero-day {
  background: linear-gradient(115deg, #007b48, #009e59, #064d36);
}

.weather-page .hero-night {
  background: linear-gradient(115deg, #03251a, #064d36, #0a6b47);
}

.weather-page .hero .v-icon {
  color: #fff;
}

.hero-temp {
  font-size: 80px;
  font-weight: 300;
  line-height: 1.1;
}

/* Outlined cards (stats, hourly, 7-day) */
.weather-page .v-card--variant-outlined {
  background: #061e16;
  color: #f0fff8;
  border: 1px solid #079b5e;
  border-radius: 12px;
}

.weather-page .v-card--variant-outlined .v-icon {
  color: #56f2d5;
}

.weather-page .section-title {
  color: #3cf0a0;
}

.weather-page .text-primary {
  color: #35ff9a !important;
}

/* Hourly strip */
.hourly {
  display: flex;
  overflow-x: auto;
}

.hour {
  flex: 1 0 64px;
  text-align: center;
  padding: 0 6px;
  border-right: 1px solid #104532;
}

.hour:last-child {
  border-right: none;
}

/* 7-day rows */
.day-row {
  display: grid;
  grid-template-columns: 1fr 40px 60px 90px;
  align-items: center;
  gap: 10px;
  padding: 12px 4px;
  border-top: 1px solid #104532;
}

.day-rain,
.day-temps {
  text-align: right;
}

/* Autocomplete dropdown (rendered outside the page) */
.weather-menu .v-list {
  background: #061e16 !important;
  color: #f0fff8 !important;
  border: 1px solid #079b5e;
}

.weather-menu .v-list-item:hover {
  background: #0b3827 !important;
}

@media (max-width: 600px) {
  .hero-temp {
    font-size: 56px;
  }
}
</style>