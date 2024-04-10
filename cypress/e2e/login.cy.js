describe('Login Page Workflows', () => {

    it('can login successfully', () => {
        cy.fixture("login-data.json").then((loginData) => {
            cy.login(loginData.validUser.email, loginData.validUser.password)
            cy.url().should('eq', 'http://localhost:3000/home')
        })
    })
})
  