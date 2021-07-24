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
    return (
      (this.yearlySalary(averageSalary) -
        moneyLostOnCommute -
        moneyLostOnHolidays) /
      12
    ).toFixed()
  },

  calculateLostMoneyOnHolidays(averageSalary, holidayPerYear) {
    let remainingHolidayPerYear = this.paidHolidaysInYear - holidayPerYear
    if (remainingHolidayPerYear < 0) {
      remainingHolidayPerYear = 0
    }
    return remainingHolidayPerYear * this.dailySalary(averageSalary)
  },

  calculateSalaryForScoring(salary, number = (salary.min + salary.max) / 2) {
    return number
  },

  calculateLostMoneyOnCommute(averageSalary, commuteTime) {
    return (
      this.yearlyCommuteTime(commuteTime) * this.hourlySalary(averageSalary)
    )
  },
}
