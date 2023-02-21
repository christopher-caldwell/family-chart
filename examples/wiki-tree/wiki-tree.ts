import f3 from '../../src/index.js'
import { setupWikiSearch } from './wiki-data.search.js'

;(() => {
  const store = f3.createStore({
      data: null,
      node_separation: 250,
      level_separation: 150,
    }),
    // @ts-expect-error TS(2345) FIXME: Argument of type '{ store: { state: any; update: {... Remove this comment to see the full error message
    view = f3.d3AnimationView({
      store,
      cont: document.querySelector('#FamilyChart'),
    }),
    Card = f3.elements.Card({
      store,
      svg: view.svg,
      card_dim: { w: 220, h: 70, text_x: 75, text_y: 15, img_w: 60, img_h: 60, img_x: 5, img_y: 5 },
      // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
      card_display: [d => d.data.label || '', d => d.data.desc || ''],
      mini_tree: true,
      link_break: true,
    })

  view.setCard(Card)
  setupWikiSearch(store, document.querySelector('#FamilyChart'))
  // @ts-expect-error TS(7006) FIXME: Parameter 'props' implicitly has an 'any' type.
  store.setOnUpdate(props => {
    addWikiIdToURL(store.state.main_id)
    view.update(props || {})
  })

  // @ts-expect-error TS(7006) FIXME: Parameter 'wiki_id' implicitly has an 'any' type.
  function addWikiIdToURL(wiki_id) {
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('wiki_id', wiki_id)
    window.history.pushState('page2', 'Title', location.pathname + '?wiki_id=' + wiki_id)
    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    document.title = 'wiki tree - ' + store.getData().find(d => d.id === store.state.main_id).data.label
  }
})()
