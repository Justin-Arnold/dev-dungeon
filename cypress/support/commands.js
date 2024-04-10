Cypress.Commands.add("login", (email, password) => {
    cy.session([email, password], () => {
        cy.visit('http://localhost:3000/login')
        cy.get("#email").type(email)
        cy.get("#password").type(password, {log:false})
        cy.get('button:contains("Login")').click()
        cy.url().should('contain', '/home')
    })
})