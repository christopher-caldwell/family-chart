//[remove_before_rollup]import * as _d3 from 'd3';
// @ts-expect-error TS(2339) FIXME: Property 'd3' does not exist on type 'Window & typ... Remove this comment to see the full error message
export default typeof window === 'object' && !!window.d3 ? window.d3 : _d3
