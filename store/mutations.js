export default {
  updateUserGeoLocalizationLat(state, payload) {
    state.userLocation.userLatitude = payload
  },
  updateUserGeoLocalizationLng(state, payload) {
    state.userLocation.userLongitude = payload
  },
}
