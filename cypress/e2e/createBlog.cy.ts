describe('Creating a blog', () => {
  it('passes', () => {
    const initialUrl = "http://localhost:3000/"
    cy.visit(initialUrl)
    cy.get('button').contains('Create a blog').click();

    cy.url().then(initialUrl => {
      cy.get('#title').type('title text');
      cy.get('button').contains('Publish Blog').click();

      // Check that the "Body is empty" error message is displayed
      cy.get('.error-message').should('have.text', 'Body is empty');
      cy.get('.error-message').should('have.length', 1);

      cy.get('#title').clear();
      cy.get('#title').should('have.value', '');

      cy.get('#body').type('body text');
      cy.get('button').contains('Publish Blog').click();

      // Check that the "Title is empty" error message is displayed
      cy.get('.error-message').should('have.text', 'Title is empty');
      cy.get('.error-message').should('have.length', 1);

      cy.get('#title').type('title text');
      cy.get('button').contains('Publish Blog').click();

      cy.url().should('not.eq', initialUrl);
    })

    cy.get(".blog-list-button").contains("title text").click()
    cy.get('.blog-title').contains('title text')
    cy.get('.column-of-text').contains('body text')
  })
})