import React from 'react';
import useVisualMode from 'hooks/useVisualMode';

import Header from 'components/Appointment/Header';
import Show from 'components/Appointment/Show';
import Empty from 'components/Appointment/Empty';
import Form from 'components/Appointment/Form';
import Status from 'components/Appointment/Status';
import Error from 'components/Appointment/Error';
import Confirm from 'components/Appointment/Confirm';

import './styles.scss';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const ERROR = "ERROR";
const CREATE = "CREATE";
const EDIT = "EDIT";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";




export default function Appointment(props) {
  const {mode, transition, back} = useVisualMode(props.interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    }
    transition(SAVING);
    props.bookInterview(props.id, interview)
    .then(() => {
      transition(SHOW);
    })
    .catch(() => {
      transition(ERROR);
    })
  }

  function confirmDelete() {
    transition(DELETING);
    // props.bookInterview(props.id, null)
    props.cancelInterview(props.id)
    .then(() => {
      transition(EMPTY);
    })
    .catch(() => {
      transition(ERROR);
    })
  }

  return (
    <article className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
        />
      )}
      {mode === CREATE && (
        <Form 
          onCancel={back} 
          onSave={save}
          interviewers={props.interviewers} 
        />)}
      { mode === CONFIRM && (
        <Confirm 
          onCancel={back}
          onConfirm={confirmDelete}
        />
      )}
      {mode === SAVING && (
        <Status message={"Saving..."}/>
      )}
      {mode === DELETING && (
        <Status message={"Deleting..."}/>
      )}
      {mode === ERROR && (
        <Error />
      )}

    </article>
  );
};