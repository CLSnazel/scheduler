import React, { useState, useEffect} from "react";
import axios from 'axios';

import DayList from "components/DayList";
import Appointment from "components/Appointment/index";
import { getAppointmentsForDay } from "helpers/selectors";

import "components/Application.scss";



export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  const [dailyAppointments, setDaily] = useState([]);
  
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

  useEffect(() => {
    console.log(dailyAppointments);
    setDaily(getAppointmentsForDay(state, state.day));
  }, [state])

  const setDay = day => {
    setState(prev => {
      return {
        ...prev,
        day
      }
    });
  }

  // const setDays = days => {
  //   setState(prev => {
  //     return {
  //       ...prev,
  //       days
  //     }
  //   })
  // }
  
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
        {dailyAppointments.map(appt => <Appointment 
          key={appt.id}
          {...appt}/>)}
      </section>
    </main>
  );
}
