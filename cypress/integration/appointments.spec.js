

beforeEach(() => {
  cy.request("GET", "/api/debug/reset")
  cy.visit("/");
  cy.contains('Monday');
  cy.wait(500);
});

describe('Appointment', () => {
  const name = "Lydia Miller-Jones";
  const editName = "Polly Pocket";

  const interviewer = "Sylvia Palmer";
  const editInterviewer = "Tori Malcolm";
  it ('should book an interview', () => {

    cy.get('[alt="Add"]')
      .first()
      .click();
    cy.wait(500);

    cy.get('input')
      .type(name, {delay:17});
    cy.wait(500);
    cy.get(`[alt="${interviewer}"]`)
      .click();
    cy.wait(250);
    cy.contains('button', 'Save')
      .click();

    cy.contains('.appointment__card--show', name);
    cy.contains('.appointment__card--show', interviewer);
  });

  it ('should edit an interview', () => {

    cy.get('[alt="Edit"]')
      .click({force:true})
      .wait(500);

    cy.get('input')
      .clear()
      .type(editName, {delay:17})
      .wait(500);
    
    cy.get(`[alt="${editInterviewer}"]`)
      .click()
      .wait(500);

    cy.contains('button', 'Save')
      .click();

      cy.contains('.appointment__card--show', editName);
      cy.contains('.appointment__card--show', editInterviewer);
  });

  it ('should cancel an interview', () => {
    cy.get('[alt="Delete"]')
      .click({force:true})
      .wait(500);
    cy.contains('button', 'Confirm')
      .click();
    
    cy.contains('main', 'Archie Cohen')
      .should('not.exist');
  }); 
});