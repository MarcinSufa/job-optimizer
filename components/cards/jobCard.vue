<template>
  <v-hover v-slot="{ hover }">
    <v-card
      :class="{ 'job-position-card-active': hover }"
      @mouseover="$emit('activeCard', jobData, true)"
      @mouseleave="$emit('activeCard', jobData, false)"
    >
      <v-card-title class="headline"> {{ jobData.jobTitle }} </v-card-title>
      <v-card-text>
        <div>
          {{ jobData.description }}
          time: <br />
          travel type:
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
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  name: 'jobCard',
  props: {
    jobData: Object,
  },
}
</script>

<style lang="scss" scoped>
.job-position-card {
  border: 1px solid darkcyan;
  margin-bottom: 1rem;
  &-active {
    border: 2px deeppink solid;
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
