export default {
  calculateRealYearlySalary(
    averageSalary,
    moneyLostOnCommute,
    moneyLostOnHolidays
  ) {
    return (
      (averageSalary * 12 - moneyLostOnCommute - moneyLostOnHolidays) /
      12
    ).toFixed()
  },

  calculateLostMoneyOnHolidays(averageSalary, holidayPerYear) {
    const moneyLostPerDay = (averageSalary / 21).toFixed()
    let remainingHolidayPerYear = 26 - holidayPerYear
    if (remainingHolidayPerYear < 0) {
      remainingHolidayPerYear = 0
    }
    const moneyLostOnHolidays = remainingHolidayPerYear * moneyLostPerDay
    return moneyLostOnHolidays
  },

  calculateSalaryForScoring(salary, number = (salary.min + salary.max) / 2) {
    return number
  },

  calculateLostMoneyOnCommute(averageSalary, commuteTime) {
    const dailyCommuteTime = commuteTime * 2
    const yearlyCommuteTime = (dailyCommuteTime / 60).toFixed() * 21 * 12
    return yearlyCommuteTime.toFixed() * (averageSalary / 21 / 8).toFixed()
  },
}
