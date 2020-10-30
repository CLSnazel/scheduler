import React from 'react';
import useVisualMode from 'hooks/useVisualMode';

import Header from 'components/Appointment/Header';
import Show from 'components/Appointment/Show';
import Empty from 'components/Appointment/Empty';
import Form from 'components/Appointment/Form';

import './styles.scss';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const ERROR = "ERROR";
const CREATE = "CREATE";
const EDIT = "EDIT";
const SAVING = "SAVING";


export default function Appointment(props) {
  const {mode, transition, back} = useVisualMode(props.interview ? SHOW : EMPTY);

  const interviewers = [];
  return (
    <article className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}
      {mode === CREATE && <Form interviewers={interviewers} onCancel={back} />}

    </article>
  );
};