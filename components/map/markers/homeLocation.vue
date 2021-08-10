<template>
  <l-marker v-if="latLng" ref="homeLocationMarker" :lat-lng="latLng">
    <l-icon :icon-size="iconSize" :icon-anchor="iconAnchor" :icon-url="iconUrl">
    </l-icon>
    <!--      <marker-tooltip :marker-info="m"></marker-tooltip> -->
  </l-marker>
</template>

<script>
export default {
  name: 'HomeLocation',
  props: {
    iconSize: Array,
    iconAnchor: Array,
    latLng: Array,
    iconUrl: String,
  },
}
</script>

<style scoped></style>
