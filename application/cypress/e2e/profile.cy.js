describe('User Profile Workflows', () => {

    it('can add codewars integration', () => {
        cy.fixture("login-data.json").then((loginData) => {
            cy.login(loginData.validUser.email, loginData.validUser.password)
            cy.visit('http://localhost:3000/profile')
        })
    })
})
  