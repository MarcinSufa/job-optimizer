export default {
  userLocationLatLng(state, getters) {
    if (state.userLocation?.userLatitude && state.userLocation?.userLongitude) {
      return [getters.userLocationLat, getters.userLocationLng]
    }
    return null
  },
  userLocationLat(state) {
    return state.userLocation.userLatitude
  },
  userLocationLng(state) {
    return state.userLocation.userLongitude
  },
}
