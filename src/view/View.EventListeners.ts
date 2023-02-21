// @ts-expect-error TS(7006) FIXME: Parameter 'store' implicitly has an 'any' type.
export default function ViewAddEventListeners(store) {
  // @ts-expect-error TS(7006) FIXME: Parameter 'e' implicitly has an 'any' type.
  store.state.cont.querySelector('.main_svg').addEventListener('click', e => {
    const node = e.target
    const listeners = [...(store.state.custom_elements || [])],
      // @ts-expect-error TS(7006) FIXME: Parameter 'query' implicitly has an 'any' type.
      isClicked = query => node.closest(query)

    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      if (!listener.query || !isClicked(listener.query)) continue

      e.stopPropagation()
      const card = node.closest('.card'),
        d_id = card.getAttribute('data-id'),
        // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
        d = store.getTree().data.find(d => d.data.id === d_id)
      listener.lis(store, { card, d_id, d })
    }
  })
}
