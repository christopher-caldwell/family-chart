import f3 from '../../../src/index.js'

// @ts-expect-error TS(7006) FIXME: Parameter 'updateData' implicitly has an 'any' typ... Remove this comment to see the full error message
export default function ReactiveTextarea(updateData, textarea_selector, update_btn_selector) {
  const textarea = document.querySelector(textarea_selector)

  document.querySelector(update_btn_selector).addEventListener('click', () => {
    updateData(JSON.parse(textarea.value))
  })

  return { update: updateTextArea }

  // @ts-expect-error TS(7006) FIXME: Parameter 'data' implicitly has an 'any' type.
  function updateTextArea(data) {
    let data_no_to_add = JSON.parse(JSON.stringify(data))
    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    data_no_to_add.forEach(d => (d.to_add ? f3.handlers.removeToAdd(d, data_no_to_add) : d))
    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    data_no_to_add.forEach(d => delete d.main)
    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    data_no_to_add.forEach(d => delete d.hide_rels)
    textarea.value = JSON.stringify(data_no_to_add, null, 2)
  }
}
