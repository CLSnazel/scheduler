export function getAppointmentsForDay(state, day) {
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
};

export function getInterview(state, interview) {

  let interviewData = {...interview};
  if (interviewData.interviewer) {
    let interviewerID = interview.interviewer;
    interviewData.interviewer = state.interviewers[interviewerID];
    
  } else {
    interviewData = null;
  }

  return interviewData;
};