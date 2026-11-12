/// <reference types="cytoscape" preserve="true" />
type IHAlign = "left" | "center" | "right";
type IVAlign = "top" | "center" | "bottom";
declare var module: {
    exports: unknown;
} | undefined;
declare var define: ((name: string, factory: () => unknown) => void) & {
    amd?: unknown;
};
interface CytoscapeNodeHtmlParams {
    query?: string;
    halign?: IHAlign;
    valign?: IVAlign;
    halignBox?: IHAlign;
    valignBox?: IVAlign;
    cssClass?: string;
    tpl?: (d: cytoscape.NodeDataDefinition) => string;
}
interface CytoscapeContainerParams {
    enablePointerEvents?: boolean;
}
