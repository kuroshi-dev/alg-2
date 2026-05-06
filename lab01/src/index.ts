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

console.log("=== Матриця суміжності ===");
graph.printMatrix();

console.log("\n=== Виконання алгоритму Прима-Крускала ===");
const result = primKruskal(graph);

console.log("\n=== Мінімальне каркасне дерево ===");
for (const edge of result.edges) {
  console.log(`  (${edge.from}, ${edge.to})  вага: ${edge.weight}`);
}
console.log(`\nСумарна вага: ${result.totalWeight}`);
