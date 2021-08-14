export default {
  updateCommuteTravelTime(state, { offer, time }) {
    offer.commute.travelTime = time
  },
  updateCommuteDistance(state, { offer, distance }) {
    offer.commute.distance = distance
  },
  updateAverageSalary(state, { offer, salary }) {
    offer.scoring.salary.salaryPerHour = salary
  },
  updateMoneyLostOnCommute(state, { offer, moneyLostYearly }) {
    offer.scoring.salary.commuteTime = moneyLostYearly
  },
  updateMoneyLostOnHolidays(state, { offer, moneyLostYearly }) {
    offer.scoring.salary.holidays = moneyLostYearly
  },
  updateRealSalary(state, { offer, realSalary }) {
    offer.scoring.salary.real = realSalary
  },
  enableScoring(state, { offer, isEnabled }) {
    offer.scoring.salary.enabled = isEnabled
  },
}
