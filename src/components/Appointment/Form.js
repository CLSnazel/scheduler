import React, { useState } from "react";

import InterviewerList from 'components/InterviewerList';
import Button from 'components/Button';

export default function Form(props) {
  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewID] = useState(props.interviewer || null);

  function clickInterviewer(interviewer) {
    setInterviewID(interviewer);
  }

  function reset() {
    setName("");
    setInterviewID(null);
    props.onCancel();
  }

  return(
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form 
          autoComplete="off"
          onSubmit = {event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder={props.name ? props.name : "Enter Student Name"}
            value={name}
            /*
              This must be a controlled component
            */
            onChange = {(event) => setName(event.target.value)}
            
          />
        </form>
        <InterviewerList 
          interviewers={props.interviewers} 
          value={interviewer} 
          onChange={clickInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={reset}>Cancel</Button>
          <Button confirm onClick={() => props.onSave(name, interviewer)}>Save</Button>
        </section>
      </section>
    </main>
  );
}