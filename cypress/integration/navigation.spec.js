import axios from 'axios';

beforeEach(() => {
  axios.get("/api/debug/reset")
  cy.visit("/");
});
describe("Navigation", () => {

  it("should navigate to Tuesday", () => {
    cy.contains("[data-testid=day]", "Tuesday")
      .click()
      .should("have.class", "day-list__item--selected");
  });

});
