import {useState, useEffect} from 'react';
import { getSpotsForDay } from 'helpers/selectors';
import axios from 'axios';

export default function useApplicationData() {
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
      // console.log(all);
      setState(prev => {
        return {
          ...prev,
          days:all[0].data,
          appointments:all[1].data,
          interviewers:all[2].data
        };
      });
      // console.log(state);
    })
  }, []);

  const setDay = day => {
    setState(prev => {
      return {
        ...prev,
        day
      }
    });
  }

  function bookInterview(id, interview) {
    console.log(id, interview);

    let newAppt = false;
    if (!state.appointments[id].interview) {
      newAppt = true;
    }
    
    //Setting up Appointment update
    const newAppointment = {
      ...state.appointments[id],
      interview: {...interview}
    }
    const newAppointments = {
      ...state.appointments,
      [id]: newAppointment
    }

    // Setting up spots update
    let freeSpots = getSpotsForDay(state, state.day);
    if(!state.appointments[id].interview) {
      freeSpots--;
    }
    const dayIndex = state.days.findIndex(item => item.name === state.day);
    console.log(dayIndex);

    const newDayData = {
      ...state.days[dayIndex],
      spots:freeSpots
    }

    const newDaysData = [
      ...state.days.slice(0, dayIndex),
      newDayData,
      ...state.days.slice(dayIndex + 1)
    ];

    
    
    return axios.put(`/api/appointments/${id}`, newAppointment)
    .then(() => {
      // console.log("Successfully updated appointment");
      // console.log(newAppointments, newAppointment);
      setState(prev => (
        {
          ...prev,
          appointments: {...newAppointments},
          days:[...newDaysData]
        }
      ));
      // console.log(state);
      return;
    });
  }

  function cancelInterview(id) {

    //for updating appointment local state
    const nullAppointment = {
      ...state.appointments[id],
      interview: null
    }
    const newAppointments = {
      ...state.appointments,
      [id]: nullAppointment
    }

    //for updating remaining spots locally
    let freeSpots = getSpotsForDay(state, state.day);
    freeSpots++;
    const dayIndex = state.days.findIndex(item => item.name === state.day);
    // console.log(dayIndex);

    const newDayData = {
      ...state.days[dayIndex],
      spots:freeSpots
    }

    const newDaysData = [
      ...state.days.slice(0, dayIndex),
      newDayData,
      ...state.days.slice(dayIndex + 1)
    ];

    return axios.delete(`api/appointments/${id}`)
    .then(() => {
      // console.log("Successfully updated appointment");
      setState(prev => ({
          ...prev,
          appointments: {...newAppointments},
          days:[...newDaysData]
        }));
      return;
    });
  }

  return {state, setDay, bookInterview, cancelInterview }
}