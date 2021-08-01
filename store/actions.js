export default {
  updateUserGeoLocalization(context, position) {
    context.commit('updateUserGeoLocalizationLat', position.coords.latitude)
    context.commit('updateUserGeoLocalizationLng', position.coords.longitude)
  },
  updateUserGeoLocalizationLatLng(context, latLng) {
    context.commit('updateUserGeoLocalizationLat', latLng[0])
    context.commit('updateUserGeoLocalizationLng', latLng[1])
  },
}
