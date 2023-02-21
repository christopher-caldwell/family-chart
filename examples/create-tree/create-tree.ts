import f3 from '../../src/index.js'
import Edit from './elements/Edit.js'
import ReactiveTextarea from './elements/ReactiveTextarea.js'
import ReactiveVanila from './elements/ReactiveVanila.js'
import ReactiveVue from './elements/ReactiveVue.js'
// @ts-expect-error TS(6142) FIXME: Module './elements/ReactiveReact.js' was resolved ... Remove this comment to see the full error message
import ReactiveReact from './elements/ReactiveReact.js'
import Display from './elements/Display.js'
import { Form } from '../../src/view/elements/Form.js'

;(async () => {
  const cont = document.querySelector('#FamilyChart'),
    card_dim = { w: 220, h: 70, text_x: 75, text_y: 15, img_w: 60, img_h: 60, img_x: 5, img_y: 5 },
    card_display = cardDisplay(),
    card_edit = cardEditParams(),
    store = f3.createStore({
      data: firstNode(),
      node_separation: 250,
      level_separation: 150,
    }),
    view = f3.d3AnimationView({
      store,
      cont: document.querySelector('#FamilyChart'),
      // @ts-expect-error TS(2345) FIXME: Argument of type '{ store: { state: any; update: {... Remove this comment to see the full error message
      card_edit,
    }),
    Card = f3.elements.Card({
      store,
      svg: view.svg,
      card_dim,
      card_display,
      mini_tree: true,
      link_break: false,
      cardEditForm,
      addRelative: f3.handlers.AddRelative({ store, cont, card_dim, cardEditForm, labels: { mother: 'Add mother' } }),
    }),
    edit = Edit('#edit_cont', card_edit),
    display = Display('#display_cont', store, card_display),
    // @ts-expect-error TS(7006) FIXME: Parameter 'data' implicitly has an 'any' type.
    reactiveTextArea = ReactiveTextarea(
      data => {
        store.update.data(data)
        store.update.tree()
      },
      '#textarea',
      '#update_btn'
    ),
    reactiveVanila = ReactiveVanila('#ReactiveVanila'),
    reactiveVue = ReactiveVue('#ReactiveVue'),
    reactiveReact = ReactiveReact('#ReactiveReact'),
    // @ts-expect-error TS(7006) FIXME: Parameter 'props' implicitly has an 'any' type.
    onUpdate = props => {
      view.update(props || {})
      reactiveTextArea.update(store.getData())
      reactiveVanila.update(store, card_display)
      reactiveVue.update(store, card_display)
      reactiveReact.update(store, card_display)
    }

  view.setCard(Card)
  // @ts-expect-error TS(2531) FIXME: Object is possibly 'null'.
  fetch('./elements/family-chart.css')
    .then(r => r.text())
    .then(text => (document.querySelector('#family-chart-css').innerText = text))
  store.setOnUpdate(onUpdate)
  store.update.tree({ initial: true })

  // @ts-expect-error TS(7006) FIXME: Parameter 'props' implicitly has an 'any' type.
  function cardEditForm(props) {
    const postSubmit = props.postSubmit
    // @ts-expect-error TS(7006) FIXME: Parameter 'ps_props' implicitly has an 'any' type.
    props.postSubmit = ps_props => {
      postSubmit(ps_props)
    }
    const el = document.querySelector('#form_modal'),
      // @ts-expect-error TS(2339) FIXME: Property 'Modal' does not exist on type 'number'.
      modal = M.Modal.getInstance(el),
      edit = { el, open: () => modal.open(), close: () => modal.close() }
    Form({ ...props, card_edit, card_display, edit })
  }
})()

function firstNode() {
  return [
    {
      id: '0',
      rels: {},
      data: {
        'first name': 'Name',
        'last name': 'Surname',
        birthday: 1970,
        avatar:
          'https://static8.depositphotos.com/1009634/988/v/950/depositphotos_9883921-stock-illustration-no-user-profile-picture.jpg',
        gender: 'M',
      },
    },
  ]
}

function cardEditParams() {
  return [
    { type: 'text', placeholder: 'first name', key: 'first name' },
    { type: 'text', placeholder: 'last name', key: 'last name' },
    { type: 'text', placeholder: 'birthday', key: 'birthday' },
    { type: 'text', placeholder: 'avatar', key: 'avatar' },
  ]
}

function cardDisplay() {
  // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
  const d1 = d => `${d.data['first name'] || ''} ${d.data['last name'] || ''}`,
    // @ts-expect-error TS(7006) FIXME: Parameter 'd' implicitly has an 'any' type.
    d2 = d => `${d.data['birthday'] || ''}`
  d1.create_form = '{first name} {last name}'
  d2.create_form = '{birthday}'

  return [d1, d2]
}
