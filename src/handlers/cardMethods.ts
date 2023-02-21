import { toggleAllRels, toggleRels } from '../CalculateTree/CalculateTree.handlers.js'
// @ts-expect-error TS(6133) FIXME: 'AddRelativeTree' is declared but its value is nev... Remove this comment to see the full error message
import AddRelativeTree from '../AddRelativeTree/AddRelativeTree.js'
import { deletePerson, moveToAddToAdded } from './general.js'

// @ts-expect-error TS(7006) FIXME: Parameter 'store' implicitly has an 'any' type.
export function cardChangeMain(store, { card, d }) {
  toggleAllRels(store.getTree().data, false)
  store.update.mainId(d.data.id)
  store.update.tree({ tree_position: 'inherit' })
  return true
}

// @ts-expect-error TS(7006) FIXME: Parameter 'store' implicitly has an 'any' type.
export function cardEdit(store, { card, d, cardEditForm }) {
  const datum = d.data,
    // @ts-expect-error TS(7006) FIXME: Parameter 'props' implicitly has an 'any' type.
    postSubmit = props => {
      if (datum.to_add) moveToAddToAdded(datum, store.getData())
      if (props && props.delete) {
        if (datum.main) store.update.mainId(null)
        deletePerson(datum, store.getData())
      }
      store.update.tree()
    }
  cardEditForm({ datum, postSubmit, store })
}

// @ts-expect-error TS(7006) FIXME: Parameter 'store' implicitly has an 'any' type.
export function cardShowHideRels(store, { card, d }) {
  d.data.hide_rels = !d.data.hide_rels
  toggleRels(d, d.data.hide_rels)
  store.update.tree({ tree_position: 'inherit' })
}
