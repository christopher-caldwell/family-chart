const props = {
    gender: 'P21',
    first_name: 'P735',
    last_name: 'P734',
    date_of_birth: 'P569',
    male: 'Q6581097',
    female: 'Q6581072',
    image: 'P18',

    father: 'P22',
    mother: 'P25',
    spouse: 'P26',
    child: 'P40',
  },
  // @ts-expect-error TS(2550) FIXME: Property 'values' does not exist on type 'ObjectCo... Remove this comment to see the full error message
  exclusive_props = Object.values(props),
  relative_props = [props.father, props.mother, props.spouse, props.child]

export { props, exclusive_props, relative_props }
