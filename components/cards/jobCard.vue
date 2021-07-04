<template>
  <v-hover v-slot="{ hover }">
    <v-card
      :class="{ 'job-position-card-active': hover }"
      @mouseover="$emit('activeCard', jobData, true)"
      @mouseleave="$emit('activeCard', jobData, false)"
    >
      <v-fab-transition>
        <v-btn
          class="map-center-button"
          color="primary"
          absolute
          depressed
          elevation="2"
          fab
          icon
          rounded
          x-small
          @click="$emit('centerToMarker', jobData.latLng)"
        >
          <v-icon>mdi-map-marker-radius</v-icon>
        </v-btn>
      </v-fab-transition>
      <v-card-title class="headline"> {{ jobData.jobTitle }} </v-card-title>
      <v-card-text>
        <div>
          {{ jobData.description }}
          <br />
          <p ref="timeCounter" class="timerCounter">
            time: {{ displayTravelTime }} minutes
          </p>
          distance {{ displayTravelDistance }} km <br />type:
        </div>
        <div></div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          @click.prevent="$emit('showToltip', jobData.ref, jobData.active)"
          >show route</v-btn
        >
        <v-btn @click.prevent="calculateTravelTime(jobData)">
          calculate Offer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-hover>
</template>
const { gsap } = require("gsap/dist/gsap");
<script>
export default {
  name: 'JobCard',
  props: {
    jobData: Object,
    travelTime: String,
    travelDistance: String,
  },
  data() {
    return {
      displayTravelTime: this.travelTime,
      tweenTravelTime: this.travelTime,
      displayTravelDistance: this.travelDistance,
      tweenTravelDistance: this.travelDistance,
    }
  },
  watch: {
    travelTime() {
      this.$gsap.to(this, {
        tweenTravelTime: this.travelTime,
        onUpdate: () => {
          this.displayTravelTime = Math.ceil(this.tweenTravelTime)
        },
      })
    },
    travelDistance() {
      this.$gsap.to(this, {
        tweenTravelDistance: this.travelDistance,
        onUpdate: () => {
          this.displayTravelDistance = Math.ceil(this.tweenTravelDistance)
        },
      })
    },
  },
  methods: {
    calculateTravelTime(jobData) {
      this.$emit('calculateOffer', jobData)
    },
  },
}
</script>

<style lang="scss" scoped>
.map-center-button {
  top: 0.5rem;
  right: 0.5rem;
}
.job-position-card {
  border: 1px solid darkcyan;
  margin-bottom: 1rem;
  &-active {
    border: 1px deeppink solid;
    transition: border 0.5s ease-in;
  }
}
.activeMarker {
  animation-name: bounce-1;
  animation-timing-function: linear;
}
@keyframes bounce-1 {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-100px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
