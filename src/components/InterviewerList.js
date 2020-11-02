import React from 'react';
import PropTypes from 'prop-types';

import InterviewerListItem from 'components/InterviewerListItem';

import './InterviewerList.scss';



function InterviewerList(props) {

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

InterviewerList.propTypes = {
  interviewers: PropTypes.array
};

export default InterviewerList;