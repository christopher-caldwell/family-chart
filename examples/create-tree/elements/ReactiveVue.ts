import Reactive from './Reactive.js'

// @ts-expect-error TS(7006) FIXME: Parameter 'selector' implicitly has an 'any' type.
export default function ReactiveVue(selector) {
  return Reactive(selector, getComponent)

  // @ts-expect-error TS(7006) FIXME: Parameter 'create_tree_js' implicitly has an 'any'... Remove this comment to see the full error message
  function getComponent(create_tree_js) {
    return `
<template>
  <div id="FamilyChart" class="f3"></div>
</template>

<script>
import f3 from "family-chart";  // npm i family-chart
import './family-chart.css';  // create file 'family-chart.css' in same directory, copy/paste css from examples/create-tree
      
export default {
  name: "FamilyChart",
  mounted() {
    ${create_tree_js}
  },
};
</script>
<style></style>
    `
  }
}
