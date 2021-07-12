<template>
  <v-row>
    <v-col
      align="start"
      justify="start"
      class="d-flex cards-wrapper pt-0"
      cols="12"
      sm="12"
      md="6"
    >
      <v-dialog v-model="isUserLocationDialogOpen" max-width="500">
        <v-card>
          <v-card-title>Localization</v-card-title>
          <v-card-subtitle>Write your address</v-card-subtitle>
          <v-card-text>
            <v-text-field
              v-model="userAddressInput"
              label="address"
              prepend-inner-icon="mdi-map-marker"
            ></v-text-field
          ></v-card-text>
          <v-card-actions>
            <v-col class="text-right">
              <v-btn class="primary" @click="userAddressChange">submit</v-btn>
            </v-col>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-card class="pa-3 mb-3">
        <slider
          @changeIsJobRadiusRageActive="changeIsJobRadiusRageActive"
          @changeJobsRadiusRange="changeJobsRadiusRange"
        />
      </v-card>
      <div class="cards-wrapper-inner pt-0">
        <v-expand-transition
          v-for="card in jobOffersMaker"
          :key="card.id"
          appear
        >
          <div>
            <job-card
              v-show="isJobOfferActive(card.latLng)"
              :job-data="card"
              :travel-time="card.commute.travelTime"
              :travel-distance="card.commute.distance"
              class="job-position-card"
              @showToltip="showToltip"
              @calculateOffer="calculateTravelTime"
              @activeCard="activeCard"
              @centerToMarker="centerMap"
            />
          </div>
        </v-expand-transition>
      </div>
    </v-col>
    <v-col class="d-flex pt-0" cols="12" sm="12" md="6">
      <div class="map-wrapper map-container">
        <client-only>
          <l-map ref="map" :zoom="11" :center="[52.2464418, 21.1277591]">
            <l-tile-layer :url="mapTileApi"> </l-tile-layer>
            <l-polyline
              v-if="polylineCoords"
              :lat-lngs="polylineCoords"
              :color="polyline.color"
            ></l-polyline>
            <l-marker
              v-for="m in jobOffersMaker"
              :ref="m.ref"
              :key="m.id"
              :lat-lng="m.latLng"
            >
              <l-icon
                :icon-size="iconSize"
                :icon-anchor="iconAnchor"
                icon-url="icons/apple-original.svg"
              >
              </l-icon>
              <marker-tooltip :marker-info="m"></marker-tooltip>
            </l-marker>
            <l-marker
              v-if="userLocationLatLng"
              ref="userLocationLatLng"
              :lat-lng="userLocationLatLng"
            >
              <l-icon
                :icon-size="iconSize"
                :icon-anchor="iconAnchor"
                icon-url="icons/apple-original.svg"
              >
              </l-icon>
              <marker-tooltip
                :marker-info="markerUserLocation"
                @initChageLocation="manuallyChangeUserLocation"
              ></marker-tooltip>
            </l-marker>
            <l-circle
              className="map-circle-job-range"
              v-if="userLocationLatLng && isJobRadiusRageActive"
              :lat-lng="userLocationLatLng"
              :radius="jobsRadiusRange * 1000"
              :color="polyline.color"
            />
          </l-map>
        </client-only>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import jobCard from '@/components/cards/jobCard'
import markerTooltip from '@/components/map/markers/markerTooltip'
import slider from '@/components/slider/slider'
import jobOffers from '@/services/jobOffers'
export default {
  components: {
    jobCard,
    markerTooltip,
    slider,
  },
  data() {
    return {
      mapApiKey:
        'pk.eyJ1IjoiYWxleG1hbHkiLCJhIjoiY2o1OGN5aXR0MHp1ODJ3cDN3cmI4a2dkbSJ9.uR1Bix3JXHGJkz1dxXt3NA',
      darkMapTile:
        'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
      lightMapTile:
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png',
      urlMapboxStyle2:
        'https://api.mapbox.com/styles/v1/alexmaly/ckph4rwbn029g17p4b5pvvg3s/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxleG1hbHkiLCJhIjoiY2o1OGN5aXR0MHp1ODJ3cDN3cmI4a2dkbSJ9.uR1Bix3JXHGJkz1dxXt3NA',
      userLocation: {
        userLatitude: null,
        userLongitude: null,
      },
      userAddressInput: '',
      isUserLocationDialogOpen: false,
      markerUserLocation: null,
      homeLocationIcon: '',
      isJobRadiusRageActive: false,
      jobsRadiusRange: 50,
      mapGL: {},
      routeData: null,
      error: null,
      loading: false,
      travel: {
        duration: null,
        type: null,
      },
      toggleRoute: false,
      markerTimeTravel: {},
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      markers: jobOffers,
      polyline: {
        color: 'darkcyan',
      },
      testPolyline: [
        [47.334852, -1.509485],
        [47.342596, -1.328731],
        [47.241487, -1.190568],
        [47.234787, -1.358337],
      ],
      travelTypes: {
        walking: 'walking',
        driving: 'driving',
        cycling: 'cycling',
      },
      jobCoordsForRoute: [],
      travelType: 'driving',
    }
  },
  computed: {
    userAddressInputFomatted() {
      return this.userAddressInput
        ? this.userAddressInput.replace(/ /g, '+')
        : ''
    },
    userLocationLatLng() {
      if (this.userLocation?.userLatitude && this.userLocation?.userLongitude) {
        return [this.userLocation.userLatitude, this.userLocation.userLongitude]
      }
      return null
    },
    jobOffersMaker() {
      if (this.isJobRadiusRageActive) {
        return this.markers.filter(
          (m) =>
            m.type === 'jobOffer' &&
            this.isInDistanceRadius(m.latLng, this.userLocationLatLng)
        )
      }
      return this.markers
    },
    polylineCoords() {
      if (this.jobCoordsForRoute.length > 0) {
        return [
          [this.userLocation.userLatitude, this.userLocation.userLongitude],
          this.jobCoordsForRoute,
        ]
      }
      return null
    },
    mapTileApi() {
      return this.$vuetify.theme.dark ? this.darkMapTile : this.lightMapTile
    },
  },
  mounted() {
    if (!this.userLocationLatLng) {
      this.getGeoLocalization()
    }
  },
  methods: {
    manuallyChangeUserLocation() {
      this.isUserLocationDialogOpen = true
    },
    changeIsJobRadiusRageActive(isActive) {
      this.isJobRadiusRageActive = isActive
    },
    changeJobsRadiusRange(rage) {
      this.jobsRadiusRange = rage
    },
    isJobOfferActive(companyLocation) {
      if (this.$refs.map !== undefined && this.$refs.map.mapObject) {
        if (!this.isJobRadiusRageActive) {
          return true
        }
        return this.isInDistanceRadius(companyLocation, [
          this.userLocation.userLatitude,
          this.userLocation.userLongitude,
        ])
      }
      return false
    },
    getGeoLocalization() {
      navigator.geolocation.getCurrentPosition(
        this.getGeoLocalSuccess,
        this.getGeoLocalError
      )
    },
    getGeoLocalSuccess(position) {
      this.userLocation.userLatitude = position.coords.latitude
      this.userLocation.userLongitude = position.coords.longitude

      this.markerUserLocation = this.createUserLocalizationMarker(
        position.coords.latitude,
        position.coords.longitude
      )
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
      if (this.isJobRadiusRageActive && this.userLocationLatLng) {
        this.isInDistanceRadius(this.markers[0].latLng, this.userLocationLatLng)
      }
      const jobOfferLocalization = `${marker.latLng[1]},${marker.latLng[0]}`
      const userLocalization = `${this.userLocation.userLongitude},${this.userLocation.userLatitude}`
      this.jobCoordsForRoute = [marker.latLng[0], marker.latLng[1]]
      const travelData = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${jobOfferLocalization};${userLocalization}?overview=false`
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
    isInDistanceRadius(markerCoords, userCoords) {
      if (!this.$refs.map?.mapObject) {
        return false
      }
      const distance =
        this.$refs.map.mapObject.distance(markerCoords, userCoords).toFixed(0) /
        1000
      return distance <= this.jobsRadiusRange
    },
    getDistance(from, to) {
      return from.distanceTo(to).toFixed(0) / 1000
    },
    activeCard(jobData, isActive) {
      this.toggleMarkerAnimation(jobData.ref, isActive)
    },
    centerMap(canterCords, zoom) {
      this.$refs.map.mapObject.flyTo(canterCords, zoom)
    },
    toggleMarkerAnimation(marker, isActive) {
      if (marker) {
        const icon = this.$refs[marker][0].mapObject._icon
        isActive
          ? icon.classList.add('activeMarker')
          : icon.classList.remove('activeMarker')
      }
    },
    async userAddressChange() {
      if (this.userAddressInputFomatted) {
        const userAddressGeoLocal = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${this.userAddressInputFomatted}&format=json&polygon=1&addressdetails=1`
        ).catch((error) => {
          return console.log(error)
        })
        const result = await userAddressGeoLocal.json()
        const newUserAddress = result[0] ? [result[0].lat, result[0].lon] : null
        if (newUserAddress) {
          this.userLocation.userLatitude = newUserAddress[0]
          this.userLocation.userLongitude = newUserAddress[1]
        }
        this.userAddressInput = ''
        this.isUserLocationDialogOpen = false
      }
    },
  },
}
</script>
<style lang="scss">
.map-wrapper {
  height: 90%;
  position: relative;
  z-index: 2;
}

.map-container {
  height: 80vh;
  width: 50vw;
}

.cards-wrapper {
  flex-direction: column;
  &-inner {
    height: 60vh;
    overflow-x: hidden;
    overflow-y: scroll;
    padding-right: 15px;

    &::-webkit-scrollbar {
      width: 12px;
      background-color: #f5f5f5;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      background-color: #f5f5f5;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: #2196f3;
    }
  }
}

.activeMarker {
  animation: fade 0.6s infinite alternate;
}
@keyframes fade {
  from {
    opacity: 0.5;
  }
}

.leaflet-tile-container img {
  width: 256.5px !important;
  height: 256.5px !important;
}

body::-webkit-scrollbar {
  width: 1em;
}

.map-circle-job-range {
  stroke-width: 2;
}
</style>
