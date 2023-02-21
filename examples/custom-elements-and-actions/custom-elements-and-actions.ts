import f3 from '../../src/index.js'

fetch('./data.json')
  .then(r => r.json())
  .then(data => {
    const card_dim = { w: 220, h: 70, text_x: 75, text_y: 15, img_w: 60, img_h: 60, img_x: 5, img_y: 5 }

    const store = f3.createStore({
        data,
        cont: document.querySelector('#chart'),
        // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
        card_display: [d => d.data.label || '', d => d.data.desc || ''],
        mini_tree: true,
        hide_rels: true,
        node_separation: 250,
        level_separation: 150,
        custom_elements: [{ el: customAddBtn(card_dim), lis: customAddBtnListener, query: '.customAddBtn' }],
        card_dim,
      }),
      // @ts-expect-error TS(2345) FIXME: Argument of type '{ state: any; update: { tree: (p... Remove this comment to see the full error message
      view = f3.d3AnimationView(store)

    // @ts-expect-error TS(7006) FIXME: Parameter 'props' implicitly has an 'any' type.
    store.setOnUpdate(props => view.update(props || {}))
    // @ts-expect-error TS(2554) FIXME: Expected 1 arguments, but got 0.
    store.update.tree()
  })

// @ts-expect-error TS(7006) FIXME: Parameter 'card_dim' implicitly has an 'any' type.
function customAddBtn(card_dim) {
  return `
    <g class="customAddBtn" style="cursor: pointer">
      <g transform="translate(${card_dim.w - 12},${card_dim.h - 12})scale(.08)">
        <circle r="100" fill="#fff" />
        <g transform="translate(-50,-45)">
          <line
            x1="10" x2="90" y1="50" y2="50"
            stroke="currentColor" stroke-width="20" stroke-linecap="round"
          />
          <line
            x1="50" x2="50" y1="10" y2="90"
            stroke="currentColor" stroke-width="20" stroke-linecap="round"
          />
        </g>
      </g>
    </g>
  `
}

// @ts-expect-error TS(7006) FIXME: Parameter 'store' implicitly has an 'any' type.
function customAddBtnListener(store, props) {
  console.log(props.card)
  console.log(props.d)
}
