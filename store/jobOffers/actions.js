export default {
  updateCommuteTravelTime({ commit, getters }, { id, time }) {
    const offer = getters.mapJobOffer(id)
    commit('updateCommuteTravelTime', { offer, time })
  },
  updateCommuteDistance({ commit, getters }, { id, distance }) {
    const offer = getters.mapJobOffer(id)
    commit('updateCommuteDistance', { offer, distance })
  },
  updateAverageSalary({ commit, getters }, { id, salary }) {
    const offer = getters.mapJobOffer(id)
    commit('updateAverageSalary', { offer, salary })
  },
  updateMoneyLostOnCommute({ commit, getters }, { id, moneyLostYearly }) {
    const offer = getters.mapJobOffer(id)
    commit('updateMoneyLostOnCommute', { offer, moneyLostYearly })
  },
  updateMoneyLostOnHolidays({ commit, getters }, { id, moneyLostYearly }) {
    const offer = getters.mapJobOffer(id)
    commit('updateMoneyLostOnHolidays', { offer, moneyLostYearly })
  },
  updateRealSalary({ commit, getters }, { id, realSalary }) {
    const offer = getters.mapJobOffer(id)
    commit('updateRealSalary', { offer, realSalary })
  },
  enableScoring({ commit, getters }, { id, isEnabled }) {
    const offer = getters.mapJobOffer(id)
    commit('enableScoring', { offer, isEnabled })
  },
  enableJobError({ commit, getters }, { id, isErrorEnabled }) {
    const offer = getters.mapJobOffer(id)
    commit('enableJobError', { offer, isErrorEnabled })
  },
  changeErrorMessage({ commit, getters }, { id, errorMessage }) {
    const offer = getters.mapJobOffer(id)
    commit('changeErrorMessage', { offer, errorMessage })
  },
}
