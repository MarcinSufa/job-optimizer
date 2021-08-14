export default {
  jobOffers(state) {
    return state.jobOffers
  },
  mapJobOffer: (state) => (id) => {
    return state.jobOffers.find((offer) => offer.id === id)
  },
  jobOfferCommuteTravelTime: (state, getters) => (id) => {
    const offer = getters.mapJobOffer(id)
    return offer.commute.travelTime
  },
}
