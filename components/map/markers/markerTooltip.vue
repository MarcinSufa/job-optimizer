<template>
  <l-popup>
    <slot>
      {{ markerInfo.jobTitle }}
      <button @click="goToOfferPage">show</button>
      <span> {{ markerInfo.description }}</span>
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
