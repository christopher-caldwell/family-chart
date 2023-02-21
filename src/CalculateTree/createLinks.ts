// @ts-expect-error TS(7031) FIXME: Binding element 'd' implicitly has an 'any' type.
export function createLinks({ d, tree, is_vertical }) {
  // @ts-expect-error TS(7034) FIXME: Variable 'links' implicitly has type 'any[]' in so... Remove this comment to see the full error message
  const links = []

  if (d.data.rels.spouses && d.data.rels.spouses.length > 0) handleSpouse({ d })
  handleAncestrySide({ d })
  handleProgenySide({ d })

  // @ts-expect-error TS(7005) FIXME: Variable 'links' implicitly has an 'any[]' type.
  return links

  // @ts-expect-error TS(7031) FIXME: Binding element 'd' implicitly has an 'any' type.
  function handleAncestrySide({ d }) {
    if (!d.parents || d.parents.length !== 2) return
    const p1 = d.parents[0],
      p2 = d.parents[1]

    // @ts-expect-error TS(2554) FIXME: Expected 4 arguments, but got 3.
    const p = { x: getMid(p1, p2, 'x'), y: getMid(p1, p2, 'y') }

    links.push({
      d: Link(d, p),
      _d: () => {
        const _d = { x: d.x, y: d.y },
          _p = { x: d.x, y: d.y }
        return Link(_d, _p)
      },
      curve: true,
      id: linkId(d, d.parents[0], d.parents[1]),
      depth: d.depth + 1,
      is_ancestry: true,
    })
  }

  // @ts-expect-error TS(7031) FIXME: Binding element 'd' implicitly has an 'any' type.
  function handleProgenySide({ d }) {
    if (!d.children || d.children.length === 0) return

    // @ts-expect-error TS(7006) FIXME: Parameter 'child' implicitly has an 'any' type.
    d.children.forEach((child, i) => {
      const other_parent = otherParent(child, d, tree),
        sx = other_parent.sx

      links.push({
        d: Link(child, { x: sx, y: d.y }),
        _d: () => Link({ x: sx, y: d.y }, { x: _or(child, 'x'), y: _or(child, 'y') }),
        curve: true,
        id: linkId(child, d, other_parent),
        depth: d.depth + 1,
      })
    })
  }

  // @ts-expect-error TS(7031) FIXME: Binding element 'd' implicitly has an 'any' type.
  function handleSpouse({ d }) {
    // @ts-expect-error TS(7006) FIXME: Parameter 'sp_id' implicitly has an 'any' type.
    d.data.rels.spouses.forEach(sp_id => {
      // @ts-expect-error TS(7006) FIXME: Parameter 'd0' implicitly has an 'any' type.
      const spouse = tree.find(d0 => d0.data.id === sp_id)
      if (!spouse || d.spouse) return
      links.push({
        d: [
          [d.x, d.y],
          [spouse.x, spouse.y],
        ],
        _d: () => [
          d.is_ancestry ? [_or(d, 'x') - 0.0001, _or(d, 'y')] : [d.x, d.y], // add -.0001 to line to have some length if d.x === spouse.x
          // @ts-expect-error TS(2554) FIXME: Expected 2 arguments, but got 3.
          d.is_ancestry ? [_or(spouse, 'x', true), _or(spouse, 'y')] : [d.x - 0.0001, d.y],
        ],
        curve: false,
        id: [d.data.id, spouse.data.id].join(', '),
        depth: d.depth,
        spouse: true,
        is_ancestry: spouse.is_ancestry,
      })
    })
  }

  ///
  // @ts-expect-error TS(7006) FIXME: Parameter 'd1' implicitly has an 'any' type.
  function getMid(d1, d2, side, is_) {
    if (is_) return _or(d1, side) - (_or(d1, side) - _or(d2, side)) / 2
    else return d1[side] - (d1[side] - d2[side]) / 2
  }

  // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
  function _or(d, k) {
    return d.hasOwnProperty('_' + k) ? d['_' + k] : d[k]
  }

  // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
  function Link(d, p) {
    const hy = d.y + (p.y - d.y) / 2
    return [
      [d.x, d.y],
      [d.x, hy],
      [d.x, hy],
      [p.x, hy],
      [p.x, hy],
      [p.x, p.y],
    ]
  }

  // @ts-expect-error TS(7019) FIXME: Rest parameter 'args' implicitly has an 'any[]' ty... Remove this comment to see the full error message
  function linkId(...args) {
    return args
      .map(d => d.data.id)
      .sort()
      .join(', ') // make unique id
  }

  // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
  function otherParent(d, p1, data) {
    return data.find(
      // @ts-expect-error TS(7006) FIXME: Parameter 'd0' implicitly has an 'any' type.
      d0 => d0.data.id !== p1.data.id && (d0.data.id === d.data.rels.mother || d0.data.id === d.data.rels.father)
    )
  }
}
