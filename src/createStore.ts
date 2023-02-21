import CalculateTree from './CalculateTree/CalculateTree.js'
import { createTreeDataWithMainNode } from './handlers/newPerson.js'

// @ts-expect-error TS(7006) FIXME: Parameter 'initial_state' implicitly has an 'any' ... Remove this comment to see the full error message
export default function createStore(initial_state) {
  // @ts-expect-error TS(7034) FIXME: Variable 'onUpdate' implicitly has type 'any' in s... Remove this comment to see the full error message
  let onUpdate
  const state = initial_state,
    update = {
      // @ts-expect-error TS(7006) FIXME: Parameter 'props' implicitly has an 'any' type.
      tree: props => {
        state.tree = calcTree()
        // @ts-expect-error TS(7005) FIXME: Variable 'onUpdate' implicitly has an 'any' type.
        if (onUpdate) onUpdate(props)
      },
      // @ts-expect-error TS(7006) FIXME: Parameter 'main_id' implicitly has an 'any' type.
      mainId: main_id => (state.main_id = main_id),
      // @ts-expect-error TS(7006) FIXME: Parameter 'data' implicitly has an 'any' type.
      data: data => (state.data = data),
    },
    getData = () => state.data,
    getTree = () => state.tree,
    // @ts-expect-error TS(7006) FIXME: Parameter 'f' implicitly has an 'any' type.
    setOnUpdate = f => (onUpdate = f),
    methods = {}

  return { state, update, getData, getTree, setOnUpdate, methods }

  function calcTree() {
    return CalculateTree({
      data_stash: state.data,
      main_id: state.main_id,
      node_separation: state.node_separation,
      level_separation: state.level_separation,
    })
  }
}
