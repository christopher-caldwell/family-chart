import { generateUUID, removeToAdd } from './general.js'

// @ts-expect-error TS(7031) FIXME: Binding element 'datum' implicitly has an 'any' ty... Remove this comment to see the full error message
export function handleRelsOfNewDatum({ datum, data_stash, rel_type, rel_datum }) {
  if (rel_type === 'daughter' || rel_type === 'son') addChild(datum)
  else if (rel_type === 'father' || rel_type === 'mother') addParent(datum)
  else if (rel_type === 'spouse') addSpouse(datum)

  // @ts-expect-error TS(7006) FIXME: Parameter 'datum' implicitly has an 'any' type.
  function addChild(datum) {
    if (datum.data.other_parent) {
      addChildToSpouseAndParentToChild(datum.data.other_parent)
      delete datum.data.other_parent
    }
    datum.rels[rel_datum.data.gender === 'M' ? 'father' : 'mother'] = rel_datum.id
    if (!rel_datum.rels.children) rel_datum.rels.children = []
    rel_datum.rels.children.push(datum.id)
    return datum

    // @ts-expect-error TS(7006) FIXME: Parameter 'spouse_id' implicitly has an 'any' type... Remove this comment to see the full error message
    function addChildToSpouseAndParentToChild(spouse_id) {
      if (spouse_id === '_new') spouse_id = addOtherParent().id

      // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
      const spouse = data_stash.find(d => d.id === spouse_id)
      datum.rels[spouse.data.gender === 'M' ? 'father' : 'mother'] = spouse.id
      if (!spouse.rels.hasOwnProperty('children')) spouse.rels.children = []
      spouse.rels.children.push(datum.id)

      function addOtherParent() {
        // @ts-expect-error TS(2345) FIXME: Argument of type '{ rel_type: string; rel_datum: a... Remove this comment to see the full error message
        const new_spouse = createNewPersonWithGenderFromRel({ rel_type: 'spouse', rel_datum })
        addSpouse(new_spouse)
        addNewPerson({ data_stash, datum: new_spouse })
        return new_spouse
      }
    }
  }

  // @ts-expect-error TS(7006) FIXME: Parameter 'datum' implicitly has an 'any' type.
  function addParent(datum) {
    const is_father = datum.data.gender === 'M',
      parent_to_add_id = rel_datum.rels[is_father ? 'father' : 'mother']
    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    if (parent_to_add_id)
      removeToAdd(
        data_stash.find(d => d.id === parent_to_add_id),
        data_stash
      )
    addNewParent()

    function addNewParent() {
      rel_datum.rels[is_father ? 'father' : 'mother'] = datum.id
      handleSpouse()
      datum.rels.children = [rel_datum.id]
      return datum

      function handleSpouse() {
        const spouse_id = rel_datum.rels[!is_father ? 'father' : 'mother']
        if (!spouse_id) return
        // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
        const spouse = data_stash.find(d => d.id === spouse_id)
        datum.rels.spouses = [spouse_id]
        if (!spouse.rels.spouses) spouse.rels.spouses = []
        spouse.rels.spouses.push(datum.id)
        return spouse
      }
    }
  }

  // @ts-expect-error TS(7006) FIXME: Parameter 'datum' implicitly has an 'any' type.
  function addSpouse(datum) {
    removeIfToAdd()
    if (!rel_datum.rels.spouses) rel_datum.rels.spouses = []
    rel_datum.rels.spouses.push(datum.id)
    datum.rels.spouses = [rel_datum.id]

    function removeIfToAdd() {
      if (!rel_datum.rels.spouses) return
      // @ts-expect-error TS(7006) FIXME: Parameter 'spouse_id' implicitly has an 'any' type... Remove this comment to see the full error message
      rel_datum.rels.spouses.forEach(spouse_id => {
        // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
        const spouse = data_stash.find(d => d.id === spouse_id)
        if (spouse.to_add) removeToAdd(spouse, data_stash)
      })
    }
  }
}

// @ts-expect-error TS(7031) FIXME: Binding element 'data' implicitly has an 'any' typ... Remove this comment to see the full error message
export function createNewPerson({ data, rels }) {
  return { id: generateUUID(), data: data || {}, rels: rels || {} }
}

// @ts-expect-error TS(7031) FIXME: Binding element 'data' implicitly has an 'any' typ... Remove this comment to see the full error message
export function createNewPersonWithGenderFromRel({ data, rel_type, rel_datum }) {
  const gender = getGenderFromRelative(rel_datum, rel_type)
  data = Object.assign(data || {}, { gender })
  // @ts-expect-error TS(2345) FIXME: Argument of type '{ data: any; }' is not assignabl... Remove this comment to see the full error message
  return createNewPerson({ data })

  // @ts-expect-error TS(7006) FIXME: Parameter 'rel_datum' implicitly has an 'any' type... Remove this comment to see the full error message
  function getGenderFromRelative(rel_datum, rel_type) {
    // @ts-expect-error TS(2550) FIXME: Property 'includes' does not exist on type 'string... Remove this comment to see the full error message
    return ['daughter', 'mother'].includes(rel_type) || (rel_type === 'spouse' && rel_datum.data.gender === 'M')
      ? 'F'
      : 'M'
  }
}

// @ts-expect-error TS(7031) FIXME: Binding element 'data_stash' implicitly has an 'an... Remove this comment to see the full error message
export function addNewPerson({ data_stash, datum }) {
  data_stash.push(datum)
}

// @ts-expect-error TS(7031) FIXME: Binding element 'data' implicitly has an 'any' typ... Remove this comment to see the full error message
export function createTreeDataWithMainNode({ data, version }) {
  // @ts-expect-error TS(2345) FIXME: Argument of type '{ data: any; }' is not assignabl... Remove this comment to see the full error message
  return { data: [createNewPerson({ data })], version }
}

// @ts-expect-error TS(7031) FIXME: Binding element 'datum' implicitly has an 'any' ty... Remove this comment to see the full error message
export function addNewPersonAndHandleRels({ datum, data_stash, rel_type, rel_datum }) {
  addNewPerson({ data_stash, datum })
  handleRelsOfNewDatum({ datum, data_stash, rel_type, rel_datum })
}
