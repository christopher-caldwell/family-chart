import d3 from '../d3'

// @ts-expect-error TS(7006) FIXME: Parameter 'svg' implicitly has an 'any' type.
export function setupSvg(svg, zoom_polite) {
  setupZoom()

  function setupZoom() {
    if (svg.__zoom) return
    const view = svg.querySelector('.view'),
      zoom = d3.zoom().on('zoom', zoomed)

    d3.select(svg).call(zoom)
    svg.__zoomObj = zoom

    if (zoom_polite) zoom.filter(zoomFilter)

    // @ts-expect-error TS(7006) FIXME: Parameter 'e' implicitly has an 'any' type.
    function zoomed(e) {
      d3.select(view).attr('transform', e.transform)
    }

    // @ts-expect-error TS(7006) FIXME: Parameter 'e' implicitly has an 'any' type.
    function zoomFilter(e) {
      if (e.type === 'wheel' && !e.ctrlKey) return false
      else if (e.touches && e.touches.length < 2) return false
      else return true
    }
  }
}

// @ts-expect-error TS(7031) FIXME: Binding element 't' implicitly has an 'any' type.
function positionTree({ t, svg, transition_time = 2000 }) {
  const zoom = svg.__zoomObj

  // d3.select(svg).call(zoom.transform, d3.zoomIdentity.translate(x*k, y*k))

  d3.select(svg)
    .transition()
    .duration(transition_time || 0)
    .delay(transition_time ? 100 : 0) // delay 100 because of weird error of undefined something in d3 zoom
    .call(zoom.transform, d3.zoomIdentity.scale(t.k).translate(t.x, t.y))
}

// @ts-expect-error TS(7031) FIXME: Binding element 'svg' implicitly has an 'any' type... Remove this comment to see the full error message
export function treeFit({ svg, svg_dim, tree_dim, with_transition, transition_time }) {
  const t = calculateTreeFit(svg_dim, tree_dim)
  // @ts-expect-error TS(2345) FIXME: Argument of type '{ t: { k: number; x: any; y: any... Remove this comment to see the full error message
  positionTree({ t, svg, with_transition, transition_time })
}

// @ts-expect-error TS(7006) FIXME: Parameter 'svg_dim' implicitly has an 'any' type.
export function calculateTreeFit(svg_dim, tree_dim) {
  let k = Math.min(svg_dim.width / tree_dim.width, svg_dim.height / tree_dim.height),
    x = tree_dim.x_off + (svg_dim.width - tree_dim.width * k) / k / 2,
    y = tree_dim.y_off + (svg_dim.height - tree_dim.height * k) / k / 2

  if (k > 1) {
    x *= k
    y *= k
    k = 1
  }
  return { k, x, y }
}

// @ts-expect-error TS(7031) FIXME: Binding element 'datum' implicitly has an 'any' ty... Remove this comment to see the full error message
export function mainToMiddle({ datum, svg, svg_dim, scale, transition_time }) {
  const k = scale || 1,
    x = svg_dim.width / 2 - datum.x * k,
    y = svg_dim.height / 2 - datum.y,
    t = { k, x: x / k, y: y / k }
  // @ts-expect-error TS(2345) FIXME: Argument of type '{ t: { k: any; x: number; y: num... Remove this comment to see the full error message
  positionTree({ t, svg, with_transition: true, transition_time })
}
