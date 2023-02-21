import d3 from '../d3.js'

import { mainToMiddle, setupSvg, treeFit } from './View.handlers.js'
import { createPath } from './elements/Link.js'
import { createLinks } from '../CalculateTree/createLinks.js'
import { Card as CardDefault } from './elements/Card.js'
import { calculateEnterAndExitPositions } from '../CalculateTree/CalculateTree.handlers.js'

// @ts-expect-error TS(7031) FIXME: Binding element 'store' implicitly has an 'any' ty... Remove this comment to see the full error message
export default function d3AnimationView({ store, cont, Card }) {
  const svg = createSvg()
  setupSvg(svg, store.state.zoom_polite)

  // @ts-expect-error TS(7006) FIXME: Parameter 'card' implicitly has an 'any' type.
  return { update: updateView, svg, setCard: card => (Card = card) }

  // @ts-expect-error TS(7006) FIXME: Parameter 'props' implicitly has an 'any' type.
  function updateView(props) {
    if (!props) props = {}
    const tree = store.state.tree,
      view = d3.select(svg).select('.view'),
      tree_position = props.tree_position || 'fit',
      transition_time = props.hasOwnProperty('transition_time') ? props.transition_time : 2000

    updateCards()
    updateLinks()
    // @ts-expect-error TS(2345) FIXME: Argument of type '{ svg: Element | null; svg_dim: ... Remove this comment to see the full error message
    if (props.initial) treeFit({ svg, svg_dim: svg.getBoundingClientRect(), tree_dim: tree.dim, transition_time: 0 })
    else if (tree_position === 'fit')
      // @ts-expect-error TS(2345) FIXME: Argument of type '{ svg: Element | null; svg_dim: ... Remove this comment to see the full error message
      treeFit({ svg, svg_dim: svg.getBoundingClientRect(), tree_dim: tree.dim, transition_time })
    else if (tree_position === 'main_to_middle')
      mainToMiddle({
        datum: tree.data[0],
        svg,
        // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
        svg_dim: svg.getBoundingClientRect(),
        scale: props.scale,
        transition_time,
      })
    else if (tree_position === 'inherit') {
    }

    return true

    function updateLinks() {
      // @ts-expect-error TS(7006) FIXME: Parameter 'acc' implicitly has an 'any' type.
      const links_data = tree.data.reduce((acc, d) => acc.concat(createLinks({ d, tree: tree.data })), []),
        link = view
          .select('.links_view')
          .selectAll('path.link')
          // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
          .data(links_data, d => d.id),
        link_exit = link.exit(),
        link_enter = link.enter().append('path').attr('class', 'link'),
        link_update = link_enter.merge(link)

      link_exit.each(linkExit)
      link_enter.each(linkEnter)
      link_update.each(linkUpdate)

      // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
      function linkEnter(d) {
        // @ts-expect-error TS(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
        d3.select(this).attr('fill', 'none').attr('stroke', '#fff').style('opacity', 0).attr('d', createPath(d, true))
      }

      // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
      function linkUpdate(d) {
        // @ts-expect-error TS(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
        const path = d3.select(this)
        const delay = calculateDelay(d)
        // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 1.
        path.transition('path').duration(transition_time).delay(delay).attr('d', createPath(d)).style('opacity', 1)
      }

      // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
      function linkExit(d) {
        // @ts-expect-error TS(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
        const path = d3.select(this)
        path.transition('op').duration(800).style('opacity', 0)
        path
          .transition('path')
          .duration(transition_time)
          .attr('d', createPath(d, true))
          .on('end', () => path.remove())
      }
    }

    function updateCards() {
      const card = view
          .select('.cards_view')
          .selectAll('g.card_cont')
          // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
          .data(tree.data, d => d.data.id),
        card_exit = card.exit(),
        card_enter = card.enter().append('g').attr('class', 'card_cont'),
        card_update = card_enter.merge(card)

      // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
      card_exit.each(d => calculateEnterAndExitPositions(d, false, true))
      // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
      card_enter.each(d => calculateEnterAndExitPositions(d, true, false))

      card_exit.each(cardExit)
      card.each(cardUpdateNoEnter)
      card_enter.each(cardEnter)
      card_update.each(cardUpdate)

      // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
      function cardEnter(d) {
        // @ts-expect-error TS(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
        d3.select(this)
          .attr('transform', `translate(${d._x}, ${d._y})`)
          .style('opacity', 0)
          .node()
          // @ts-expect-error TS(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
          .appendChild(CardElement(this, d))
      }

      // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
      function cardUpdateNoEnter(d) {}

      // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
      function cardUpdate(d) {
        // @ts-expect-error TS(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
        this.innerHTML = ''
        // @ts-expect-error TS(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
        this.appendChild(CardElement(this, d))
        const delay = calculateDelay(d)
        // @ts-expect-error TS(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
        d3.select(this)
          .transition()
          .duration(transition_time)
          .delay(delay)
          .attr('transform', `translate(${d.x}, ${d.y})`)
          .style('opacity', 1)
      }

      // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
      function cardExit(d) {
        // @ts-expect-error TS(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
        const g = d3.select(this)
        g.transition()
          .duration(transition_time)
          .style('opacity', 0)
          .attr('transform', `translate(${d._x}, ${d._y})`)
          .on('end', () => g.remove())
      }

      // @ts-expect-error TS(7006) FIXME: Parameter 'node' implicitly has an 'any' type.
      function CardElement(node, d) {
        if (Card) return Card({ node, d })
        else return CardDefault({ store, svg })({ node, d })
      }
    }

    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    function calculateDelay(d) {
      if (!props.initial) return 0
      const delay_level = 800,
        // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
        ancestry_levels = Math.max(...tree.data.map(d => (d.is_ancestry ? d.depth : 0)))
      let delay = d.depth * delay_level
      if ((d.depth !== 0 || !!d.spouse) && !d.is_ancestry) {
        delay += ancestry_levels * delay_level // after ancestry
        if (d.spouse) delay += delay_level // spouse after bloodline
        delay += d.depth * delay_level // double the delay for each level because of additional spouse delay
      }
      return delay
    }
  }

  function createSvg() {
    const svg_dim = cont.getBoundingClientRect(),
      svg_html = `
        <svg class="main_svg">
          <rect width="${svg_dim.width}" height="${svg_dim.height}" fill="transparent" />
          <g class="view">
            <g class="links_view"></g>
            <g class="cards_view"></g>
          </g>
          <g style="transform: translate(100%, 100%)">
            <g class="fit_screen_icon cursor-pointer" style="transform: translate(-50px, -50px); display: none">
              <rect width="27" height="27" stroke-dasharray="${27 / 2}" stroke-dashoffset="${27 / 4}" 
                style="stroke:#fff;stroke-width:4px;fill:transparent;"/>
              <circle r="5" cx="${27 / 2}" cy="${27 / 2}" style="fill:#fff" />          
            </g>
          </g>
        </svg>
      `
    const fake_cont = document.createElement('div')
    fake_cont.innerHTML = svg_html
    const svg = fake_cont.firstElementChild
    cont.innerHTML = ''
    cont.appendChild(svg)

    return svg
  }
}
