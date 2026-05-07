export interface Edge {
  from:   number;
  to:     number;
  weight: number;
}

export class Graph {
  private readonly size:   number;
  private readonly matrix: number[][];

  constructor(vertices: number) {
    this.size   = vertices;
    this.matrix = Array.from({ length: vertices }, () => Array(vertices).fill(0));
  }

  addEdge(from: number, to: number, weight: number): void {
    this.matrix[from - 1]![to - 1] = weight;
    this.matrix[to - 1]![from - 1] = weight; // симетрично-неорієнтований граф
  }

  getVertexCount(): number {
    return this.size;
  }

 
  getNeighbors(vertex: number): Edge[] {  // повертає список суміжних вершин з вагами для заданої вершини
    const neighbors: Edge[] = [];
    const row = this.matrix[vertex - 1]!;
    for (let col = 0; col < this.size; col++) {
      const weight = row[col]!;
      if (weight > 0) neighbors.push({ from: vertex, to: col + 1, weight });
    }
    return neighbors;
  }

  printMatrix(): void {
    const header = "    " + Array.from({ length: this.size }, (unusedValue, index) => String(index + 1).padStart(4)).join("");
    console.log(header);
    console.log("    " + "----".repeat(this.size));
    for (let row = 0; row < this.size; row++) {
      const rowStr = this.matrix[row]!.map((cell) => String(cell).padStart(4)).join("");
      console.log(`${row + 1}  |${rowStr}`);
    }
  }
}
