import React from "react";
import axios from 'axios';
import { render, cleanup, waitForElement, debug, getByText, getByTestId, fireEvent, getByAltText, getByPlaceholderText, getAllByRole, getAllByTestId } from "@testing-library/react";

import Application from "components/Application";



afterEach(cleanup);

jest.mock('axios');

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async() => {
    
    /* fire events that update state */
    const { getByText, getAllByRole, getByTestId } = render(<Application />);

    await waitForElement(() => getByText("Monday"));
    
    //confirm monday is selected
    const currDay = getByTestId("currentDay");
    expect(currDay).toHaveTextContent("Monday");

    //get tuesday in side nav
    const tuesdayItem = getAllByRole("listitem")[1];
    
    //click and confirm selected
    fireEvent.click(tuesdayItem);
    const newCurrDay = getByTestId("currentDay");
    expect(newCurrDay).toHaveTextContent("Tuesday");
    expect(getByText("Leopold Silvers")).not.toBeNull();
  
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async() => {
    const { container} = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // get empty appt and click on add
    const appointment = getAllByTestId(container, "appointment")[0];
    fireEvent.click(getByAltText(appointment, "Add"));
    
    //get text entry and enter name
    const textEntry = getByPlaceholderText(appointment, "Enter Student Name");
    fireEvent.change(textEntry, {target: {value: 'Lydia Miller-Jones'}});
    
    //get first interviewer, click on it and click on save
    const firstInterviewer = getAllByRole(appointment, 'listitem')[0]
    fireEvent.click(firstInterviewer);
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, /Saving/i)).toBeInTheDocument();
    //after state successfully updates, check that the day list was updated
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    expect(getByTestId(container, "currentDay")).toHaveTextContent("Monday");
    expect(getByTestId(container, "currentDay")).toHaveTextContent("no spots remaining");
  });
 
});
