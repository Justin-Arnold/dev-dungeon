type Edge = {
    from: number;
    to: number;
    weight: number;
}

type Node = {
    getCenter: () => { x: number, y: number };
}

function calculateEdges(nodes: Node[]) {
    let edges: Edge[] = [];

    // Iterate over all pairs of rooms
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            // Get the center points of the two rooms
            const centerA = nodes[i].getCenter();
            const centerB = nodes[j].getCenter();

            // Calculate the distance between the two centers
            // Here, we use Manhattan distance for simplicity, but you could use Euclidean distance or another metric
            const distance = Math.abs(centerA.x - centerB.x) + Math.abs(centerA.y - centerB.y);

            // Add an edge between these two rooms with the calculated distance as the weight
            edges.push({
                from: i,
                to: j,
                weight: distance
            });
        }
    }

    return edges;
}


function calculateMST(edges: Edge[], nodes: Node[]) {
    // Sort edges by weight
    edges.sort((a, b) => a.weight - b.weight);

    const numRooms = nodes.length; // Assuming this.rooms holds your rooms
    const uf = new UnionFind(numRooms);

    const mst = []; // This will store the edges in the MST

    for (const edge of edges) {
        const root1 = uf.find(edge.from);
        const root2 = uf.find(edge.to);

        if (root1 !== root2) {
            mst.push(edge); // Add edge to MST
            uf.union(root1, root2);
        }
    }

    return mst;
}

class UnionFind {
    private parent: number[];
    private rank: number[];

    constructor(size: number) {
        this.parent = Array.from({ length: size }, (_, index) => index);
        this.rank = Array.from({ length: size }, () => 0);
    }

    find(i: number): number {
        if (this.parent[i] !== i) {
            this.parent[i] = this.find(this.parent[i]); // Path compression
        }
        return this.parent[i];
    }

    union(x: number, y: number): void {
        const xRoot = this.find(x);
        const yRoot = this.find(y);

        if (xRoot === yRoot) return;

        // Attach smaller rank tree under root of high rank tree
        if (this.rank[xRoot] < this.rank[yRoot]) {
            this.parent[xRoot] = yRoot;
        } else if (this.rank[xRoot] > this.rank[yRoot]) {
            this.parent[yRoot] = xRoot;
        } else {
            this.parent[yRoot] = xRoot;
            this.rank[xRoot] += 1;
        }
    }
}

export default {
    UnionFind,
    calculateEdges,
    calculateMST
}