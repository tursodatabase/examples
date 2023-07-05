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

/**
 * @description Returns a random number given two boundaries
 * @param min {Number} - lower boundary
 * @param max {Number} - upper bondary
 * @returns {Number}
 */
export const randomBetween = (min: number, max: number): number =>
  Math.floor(Math.random() * max) + min;
