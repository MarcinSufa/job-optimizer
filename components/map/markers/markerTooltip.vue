<template>
  <l-popup>
    <slot>
      <div v-if="markerInfo.type !== 'userLocalization'">
        {{ markerInfo.jobTitle }}
        <button @click="goToOfferPage">show</button>
        <span> {{ markerInfo.description }}</span>
      </div>
      <div v-else>
        <p>Your localization</p>
        <v-btn @click="changeLocation">change localization</v-btn>
      </div>
    </slot>
  </l-popup>
</template>

<script>
export default {
  name: 'MarkerTooltip',
  props: {
    markerInfo: Object,
  },
  methods: {
    goToOfferPage(e) {
      console.log(e)
    },
    changeLocation() {
      this.$emit('initChageLocation')
    },
  },
}
</script>

<style scoped></style>
