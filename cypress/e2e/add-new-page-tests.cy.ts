import { randomBetween } from "../support/commands";

describe('"Add New" page', () => {
  let demoFramework: {
    name: string;
    programmingLanguage: string;
    githubLink: string;
    githubStarsCount: number;
  };

  context("Given that we access the `/add-new` page", () => {
    beforeEach(() => {
      cy.visit("/add-new");

      const id = randomBetween(1, 99);
      demoFramework = {
        name: `Demo ${id}`,
        programmingLanguage: ["JavaScript", "PHP", "Python", "Rust", "Go"][
          randomBetween(0, 4)
        ],
        githubLink: `https://github.com/demo/demo-${id}`,
        githubStarsCount: randomBetween(20000, 99999),
      };
    });

    it("Make sure that all required form fields exist", () => {
      cy.get('form > div > input[data-cy="name"]').should("exist");
      cy.get('form > div > input[data-cy="programming-language"]').should(
        "exist"
      );
      cy.get('form > div > input[data-cy="github-link"]').should("exist");
      cy.get('form > div > input[data-cy="github-stars-count"]').should(
        "exist"
      );
      cy.get('form > div > button[data-cy="submit"]').should("exist");
    });

    context("When the form is submitted with a missing `Name` field", () => {
      it("The correct error message will be displayed", () => {
        const { name, ...noNameField } = demoFramework;
        cy.fillInFrameworksForm(noNameField, "Fill in the: 'name'");
      });
    });

    context(
      "When the form is submitted with a missing `Programming Language` field",
      () => {
        it("The correct error message will be displayed", () => {
          const { programmingLanguage, ...noLanguageField } = demoFramework;
          cy.fillInFrameworksForm(noLanguageField, "Fill in the: 'language'");
        });
      }
    );

    context(
      "When the form is submitted with a missing `GitHub Link` field",
      () => {
        it("The correct error message will be displayed", () => {
          const { githubLink, ...noGHLinkField } = demoFramework;
          cy.fillInFrameworksForm(noGHLinkField, "Fill in the: 'GitHub link'");
        });
      }
    );

    context(
      "When the form is submitted with a missing `Stars Count` field",
      () => {
        it("The correct error message will be displayed", () => {
          const { githubStarsCount, ...noStarsCountField } = demoFramework;
          cy.fillInFrameworksForm(
            noStarsCountField,
            "Fill in the: 'stars count'"
          );
        });
      }
    );

    context("When a new framework is submitted using the form", () => {
      it("It should get listed in the frameworks table on the home page", () => {
        cy.fillInFrameworksForm(demoFramework, "Thanks for your contribution");
        cy.get('nav > a[href="/"]')
          .click()
          .then(() => {
            cy.get("tr").should("contain.text", demoFramework.name);
          });
      });
    });
  });
});
