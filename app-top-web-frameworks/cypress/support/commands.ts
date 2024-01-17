/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: "element" }, (subject, options) => {
//   console.log("DRAG CUSTOM Command");
// });

Cypress.Commands.add(
  "fillInFrameworksForm",
  (
    fields: {
      name: string | undefined;
      programmingLanguage: string | undefined;
      githubLink: string | undefined;
      githubStarsCount: string | undefined;
    },
    message = undefined
  ) => {
    cy.visit("/add-new");
    if (fields.name !== undefined) {
      cy.get('form > div > input[data-cy="name"]')
        .type(fields.name)
        .should("have.value", fields.name);
    }
    if (fields.programmingLanguage !== undefined) {
      cy.get('form > div > input[data-cy="programming-language"]')
        .type(fields.programmingLanguage)
        .should("have.value", fields.programmingLanguage);
    }
    if (fields.githubLink !== undefined) {
      cy.get('form > div > input[data-cy="github-link"]')
        .type(fields.githubLink)
        .should("have.value", fields.githubLink);
    }
    if (fields.githubStarsCount !== undefined) {
      cy.get('form > div > input[data-cy="github-stars-count"]')
        .type(fields.githubStarsCount)
        .should("have.value", fields.githubStarsCount);
    }

    cy.get('form > div > button[data-cy="submit"]').click();
    if (message !== "") {
      cy.get("#submission-status-message").should("include.text", message);
    }
  }
);
