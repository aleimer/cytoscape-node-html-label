# TODO

## Verify the perf changes in a real browser

- [ ] Record a zoom and a pan in the DevTools Performance tab before and after
      the patch; paint time per frame should drop.
- [ ] Check that labels look sharp again about 150 ms after zooming stops.
- [ ] Drag a node and run a layout; labels must follow without lag.

## Bugs carried over from upstream

- [ ] Re-init leaves the old label layer behind: `createLabelContainer` looks
      for `[class^='cy-node-html']`, but the layer never gets that class, so a
      second `cy.nodeHtmlLabel(...)` call adds a second layer.
- [ ] `test/specs/base.js` "nodeHtmlLabel can reinit" asserts inside a
      `setTimeout` without `done`, so it never really checks anything.

## Tests

- [ ] Add Karma specs for the perf behaviour: `addClass` keeps label DOM,
      data change rebuilds it, moves land after one animation frame,
      `will-change` is set on zoom and cleared when idle, remove during a
      pending move.

## Tooling

- [ ] ESLint 8 is end-of-life: move to ESLint 9 with a flat config
      (`eslint.config.js`) and typescript-eslint 8.
- [ ] Add a `.gitattributes` (e.g. `* text=auto eol=lf`) to stop the CRLF/LF
      warnings and keep `dist/` line endings stable.
- [ ] Update `libs/cytoscape.min.js` used by the demo page (`index.html`), or
      load it from `node_modules`.

## Packaging and release

- [ ] Point `repository`, `bugs` and `homepage` in `package.json` (and
      `bower.json`) at the fork, or keep them upstream if this goes back as a PR.
- [ ] Decide on distribution: PR upstream, publish under a scoped name
      (e.g. `@<scope>/cytoscape-node-html-label`), or install from git.
- [ ] Bump the version (`npm version minor`) and move the CHANGELOG
      "Unreleased" section under it.
- [ ] Consider a `"types"` entry in `package.json` for the `.d.ts` (it
      declares globals, so check it doesn't clash in consumer projects first).
