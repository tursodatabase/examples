import { randomBetween } from "./../support/commands";

describe("Footer links", () => {
  context("Given that we are on any page of the website", () => {
    before(() => {
      cy.visit(["/", "/add-new", "/about"][randomBetween(0, 3)]);
    });

    it("There should be correct links on the footer", () => {
      cy.get('a[title="Nuxt"]').should("have.attr", "href", "https://nuxt.com");
      cy.get('a[title="Turso"]').should(
        "have.attr",
        "href",
        "https://turso.tech"
      );
    });
  });
});
