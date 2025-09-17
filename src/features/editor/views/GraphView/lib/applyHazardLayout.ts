import type { ElkCanvasLayoutOptions } from "reaflow";
import type { EdgeData, NodeData } from "../../../../../types/graph";

interface HazardLayoutResult {
  nodes: NodeData[];
  edges: EdgeData[];
  layoutOptions?: ElkCanvasLayoutOptions;
}

const COLUMN_X = {
  left: 220,
  center: 620,
  right: 1020,
};

const VERTICAL_SPACING = 180;
const TOP_MARGIN = 80;
const FIXED_LAYOUT_OPTIONS: ElkCanvasLayoutOptions = { "elk.algorithm": "fixed" };

const pathKey = (node: NodeData) =>
  node.path
    ?.map(segment =>
      typeof segment === "number" ? segment.toString().padStart(4, "0") : String(segment)
    )
    .join(".") ?? "";

const includesPathSegment = (node: NodeData, key: string) =>
  (node.path ?? []).some(segment => segment === key);

const isThreatNode = (node: NodeData) => includesPathSegment(node, "threatAction");
const isHazardNode = (node: NodeData) => includesPathSegment(node, "hazardElement");
const isConsequenceNode = (node: NodeData) => includesPathSegment(node, "consequence");

const isThreatContainer = (node: NodeData) =>
  node.path && node.path.length === 1 && node.path[0] === "threatAction";

const isThreatEntry = (node: NodeData) =>
  node.path &&
  node.path[0] === "threatAction" &&
  typeof node.path[1] === "number" &&
  node.path.length === 2;

const isConsequenceContainer = (node: NodeData) =>
  node.path && node.path.length === 1 && node.path[0] === "consequence";

const isConsequenceEntry = (node: NodeData) =>
  node.path &&
  node.path[0] === "consequence" &&
  typeof node.path[1] === "number" &&
  node.path.length === 2;

const getHazardRoot = (nodes: NodeData[]) =>
  nodes.find(node => node.path && node.path.length === 1 && node.path[0] === "hazardElement") ??
  nodes.find(node => node.path && node.path[node.path.length - 1] === "hazardElement") ??
  null;

const cloneEdge = (edge: EdgeData): EdgeData => ({ ...edge });

export const applyHazardLayout = (nodes: NodeData[], edges: EdgeData[]): HazardLayoutResult => {
  const threatNodes = nodes
    .filter(isThreatNode)
    .sort((a, b) => pathKey(a).localeCompare(pathKey(b)));
  const hazardNodes = nodes
    .filter(isHazardNode)
    .sort((a, b) => pathKey(a).localeCompare(pathKey(b)));
  const consequenceNodes = nodes
    .filter(isConsequenceNode)
    .sort((a, b) => pathKey(a).localeCompare(pathKey(b)));

  const hazardRoot = getHazardRoot(hazardNodes);
  const threatContainer = nodes.find(isThreatContainer) ?? null;
  const consequenceContainer = nodes.find(isConsequenceContainer) ?? null;
  const threatEntries = nodes.filter(isThreatEntry);
  const consequenceEntries = nodes.filter(isConsequenceEntry);

  if (!hazardRoot || threatNodes.length === 0 || consequenceNodes.length === 0) {
    return { nodes, edges };
  }

  const positions = new Map<string, { x: number; y: number }>();

  const assignSymmetricColumn = (list: NodeData[], x: number) => {
    if (list.length === 0) return;
    const half = (list.length - 1) / 2;
    list.forEach((node, index) => {
      const y = (index - half) * VERTICAL_SPACING;
      positions.set(node.id, { x, y });
    });
  };

  assignSymmetricColumn(threatNodes, COLUMN_X.left);
  assignSymmetricColumn(consequenceNodes, COLUMN_X.right);

  const hazardSorted = hazardNodes;
  if (hazardRoot) {
    positions.set(hazardRoot.id, { x: COLUMN_X.center, y: 0 });
    const rootIndex = hazardSorted.findIndex(node => node.id === hazardRoot.id);

    if (rootIndex !== -1) {
      for (let i = rootIndex - 1, step = 1; i >= 0; i -= 1, step += 1) {
        const node = hazardSorted[i];
        positions.set(node.id, { x: COLUMN_X.center, y: -step * VERTICAL_SPACING });
      }

      for (let i = rootIndex + 1, step = 1; i < hazardSorted.length; i += 1, step += 1) {
        const node = hazardSorted[i];
        positions.set(node.id, { x: COLUMN_X.center, y: step * VERTICAL_SPACING });
      }
    }
  } else {
    assignSymmetricColumn(hazardNodes, COLUMN_X.center);
  }

  const positionedEntries = Array.from(positions.entries());
  if (positionedEntries.length === 0) {
    return { nodes, edges };
  }

  let minY = Infinity;
  let maxY = -Infinity;

  positionedEntries.forEach(([, { y }]) => {
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  });

  if (Number.isFinite(minY) && Number.isFinite(maxY)) {
    const centerShift = (maxY - minY) / 2;
    positionedEntries.forEach(([, pos]) => {
      pos.y += centerShift;
    });

    minY += centerShift;

    const minWithMargin = minY < TOP_MARGIN ? TOP_MARGIN - minY : 0;
    if (minWithMargin > 0) {
      positionedEntries.forEach(([, pos]) => {
        pos.y += minWithMargin;
      });
    }
  }

  const manualNodes = nodes.map(node => {
    const pos = positions.get(node.id);
    if (!pos) return node;

    return {
      ...node,
      layoutOptions: {
        ...(node.layoutOptions ?? {}),
        "org.eclipse.elk.position": `(${Math.round(pos.x)},${Math.round(pos.y)})`,
      },
    };
  });

  const manualEdges = edges.map(cloneEdge);
  let nextEdgeId = manualEdges.reduce((max, edge) => {
    const numericId = Number(edge.id);
    return Number.isFinite(numericId) ? Math.max(max, numericId) : max;
  }, 0);

  const ensureEdge = (fromId: string | undefined | null, toId: string | undefined | null) => {
    if (!fromId || !toId) return;
    const exists = manualEdges.some(edge => edge.from === fromId && edge.to === toId);
    if (exists) return;

    nextEdgeId += 1;
    manualEdges.push({ id: String(nextEdgeId), from: fromId, to: toId, text: null });
  };

  const threatSources =
    threatEntries.length > 0 ? threatEntries : threatContainer ? [threatContainer] : [];
  threatSources.forEach(node => ensureEdge(node.id, hazardRoot.id));

  const consequenceTargets =
    consequenceEntries.length > 0
      ? consequenceEntries
      : consequenceContainer
        ? [consequenceContainer]
        : [];
  consequenceTargets.forEach(node => ensureEdge(hazardRoot.id, node.id));

  return {
    nodes: manualNodes,
    edges: manualEdges,
    layoutOptions: FIXED_LAYOUT_OPTIONS,
  };
};
