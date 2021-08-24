<template>
  <v-hover v-slot="{ hover }">
    <v-card
      :class="{ 'job-position-card-active': hover }"
      @mouseover="$emit('activeCard', jobData, true)"
      @mouseleave="$emit('activeCard', jobData, false)"
    >
      <v-alert
        v-if="jobData.error.enabled"
        class="alert-box"
        border="left"
        dismissible
        icon="mdi-alert-circle-outline"
        type="error"
        >{{ jobData.error.message }}</v-alert
      >
      <div class="job-position-card-inner">
        <div>
          <v-img
            contain
            max-height="64"
            max-width="64"
            :src="jobData.companyLogo"
          ></v-img>
        </div>
        <div class="job-position-card-inner-content">
          <div>
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

            <v-card-title class="text-subtitle-1 pt-2 pb-2 font-weight-medium">
              {{ jobData.jobTitle }} - {{ jobData.company }}
            </v-card-title>
            <div class="job-position-card-salary text-subtitle-2 ml-4">
              {{ jobData.salary.min | formatShortThousandNumber }} -
              {{ jobData.salary.max | formatShortThousandNumber }}
              real salary
              {{ displayRealSalary | formatShortThousandNumber }}
            </div>
            <v-tabs
              v-model="tab"
              background-color="transparent"
              color="basil"
              grow
            >
              <v-tab v-for="item in items" :key="item">
                {{ item }}
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item key="Description">
                <v-card-text>
                  <div>
                    {{ jobData.description }}
                  </div>
                  <br />
                  <v-row no-gutters>
                    <v-col>
                      <div>
                        <v-icon small color="primary" class="mr-3"
                          >mdi-home</v-icon
                        >
                        {{ jobData.city }}
                      </div>
                      <br />
                      <div>
                        <v-icon small color="primary" class="mr-3"
                          >mdi-cash-multiple</v-icon
                        >
                        {{ jobData.contract }}
                      </div>
                    </v-col>
                    <v-col>
                      <v-icon small color="primary" class="mr-3"
                        >mdi-map-marker</v-icon
                      >
                      {{ jobData.address }}
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-tab-item>
              <v-tab-item key="Salary Calculations">
                <v-card-text>
                  <v-row no-gutters>
                    <v-col>
                      <div>
                        <br />
                        <p ref="timeCounter" class="timerCounter">
                          commute time: {{ displayTravelTime }} minutes
                        </p>
                        distance {{ displayTravelDistance }} km
                      </div>
                      <div v-if="jobData.scoring.enabled">
                        Real Salary:
                        {{ displayRealSalary | formatShortThousandNumber }}
                      </div>
                    </v-col>
                    <v-col>
                      <div>
                        <br />
                        <p class="timerCounter">
                          unpaid holidays cost:
                          {{ jobData.scoring.salary.holidays }} yearly
                        </p>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-tab-item>
              <v-tab-item key="Technology">
                <v-card-text>
                  <v-chip
                    v-for="tech in jobData.tech"
                    :key="tech"
                    class="ma-2"
                    color="primary"
                    outlined
                    pill
                    >{{ tech }}</v-chip
                  >
                </v-card-text>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </div>
        <v-card-actions class="text-right job-position-card-action-buttons">
          <v-spacer />
          <v-btn
            color="primary"
            @click.prevent="$emit('showToltip', jobData.ref, jobData.active)"
            >apply</v-btn
          >
          <v-btn @click.prevent="calculateTravelTime(jobData)">
            calculate Offer
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-hover>
</template>
const { gsap } = require("gsap/dist/gsap");
<script>
export default {
  name: 'JobCard',
  filters: {
    formatShortThousandNumber(number) {
      return `${number / 1000}k`
    },
  },
  props: {
    jobData: {
      type: Object,
      default: null,
    },
    travelTime: {
      type: String,
      default: '0',
    },
    travelDistance: {
      type: String,
      default: '0',
    },
    realSalary: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      tab: null,
      items: ['Description', 'Salary Calculations', 'Technology'],
      displayTravelTime: this.travelTime,
      tweenTravelTime: this.travelTime,
      displayTravelDistance: this.travelDistance,
      tweenTravelDistance: this.travelDistance,
      displayRealSalary: this.realSalary,
      tweenRealSalary: this.realSalary,
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
    realSalary() {
      this.$gsap.to(this, {
        tweenRealSalary: this.jobData.scoring.salary.real,
        onUpdate: () => {
          this.displayRealSalary = Math.ceil(this.tweenRealSalary)
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
.headline {
  font-size: 1rem;
  font-weight: 500;
}
.map-center-button {
  top: 0.5rem;
  right: 0.5rem;
}
.job-position-card {
  border: 1px solid darkcyan;
  margin-bottom: 1rem;
  &-salary {
    color: #41b883;
  }
  &-inner {
    display: flex;
    &-content {
    }
  }
  &-active {
    border: 1px deeppink solid;
    transition: border 0.5s ease-in;
  }
  &-action-buttons {
    align-items: flex-end;
  }
}
.alert-box {
  z-index: 5;
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
