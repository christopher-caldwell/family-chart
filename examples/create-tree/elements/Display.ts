// @ts-expect-error TS(7006) FIXME: Parameter 'cont_selector' implicitly has an 'any' ... Remove this comment to see the full error message
export default function Display(cont_selector, store, card_display) {
  const cont = document.querySelector(cont_selector)

  cont.innerHTML = `   
    <h5>Display</h5>
    <div class="inputs"></div>
  `

  createInputs()

  function createInputs() {
    const inputs = cont.querySelector('.inputs')
    inputs.innerHTML = ''
    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    card_display.forEach((d, i) => {
      const cont = document.createElement('div')
      cont.style.position = 'relative'
      cont.innerHTML = `
        <input type="text" placeholder="label" value="${d.create_form}">
      `

      let timeout = setTimeout(() => {}, 1)
      // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
      cont.querySelector('input').addEventListener('input', function () {
        card_display[i] = labelCreator(this.value)
        clearTimeout(timeout)
        timeout = setTimeout(store.update.tree, 300)
      })

      inputs.appendChild(cont)
    })
  }
}

// @ts-expect-error TS(7006) FIXME: Parameter 'create_form' implicitly has an 'any' ty... Remove this comment to see the full error message
function labelCreator(create_form) {
  const keys = create_form.match(/[^{\}]+(?=})/g),
    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    creator = d => {
      let label = create_form
      // @ts-expect-error TS(7006) FIXME: Parameter 'k' implicitly has an 'any' type.
      keys.forEach(k => (label = label.replace(`{${k}}`, d.data[k] || '')))
      return label
    }
  creator.create_form = create_form
  creator.toString = () => `d => \`${create_form.replace(/{/g, '${d.data["').replace(/}/g, '"]}')}\``
  return creator
}
