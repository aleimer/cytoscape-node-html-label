cytoscape-node-html-label
================================================================================


## Description

This extension provides ability to add labels for Cytoscape nodes. Simple example:

`cyInstance.nodeHtmlLabel( [{ tpl: d => '<div>' + d + '</div>' }] );`

Demo: https://kaluginserg.github.io/cytoscape-node-html-label/

## Features
- optimized for high performance with high number of nodes, for smooth panning and zooming.
- customizable labels with different templates.

## Dependencies

 * Cytoscape.js ^3.0.0


## Usage instructions

Download the library:
 * via npm: `npm install cytoscape-node-html-label`,
 * via bower: `bower install cytoscape-node-html-label`, or
 * via direct download from the repository (probably from a tag).

#### Plain HTML/JS has extension registered for you automatically:
```html
<script src="http://cytoscape.github.io/cytoscape.js/api/cytoscape.js-latest/cytoscape.min.js"></script>
<script src="cytoscape-node-html-label.js"></script>
```

#### RequireJs approach:
`require()` the library as appropriate for your project:

CommonJS:
```js
var cytoscape = require('cytoscape');
var nodeHtmlLabel = require('cytoscape-node-html-label');
nodeHtmlLabel( cytoscape ); // register extension
```

AMD:
```js
require(['cytoscape', 'cytoscape-node-html-label'], function( cytoscape, nodeHtmlLabel ){
  nodeHtmlLabel( cytoscape ); // register extension
});
```


## API

`nodeHtmlLabel` parameter is an array of options:

```js
cyInstance.nodeHtmlLabel([
  {
    query: 'node', // cytoscape query selector
    halign: 'center', // title vertical position. Can be 'left',''center, 'right'
    valign: 'center', // title vertical position. Can be 'top',''center, 'bottom'
    halignBox: 'center', // title vertical position. Can be 'left',''center, 'right'
    valignBox: 'center', // title relative box vertical position. Can be 'top',''center, 'bottom'
    cssClass: '', // any classes will be as attribute of <div> container for every title
    tpl(data) {
      return '<span>' + data + '</span>'; // your html template here
    }
  }
]);
```

To make links clickable inside your labels, you need to pass `enablePointerEvents: true` as the 3rd argument to `nodeHtmlLabel`:

```js
cyInstance.nodeHtmlLabel([
  {
    ...
  }
], {
  enablePointerEvents: true
});
```

## Usage example

Code example:
```js
// create Cy instance
var cyInstance = cytoscape({
    container: document.getElementById('cy'),
    layout: {
        name: 'random'
    },
    elements: [ // your cy elements
        { group: "nodes", data: { id: 'a1', name: 'a10' }, classes: 'l1' },
        { group: "nodes", data: { id: 'a1', name: 'a10' }, classes: 'l1' },
        { group: "nodes", data: { id: 'a1', name: 'a10' }, classes: 'l1' },
        { group: "nodes", data: { id: 'a5', name: 'a5' }, classes: 'l2' }
    ]
});

// set nodeHtmlLabel for your Cy instance
cyInstance.nodeHtmlLabel([{
        query: '.l1',
        valign: "top",
        halign: "left",
        valignBox: "top",
        halignBox: "left",
        tpl: function(data) {
            return '<p class="cy-title__p1">' + data.id + '</p>' + '<p  class="cy-title__p2">' + data.name + '</p>';
        }
    },
    {
        query: '.l2',
        tpl: function(data) {
            return '<p class="cy-title__p1">' + data.id + '</p>' + '<p  class="cy-title__p2">' + data.name + '</p>';
        }
    }
]);
```

Demo here: https://kaluginserg.github.io/cytoscape-node-html-label/


## Performance notes

This fork changes how labels are updated so large graphs pan, zoom and restyle
faster. The API and options are unchanged. See [CHANGELOG.md](CHANGELOG.md).

- **Pan and zoom:** the label layer gets `will-change: transform` while the
  viewport moves, so the browser moves it on the GPU instead of repainting every
  label each frame. The hint is removed 150 ms after the last pan/zoom so text
  is re-rastered sharp; labels can look slightly soft while zooming.
- **Batched updates:** `data`, `style`, `position` and `bounds` events are
  collected and applied once per `requestAnimationFrame`, one update per node
  per frame. Edge events no longer trigger any label work.
- **No needless rebuilds:** a label's DOM is rebuilt only when its `tpl` output
  changes, so `addClass`, selection and hover no longer re-parse every label.

Behaviour differences to be aware of:

- Label updates land on the next animation frame instead of the next
  `setTimeout` tick. In a background tab, browsers pause animation frames, so
  labels catch up when the tab becomes visible.
- If `tpl` returns the same HTML as before, the existing label element is
  kept. Changes you made to that element's DOM by hand are no longer reset by
  unrelated node events.

## How to build and develop:
1) Run `npm start`
1) Create change in src/cytoscape-node-html-label.ts
1) When finished => `npm run test`
1) Prepare js and min files: `npm run build`
1) `git commit`

Then, for version update and publish:
1) Create new npm version: `gulp patch`, `gulp feature` or `gulp release`
1) `npm publish`
