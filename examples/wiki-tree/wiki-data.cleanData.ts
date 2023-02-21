import { getFamilyDataForItem } from './wiki-data.handleWikiData.js'
import { props } from './wiki-data.dict.js'

// @ts-expect-error TS(7006) FIXME: Parameter 'wiki_stash' implicitly has an 'any' typ... Remove this comment to see the full error message
export async function getFamilyTreeFromWikidata(wiki_stash, wiki_id) {
  const data_wd = await getFamilyDataForItem(wiki_stash, wiki_id, 2)
  return { wiki_stash, data: childrenToParentsFix(parentsToSpousesFix(wdToFamilyTree(data_wd))) }
}

// @ts-expect-error TS(7006) FIXME: Parameter 'data_wd' implicitly has an 'any' type.
function wdToFamilyTree(data_wd) {
  return data_wd.map(wdItemToFtItem)

  // @ts-expect-error TS(7006) FIXME: Parameter 'datum' implicitly has an 'any' type.
  function wdItemToFtItem(datum) {
    const first_name = get(props.first_name, 'labels'),
      last_name = get(props.last_name, 'labels'),
      gender = get(props.gender, 'id'),
      father = get(props.father, 'id'),
      mother = get(props.mother, 'id'),
      spouses = get(props.spouse, 'ids'),
      children = get(props.child, 'ids'),
      ft_datum = {
        id: datum.wiki_id,
        data: { fn: first_name, ln: last_name, desc: datum.desc, label: datum.label, avatar: datum.avatar },
        rels: {},
      }

    // @ts-expect-error TS(2339) FIXME: Property 'gender' does not exist on type '{ fn: an... Remove this comment to see the full error message
    if (gender === props.male || gender === props.female) ft_datum.data.gender = gender === props.male ? 'M' : 'F'
    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    if (father && data_wd.find(d => d.wiki_id === father)) ft_datum.rels.father = father
    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    if (mother && data_wd.find(d => d.wiki_id === mother)) ft_datum.rels.mother = mother
    // @ts-expect-error TS(2339) FIXME: Property 'spouses' does not exist on type '{}'.
    ft_datum.rels.spouses = spouses.filter(d_id => data_wd.find(d => d.wiki_id === d_id))
    // @ts-expect-error TS(2339) FIXME: Property 'spouses' does not exist on type '{}'.
    ft_datum.rels.spouses = [...new Set(ft_datum.rels.spouses)] // if its remarried there are 2 entries
    // @ts-expect-error TS(2339) FIXME: Property 'children' does not exist on type '{}'.
    ft_datum.rels.children = children.filter(d_id => data_wd.find(d => d.wiki_id === d_id))

    return ft_datum

    // @ts-expect-error TS(7006) FIXME: Parameter 'prop' implicitly has an 'any' type.
    function get(prop, type) {
      return type === 'id'
        ? // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
          (datum.claims.find(d => d.prop_id === prop) || {}).wiki_id
        : type === 'ids'
        ? // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
          datum.claims.filter(d => d.prop_id === prop).map(d => d.wiki_id)
        : type === 'labels'
        ? datum.claims
            // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
            .filter(d => d.prop_id === prop)
            // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
            .map(d => d.label)
            .join(' ')
        : null
    }
  }
}

// @ts-expect-error TS(7006) FIXME: Parameter 'data' implicitly has an 'any' type.
function parentsToSpousesFix(data) {
  // @ts-expect-error TS(7006) FIXME: Parameter 'datum' implicitly has an 'any' type.
  data.forEach(datum => {
    const r = datum.rels
    if (!r.mother || !r.father) return
    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    const p1 = data.find(d => d.id === r.mother),
      // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
      p2 = data.find(d => d.id === r.father)
    if (!p1.rels.spouses.includes(p2.id)) p1.rels.spouses.push(p2.id)
    if (!p2.rels.spouses.includes(p1.id)) p2.rels.spouses.push(p1.id)
  })

  return data
}

// @ts-expect-error TS(7006) FIXME: Parameter 'data' implicitly has an 'any' type.
function childrenToParentsFix(data) {
  // @ts-expect-error TS(7006) FIXME: Parameter 'datum' implicitly has an 'any' type.
  data.forEach(datum => {
    const r = datum.rels
    if (!r.children) return
    // @ts-expect-error TS(7006) FIXME: Parameter 'ch_id' implicitly has an 'any' type.
    r.children.forEach(ch_id => {
      // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
      const child = data.find(d => d.id === ch_id)
      if (datum.data.gender === 'F' && !child.rels.mother) child.rels.mother = datum.id
      if (datum.data.gender === 'M' && !child.rels.father) child.rels.father = datum.id
    })

    // @ts-expect-error TS(7006) FIXME: Parameter 'ch_id' implicitly has an 'any' type.
    r.children = r.children.filter(ch_id => {
      // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
      const child = data.find(d => d.id === ch_id)
      if (datum.data.gender === 'F' && child.rels.mother && child.rels.mother !== datum.id) return false
      else if (datum.data.gender === 'M' && child.rels.father && child.rels.father !== datum.id) return false
      else return true
    })
  })

  return data
}
