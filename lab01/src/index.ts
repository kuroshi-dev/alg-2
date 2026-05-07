import { Graph } from "./Graph.js";
import { primKruskal } from "./primKruskal.js";

// Варіант 3: вершини 1-6
const graph = new Graph(6);

graph.addEdge(1, 2, 5);
graph.addEdge(1, 4, 3);
graph.addEdge(2, 3, 11);
graph.addEdge(2, 5, 12);
graph.addEdge(3, 5, 15);
graph.addEdge(3, 6, 2);
graph.addEdge(4, 5, 2);
graph.addEdge(4, 6, 14);
graph.addEdge(5, 6, 10);

console.log("граф: 6 вершин, варіант 3");
console.log("---\n");

console.log("матриця суміжності:");
graph.printMatrix();

console.log("\nPrim-Kruskal:");
const result = primKruskal(graph);

console.log("\n---");
for (const edge of result.edges) {
  console.log(`  (${edge.from}, ${edge.to})  w=${edge.weight}`);
}
console.log(`\nвага = ${result.totalWeight}`);
