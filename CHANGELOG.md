# Changelog

## Unreleased

Performance changes on top of upstream 1.2.2. No API or option changes.

### Changed

- `LabelContainer.updatePanZoom`: sets `will-change: transform` on the label
  layer on every pan/zoom and clears it 150 ms after the last one. The layer is
  moved by the GPU instead of every label being repainted per frame.
- `LabelElement.updateData`: caches the template output and returns early when
  it is unchanged, so `addClass`, select and hover no longer rebuild label DOM.
- `style`, `data`, `position` and `bounds` handlers: changed nodes are collected
  and flushed once per `requestAnimationFrame` (one update per node per frame)
  instead of one `setTimeout` or synchronous transform write per event.
- These four handlers are bound with the `"node"` selector; edge events no
  longer trigger work. `removeCyHandler` drops a pending move for the removed
  node.

### Code style

- Stricter ESLint config: Allman braces, 4-space indent, double quotes,
  128-column limit, explicit types on every variable, parameter and function
  return, `no-explicit-any`, `eqeqeq`, member ordering.
- Tooling raised for these rules: ESLint 8.57, @typescript-eslint 6.21,
  TypeScript 4.9.
- `any` replaced with `@types/cytoscape` types. In the generated `.d.ts`,
  `tpl` now receives `cytoscape.NodeDataDefinition` (still allows any data
  field) and the file references `@types/cytoscape`. The global
  `declare var cytoscape: any` is gone.
- Label layer styles set as `zIndex` / `pointerEvents` instead of the dashed
  property names; same effect.

### Tooling

- Removed gulp and its plugins; `npm run build` is now `tsc` + `terser`,
  version bumps use `npm version`.
- Karma 6 / karma-jasmine 5 (specs run in file order), TypeScript 5.5,
  @typescript-eslint 7.18. Cytoscape types now come from the `cytoscape`
  package (dev dependency) instead of `@types/cytoscape`.
- Tests load Cytoscape from `node_modules` (current 3.x) instead of
  `libs/cytoscape.min.js`; the demo page still uses `libs/`.
- Lockfile regenerated. GitHub Actions CI workflow removed.

### Behaviour notes

- Label updates now run on the next animation frame rather than the next
  `setTimeout` tick; in background tabs they wait until the tab is visible.
- A label whose `tpl` output is unchanged keeps its existing DOM element.

## 1.2.2

Upstream release by kaluginserg.
