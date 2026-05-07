import { Graph } from "./Graph.js";
import { dijkstra } from "./dijkstra.js";

const graph = new Graph(6); // Варіант 3: вершини 1-6

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

console.log("\nDijkstra 1 -> 6:\n");
const result = dijkstra(graph, 1, 6);

console.log("\n---");
console.log(`шлях: ${result.path.join(" -> ")}`);
console.log(`довжина = ${result.distance}`);
