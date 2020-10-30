import React, { useState, useEffect} from "react";
import axios from 'axios';

import DayList from "components/DayList";
import Appointment from "components/Appointment/index";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";

import "components/Application.scss";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then((all) => {
      console.log(all);
      setState(prev => {
        return {
          ...prev,
          days:all[0].data,
          appointments:all[1].data,
          interviewers:all[2].data
        }
      })
      console.log(state);
    })
  }, []);

  function bookInterview(id, interview) {
    console.log(id, interview);
    const newAppointment = {
      ...state.appointments[id],
      interview: {...interview}
    }
    const newAppointments = {
      ...state.appointments,
      [id]: newAppointment
    }
    return axios.put(`/api/appointments/${id}`, newAppointment)
    .then(()=> {
      console.log("Successfully updated appointment");
      setState({
        ...state,
        appointments: newAppointments
      });
      return;
    }) 
  }

  function cancelInterview(id) {
    const nullAppointment = {
      ...state.appointments[id],
      interview: null
    }
    const newAppointments = {
      ...state.appointments,
      [id]: nullAppointment
    }

    return axios.delete(`api/appointments/${id}`)
    .then(() => {
      console.log("Successfully updated appointment");
      setState({
        ...state,
        appointments: newAppointments
      });
      return;
    });
  }

  const appointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);
  const schedule = appointments.map((appt) => {
    return (
      <Appointment 
        {...appt}
        key={appt.id}
        interview={getInterview(state, appt.interview)}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    )
  });

  const setDay = day => {
    setState(prev => {
      return {
        ...prev,
        day
      }
    });
  }
 
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />

      </section>
      <section className="schedule">
        {schedule}
        <Appointment time="5pm"/>
      </section>
    </main>
  );
}
