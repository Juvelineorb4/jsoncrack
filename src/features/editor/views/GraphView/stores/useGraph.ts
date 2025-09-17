import type { ViewPort } from "react-zoomable-ui/dist/ViewPort";
import type { ElkCanvasLayoutOptions } from "reaflow";
import type { CanvasDirection } from "reaflow/dist/layout/elkLayout";
import { create } from "zustand";
import { SUPPORTED_LIMIT } from "../../../../../constants/graph";
import useJson from "../../../../../store/useJson";
import type { EdgeData, NodeData } from "../../../../../types/graph";
import { applyHazardLayout } from "../lib/applyHazardLayout";
import { parser } from "../lib/jsonParser";

export const DEFAULT_LAYOUT_OPTIONS: ElkCanvasLayoutOptions = {
  "elk.layered.compaction.postCompaction.strategy": "EDGE_LENGTH",
  "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
};

export interface Graph {
  viewPort: ViewPort | null;
  direction: CanvasDirection;
  loading: boolean;
  fullscreen: boolean;
  nodes: NodeData[];
  edges: EdgeData[];
  selectedNode: NodeData | null;
  path: string;
  aboveSupportedLimit: boolean;
  layoutOptions: ElkCanvasLayoutOptions;
}

const initialStates: Graph = {
  viewPort: null,
  direction: "RIGHT",
  loading: true,
  fullscreen: false,
  nodes: [],
  edges: [],
  selectedNode: null,
  path: "",
  aboveSupportedLimit: false,
  layoutOptions: DEFAULT_LAYOUT_OPTIONS,
};

interface GraphActions {
  setGraph: (json?: string, options?: Partial<Graph>[]) => void;
  setLoading: (loading: boolean) => void;
  setDirection: (direction: CanvasDirection) => void;
  setViewPort: (ref: ViewPort) => void;
  setSelectedNode: (nodeData: NodeData) => void;
  focusFirstNode: () => void;
  toggleFullscreen: (value: boolean) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  centerView: () => void;
  clearGraph: () => void;
  setZoomFactor: (zoomFactor: number) => void;
}

const useGraph = create<Graph & GraphActions>((set, get) => ({
  ...initialStates,
  clearGraph: () =>
    set({ nodes: [], edges: [], loading: false, layoutOptions: DEFAULT_LAYOUT_OPTIONS }),
  setSelectedNode: nodeData => set({ selectedNode: nodeData }),
  setGraph: (data, options) => {
    const { nodes: parsedNodes, edges: parsedEdges } = parser(data ?? useJson.getState().json);
    const {
      nodes: transformedNodes,
      edges: transformedEdges,
      layoutOptions: transformedLayoutOptions,
    } = applyHazardLayout(parsedNodes, parsedEdges);

    if (transformedNodes.length > SUPPORTED_LIMIT) {
      return set({
        aboveSupportedLimit: true,
        layoutOptions: DEFAULT_LAYOUT_OPTIONS,
        ...options,
        loading: false,
      });
    }

    set({
      nodes: transformedNodes,
      edges: transformedEdges,
      aboveSupportedLimit: false,
      layoutOptions: transformedLayoutOptions ?? DEFAULT_LAYOUT_OPTIONS,
      ...options,
    });
  },
  setDirection: (direction = "RIGHT") => {
    set({ direction });
    setTimeout(() => get().centerView(), 200);
  },
  setLoading: loading => set({ loading }),
  focusFirstNode: () => {
    const rootNode = document.querySelector("g[id$='node-1']");
    get().viewPort?.camera?.centerFitElementIntoView(rootNode as HTMLElement, {
      elementExtraMarginForZoom: 100,
    });
  },
  setZoomFactor: zoomFactor => {
    const viewPort = get().viewPort;
    viewPort?.camera?.recenter(viewPort.centerX, viewPort.centerY, zoomFactor);
  },
  zoomIn: () => {
    const viewPort = get().viewPort;
    viewPort?.camera?.recenter(viewPort.centerX, viewPort.centerY, viewPort.zoomFactor + 0.1);
  },
  zoomOut: () => {
    const viewPort = get().viewPort;
    viewPort?.camera?.recenter(viewPort.centerX, viewPort.centerY, viewPort.zoomFactor - 0.1);
  },
  centerView: () => {
    const viewPort = get().viewPort;
    viewPort?.updateContainerSize();

    const canvas = document.querySelector(".jsoncrack-canvas") as HTMLElement | null;
    if (canvas) {
      viewPort?.camera?.centerFitElementIntoView(canvas);
    }
  },
  toggleFullscreen: fullscreen => set({ fullscreen }),
  setViewPort: viewPort => set({ viewPort }),
}));

export default useGraph;
