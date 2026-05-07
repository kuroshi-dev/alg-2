import { Graph } from "./Graph.js";

export interface DijkstraResult {
  path:     number[];   // найкоротший шлях від start до end
  distance: number;    // сумарна відстань
}

export function dijkstra(graph: Graph, start: number, end: number): DijkstraResult {
  const vertexCount = graph.getVertexCount();
  const dist        = Array<number>(vertexCount + 1).fill(Infinity);  // мінімальна відстань від start
  const prev        = Array<number>(vertexCount + 1).fill(-1);        // попередня вершина в найкоротшому шляху
  const visited     = Array<boolean>(vertexCount + 1).fill(false);

  dist[start] = 0;

  console.log("Крок | Поточна | dist[1..6]");
  console.log("-----|---------|" + "-".repeat(40));

  for (let step = 0; step < vertexCount; step++) {  // обираємо незакреслену вершину з мінімальною міткою
    let current = -1;
    for (let vertexIndex = 1; vertexIndex <= vertexCount; vertexIndex++) {
      if (!visited[vertexIndex] && (current === -1 || dist[vertexIndex]! < dist[current]!)) current = vertexIndex;
    }

    if (current === -1 || dist[current] === Infinity) break; // решта недосяжні

    visited[current] = true;

    const distStr = Array.from({ length: vertexCount }, (unusedValue, index) => {
      const distanceValue = dist[index + 1];
      return distanceValue === Infinity ? "  ∞" : String(distanceValue).padStart(3);
    }).join(" ");
    console.log(`  ${step + 1}  |    ${current}    | ${distStr}`);

    for (const edge of graph.getNeighbors(current)) { // оновлюємо відстані до сусідів
      const newDist = dist[current]! + edge.weight;
      if (newDist < dist[edge.to]!) {
        dist[edge.to] = newDist;
        prev[edge.to] = current;
      }
    }
  }

  const path: number[] = []; // відновлення шляху з end до start
  for (let vertex = end; vertex !== -1; vertex = prev[vertex]!) {
    path.unshift(vertex);
    if (vertex === start) break;
  }

  return { path, distance: dist[end]! };
}
