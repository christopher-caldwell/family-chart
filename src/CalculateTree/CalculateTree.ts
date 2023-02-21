import d3 from '../d3.js'
import { sortChildrenWithSpouses } from './CalculateTree.handlers.js'
import { createNewPerson } from '../handlers/newPerson.js'

export default function CalculateTree({
  // @ts-expect-error TS(7031) FIXME: Binding element 'data_stash' implicitly has an 'an... Remove this comment to see the full error message
  data_stash,
  main_id = null,
  is_vertical = true,
  node_separation = 250,
  level_separation = 150,
}) {
  data_stash = createRelsToAdd(data_stash)
  sortChildrenWithSpouses(data_stash)
  // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
  const main = main_id !== null ? data_stash.find(d => d.id === main_id) : data_stash[0],
    tree_children = calculateTreePositions(main, 'children', false),
    tree_parents = calculateTreePositions(main, 'parents', true)

  // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
  data_stash.forEach(d => (d.main = d === main))
  levelOutEachSide(tree_parents, tree_children)
  const tree = mergeSides(tree_parents, tree_children)
  setupChildrenAndParents({ tree })
  setupSpouses({ tree, node_separation })
  nodePositioning({ tree, is_vertical })

  const dim = calculateTreeDim(tree, node_separation, level_separation, is_vertical)

  return { data: tree, data_stash, dim }

  // @ts-expect-error TS(7006) FIXME: Parameter 'datum' implicitly has an 'any' type.
  function calculateTreePositions(datum, rt, is_ancestry) {
    const hierarchyGetter = rt === 'children' ? hierarchyGetterChildren : hierarchyGetterParents,
      d3_tree = d3.tree().nodeSize([node_separation, level_separation]).separation(separation),
      root = d3.hierarchy(datum, hierarchyGetter)
    d3_tree(root)
    return root.descendants()

    // @ts-expect-error TS(7006) FIXME: Parameter 'a' implicitly has an 'any' type.
    function separation(a, b) {
      let offset = 1
      if (!is_ancestry) {
        if (!sameParent(a, b)) offset += 0.25
        if (someSpouses(a, b)) offset += offsetOnPartners(a, b)
        if (sameParent(a, b) && !sameBothParents(a, b)) offset += 0.125
      }
      return offset
    }

    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    function hasCh(d) {
      return !!d.children
    }
    // @ts-expect-error TS(7006) FIXME: Parameter 'a' implicitly has an 'any' type.
    function sameParent(a, b) {
      return a.parent == b.parent
    }
    // @ts-expect-error TS(7006) FIXME: Parameter 'a' implicitly has an 'any' type.
    function sameBothParents(a, b) {
      return a.data.rels.father === b.data.rels.father && a.data.rels.mother === b.data.rels.mother
    }
    // @ts-expect-error TS(6133) FIXME: 'someChildren' is declared but its value is never ... Remove this comment to see the full error message
    function someChildren(a, b) {
      return hasCh(a) || hasCh(b)
    }
    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    function hasSpouses(d) {
      return d.data.rels.spouses && d.data.rels.spouses.length > 0
    }
    // @ts-expect-error TS(7006) FIXME: Parameter 'a' implicitly has an 'any' type.
    function someSpouses(a, b) {
      return hasSpouses(a) || hasSpouses(b)
    }

    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    function hierarchyGetterChildren(d) {
      // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
      return [...(d.rels.children || [])].map(id => data_stash.find(d => d.id === id))
    }

    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    function hierarchyGetterParents(d) {
      return (
        [d.rels.father, d.rels.mother]
          .filter(d => d)
          // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
          .map(id => data_stash.find(d => d.id === id))
      )
    }

    // @ts-expect-error TS(7006) FIXME: Parameter 'a' implicitly has an 'any' type.
    function offsetOnPartners(a, b) {
      return Math.max((a.data.rels.spouses || []).length, (b.data.rels.spouses || []).length) * 0.5 + 0.5
    }
  }

  // @ts-expect-error TS(7006) FIXME: Parameter 'parents' implicitly has an 'any' type.
  function levelOutEachSide(parents, children) {
    const mid_diff = (parents[0].x - children[0].x) / 2
    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    parents.forEach(d => (d.x -= mid_diff))
    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    children.forEach(d => (d.x += mid_diff))
  }

  // @ts-expect-error TS(7006) FIXME: Parameter 'parents' implicitly has an 'any' type.
  function mergeSides(parents, children) {
    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    parents.forEach(d => {
      d.is_ancestry = true
    })
    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    parents.forEach(d => (d.depth === 1 ? (d.parent = children[0]) : null))

    return [...children, ...parents.slice(1)]
  }
  // @ts-expect-error TS(7031) FIXME: Binding element 'tree' implicitly has an 'any' typ... Remove this comment to see the full error message
  function nodePositioning({ tree, is_vertical }) {
    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    tree.forEach(d => {
      d.y *= d.is_ancestry ? -1 : 1
      if (!is_vertical) {
        const d_x = d.x
        d.x = d.y
        d.y = d_x
      }
    })
  }

  // @ts-expect-error TS(7031) FIXME: Binding element 'tree' implicitly has an 'any' typ... Remove this comment to see the full error message
  function setupSpouses({ tree, node_separation }) {
    for (let i = tree.length; i--; ) {
      const d = tree[i]
      if (!d.is_ancestry && d.data.rels.spouses && d.data.rels.spouses.length > 0) {
        const side = d.data.data.gender === 'M' ? -1 : 1 // female on right
        d.x += (d.data.rels.spouses.length / 2) * node_separation * side
        // @ts-expect-error TS(7006) FIXME: Parameter 'sp_id' implicitly has an 'any' type.
        d.data.rels.spouses.forEach((sp_id, i) => {
          // @ts-expect-error TS(7006) FIXME: Parameter 'd0' implicitly has an 'any' type.
          const spouse = { data: data_stash.find(d0 => d0.id === sp_id), added: true }

          // @ts-expect-error TS(2339) FIXME: Property 'x' does not exist on type '{ data: any; ... Remove this comment to see the full error message
          spouse.x = d.x - node_separation * (i + 1) * side
          // @ts-expect-error TS(2339) FIXME: Property 'y' does not exist on type '{ data: any; ... Remove this comment to see the full error message
          spouse.y = d.y
          // @ts-expect-error TS(2339) FIXME: Property 'sx' does not exist on type '{ data: any;... Remove this comment to see the full error message
          spouse.sx = i > 0 ? spouse.x : spouse.x + (node_separation / 2) * side
          // @ts-expect-error TS(2339) FIXME: Property 'depth' does not exist on type '{ data: a... Remove this comment to see the full error message
          spouse.depth = d.depth
          // @ts-expect-error TS(2339) FIXME: Property 'spouse' does not exist on type '{ data: ... Remove this comment to see the full error message
          spouse.spouse = d
          if (!d.spouses) d.spouses = []
          d.spouses.push(spouse)
          tree.push(spouse)

          // @ts-expect-error TS(7006) FIXME: Parameter 'd0' implicitly has an 'any' type.
          tree.forEach(d0 =>
            (d0.data.rels.father === d.data.id && d0.data.rels.mother === spouse.data.id) ||
            (d0.data.rels.mother === d.data.id && d0.data.rels.father === spouse.data.id)
              ? // @ts-expect-error TS(2339) FIXME: Property 'sx' does not exist on type '{ data: any;... Remove this comment to see the full error message
                (d0.psx = spouse.sx)
              : null
          )
        })
      }
      if (d.parents && d.parents.length === 2) {
        const p1 = d.parents[0],
          p2 = d.parents[1],
          midd = p1.x - (p1.x - p2.x) / 2,
          // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
          x = (d, sp) => midd + (node_separation / 2) * (d.x < sp.x ? 1 : -1)

        p2.x = x(p1, p2)
        p1.x = x(p2, p1)
      }
    }
  }

  // @ts-expect-error TS(7031) FIXME: Binding element 'tree' implicitly has an 'any' typ... Remove this comment to see the full error message
  function setupChildrenAndParents({ tree }) {
    // @ts-expect-error TS(7006) FIXME: Parameter 'd0' implicitly has an 'any' type.
    tree.forEach(d0 => {
      delete d0.children
      // @ts-expect-error TS(7006) FIXME: Parameter 'd1' implicitly has an 'any' type.
      tree.forEach(d1 => {
        if (d1.parent === d0) {
          if (d1.is_ancestry) {
            if (!d0.parents) d0.parents = []
            d0.parents.push(d1)
          } else {
            if (!d0.children) d0.children = []
            d0.children.push(d1)
          }
        }
      })
    })
  }

  // @ts-expect-error TS(7006) FIXME: Parameter 'tree' implicitly has an 'any' type.
  function calculateTreeDim(tree, node_separation, level_separation, is_vertical) {
    if (!is_vertical) [node_separation, level_separation] = [level_separation, node_separation]
    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    const w_extent = d3.extent(tree, d => d.x),
      // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
      h_extent = d3.extent(tree, d => d.y)
    return {
      width: w_extent[1] - w_extent[0] + node_separation,
      height: h_extent[1] - h_extent[0] + level_separation,
      x_off: -w_extent[0] + node_separation / 2,
      y_off: -h_extent[0] + level_separation / 2,
    }
  }

  // @ts-expect-error TS(7006) FIXME: Parameter 'data' implicitly has an 'any' type.
  function createRelsToAdd(data) {
    // @ts-expect-error TS(7034) FIXME: Variable 'to_add_spouses' implicitly has type 'any... Remove this comment to see the full error message
    const to_add_spouses = []
    for (let i = 0; i < data.length; i++) {
      const d = data[i]
      if (d.rels.children && d.rels.children.length > 0) {
        if (!d.rels.spouses) d.rels.spouses = []
        const is_father = d.data.gender === 'M'
        // @ts-expect-error TS(7034) FIXME: Variable 'spouse' implicitly has type 'any' in som... Remove this comment to see the full error message
        let spouse

        // @ts-expect-error TS(7006) FIXME: Parameter 'd0' implicitly has an 'any' type.
        d.rels.children.forEach(d0 => {
          // @ts-expect-error TS(7006) FIXME: Parameter 'd1' implicitly has an 'any' type.
          const child = data.find(d1 => d1.id === d0)
          if (child.rels[is_father ? 'father' : 'mother'] !== d.id) return
          if (child.rels[!is_father ? 'father' : 'mother']) return
          // @ts-expect-error TS(7005) FIXME: Variable 'spouse' implicitly has an 'any' type.
          if (!spouse) {
            spouse = createToAddSpouse(d)
            d.rels.spouses.push(spouse.id)
          }
          // @ts-expect-error TS(7005) FIXME: Variable 'spouse' implicitly has an 'any' type.
          spouse.rels.children.push(child.id)
          // @ts-expect-error TS(7005) FIXME: Variable 'spouse' implicitly has an 'any' type.
          child.rels[!is_father ? 'father' : 'mother'] = spouse.id
        })
      }
    }
    // @ts-expect-error TS(7005) FIXME: Variable 'to_add_spouses' implicitly has an 'any[]... Remove this comment to see the full error message
    to_add_spouses.forEach(d => data.push(d))
    return data

    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    function createToAddSpouse(d) {
      const spouse = createNewPerson({
        data: { gender: d.data.gender === 'M' ? 'F' : 'M' },
        rels: { spouses: [d.id], children: [] },
      })
      // @ts-expect-error TS(2339) FIXME: Property 'to_add' does not exist on type '{ id: st... Remove this comment to see the full error message
      spouse.to_add = true
      to_add_spouses.push(spouse)
      return spouse
    }
  }
}
