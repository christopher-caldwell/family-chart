import { props, relative_props, exclusive_props } from './wiki-data.dict.js'

// @ts-expect-error TS(7006) FIXME: Parameter 'wiki_ids' implicitly has an 'any' type.
function getWikiDataLabels(wiki_ids) {
  let url =
    'https://www.wikidata.org/w/api.php?' +
    'action=wbgetentities&ids=' +
    wiki_ids.slice(0, 49).join('|') + // TODO: get all
    '&callback=?' +
    '&languages=en|hr' +
    '&props=labels|descriptions' +
    '&format=json'

  return new Promise((resolve, reject) => {
    jsonpQuery(url).then(function (json) {
      // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
      if (!json.hasOwnProperty('entities')) {
        resolve({})
        return
      }
      // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
      resolve(json.entities)
    })
  })
}

// @ts-expect-error TS(7006) FIXME: Parameter 'datum' implicitly has an 'any' type.
function getWikiDatumLbl(datum) {
  let label
  try {
    label = datum.labels.en.value
  } catch (e) {
    try {
      const lang = Object.keys(datum.labels)[0]
      label = datum.labels[Object.keys(datum.labels)[0]].value + ' (' + lang + ')'
    } catch (e) {
      label = 'no label'
    }
  }
  return label
}

// @ts-expect-error TS(7006) FIXME: Parameter 'datum' implicitly has an 'any' type.
function getWikiDatumDesc(datum) {
  let label
  try {
    label = datum.descriptions.en.value
  } catch (e) {
    try {
      const lang = Object.keys(datum.descriptions)[0]
      label = datum.descriptions[Object.keys(datum.descriptions)[0]].value + ' (' + lang + ')'
    } catch (e) {
      label = 'no description'
    }
  }
  return label
}

// @ts-expect-error TS(7006) FIXME: Parameter 'wiki_id' implicitly has an 'any' type.
export async function isHuman(wiki_id) {
  const data = await getWikiItem(wiki_id),
    instance_of = 'P31',
    is_human = 'Q5',
    // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
    claims = data.entities[wiki_id].claims
  if (!claims[instance_of]) return false

  // @ts-expect-error TS(7006) FIXME: Parameter 'claim' implicitly has an 'any' type.
  return claims[instance_of]
    .map(claim => {
      return claim.mainsnak && claim.mainsnak.datavalue ? claim.mainsnak.datavalue.value.id : null
      // @ts-expect-error TS(7006) FIXME: Parameter 'claim_id' implicitly has an 'any' type.
    })
    .some(claim_id => claim_id === is_human)
}

// @ts-expect-error TS(7006) FIXME: Parameter 'wiki_id' implicitly has an 'any' type.
export function getWikiItem(wiki_id) {
  const url =
    'https://www.wikidata.org/w/api.php?' +
    'action=wbgetentities&ids=' +
    wiki_id +
    '&languages=en|hr' +
    '&props=labels|claims|descriptions' +
    '&format=json'

  return jsonpQuery(url)
}

// @ts-expect-error TS(7031) FIXME: Binding element 'wiki_id' implicitly has an 'any' ... Remove this comment to see the full error message
export async function getWikiPersonData({ wiki_id, exclude_props = true }) {
  const json = await getWikiItem(wiki_id),
    // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
    entity = json.entities[wiki_id]
  if (exclude_props) cleanClaims(entity.claims, exclusive_props)

  return {
    wiki_id,
    label: getWikiDatumLbl(entity),
    desc: getWikiDatumDesc(entity),
    avatar: await getImageUrl(entity),
    claims: await getElementsClaims(entity.claims),
  }

  // @ts-expect-error TS(7006) FIXME: Parameter 'claims' implicitly has an 'any' type.
  function cleanClaims(claims, exclusive_props) {
    for (let prop_id in claims) {
      if (!claims.hasOwnProperty(prop_id)) continue
      if (exclusive_props && !exclusive_props.includes(prop_id)) delete claims[prop_id]
    }
  }

  // @ts-expect-error TS(7006) FIXME: Parameter 'claims' implicitly has an 'any' type.
  async function getElementsClaims(claims) {
    if (!claims) return []
    // @ts-expect-error TS(7034) FIXME: Variable 'claims_id' implicitly has type 'any[]' i... Remove this comment to see the full error message
    const claims_id = []
    for (let prop_id in claims) {
      if (!claims.hasOwnProperty(prop_id)) continue

      // @ts-expect-error TS(7006) FIXME: Parameter 'claim' implicitly has an 'any' type.
      claims[prop_id].forEach(claim => {
        let rank = claim.rank
        let claim_id = claim.mainsnak ? (claim.mainsnak.datavalue ? claim.mainsnak.datavalue.value.id : null) : null
        if (claim_id && rank !== 'deprecated') claims_id.push({ prop_id: prop_id, claim_id: claim_id })
      })
    }

    // @ts-expect-error TS(7005) FIXME: Variable 'claims_id' implicitly has an 'any[]' typ... Remove this comment to see the full error message
    const search_entities_claims = await getWikiDataLabels(claims_id.map(d => d.claim_id))

    // @ts-expect-error TS(7005) FIXME: Variable 'claims_id' implicitly has an 'any[]' typ... Remove this comment to see the full error message
    return claims_id.map(d => {
      const claim_id = d.claim_id
      const prop_id = d.prop_id
      d.wiki_id = claim_id
      // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
      d.label = getWikiDatumLbl(search_entities_claims[claim_id])
      // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
      d.desc = getWikiDatumDesc(search_entities_claims[claim_id])

      return d
    })
  }

  // @ts-expect-error TS(7006) FIXME: Parameter 'entity' implicitly has an 'any' type.
  function getImageUrl(entity) {
    const image_claim = entity.claims[props.image]
    return new Promise(function (resolve, reject) {
      if (!image_claim || !image_claim[0].mainsnak.datavalue) resolve(null)
      const image_name = image_claim[0].mainsnak.datavalue.value
      jsonpQuery(
        'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&titles=File:' +
          image_name
      ).then(function (response) {
        // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
        const wikimedia_first_page = response.query.pages[Object.keys(response.query.pages)[0]]
        if (wikimedia_first_page.imageinfo) resolve(wikimedia_first_page.imageinfo[0].url)
        else resolve(null)
      })
    })
  }
}

// @ts-expect-error TS(7006) FIXME: Parameter 'wiki_stash' implicitly has an 'any' typ... Remove this comment to see the full error message
export async function getFamilyDataForItem(wiki_stash, wiki_id, level) {
  // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
  const stashed_datum = wiki_stash.find(d => d.wiki_id === wiki_id),
    datum = stashed_datum || (await getWikiPersonData({ wiki_id })),
    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    rels_id = datum.claims.filter(d => relative_props.includes(d.prop_id)).map(d => d.wiki_id)
  wiki_stash.push(datum)

  if (level === 0) return wiki_stash
  else
    return new Promise(resolve => {
      let rels_to_load = 0
      for (let i = 0; i < rels_id.length; i++) {
        const rel_id = rels_id[i]
        // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
        if (wiki_stash.find(d => d.wiki_id === rel_id)) continue
        rels_to_load += 1
        getFamilyDataForItem(wiki_stash, rel_id, level - 1).then(() => {
          rels_to_load -= 1
          if (rels_to_load === 0) resolve(wiki_stash)
        })
      }
      if (rels_to_load === 0) resolve(wiki_stash)
    })
}

// @ts-expect-error TS(7006) FIXME: Parameter 'text_substr' implicitly has an 'any' ty... Remove this comment to see the full error message
export function getWikiDataElementByStr(text_substr) {
  const url_temp =
      'https://www.wikidata.org/w/api.php?action=wbsearchentities&callback=?&format=json&language=en&type=item&continue={search_continue}&search={text_substr}',
    // @ts-expect-error TS(7034) FIXME: Variable 'data' implicitly has type 'any[]' in som... Remove this comment to see the full error message
    data = []

  return new Promise((resolve, reject) => {
    ;(async () => {
      for (let i = 0; i < 1; i++) {
        await getRes(i * 7)
      }
      // @ts-expect-error TS(7005) FIXME: Variable 'data' implicitly has an 'any[]' type.
      resolve(data)
    })()
  })

  // @ts-expect-error TS(7006) FIXME: Parameter 'iter' implicitly has an 'any' type.
  function getRes(iter) {
    let url_query = url_temp.replace('{search_continue}', iter).replace('{text_substr}', text_substr)
    return jsonpQuery(url_query).then(function (json) {
      // @ts-expect-error TS(2571) FIXME: Object is of type 'unknown'.
      json.search.forEach(datum => {
        data.push({
          key: datum.label,
          desc: datum.description,
          datum: {
            label: datum.label,
            wiki_id: datum.id,
          },
        })
      })
    })
  }
}

// @ts-expect-error TS(7006) FIXME: Parameter 'url' implicitly has an 'any' type.
function jsonpQuery(url) {
  return new Promise(resolve => {
    // @ts-expect-error TS(2339) FIXME: Property 'jsonpQuery' does not exist on type 'Wind... Remove this comment to see the full error message
    if (!window.jsonpQuery) window.jsonpQuery = {}
    const q_id = '_' + new Date().getTime() + Math.floor(10000 * Math.random())
    // @ts-expect-error TS(2339) FIXME: Property 'jsonpQuery' does not exist on type 'Wind... Remove this comment to see the full error message
    window.jsonpQuery[q_id] = function (data) {
      resolve(data)
      // cleanup
      // @ts-expect-error TS(2339) FIXME: Property 'jsonpQuery' does not exist on type 'Wind... Remove this comment to see the full error message
      delete window.jsonpQuery[q_id]
      // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
      document.querySelector('#' + q_id).remove()
    }

    const script = document.createElement('script')
    script.setAttribute('id', q_id)
    script.src = url + '&callback=jsonpQuery.q_id'.replace('q_id', q_id)

    document.getElementsByTagName('head')[0].appendChild(script)
  })
}
