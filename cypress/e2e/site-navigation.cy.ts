describe("Navigation links", () => {
  it("Check that the add-new link takes us to respective page", () => {
    cy.visit("/");

    cy.get('nav > a[href="/add-new"]').click();
    cy.location("pathname").should("eq", "/add-new");
  });

  it("Check that the home page link takes us to respective page", () => {
    cy.visit("/add-new");

    cy.get('nav > a[title="home page"]').click();
    cy.location("pathname").should("eq", "/");
  });

  it("Check that the about page link takes us to respective page", () => {
    cy.visit(`/add-new`);

    cy.get('nav > a[href="/about"]').click();
    cy.location("pathname").should("eq", "/about");
  });

  it("Check that the redirection on the about page paragraph works", () => {
    cy.visit(`/about`);

    cy.get('p > a[title="Redirect to add new page"]').click();
    cy.location("pathname").should("eq", "/add-new");
  });
});
