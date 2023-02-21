import d3 from '../../d3'

// @ts-expect-error TS(7031) FIXME: Binding element 'd' implicitly has an 'any' type.
export default function Link({ d, entering, exiting }) {
  // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 3.
  const path = createPath(d, entering, exiting)

  return {
    template: `
    <path d="${path}" fill="none" stroke="#fff" />
  `,
  }
}

// @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
export function createPath(d, is_) {
  const line = d3.line().curve(d3.curveMonotoneY),
    lineCurve = d3.line().curve(d3.curveBasis),
    path_data = is_ ? d._d() : d.d

  if (!d.curve) return line(path_data)
  else if (d.curve === true) return lineCurve(path_data)
}
