import { type Edge, Graph } from "./Graph.js";

export interface MSTResult {
  edges:       Edge[];
  totalWeight: number;
}

export function primKruskal(graph: Graph): MSTResult { //
  const vertexCount = graph.getVertexCount();
  const color       = Array.from({ length: vertexCount + 1 }, (unusedValue, index) => index);  // кожна вершина — окремий компонент

  const allEdges = graph.getEdges().sort((edgeA, edgeB) => edgeA.weight - edgeB.weight);  // сортування за вагою

  const mstEdges: Edge[] = [];
  let totalWeight        = 0;

  const allSameColor = () => new Set(color.slice(1)).size === 1;  // умова завершення

  while (!allSameColor()) {
    for (const edge of allEdges) {
      if (color[edge.from] !== color[edge.to]) {  // ребро між різними компонентами
        mstEdges.push(edge);
        totalWeight += edge.weight;

        const oldColor = color[edge.to]!;
        const newColor = color[edge.from]!;
        for (let vertex = 1; vertex <= vertexCount; vertex++) {
          if (color[vertex] === oldColor) color[vertex] = newColor;  // злиття компонентів
        }

        console.log(`  Ребро (${edge.from}, ${edge.to}) вага=${edge.weight}  →  кольори: [${color.slice(1).join(", ")}]`);
        break;
      }
    }
  }

  return { edges: mstEdges, totalWeight };
}
