<template>
  <v-row justify="center" align="center">
    <v-col class="d-flex cards-wrapper" cols="6" sm="12" md="6">
      <job-card
        v-for="card in jobOffersMaker"
        :key="card.id"
        :jobData="card"
        class="job-position-card"
        @showToltip="showToltip"
        @calculateOffer="calculateTravelTime"
        @activeCard="activeCard"
      >
      </job-card>
    </v-col>
    <v-col class="d-flex" cols="6" sm="12" md="6">
      <div class="map-wrapper map-container">
        <l-map ref="map" :zoom="13" :center="[55.9464418, 8.1277591]">
          <l-tile-layer :url="urlMapboxStyle"> </l-tile-layer>
          <l-marker
            :ref="m.ref"
            v-for="m in markers"
            :key="m.id"
            :latLng="m.latLng"
          >
            <marker-tooltip :markerInfo="m"></marker-tooltip> </l-marker
        ></l-map>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import jobCard from '@/components/cards/jobCard'
import markerTooltip from '@/components/map/markers/markerTooltip'
export default {
  components: {
    jobCard,
    markerTooltip,
  },
  data() {
    return {
      mapApiKey:
        'pk.eyJ1IjoiYWxleG1hbHkiLCJhIjoiY2o1OGN5aXR0MHp1ODJ3cDN3cmI4a2dkbSJ9.uR1Bix3JXHGJkz1dxXt3NA',
      urlMapboxStyle:
        'https://api.mapbox.com/styles/v1/alexmaly/ckph4rwbn029g17p4b5pvvg3s/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxleG1hbHkiLCJhIjoiY2o1OGN5aXR0MHp1ODJ3cDN3cmI4a2dkbSJ9.uR1Bix3JXHGJkz1dxXt3NA',
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
      markerTimeTravel: {},
      markers: [
        {
          id: 1,
          type: 'jobOffer',
          company: 'Aple',
          jobTitle: 'Frontend developer',
          tech: ['javascript', 'react', 'webpack', 'node', 'css'],
          description: 'We are looking for frontend dev',
          city: 'Warsaw',
          address: 'Marszałkowska 45a',
          salary: 17000,
          currency: 'pln',
          latLng: [55.9464418, 8.1277591],
          ref: 'ref1',
          commute: {
            travelTime: null,
            distance: null,
          },
          active: true,
        },
        {
          id: 2,
          type: 'jobOffer',
          company: 'Microsoft',
          jobTitle: 'Frontend developer',
          tech: ['javascript', 'react', 'webpack', 'node', 'css'],
          description: 'We are looking for frontend dev',
          city: 'Warsaw',
          address: 'Marszałkowska 45a',
          salary: 17000,
          currency: 'pln',
          latLng: [52.22977, 21.01178],
          ref: 'ref2',
          commute: {
            travelTime: null,
            distance: null,
          },
          active: true,
        },
        {
          id: 3,
          type: 'jobOffer',
          company: 'Netflix',
          jobTitle: 'Frontend developer',
          tech: ['javascript', 'react', 'webpack', 'node', 'css'],
          description: 'We are looking for frontend dev',
          city: 'Warsaw',
          address: 'Marszałkowska 45a',
          salary: 18000,
          currency: 'pln',
          latLng: [52.23977, 21.02178],
          ref: 'ref3',
          commute: {
            travelTime: null,
            distance: null,
          },
          active: true,
        },
      ],
      travelTypes: {
        walking: 'walking',
        driving: 'driving',
        cycling: 'cycling',
      },
      travelType: 'driving',
    }
  },
  mounted() {
    if (!this.coordinates) {
      this.getGeoLocalization()
    }
  },
  computed: {
    coordinates() {
      if (this.userLatitude && this.userLongitude) {
        return [this.userLongitude, this.userLatitude]
      }
      return null
    },
    jobOffersMaker() {
      return this.markers.filter((m) => m.type === 'jobOffer')
    },
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
      const markerUserLocation = this.createUserLocalizationMarker(
        position.coords.latitude,
        position.coords.longitude
      )
      this.markers.push(markerUserLocation)
    },
    createUserLocalizationMarker(lat, lng) {
      return {
        id: 9999,
        type: 'userLocalization',
        latLng: [lat, lng],
        ref: 'userMarker',
        active: true,
      }
    },
    getGeoLocalError(error) {
      console.log(error)
    },
    showToltip(tooltipRef, isActive) {
      isActive
        ? this.$refs[tooltipRef][0].mapObject.openPopup()
        : this.$refs[tooltipRef][0].mapObject.closePopup()
    },
    async calculateTravelTime(marker) {
      const jobOfferLocalization = `${marker.latLng[1]},${marker.latLng[0]}`
      const userLocalization = `${this.userLongitude},${this.userLatitude}`

      const travelData = await fetch(
        `http://router.project-osrm.org/route/v1/driving/${jobOfferLocalization};${userLocalization}?overview=false`
      ).catch((error) => {
        console.log(error)
      })
      const data = await travelData.json()

      const markerToUpdate = this.markers.find((m) => m.id === marker.id)
      const markerCommuteData = data?.routes[0]

      markerToUpdate.commute.travelTime = (
        markerCommuteData.duration / 60
      ).toFixed(0)

      markerToUpdate.commute.distance = (
        markerCommuteData.distance / 1000
      ).toFixed(2)
    },
    activeCard(jobData, isActive) {
      if (isActive) {
        this.centerMap(jobData.latLng, 10)
      }
      this.toggleMarkerAnimation(jobData.ref, isActive)
    },
    centerMap(canterCords, zoom) {
      this.$refs.map.mapObject.flyTo(canterCords, zoom)
    },
    toggleMarkerAnimation(marker, isActive) {
      const icon = this.$refs[marker][0].mapObject._icon
      isActive
        ? icon.classList.add('activeMarker')
        : icon.classList.remove('activeMarker')
    },
  },
}
</script>
<style lang="scss">
.map {
  height: 550px;
  width: 100%;
}
.map-wrapper {
  height: 90%;
  position: relative;
}

.map-container {
  height: 500px;
  width: 500px;
}

.cards-wrapper {
  flex-direction: column;
}

.activeMarker {
  animation: fade 0.6s infinite alternate;
}
@keyframes fade {
  from {
    opacity: 0.5;
  }
}
</style>
