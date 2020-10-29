function getAppointmentsForDay(state, day) {
  const filteredDay = state.days.filter(item => item.name === day)[0];
  const appointmentIDs = [];
  
  if (filteredDay) {
    for (let appt of filteredDay.appointments) {
      if (state.appointments[appt]) {
        appointmentIDs.push(state.appointments[appt]);
      }
    }
  }
  return appointmentIDs;
}

module.exports = {getAppointmentsForDay};