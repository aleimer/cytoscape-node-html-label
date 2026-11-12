type IHAlign = "left" | "center" | "right";
type IVAlign = "top" | "center" | "bottom";
declare var module: any;
declare var define: any;
declare var cytoscape: any;

interface CytoscapeNodeHtmlParams {
  query?: string;
  halign?: IHAlign;
  valign?: IVAlign;
  halignBox?: IHAlign;
  valignBox?: IVAlign;
  cssClass?: string;
  tpl?: (d: any) => string;
}

interface CytoscapeContainerParams {
  enablePointerEvents?: boolean;
}

(function () {
  "use strict";
  const $$find = function <T>(arr: T[], predicate: (a: T) => boolean) {
    if (typeof predicate !== "function") {
      throw new TypeError("predicate must be a function");
    }
    const length = arr.length >>> 0;
    // eslint-disable-next-line prefer-rest-params
    const thisArg = arguments[1];
    let value;

    for (let i = 0; i < length; i++) {
      value = arr[i];
      if (predicate.call(thisArg, value, i, arr)) {
        return value;
      }
    }
    return undefined;
  };

  interface ICyEventObject {
    cy: any;
    type: string;
    target: any;
  }

  interface ICytoscapeNodeHtmlPosition {
    x: number;
    y: number;
    w: number;
    h: number;
  }

  interface ILabelElement {
    data?: any;
    position?: ICytoscapeNodeHtmlPosition;
    node: HTMLElement;
  }

  interface HashTableElements {
    [key: string]: LabelElement;
  }

  class LabelElement {
    public tpl: (d: any) => string;

    private _position: number[];
    private _node: HTMLElement;
    private _align: [number, number, number, number];
    private _html: string;

    constructor({
                  node,
                  position = null,
                  data = null
                }: ILabelElement,
                params: CytoscapeNodeHtmlParams) {

      this.updateParams(params);
      this._node = node;

      this.initStyles(params.cssClass);

      if (data) {
        this.updateData(data);
      }
      if (position) {
        this.updatePosition(position);
      }
    }

    updateParams({
                   tpl = () => "",
                   // eslint-disable-next-line @typescript-eslint/no-unused-vars
                   cssClass = null,
                   halign = "center",
                   valign = "center",
                   halignBox = "center",
                   valignBox = "center"
                 }: CytoscapeNodeHtmlParams) {

      const _align = {
        "top": -.5,
        "left": -.5,
        "center": 0,
        "right": .5,
        "bottom": .5
      };

      this._align = [
        _align[halign],
        _align[valign],
        100 * (_align[halignBox] - 0.5),
        100 * (_align[valignBox] - 0.5)
      ];

      this.tpl = tpl;
    }

    updateData(data: any) {
      // PERF: skip the DOM rebuild when the template output did not change
      const html = this.tpl(data);
      if (html === this._html) {
        return;
      }
      this._html = html;

      while (this._node.firstChild) {
        this._node.removeChild(this._node.firstChild);
      }

      const children = new DOMParser()
          .parseFromString(html, "text/html")
          .body.children;

      for (let i = 0; i < children.length; ++i) {
        const el = children[i];
        this._node.appendChild(el);
      }
    }

    getNode(): HTMLElement {
      return this._node;
    }

    updatePosition(pos: ICytoscapeNodeHtmlPosition) {
      this._renderPosition(pos);
    }

    private initStyles(cssClass: string) {
      const stl = this._node.style;
      stl.position = "absolute";
      if (cssClass && cssClass.length) {
        this._node.classList.add(cssClass);
      }
    }

    private _renderPosition(position: ICytoscapeNodeHtmlPosition) {
      const prev = this._position;
      const x = position.x + this._align[0] * position.w;
      const y = position.y + this._align[1] * position.h;

      if (!prev || prev[0] !== x || prev[1] !== y) {
        this._position = [x, y];

        const valRel = `translate(${this._align[2]}%,${this._align[3]}%) `;
        const valAbs = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) `;
        const val = valRel + valAbs;
        const stl = <any>this._node.style;
        stl.webkitTransform = val;
        stl.msTransform = val;
        stl.transform = val;
      }
    }
  }

  /**
   * LabelContainer
   * Html manipulate, find and upgrade nodes
   * it don't know about cy.
   */
  class LabelContainer {
    private _elements: HashTableElements;
    private _node: HTMLElement;
    private _idle: any;

    constructor(node: HTMLElement) {
      this._node = node;
      this._elements = <HashTableElements>{};
    }

    addOrUpdateElem(id: string, param: CytoscapeNodeHtmlParams, payload: { data?: any, position?: ICytoscapeNodeHtmlPosition } = {}) {
      const cur = this._elements[id];
      if (cur) {
        cur.updateParams(param);
        cur.updateData(payload.data);
        cur.updatePosition(payload.position);
      } else {
        const nodeElem = document.createElement("div");
        this._node.appendChild(nodeElem);

        this._elements[id] = new LabelElement({
          node: nodeElem,
          data: payload.data,
          position: payload.position
        }, param);
      }
    }

    removeElemById(id: string) {
      if (this._elements[id]) {
        this._node.removeChild(this._elements[id].getNode());
        delete this._elements[id];
      }
    }

    updateElemPosition(id: string, position?: ICytoscapeNodeHtmlPosition) {
      const ele = this._elements[id];
      if (ele) {
        ele.updatePosition(position);
      }
    }

    updatePanZoom({pan, zoom}: { pan: { x: number, y: number }, zoom: number }) {
      const val = `translate(${pan.x}px,${pan.y}px) scale(${zoom})`;
      const stl = <any>this._node.style;
      const origin = "top left";

      stl.webkitTransform = val;
      stl.msTransform = val;
      stl.transform = val;
      stl.webkitTransformOrigin = origin;
      stl.msTransformOrigin = origin;
      stl.transformOrigin = origin;

      // PERF: own compositor layer while the viewport moves (pan/zoom done by the GPU,
      // no repaint of every label per frame); dropped when idle so text re-rasters sharp.
      stl.willChange = "transform";
      clearTimeout(this._idle);
      this._idle = setTimeout(() => { stl.willChange = ""; }, 150);
    }
  }

  function cyNodeHtmlLabel(_cy: any, params: CytoscapeNodeHtmlParams[], options?: CytoscapeContainerParams) {
    const _params = (!params || typeof params !== "object") ? [] : params;
    const _lc = createLabelContainer();

    _cy.one("render", (e: any) => {
      createNodesCyHandler(e);
      wrapCyHandler(e);
    });
    _cy.on("add", addCyHandler);
    _cy.on("layoutstop", layoutstopHandler);
    _cy.on("remove", removeCyHandler);
    // PERF: node-only bindings (edge events only did no-op work before)
    _cy.on("data", "node", updateDataOrStyleCyHandler);
    _cy.on("style", "node", updateDataOrStyleCyHandler);
    _cy.on("pan zoom", wrapCyHandler);
    _cy.on("position bounds", "node", moveCyHandler); // "bounds" - not documented event

    // PERF: per-node updates collected and applied once per animation frame
    let _moved: { [id: string]: any } = {};
    let _changed: { [id: string]: any } = {};
    let _frame = 0;

    function schedule() {
      if (!_frame) {
        _frame = requestAnimationFrame(flush);
      }
    }

    function flush() {
      _frame = 0;
      const moved = _moved;
      const changed = _changed;
      _moved = {};
      _changed = {};

      Object.keys(changed).forEach(id => {
        const target = changed[id];
        delete moved[id]; // full update below includes the position
        const param = $$find(_params.slice().reverse(), x => target.is(x.query));
        if (param && !target.removed()) {
          _lc.addOrUpdateElem(id, param, {
            position: getNodePosition(target),
            data: target.data()
          });
        } else {
          _lc.removeElemById(id);
        }
      });

      Object.keys(moved).forEach(id => {
        _lc.updateElemPosition(id, getNodePosition(moved[id]));
      });
    }

    return _cy;

    function createLabelContainer(): LabelContainer {
      const _cyContainer = _cy.container();
      const _titlesContainer = document.createElement("div");

      const _cyCanvas = _cyContainer.querySelector("canvas");
      const cur = _cyContainer.querySelector("[class^='cy-node-html']");
      if (cur) {
        _cyCanvas.parentNode.removeChild(cur);
      }

      const stl = _titlesContainer.style;
      stl.position = 'absolute';
      stl['z-index'] = 10;
      stl.width = '500px';
      stl.margin = '0px';
      stl.padding = '0px';
      stl.border = '0px';
      stl.outline = '0px';
      stl.outline = '0px';

      if (options && options.enablePointerEvents !== true) {
        stl['pointer-events'] = 'none';
      }

      _cyCanvas.parentNode.appendChild(_titlesContainer);

      return new LabelContainer(_titlesContainer);
    }

    function createNodesCyHandler({cy}: ICyEventObject) {
      _params.forEach(x => {
        cy.elements(x.query).forEach((d: any) => {
          if (d.isNode()) {
            _lc.addOrUpdateElem(d.id(), x, {
              position: getNodePosition(d),
              data: d.data()
            });
          }
        });
      });
    }

    function addCyHandler(ev: ICyEventObject) {
      const target = ev.target;
      const param = $$find(_params.slice().reverse(), x => target.is(x.query));
      if (param) {
        _lc.addOrUpdateElem(target.id(), param, {
          position: getNodePosition(target),
          data: target.data()
        });
      }
    }

    function layoutstopHandler({cy}: ICyEventObject) {
      _params.forEach(x => {
        cy.elements(x.query).forEach((d: any) => {
          if (d.isNode()) {
            _lc.updateElemPosition(d.id(), getNodePosition(d));
          }
        });
      });
    }

    function removeCyHandler(ev: ICyEventObject) {
      delete _moved[ev.target.id()];
      _lc.removeElemById(ev.target.id());
    }

    function moveCyHandler(ev: ICyEventObject) {
      _moved[ev.target.id()] = ev.target;
      schedule();
    }

    function updateDataOrStyleCyHandler(ev: ICyEventObject) {
      _changed[ev.target.id()] = ev.target;
      schedule();
    }

    function wrapCyHandler({cy}: ICyEventObject) {
      _lc.updatePanZoom({
        pan: cy.pan(),
        zoom: cy.zoom()
      });
    }

    function getNodePosition(node: any): ICytoscapeNodeHtmlPosition {
      return {
        w: node.width(),
        h: node.height(),
        x: node.position("x"),
        y: node.position("y")
      };
    }
  }

  // registers the extension on a cytoscape lib ref
  const register = function (cy: any) {

    if (!cy) {
      return;
    } // can't register if cytoscape unspecified

    cy("core", "nodeHtmlLabel", function (optArr: any, options?: any) {
      return cyNodeHtmlLabel(this, optArr, options);
    });
  };

  if (typeof module !== "undefined" && module.exports) { // expose as a commonjs module
    module.exports = function (cy: any) {
      register(cy);
    };
  } else {
    if (typeof define !== "undefined" && define.amd) { // expose as an amd/requirejs module
      define("cytoscape-nodeHtmlLabel", function () {
        return register;
      });
    }
  }

  if (typeof cytoscape !== "undefined") { // expose to global cytoscape (i.e. window.cytoscape)
    register(cytoscape);
  }

}());
