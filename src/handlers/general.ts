import d3 from '../d3.js'
import { checkIfRelativesConnectedWithoutPerson } from './checkIfRelativesConnectedWithoutPerson.js'
import { createTreeDataWithMainNode } from './newPerson.js'

// @ts-expect-error TS(7006) FIXME: Parameter 'datum' implicitly has an 'any' type.
export function moveToAddToAdded(datum, data_stash) {
  delete datum.to_add
  return datum
}

// @ts-expect-error TS(7006) FIXME: Parameter 'datum' implicitly has an 'any' type.
export function removeToAdd(datum, data_stash) {
  deletePerson(datum, data_stash)
  return false
}

// @ts-expect-error TS(7006) FIXME: Parameter 'datum' implicitly has an 'any' type.
export function deletePerson(datum, data_stash) {
  if (!checkIfRelativesConnectedWithoutPerson(datum, data_stash))
    return { success: false, error: 'checkIfRelativesConnectedWithoutPerson' }
  executeDelete()
  return { success: true }

  function executeDelete() {
    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    data_stash.forEach(d => {
      for (const k in d.rels) {
        if (!d.rels.hasOwnProperty(k)) continue
        if (d.rels[k] === datum.id) {
          delete d.rels[k]
        } else if (Array.isArray(d.rels[k]) && d.rels[k].includes(datum.id)) {
          d.rels[k].splice(
            // @ts-expect-error TS(7006) FIXME: Parameter 'did' implicitly has an 'any' type.
            d.rels[k].findIndex(did => did === datum.id),
            1
          )
        }
      }
    })
    data_stash.splice(
      // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
      data_stash.findIndex(d => d.id === datum.id),
      1
    )
    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    data_stash.forEach(d => {
      if (d.to_add) deletePerson(d, data_stash)
    }) // full update of tree
    // @ts-expect-error TS(2345) FIXME: Argument of type '{}' is not assignable to paramet... Remove this comment to see the full error message
    if (data_stash.length === 0) data_stash.push(createTreeDataWithMainNode({}).data[0])
  }
}

// @ts-expect-error TS(7031) FIXME: Binding element 'amount' implicitly has an 'any' t... Remove this comment to see the full error message
export function manualZoom({ amount, svg, transition_time = 500 }) {
  const zoom = svg.__zoomObj
  d3.select(svg)
    .transition()
    .duration(transition_time || 0)
    .delay(transition_time ? 100 : 0) // delay 100 because of weird error of undefined something in d3 zoom
    .call(zoom.scaleBy, amount)
}

// @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
export function isAllRelativeDisplayed(d, data) {
  const r = d.data.rels,
    all_rels = [r.father, r.mother, ...(r.spouses || []), ...(r.children || [])].filter(v => v)
  // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
  return all_rels.every(rel_id => data.some(d => d.data.id === rel_id))
}

export function generateUUID() {
  let d = new Date().getTime()
  let d2 = (performance && performance.now && performance.now() * 1000) || 0 //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16)
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0
      d2 = Math.floor(d2 / 16)
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}
