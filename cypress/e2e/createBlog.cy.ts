export {}

describe('Creating a blog', () => {
  it('passes', () => {
    const initialUrl = "http://localhost:3000/"
    const titleText = "this is a title"
    const bodyText = "this is a body"
    const TitleErrorMessage = "Title is empty"
    const bodyErrorMessage = "Body is empty"

    cy.visit(initialUrl)
    cy.get('button').contains('Create a blog').click();

    cy.url().then(initialUrl => {
      cy.get('#title').type(titleText);
      cy.get('button').contains('Publish Blog').click();

      // Check that the "Body is empty" error message is displayed
      cy.get('.error-message').should('have.text', bodyErrorMessage);
      cy.get('.error-message').should('have.length', 1);

      cy.get('#title').clear();
      cy.get('#title').should('have.value', '');

      cy.get('#body').type(bodyText);
      cy.get('button').contains('Publish Blog').click();

      // Check that the "Title is empty" error message is displayed
      cy.get('.error-message').should('have.text', TitleErrorMessage);
      cy.get('.error-message').should('have.length', 1);

      cy.get('#title').type(titleText);
      cy.get('button').contains('Publish Blog').click();

      cy.url().should('not.eq', initialUrl);
    })

    cy.get(".blog-list-button").contains(titleText).click()
    cy.get('.blog-title').contains(titleText)
    cy.get('.column-of-text').contains(bodyText)
  })
})