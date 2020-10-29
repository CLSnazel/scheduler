import React from 'react';
// import classNames from 'classnames';

import InterviewerListItem from 'components/InterviewerListItem';

import './InterviewerList.scss'

export default function InterviewerList(props) {

  // const interviewerListClass = classNames("interviewers", {

  // });

  /*
  vanilla functions => (name, id, something) 
  props => {prop1:"asdjsk", whatever:"asldka", awesomeCallback:function()}
  */
  const interviewerItems = props.interviewers.map( interviewer => {
    return <InterviewerListItem 
      name={interviewer.name}
      avatar={interviewer.avatar}
      setInterviewer={(event) => props.onChange(interviewer.id)}
      selected={props.value === interviewer.id}
      key={interviewer.id}/>
  })

  return(
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewerItems}

      </ul>
    </section>
  );
}