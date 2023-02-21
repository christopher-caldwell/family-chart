// @ts-expect-error TS(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Create simple trees', () => {
  // @ts-expect-error TS(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Add f m', () => {
    // @ts-expect-error TS(2304) FIXME: Cannot find name 'cy'.
    cy.visit('http://localhost:8080/examples/create-tree')

    addRelative('Name', 'father', 'Zen')
    getCardByName('ADD')
    addRelative('Name', 'mother', 'Zebra')
    getCardByName('Zen')
    getCardByName('Zebra')
  })

  // @ts-expect-error TS(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Add s d', () => {
    // @ts-expect-error TS(2304) FIXME: Cannot find name 'cy'.
    cy.visit('http://localhost:8080/examples/create-tree')

    // @ts-expect-error TS(2554) FIXME: Expected 4 arguments, but got 3.
    addChild('Name', 'son', 'Ben')
    // @ts-expect-error TS(2554) FIXME: Expected 4 arguments, but got 3.
    addChild('Name', 'daughter', 'Becky')
    addRelative('Name', 'spouse', 'Andrea')
    getCardByName('Ben')
    getCardByName('Becky')
  })

  // @ts-expect-error TS(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Add sp s d', () => {
    // @ts-expect-error TS(2304) FIXME: Cannot find name 'cy'.
    cy.visit('http://localhost:8080/examples/create-tree')

    addRelative('Name', 'spouse', 'Andrea')
    // @ts-expect-error TS(2554) FIXME: Expected 4 arguments, but got 3.
    addChild('Name', 'son', 'Ben')
    // @ts-expect-error TS(2554) FIXME: Expected 4 arguments, but got 3.
    addChild('Name', 'daughter', 'Becky')
    getCardByName('Ben')
    getCardByName('Becky')
  })

  // @ts-expect-error TS(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Add sp s d_sp_new', () => {
    // @ts-expect-error TS(2304) FIXME: Cannot find name 'cy'.
    cy.visit('http://localhost:8080/examples/create-tree')

    addRelative('Name', 'spouse', 'Andrea')
    // @ts-expect-error TS(2554) FIXME: Expected 4 arguments, but got 3.
    addChild('Name', 'son', 'Ben')
    addChild('Name', 'daughter', 'Becky', 'NEW')
    getCardByName('Ben')
    getCardByName('Becky')
  })

  // @ts-expect-error TS(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('Add s d ss sd', () => {
    // @ts-expect-error TS(2304) FIXME: Cannot find name 'cy'.
    cy.visit('http://localhost:8080/examples/create-tree')

    // @ts-expect-error TS(2554) FIXME: Expected 4 arguments, but got 3.
    addChild('Name', 'son', 'Ben')
    // @ts-expect-error TS(2554) FIXME: Expected 4 arguments, but got 3.
    addChild('Name', 'daughter', 'Becky')
    // @ts-expect-error TS(2554) FIXME: Expected 4 arguments, but got 3.
    addChild('Ben', 'son', 'Carlos')
    // @ts-expect-error TS(2554) FIXME: Expected 4 arguments, but got 3.
    addChild('Ben', 'daughter', 'Carla')
  })
})

// @ts-expect-error TS(7006) FIXME: Parameter 'person_name' implicitly has an 'any' ty... Remove this comment to see the full error message
function addRelative(person_name, rel_type, rel_name) {
  getCardByName(person_name).find('.card_add_relative').click()
  // @ts-expect-error TS(2304) FIXME: Cannot find name 'cy'.
  cy.get(`.card[data-rel_type="${rel_type}"]`).click()
  // @ts-expect-error TS(2304) FIXME: Cannot find name 'cy'.
  cy.get('input[name="first name"]').type(rel_name)
  // @ts-expect-error TS(2304) FIXME: Cannot find name 'cy'.
  cy.get('button[type="submit"]').click()
}

// @ts-expect-error TS(7006) FIXME: Parameter 'person_name' implicitly has an 'any' ty... Remove this comment to see the full error message
function addChild(person_name, rel_type, rel_name, other_parent_name) {
  getCardByName(person_name).find('.card_add_relative').click()
  // @ts-expect-error TS(2304) FIXME: Cannot find name 'cy'.
  cy.get(`.card[data-rel_type="${rel_type}"]`).click()
  // @ts-expect-error TS(2304) FIXME: Cannot find name 'cy'.
  cy.get('input[name="first name"]').type(rel_name)
  // @ts-expect-error TS(2304) FIXME: Cannot find name 'cy'.
  if (other_parent_name) cy.get('select[name="other_parent"]').select(other_parent_name)
  // @ts-expect-error TS(2304) FIXME: Cannot find name 'cy'.
  cy.get('button[type="submit"]').click()
}

// @ts-expect-error TS(7006) FIXME: Parameter 'name' implicitly has an 'any' type.
function getCardByName(name) {
  // @ts-expect-error TS(2304) FIXME: Cannot find name 'cy'.
  return cy.contains('tspan', name).closest('[data-cy="card"]')
}
