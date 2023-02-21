import Reactive from './Reactive.js'

// @ts-expect-error TS(7006) FIXME: Parameter 'selector' implicitly has an 'any' type.
export default function ReactiveVanila(selector) {
  return Reactive(selector, getHtml)

  // @ts-expect-error TS(7006) FIXME: Parameter 'create_tree_js' implicitly has an 'any'... Remove this comment to see the full error message
  function getHtml(create_tree_js) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>my-family-chart</title>
  <script src="https://unpkg.com/d3@6"></script>
  <script src="https://unpkg.com/family-chart"></script>
  <link rel="stylesheet" href="./family-chart.css">  <!-- create file 'family-chart.css' in same directory, copy/paste css from examples/create-tree -->
</head>
<body>
  <div id="FamilyChart" class="f3"></div>
  <script type="module">
    ${create_tree_js}
  </script>
</body>
</html>
    `
  }
}
