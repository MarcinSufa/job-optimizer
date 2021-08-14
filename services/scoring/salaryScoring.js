export default {
  minutesInHour: 60,
  daysInMonth: 21,
  monthsInYear: 12,
  paidHolidaysInYear: 26,
  hoursPerWorkingDay: 8,

  yearlyCommuteTime(commuteTime) {
    return (
      ((commuteTime * 2) / this.minutesInHour).toFixed() *
      this.daysInMonth *
      this.monthsInYear
    )
  },
  hourlySalary(salary) {
    return (salary / this.daysInMonth / this.hoursPerWorkingDay).toFixed()
  },
  dailySalary(salary) {
    return (salary / this.daysInMonth).toFixed()
  },
  yearlySalary(salary) {
    return salary * this.monthsInYear
  },

  calculateRealYearlySalary(
    averageSalary,
    moneyLostOnCommute,
    moneyLostOnHolidays
  ) {
    return Math.round(
      (this.yearlySalary(averageSalary) -
        moneyLostOnCommute -
        moneyLostOnHolidays) /
        12
    )
  },

  calculateLostMoneyOnHolidays(averageSalary, holidayPerYear) {
    let remainingHolidayPerYear = this.paidHolidaysInYear - holidayPerYear
    if (remainingHolidayPerYear < 0) {
      remainingHolidayPerYear = 0
    }
    return remainingHolidayPerYear * this.dailySalary(averageSalary)
  },

  calculateSalaryForScoring(salary, percentage) {
    const salaryRage = (salary.max - salary.min) * (percentage * 0.01)
    return salary.min + salaryRage
  },

  calculateLostMoneyOnCommute(averageSalary, commuteTime) {
    return (
      this.yearlyCommuteTime(commuteTime) * this.hourlySalary(averageSalary)
    )
  },
}
