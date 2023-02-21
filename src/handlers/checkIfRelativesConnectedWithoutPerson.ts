// @ts-expect-error TS(7006) FIXME: Parameter 'datum' implicitly has an 'any' type.
export function checkIfRelativesConnectedWithoutPerson(datum, data_stash) {
  const r = datum.rels,
    r_ids = [r.father, r.mother, ...(r.spouses || []), ...(r.children || [])].filter(r_id => !!r_id),
    rels_not_to_main = []

  for (let i = 0; i < r_ids.length; i++) {
    const line = findPersonLineToMain(
      // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
      data_stash.find(d => d.id === r_ids[i]),
      [datum]
    )
    if (!line) {
      rels_not_to_main.push(r_ids[i])
      break
    }
  }
  return rels_not_to_main.length === 0

  // @ts-expect-error TS(7006) FIXME: Parameter 'datum' implicitly has an 'any' type.
  function findPersonLineToMain(datum, without_persons) {
    // @ts-expect-error TS(7034) FIXME: Variable 'line' implicitly has type 'any' in some ... Remove this comment to see the full error message
    let line
    if (isM(datum)) line = [datum]
    checkIfAnyRelIsMain(datum, [datum])
    return line

    // @ts-expect-error TS(7006) FIXME: Parameter 'd0' implicitly has an 'any' type.
    function checkIfAnyRelIsMain(d0, history) {
      // @ts-expect-error TS(7005) FIXME: Variable 'line' implicitly has an 'any' type.
      if (line) return
      history = [...history, d0]
      runAllRels(check)
      // @ts-expect-error TS(7005) FIXME: Variable 'line' implicitly has an 'any' type.
      if (!line) runAllRels(checkRels)

      // @ts-expect-error TS(7006) FIXME: Parameter 'f' implicitly has an 'any' type.
      function runAllRels(f) {
        const r = d0.rels
        ;[r.father, r.mother, ...(r.spouses || []), ...(r.children || [])]
          // @ts-expect-error TS(2550) FIXME: Property 'find' does not exist on type 'any[]'. Do... Remove this comment to see the full error message
          .filter(d_id => d_id && ![...without_persons, ...history].find(d => d.id === d_id))
          .forEach(d_id => f(d_id))
      }

      // @ts-expect-error TS(7006) FIXME: Parameter 'd_id' implicitly has an 'any' type.
      function check(d_id) {
        if (isM(d_id)) line = history
      }

      // @ts-expect-error TS(7006) FIXME: Parameter 'd_id' implicitly has an 'any' type.
      function checkRels(d_id) {
        // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
        const person = data_stash.find(d => d.id === d_id)
        checkIfAnyRelIsMain(person, history)
      }
    }
  }
  // @ts-expect-error TS(7006) FIXME: Parameter 'd0' implicitly has an 'any' type.
  function isM(d0) {
    return typeof d0 === 'object' ? d0.id === data_stash[0].id : d0 === data_stash[0].id
  } // todo: make main more exact
}
