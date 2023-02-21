import { toggleAllRels } from '../CalculateTree/CalculateTree.handlers'
import AddRelativeTree from './AddRelativeTree'

// @ts-expect-error TS(7031) FIXME: Binding element 'store' implicitly has an 'any' ty... Remove this comment to see the full error message
export function AddRelative({ store, cont, card_dim, cardEditForm, labels }) {
  // @ts-expect-error TS(7031) FIXME: Binding element 'd' implicitly has an 'any' type.
  return function ({ d, scale }) {
    const transition_time = 1000

    if (!scale && window.innerWidth < 650) scale = window.innerWidth / 650
    toggleAllRels(store.getTree().data, false)
    store.update.mainId(d.data.id)
    store.update.tree({ tree_position: 'main_to_middle', transition_time, scale })
    const props = {
      store,
      data_stash: store.getData(),
      cont,
      datum: d.data,
      transition_time,
      scale,
      card_dim,
      cardEditForm,
      labels,
    }
    AddRelativeTree(props)
  }
}
