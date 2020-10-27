import React from 'react';

import Header from 'components/Appointment/Header';

import './styles.scss';

export default function Appointment(props) {

  return (
    <article className="appointment">
      <Header time={props.time}/>
    </article>
  );
};