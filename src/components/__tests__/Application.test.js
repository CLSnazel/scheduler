import React from "react";
import axios from 'axios';
import { render, cleanup, waitForElement, debug, getByText, getByTestId, fireEvent, getByAltText, getByPlaceholderText, getAllByRole, getAllByTestId, queryByText } from "@testing-library/react";

import Application from "components/Application";

afterEach(() => {
  cleanup();
});

jest.mock('axios');

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async() => {
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
    const { container } = render(<Application />);
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

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    //get appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appt => queryByText(appt, "Archie Cohen")
    );

    //click on delete and confirm button, validate loading state
    fireEvent.click(getByAltText(appointment, "Delete"));  
    expect(getByText(appointment, "Delete the appointment?")).toBeInTheDocument();
    fireEvent.click(getByText(appointment,"Confirm"));
    expect(appointment).toHaveTextContent("Deleting...");

    //Wait for appointment to be removed, validate remaining spots
    await waitForElement(() => getByAltText(appointment, "Add"));
    expect(getByTestId(container, "currentDay")).toHaveTextContent("Monday");
    expect(getByTestId(container, "currentDay")).toHaveTextContent("2 spots remaining");
  });
  
  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async() => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Monday"));
    
    const appointment = getAllByTestId(container, "appointment").find(
      appt => queryByText(appt, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Edit"));
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
    expect(getByTestId(container, "currentDay")).toHaveTextContent("1 spot remaining");
    
  });

  it("shows the save error when failing to save an appointment", async() => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Monday"));
    
    //get appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appt => queryByText(appt, "Archie Cohen")
    );
    //click edit, enter new name in input
    fireEvent.click(getByAltText(appointment, "Edit"));
    const textEntry = getByPlaceholderText(appointment, "Enter Student Name");
    fireEvent.change(textEntry, {target: {value: 'Lydia Miller-Jones'}});

    //get first interviewer, click on it and click on save
    const firstInterviewer = getAllByRole(appointment, 'listitem')[0]
    fireEvent.click(firstInterviewer);

    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, /Saving/i)).toBeInTheDocument();

    //after request fails, check that the Error message displays
    await waitForElement(() => getByText(appointment, /Error/i));
    expect(getByText(appointment, /Could not save appointment/i)).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async() => {
    axios.delete.mockRejectedValueOnce();

    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    //get appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appt => queryByText(appt, "Archie Cohen")
    );

    //click on delete and confirm button, validate loading state
    fireEvent.click(getByAltText(appointment, "Delete"));  
    expect(getByText(appointment, "Delete the appointment?")).toBeInTheDocument();
    fireEvent.click(getByText(appointment,"Confirm"));
    expect(appointment).toHaveTextContent("Deleting...");

    //after request fails, check that the Error message displays
    await waitForElement(() => getByText(appointment, /Error/i));
    expect(getByText(appointment, /Could not delete appointment/i)).toBeInTheDocument();
  });
 
});
