<template>
  <v-row class="job-radius-wrapper">
    <v-col cols="12" sm="2" md="2">
      <v-switch
        v-model="isJobRadiusRageActive"
        @change="$emit('changeIsJobRadiusRageActive', isJobRadiusRageActive)"
      ></v-switch>
    </v-col>
    <v-col cols="12" sm="10" md="10">
      <v-slider
        v-if="isJobRadiusRageActive"
        v-model="jobsRadiusRange"
        class="job-radius-slider"
        thumb-label="always"
        label="Km"
        prepend-icon="mdi-radius"
        inverse-label
        :step="0.01"
        @input="$emit('changeJobsRadiusRange', jobsRadiusRange)"
      ></v-slider>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Slider',
  data() {
    return {
      isJobRadiusRageActive: false,
      jobsRadiusRange: 25,
    }
  },
}
</script>

<style scoped lang="scss">
.job-radius {
  &-wrapper {
    position: absolute;
    z-index: 10;
    width: 50%;
    left: 25%;
    flex: none;
    align-content: center;
    align-items: center;
    margin-top: 10px;
  }
  &-slider {
    margin-top: 20px;
  }
}
</style>
