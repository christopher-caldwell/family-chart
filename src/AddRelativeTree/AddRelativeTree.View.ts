import { addNewPerson, createNewPersonWithGenderFromRel, handleRelsOfNewDatum } from '../handlers/newPerson'

// @ts-expect-error TS(7006) FIXME: Parameter 'tree' implicitly has an 'any' type.
export default function View(tree, { store, data_stash, cont, datum, card_dim, cardEditForm, scale }) {
  const svg_dim = cont.getBoundingClientRect(),
    tree_fit = calculateTreeFit(svg_dim),
    // @ts-expect-error TS(7006) FIXME: Parameter 'node' implicitly has an 'any' type.
    mounted = node => {
      addEventListeners(node)
    }

  return {
    template: `
      <svg id="family-tree-svg" style="width: 100%; height: 100%">
        <rect width="${svg_dim.width}" height="${svg_dim.height}" fill="transparent" />
        <g class="view">
          <g transform="translate(${tree_fit.x}, ${tree_fit.y})scale(${tree_fit.k})">
            ${tree.data
              .slice(1)
              // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
              .map((d, i) => Link({ d, is_vertical: !['spouse'].includes(d.data.rel_type) }).template)}
            ${
              // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
              tree.data.slice(1).map((d, i) => Card({ d }).template)
            }
          </g>
        </g>
      </svg>
    `,
    mounted,
  }

  // @ts-expect-error TS(7006) FIXME: Parameter 'svg_dim' implicitly has an 'any' type.
  function calculateTreeFit(svg_dim) {
    const k = scale || 1
    return { k, x: svg_dim.width / 2, y: svg_dim.height / 2 }
  }

  // @ts-expect-error TS(7031) FIXME: Binding element 'd' implicitly has an 'any' type.
  function Card({ d, is_main }) {
    const [w, h] = is_main ? [160, 60] : [160, 40],
      pos = { x: d.x, y: d.y }

    return {
      template: `
      <g transform="translate(${pos.x}, ${pos.y})" class="card" data-rel_type="${
        d.data.rel_type
      }" style="cursor: pointer">
        <g transform="translate(${-w / 2}, ${-h / 2})">
          ${CardBody({ d, w, h }).template}
        </g>
      </g>
    `,
    }

    // @ts-expect-error TS(7031) FIXME: Binding element 'd' implicitly has an 'any' type.
    function CardBody({ d, w, h }) {
      const color_class =
        d.data.data.gender === 'M' ? 'card-male' : d.data.data.gender === 'F' ? 'card-female' : 'card-genderless'
      return {
        template: `
        <g>
          <rect width="${w}" height="${h}" fill="#fff" rx="${10}" ${
          d.data.main ? 'stroke="#000"' : ''
        } class="${color_class}" />
          <text transform="translate(${0}, ${h / 4})">
            <tspan x="${10}" dy="${14}">${d.data.data.label}</tspan>
          </text>
        </g>
      `,
      }
    }
  }

  // @ts-expect-error TS(7031) FIXME: Binding element 'd' implicitly has an 'any' type.
  function Link({ d, is_vertical }) {
    return {
      template: `
      // @ts-expect-error TS(2554) FIXME: Expected 0 arguments, but got 1.
      // @ts-expect-error TS(2554) FIXME: Expected 0 arguments, but got 1.
      // @ts-expect-error TS(2554) FIXME: Expected 0 arguments, but got 1.
      // @ts-expect-error TS(2554) FIXME: Expected 0 arguments, but got 1.
      // @ts-expect-error TS(2554) FIXME: Expected 0 arguments, but got 1.
      // @ts-expect-error TS(2554) FIXME: Expected 0 arguments, but got 1.
      <path d="${createPath()}" fill="none" stroke="#fff" />
    `,
    }

    function createPath() {
      const { w, h } = card_dim
      const parent =
        is_vertical && d.y < 0
          ? { x: 0, y: -h / 2 }
          : is_vertical && d.y > 0
          ? { x: 0, y: h / 2 }
          : !is_vertical && d.x < 0
          ? { x: -w / 2, y: 0 }
          : !is_vertical && d.x > 0
          ? { x: w / 2, y: 0 }
          : { x: 0, y: 0 }

      if (is_vertical) {
        return (
          'M' +
          d.x +
          ',' +
          d.y +
          'C' +
          d.x +
          ',' +
          (d.y + (d.y < 0 ? 50 : -50)) +
          ' ' +
          parent.x +
          ',' +
          (parent.y + (d.y < 0 ? -50 : 50)) +
          ' ' +
          parent.x +
          ',' +
          parent.y
        )
      } else {
        const s = d.x > 0 ? +1 : -1
        return (
          'M' +
          d.x +
          ',' +
          d.y +
          'C' +
          (parent.x + 50 * s) +
          ',' +
          d.y +
          ' ' +
          (parent.x + 150 * s) +
          ',' +
          parent.y +
          ' ' +
          parent.x +
          ',' +
          parent.y
        )
      }
    }
  }

  // @ts-expect-error TS(7006) FIXME: Parameter 'view' implicitly has an 'any' type.
  function addEventListeners(view) {
    // @ts-expect-error TS(7006) FIXME: Parameter 'e' implicitly has an 'any' type.
    view.addEventListener('click', e => {
      const node = e.target
      handleCardClick(node) || view.remove()
    })

    // @ts-expect-error TS(7006) FIXME: Parameter 'node' implicitly has an 'any' type.
    function handleCardClick(node) {
      if (!node.closest('.card')) return
      const card = node.closest('.card'),
        rel_type = card.getAttribute('data-rel_type'),
        rel_datum = datum,
        // @ts-expect-error TS(2345) FIXME: Argument of type '{ rel_datum: any; rel_type: any;... Remove this comment to see the full error message
        new_datum = createNewPersonWithGenderFromRel({ rel_datum, rel_type }),
        postSubmit = () => {
          view.remove()
          addNewPerson({ data_stash, datum: new_datum })
          handleRelsOfNewDatum({ datum: new_datum, data_stash, rel_datum, rel_type })
          store.update.tree()
        }
      cardEditForm({ datum: new_datum, rel_datum, rel_type, postSubmit, store })
      return true
    }
  }
}
