import React from "react";
import classNames from 'classnames';

import 'components/DayListItem.scss';

export default function DayListItem(props) {

  let dayItemClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full":props.spots < 1
  })

  function formatSpots(){
    return `${props.spots ? props.spots : 'no'} spot${props.spots !== 1 ? "s" : ""} remaining`;
  }
  return (
    <li className={dayItemClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{formatSpots()}</h3>
    </li>
  );
}
