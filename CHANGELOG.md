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

### Behaviour notes

- Label updates now run on the next animation frame rather than the next
  `setTimeout` tick; in background tabs they wait until the tab is visible.
- A label whose `tpl` output is unchanged keeps its existing DOM element.

## 1.2.2

Upstream release by kaluginserg.
