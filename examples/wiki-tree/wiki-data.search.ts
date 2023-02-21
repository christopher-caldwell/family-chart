import { getWikiDataElementByStr, isHuman } from './wiki-data.handleWikiData.js'
import wikidata_peps from './wikidata_peps.js'
import { getFamilyTreeFromWikidata } from './wiki-data.cleanData.js'

// @ts-expect-error TS(7006) FIXME: Parameter 'store' implicitly has an 'any' type.
export function setupWikiSearch(store, cont) {
  // @ts-expect-error TS(7034) FIXME: Variable 'wiki_stash' implicitly has type 'any[]' ... Remove this comment to see the full error message
  let wiki_stash = []
  Search({
    cont: document.body.insertBefore(document.createElement('div'), document.body.firstElementChild),
    onSelect: updateDataWithWDItem,
  })

  onLoad(updateDataWithWDItem)

  // @ts-expect-error TS(7006) FIXME: Parameter 'updateDataWithWDItem' implicitly has an... Remove this comment to see the full error message
  function onLoad(updateDataWithWDItem) {
    const wiki_id = new URL(window.location.href).searchParams.get('wiki_id')
    if (wiki_id) updateDataWithWDItem({ wiki_id })
  }

  // @ts-expect-error TS(7031) FIXME: Binding element 'wiki_id' implicitly has an 'any' ... Remove this comment to see the full error message
  function updateDataWithWDItem({ wiki_id }) {
    const loader = insertLoader()
    return (
      // @ts-expect-error TS(7005) FIXME: Variable 'wiki_stash' implicitly has an 'any[]' ty... Remove this comment to see the full error message
      getFamilyTreeFromWikidata(wiki_stash, wiki_id)
        .then(d => {
          wiki_stash = d.wiki_stash.slice(0, 500)
          // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
          store.update.mainId(d.data.find(d => d.id === wiki_id).id)
          store.update.data(d.data)
          store.update.tree({ initial: true })
        })
        // @ts-expect-error TS(2550) FIXME: Property 'finally' does not exist on type 'Promise... Remove this comment to see the full error message
        .finally(() => loader.remove())
    )
  }

  function insertLoader() {
    const loader = document.createElement('div')
    loader.setAttribute('class', 'lds-roller-cont')
    loader.innerHTML = `<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`
    cont.appendChild(loader)
    return loader
  }
}

// @ts-expect-error TS(7031) FIXME: Binding element 'cont' implicitly has an 'any' typ... Remove this comment to see the full error message
function Search({ cont, onSelect }) {
  cont.style.position = 'relative'
  cont.style.zIndex = '1'
  cont.innerHTML = `
    <div class="input-field" style="width: 450px; max-width: 85%; margin: auto; position: absolute; top: 13px; left: 0; right: 0">
      <input type="text" id="autocomplete-input" class="autocomplete" style="color: #fff;">
      <label for="autocomplete-input">Search Wikidata</label>
      <div class="lds-roller-input-cont" style="display: none">
        <div class="lds-roller" style="color: #9e9e9e"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      </div>
    </div>
  `

  const results = wikidata_peps.reduce((acc, d) => {
      // @ts-expect-error TS(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      acc[d.humanLabel] = { datum: { wiki_id: d.human.split('/')[d.human.split('/').length - 1] } }
      return acc
    }, {}),
    dict_for_autocomplete = Object.keys(results).reduce((acc, k) => {
      // @ts-expect-error TS(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      acc[k] = null
      return acc
    }, {}),
    input = cont.querySelector('input'),
    // @ts-expect-error TS(2304) FIXME: Cannot find name 'M'.
    autocomplete = M.Autocomplete.init(input, {
      data: dict_for_autocomplete,
      // @ts-expect-error TS(7006) FIXME: Parameter 'key' implicitly has an 'any' type.
      onAutocomplete: key => onSelect(results[key].datum),
      minLength: 3,
    })

  setupListener()

  function setupListener() {
    let searchTimeout = setTimeout(() => {})
    addEventListener('input', function (e) {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(search, 300)
    })

    function search() {
      if (input.value.length < 3) return
      autocomplete.el.parentNode.querySelector('.lds-roller-input-cont').style.display = null
      // @ts-expect-error TS(7006) FIXME: Parameter 'data' implicitly has an 'any' type.
      getWikiDataElementByStr(input.value).then(data => {
        autocomplete.el.parentNode.querySelector('.lds-roller-input-cont').style.display = 'none'
        // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
        data.forEach(d => {
          isHuman(d.datum.wiki_id).then(is => (is ? insertHuman(d) : ''))
        })
        // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
        function insertHuman(d) {
          // @ts-expect-error TS(2550) FIXME: Property 'values' does not exist on type 'ObjectCo... Remove this comment to see the full error message
          if (Object.values(results).find(d0 => d0.datum.wiki_id === d.datum.wiki_id)) return
          const key = d.datum.label + (d.desc ? ` (${d.desc})` : '')
          // @ts-expect-error TS(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          results[key] = d
          // @ts-expect-error TS(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          dict_for_autocomplete[key] = null
          autocomplete.updateData(dict_for_autocomplete)
          autocomplete.open()
        }
      })
    }
  }
}
