import Reactive from './Reactive.js'

// @ts-expect-error TS(7006) FIXME: Parameter 'selector' implicitly has an 'any' type.
export default function ReactiveVue(selector) {
  return Reactive(selector, getComponent)

  // @ts-expect-error TS(7006) FIXME: Parameter 'create_tree_js' implicitly has an 'any'... Remove this comment to see the full error message
  function getComponent(create_tree_js) {
    return `
import React from "react";
import f3 from "family-chart";  // npm i family-chart
import './family-chart.css';  // create file 'family-chart.css' in same directory, copy/paste css from examples/create-tree

export default class FamilyTree extends React.Component {
  cont = React.createRef();

  componentDidMount() {
    if (!this.cont.current) return;
    ${create_tree_js}
  }

  render() {
    return <div className="f3" id="FamilyChart" ref={this.cont}></div>;
  }
}
    `
  }
}
