<template>
  <v-row justify="center" align="center">
    <v-col cols="6" sm="12" md="6">
      <v-card class="job-position-card">
        <v-card-title class="headline"> Apple Warsaw </v-card-title>
        <v-card-text>
          <div>
            time: {{ travel.duration }} <br />
            travel type: {{ travelType }}
          </div>
          <div></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="showRoute">show route</v-btn>
        </v-card-actions>
      </v-card>
      <v-card class="job-position-card">
        <v-card-title class="headline"> Google Warsaw </v-card-title>
        <v-card-text>
          <div>
            time: {{ travel.duration }} <br />
            travel type: {{ travelType }}
          </div>
          <div></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="showRoute">show route</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="6" sm="12" md="6">
      <div class="map-wrapper" id="mapContainer"></div>
    </v-col>
  </v-row>
</template>

<script>
import mapboxGl from 'mapbox-gl'

export default {
  data() {
    return {
      mapApiKey:
        'pk.eyJ1IjoiYWxleG1hbHkiLCJhIjoiY2o1OGN5aXR0MHp1ODJ3cDN3cmI4a2dkbSJ9.uR1Bix3JXHGJkz1dxXt3NA',
      userLatitude: null,
      userLongitude: null,
      mapGL: {},
      routeData: null,
      error: null,
      loading: false,
      travel: {
        duration: null,
        type: null,
      },
      travelTypes: {
        walking: 'walking',
        driving: 'driving',
        cycling: 'cycling',
      },
      travelType: 'driving',
    }
  },
  computed: {
    coordinates() {
      if (this.userLatitude && this.userLongitude) {
        return [this.userLongitude, this.userLatitude]
      }
      return null
    },
  },
  mounted() {
    if (!this.coordinates) {
      this.getGeoLocalization()
    }
  },
  methods: {
    getGeoLocalization() {
      navigator.geolocation.getCurrentPosition(
        this.getGeoLocalSuccess,
        this.getGeoLocalError
      )
    },
    getGeoLocalSuccess(position) {
      this.userLatitude = position.coords.latitude
      this.userLongitude = position.coords.longitude
      this.renderMapBox()
    },
    getGeoLocalError(error) {
      console.log(error)
    },
    showRoute() {
      this.getRoute(this.coordinates, [
        this.userLongitude + 0.025,
        this.userLatitude - 0.15,
      ])
    },
    renderMapBox() {
      this.mapGL = new mapboxGl.Map({
        container: 'mapContainer',
        style: 'mapbox://styles/mapbox/streets-v11',
        accessToken: this.mapApiKey,
        center: this.coordinates,
        zoom: 3,
        essential: true,
      })

      this.mapGL.flyTo({
        center: this.coordinates,
        zoom: 8,
        essential: true,
        speed: 0.4,
      })
      new mapboxGl.Marker()
        .setLngLat([this.userLongitude, this.userLatitude])
        .addTo(this.mapGL)

      new mapboxGl.Marker()
        .setLngLat([this.userLongitude + 0.025, this.userLatitude - 0.15])
        .addTo(this.mapGL)
    },
    async getRoute(start, end) {
      this.error = null
      this.loading = true
      const url =
        'https://api.mapbox.com/directions/v5/mapbox/' +
        this.travelType +
        '/' +
        start[0] +
        ',' +
        start[1] +
        ';' +
        end[0] +
        ',' +
        end[1] +
        '?steps=true&geometries=geojson&access_token=' +
        this.mapApiKey

      const response = await fetch(url)
      const data = await response.json()
      this.loading = false
      if (data.code !== 'Ok') {
        this.routeData = null
        this.error = data.code
        return
      }
      this.routeData = data.routes[0]
      this.travel.duration = `${Math.floor(data.routes[0].duration / 60)} min`
      this.travel.type = 'bike'
      this.addLayerToMap()
    },
    addLayerToMap() {
      const route = this.routeData.geometry.coordinates
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route,
        },
      }
      if (this.mapGL.getSource('route')) {
        this.mapGL.getSource('route').setData(geojson)
      } else {
        // otherwise, make a new request
        this.mapGL.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: geojson,
              },
            },
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75,
          },
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.map-wrapper {
  height: 90%;
  position: relative;
}

.mapboxgl-map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50%;
}

.job-position-card {
  border: 1px solid darkcyan;
  margin-bottom: 1rem;
}
</style>
