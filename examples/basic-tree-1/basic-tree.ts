import f3 from '../../src/index.js'

fetch('./data.json')
  .then(r => r.json())
  .then(data => {
    const store = f3.createStore({
        data,
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
        link_break: false,
      })

    view.setCard(Card)
    // @ts-expect-error TS(7006) FIXME: Parameter 'props' implicitly has an 'any' type.
    store.setOnUpdate(props => view.update(props || {}))
    store.update.tree({ initial: true })
  })
