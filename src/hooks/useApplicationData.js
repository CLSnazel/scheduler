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

  //initial requests to render data
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then((all) => {
      setState(prev => {
        return {
          ...prev,
          days:all[0].data,
          appointments:all[1].data,
          interviewers:all[2].data
        };
      });
    })
  }, []);

  //change day selected
  const setDay = day => {
    setState(prev => {
      return {
        ...prev,
        day
      }
    });
  }

  function bookInterview(id, interview) {
    
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

    const newDayData = {
      ...state.days[dayIndex],
      spots:freeSpots
    }

    const newDaysData = [
      ...state.days.slice(0, dayIndex),
      newDayData,
      ...state.days.slice(dayIndex + 1)
    ];

    ///return put request
    return axios.put(`/api/appointments/${id}`, newAppointment)
    .then(() => {
      setState(prev => (
        {
          ...prev,
          appointments: {...newAppointments},
          days:[...newDaysData]
        }
      ));
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

    //updating remaining spots locally
    const freeSpots = getSpotsForDay(state, state.day) + 1;
    const dayIndex = state.days.findIndex(item => item.name === state.day);
    const newDayData = {
      ...state.days[dayIndex],
      spots:freeSpots
    }
    const newDaysData = [
      ...state.days.slice(0, dayIndex),
      newDayData,
      ...state.days.slice(dayIndex + 1)
    ];

    //return delete request
    return axios.delete(`/api/appointments/${id}`)
    .then(() => {
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