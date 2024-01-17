describe("Home page", () => {
  context("Given that we access the `/` page", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("The H1 heading should contain the correct heading", () => {
      cy.get("h1").contains("Top Web Frameworks");
    });
    it("There should be a table listing the frameworks", () => {
      cy.get("table > caption").contains("The list of top web frameworks");
    });
    it("There are items on the listing table", () => {
      cy.get("tbody > tr").children().should("not.eq", 0);
    });
    context("The `Visit` link of a framework listing", () => {
      const githubUrlRgx =
        /((?:https?:)?\/\/)?((?:www)\.)?((?:github\.com))(\/(?:[\w-]+))(\/(?:[\w-]+))(\/)?/gi;
      it("All listings should contain a link to a GitHub repository", () => {
        cy.get("tbody > tr").each((_$el, index, _$list) => {
          cy.get(
            `tbody > :nth-child(${
              index + 1
            }) > :last-child > a[title="GitHub link"]`
          )
            .contains("Visit")
            .and("have.attr", "href")
            .should("match", githubUrlRgx);
        });
      });
    });
  });
});
