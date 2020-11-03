import React, { useState } from "react";

import InterviewerList from 'components/InterviewerList';
import Button from 'components/Button';

export default function Form(props) {
  const [name, setName] = useState(props.name || "");
  const [error, setError] = useState("");
  const [interviewer, setInterviewerID] = useState(props.interviewer || null);

  // function clickInterviewer(interviewer) {
  //   setInterviewID(interviewer);
  // }

  function reset() {
    setName("");
    setInterviewerID(null);
    props.onCancel();
  }

  function validate() {
    if (name === "") {
      setError("Student name cannot be blank");
    } else {
      setError("");
      props.onSave(name, interviewer);
    }
  }

  return(
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form 
          autoComplete="off"
          onSubmit = {event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            data-testid="student-name-input"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            /*
              This must be a controlled component
            */
            onChange = {(event) => setName(event.target.value)}
            
          />
        </form>
        <section className="appointment__validation">{error}</section>

        <InterviewerList 
          interviewers={props.interviewers} 
          value={interviewer} 
          onChange={setInterviewerID} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={reset}>Cancel</Button>
          <Button confirm onClick={validate}>Save</Button>
        </section>
      </section>
    </main>
  );
}