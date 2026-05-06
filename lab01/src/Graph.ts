export interface Edge {
  from:   number;
  to:     number;
  weight: number;
}

export class Graph {
  private readonly size:   number; // кількість вершин
  private readonly matrix: number[][]; // матриця суміжності

  constructor(vertices: number) {
    this.size   = vertices;
    this.matrix = Array.from({ length: vertices }, () => Array(vertices).fill(0)); // ініціалізація нулями
  }

  addEdge(from: number, to: number, weight: number): void {
    this.matrix[from - 1]![to - 1] = weight;
    this.matrix[to - 1]![from - 1] = weight;  // симетрично — граф неорієнтований
  }

  getVertexCount(): number {
    return this.size;
  }

  getEdges(): Edge[] {
    const edges: Edge[] = [];
    for (let row = 0; row < this.size; row++) {
      for (let col = row + 1; col < this.size; col++) {  // тільки верхній трикутник — без дублів
        const weight = this.matrix[row]![col]!;
        if (weight > 0) edges.push({ from: row + 1, to: col + 1, weight });
      }
    }
    return edges;
  }

  printMatrix(): void {
    const header = "    " + Array.from({ length: this.size }, (_, index) => String(index + 1).padStart(4)).join("");
    console.log(header);
    console.log("    " + "----".repeat(this.size));
    for (let row = 0; row < this.size; row++) {
      const rowStr = this.matrix[row]!.map((cell) => String(cell).padStart(4)).join("");
      console.log(`${row + 1}  |${rowStr}`);
    }
  }
}
