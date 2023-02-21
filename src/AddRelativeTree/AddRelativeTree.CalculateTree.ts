// @ts-expect-error TS(7031) FIXME: Binding element 'datum' implicitly has an 'any' ty... Remove this comment to see the full error message
export default function CalculateTree({ datum, data_stash, card_dim, labels }) {
  const sx = card_dim.w + 40,
    y = card_dim.h + 50,
    lbls = labels || {}
  datum = datum ? datum : { id: '0', data: { fn: 'FN', ln: 'LN', gender: 'M' } }
  const data = [
    { x: 0, y: 0, data: datum },
    { x: -100, y: -y, data: { rel_type: 'father', data: { label: lbls.father || 'Add father', gender: 'M' } } },
    { x: 100, y: -y, data: { rel_type: 'mother', data: { label: lbls.mother || 'Add mother', gender: 'F' } } },

    { x: sx, y: 0, data: { rel_type: 'spouse', data: { label: lbls.spouse || 'Add spouse', gender: 'F' } } },

    { x: -100, y: y, data: { rel_type: 'son', data: { label: lbls.son || 'Add son', gender: 'M' } } },
    { x: 100, y: y, data: { rel_type: 'daughter', data: { label: lbls.daughter || 'Add daughter', gender: 'F' } } },
  ].filter(d => shouldAddRel(d.data.rel_type))

  // @ts-expect-error TS(7006) FIXME: Parameter 'rel_type' implicitly has an 'any' type.
  function shouldAddRel(rel_type) {
    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    if (rel_type === 'father') return !datum.rels.father || data_stash.find(d => d.id === datum.rels.father).to_add
    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    else if (rel_type === 'mother') return !datum.rels.mother || data_stash.find(d => d.id === datum.rels.mother).to_add
    else return true
  }

  return { data }
}
