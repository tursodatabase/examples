/// <reference types="cypress" />

import "./commands";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to fill in, check form values, check form errors, and submit it
       * @example cy.fillInFrameworksForm({ name, programmingLanguage, githubLink, githubStarsCount })
       */
      fillInFrameworksForm(
        fields: any,
        message: any
      ): Chainable<JQuery<HTMLElement>>;
    }
  }
}
