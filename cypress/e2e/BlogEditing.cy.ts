describe('Editing a blog', () => {
  it('passes', () => {
    const initialUrl = "http://localhost:3000/"

    cy.visit(initialUrl)
    cy.get('button').contains('Basic explanation').click();
    cy.get('button').contains('Edit').click();
    cy.get('button').contains('Cancel').click();
    cy.get('button').contains('Edit').click();
    cy.get("#new-body").type('{selectall}').rightclick()
    cy.get('button').contains("Bold").click()
    cy.get('button').contains("Update").click()
    
    cy.get('pre.column-of-text')
    .children()
    .should('have.prop', 'tagName', 'B'); 
  })
})