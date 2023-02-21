export function Form({
  // @ts-expect-error TS(7031) FIXME: Binding element 'datum' implicitly has an 'any' ty... Remove this comment to see the full error message
  datum,
  // @ts-expect-error TS(7031) FIXME: Binding element 'rel_datum' implicitly has an 'any... Remove this comment to see the full error message
  rel_datum,
  // @ts-expect-error TS(7031) FIXME: Binding element 'store' implicitly has an 'any' ty... Remove this comment to see the full error message
  store,
  // @ts-expect-error TS(7031) FIXME: Binding element 'rel_type' implicitly has an 'any'... Remove this comment to see the full error message
  rel_type,
  // @ts-expect-error TS(7031) FIXME: Binding element 'card_edit' implicitly has an 'any... Remove this comment to see the full error message
  card_edit,
  // @ts-expect-error TS(7031) FIXME: Binding element 'postSubmit' implicitly has an 'an... Remove this comment to see the full error message
  postSubmit,
  // @ts-expect-error TS(7031) FIXME: Binding element 'card_display' implicitly has an '... Remove this comment to see the full error message
  card_display,
  // @ts-expect-error TS(7031) FIXME: Binding element 'el' implicitly has an 'any' type.
  edit: { el, open, close },
}) {
  setupFromHtml()
  open()

  function setupFromHtml() {
    el.innerHTML = `
      <div class="modal-content">
        <form>
          <div>
            <div style="text-align: left">
              <span style="display: ${
                datum.to_add || !!rel_datum ? 'none' : null
              }; float: right; cursor: pointer" class="red-text delete">delete</span>
            </div>
            <div>
              <label><input type="radio" name="gender" value="M" ${
                datum.data.gender === 'M' ? 'checked' : ''
              }><span>male</span></label><br>
              <label><input type="radio" name="gender" value="F" ${
                datum.data.gender === 'F' ? 'checked' : ''
              }><span>female</span></label><br>
            </div>
          </div>
          ${getEditFields(card_edit)}
          ${rel_type === 'son' || rel_type === 'daughter' ? otherParentSelect() : ''}
          <br><br>
          <div style="text-align: center">
            <button type="submit" class="btn">submit</button>
          </div>
        </form>
      </div>
    `
    el.querySelector('form').addEventListener('submit', submitFormChanges)
    el.querySelector('.delete').addEventListener('click', deletePerson)
  }

  function otherParentSelect() {
    const data_stash = store.getData()
    return `
      <div>
        <label>Select other</label>
        <select name="other_parent" style="display: block">
          ${
            !rel_datum.rels.spouses || rel_datum.rels.spouses.length === 0
              ? ''
              : rel_datum.rels.spouses
                  // @ts-expect-error TS(7006) FIXME: Parameter 'sp_id' implicitly has an 'any' type.
                  .map((sp_id, i) => {
                    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
                    const spouse = data_stash.find(d => d.id === sp_id)
                    return `<option value="${sp_id}" ${i === 0 ? 'selected' : ''}>${card_display[0](spouse)}</option>`
                  })
                  .join('\n')
          }
          <option value="${'_new'}">NEW</option>
        </select>
      </div>
    `
  }

  // @ts-expect-error TS(7006) FIXME: Parameter 'e' implicitly has an 'any' type.
  function submitFormChanges(e) {
    e.preventDefault()
    const form_data = new FormData(e.target)
    form_data.forEach((v, k) => (datum.data[k] = v))

    close()
    postSubmit()
  }

  function deletePerson() {
    close()
    postSubmit({ delete: true })
  }

  // @ts-expect-error TS(7006) FIXME: Parameter 'card_edit' implicitly has an 'any' type... Remove this comment to see the full error message
  function getEditFields(card_edit) {
    return (
      card_edit
        // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
        .map(d =>
          d.type === 'text'
            ? `<input type="text" name="${d.key}" placeholder="${d.placeholder}" value="${datum.data[d.key] || ''}">`
            : d.type === 'textarea'
            ? `<textarea class="materialize-textarea" name="${d.key}" placeholder="${d.placeholder}">${
                datum.data[d.key] || ''
              }</textarea>`
            : ''
        )
        .join('\n')
    )
  }
}
