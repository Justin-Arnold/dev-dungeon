describe('Login Page Workflows', () => {

    it('can login successfully', () => {
        cy.fixture("login-data.json").then((loginData) => {
            cy.login(loginData.validUser.email, loginData.validUser.password)
            cy.url().should('eq', 'http://localhost:3000/home')
        })
    })

    it('will give errors on invalid login', () => {
        cy.fixture("login-data.json").then((loginData) => {
            cy.login(loginData.invalidUser.email, loginData.invalidUser.password)
            cy.url().should('eq', 'http://localhost:3000/login')
            cy.contains('invalid username or password')
        })
    })
})
  