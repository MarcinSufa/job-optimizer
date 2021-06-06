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
        <v-btn>change localization</v-btn>
      </div>
    </slot>
  </l-popup>
</template>

<script>
export default {
  props: {
    markerInfo: Object,
  },
  name: 'markerTooltip',
  methods: {
    goToOfferPage(e) {
      console.log(e)
    },
  },
}
</script>

<style scoped></style>
