<script setup lang="ts">

const gameCanvas = ref<HTMLCanvasElement | null>(null)

const TILE_SIZE = 440/11; // Size of each tile (e.g., 32x32 pixels)
const GRID_WIDTH = 100; // Grid width in tiles
const GRID_HEIGHT = 100; // Grid height in tiles
const VIEWPORT_WIDTH = 11; // Number of tiles visible horizontally
const VIEWPORT_HEIGHT = 11; // Number of tiles visible vertically


// Type for tile states
enum TileType {
    Wall = 0,
    Floor = 1,
}

class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private grid: TileType[][];
    private cameraX: number = GRID_WIDTH / 2 - VIEWPORT_WIDTH / 2;
    private cameraY: number = GRID_HEIGHT / 2 - VIEWPORT_HEIGHT / 2;
    private rooms: Room[] = [];

    constructor(canvasId: string) {
        this.canvas = gameCanvas.value!
        this.ctx = gameCanvas.value?.getContext('2d')!;
        this.grid = this.createEmptyGrid();
        this.start();
        window.addEventListener('keydown', this.handleKeyPress.bind(this));
    }

    start() {
        this.ctx.fillStyle = '#000'; // Black background
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.generateDungeon();
        this.render();
    }

    createEmptyGrid(): TileType[][] {
        const grid = [];
        for (let y = 0; y < GRID_HEIGHT; y++) {
            const row: TileType[] = [];
            for (let x = 0; x < GRID_WIDTH; x++) {
                row.push(TileType.Wall); // Initialize all tiles as walls
            }
            grid.push(row);
        }
        return grid;
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas
        for (let y = 0; y < VIEWPORT_HEIGHT; y++) {
            for (let x = 0; x < VIEWPORT_WIDTH; x++) {
                // Make sure to round down to get whole numbers for the tile indices
                const tileX = Math.floor(this.cameraX + x) + 1;
                const tileY = Math.floor(this.cameraY + y) + 1;
                if (tileX >= 0 && tileX < GRID_WIDTH && tileY >= 0 && tileY < GRID_HEIGHT) {
                    this.ctx.fillStyle = this.grid[tileY][tileX] === TileType.Floor ? '#FFF' : '#000';
                    this.ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
            }
        }
        this.drawPlayer();
    }

    generateDungeon() {
        this.grid = this.createEmptyGrid(); // Reset the grid to all walls

        // Adjust the central room creation to use the Room class
        const centralRoomX = Math.floor(GRID_WIDTH / 2) - 3;
        const centralRoomY = Math.floor(GRID_HEIGHT / 2) - 3;
        const centralRoomWidth = 7;
        const centralRoomHeight = 7;
        const centralRoom = new Room(centralRoomX, centralRoomY, centralRoomWidth, centralRoomHeight);

        // Manually add the central room to the grid (optional if you do this in generateRooms)
        // this.addRoomToGrid(centralRoom);

        // Start with the central room in the list
        this.rooms = [centralRoom];

        // Add more rooms
        this.rooms = this.rooms.concat(this.generateRooms()); // Implement this based on previous logic

        // Add all rooms to the grid
        this.rooms.forEach(room => this.addRoomToGrid(room));

        // Step 2: Create a Graph of Rooms
        let edges = this.calculateEdges(this.rooms);


        // Step 3: Calculate MST
        let mst = this.calculateMST(edges);


        // Step 4: Draw Corridors based on MST
        mst.forEach(edge => {
            this.connectRoomsDirectly(this.rooms[edge.from], this.rooms[edge.to]);
        });
    }

    addRoomToGrid(room) {
        for (let y = room.y; y < room.y + room.height; y++) {
            for (let x = room.x; x < room.x + room.width; x++) {
                if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
                    this.grid[y][x] = TileType.Floor;
                }
            }
        }
    }

    connectRoomsDirectly(roomA, roomB) {
        // Get the center points of each room
        let centerA = roomA.getCenter();
        let centerB = roomB.getCenter();

        // Decide randomly whether to start with a horizontal or vertical corridor
        if (Math.random() < 0.5) {
            // Horizontal first, then vertical

            // Draw horizontal corridor
            for (let x = Math.min(centerA.x, centerB.x); x <= Math.max(centerA.x, centerB.x); x++) {
                this.grid[centerA.y][x] = TileType.Floor;
            }

            // Draw vertical corridor
            for (let y = Math.min(centerA.y, centerB.y); y <= Math.max(centerA.y, centerB.y); y++) {
                this.grid[y][centerB.x] = TileType.Floor;
            }
        } else {
            // Vertical first, then horizontal

            // Draw vertical corridor
            for (let y = Math.min(centerA.y, centerB.y); y <= Math.max(centerA.y, centerB.y); y++) {
                this.grid[y][centerA.x] = TileType.Floor;
            }

            // Draw horizontal corridor
            for (let x = Math.min(centerA.x, centerB.x); x <= Math.max(centerA.x, centerB.x); x++) {
                this.grid[centerB.y][x] = TileType.Floor;
            }
        }
    }

    generateRooms() {
        const rooms = []; // Array to hold the generated rooms
        const numberOfRooms = 30; // Specify the desired number of rooms

        for (let i = 0; i < numberOfRooms; i++) {
            let room = null;
            let overlap = false;
            let attempts = 0;
            const maxAttempts = 100; // Prevent infinite loop by limiting the number of attempts

            do {
                // Randomly generate room dimensions
                const roomWidth = Math.floor(Math.random() * 6) + 8; // Room width between 3 and 8 tiles
                const roomHeight = Math.floor(Math.random() * 6) + 8; // Room height between 3 and 8 tiles
                // Randomly generate room position, ensuring it fits within the grid
                const roomX = Math.floor(Math.random() * (GRID_WIDTH - roomWidth));
                const roomY = Math.floor(Math.random() * (GRID_HEIGHT - roomHeight));

                room = new Room(roomX, roomY, roomWidth, roomHeight);

                // Check if the new room overlaps with existing rooms
                overlap = rooms.some(r => this.checkRoomOverlap(room, r));
                attempts++;
            } while (overlap && attempts < maxAttempts);

            if (!overlap) {
                // If no overlap, add the room to the array
                rooms.push(room);
            }
        }

        return rooms;
    }

    calculateEdges(rooms) {
        let edges = [];

        // Iterate over all pairs of rooms
        for (let i = 0; i < rooms.length; i++) {
            for (let j = i + 1; j < rooms.length; j++) {
                // Get the center points of the two rooms
                const centerA = rooms[i].getCenter();
                const centerB = rooms[j].getCenter();

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

    checkRoomOverlap(room1, room2) {
        // Check if room1 overlaps with room2
        return (
            room1.x < room2.x + room2.width &&
            room1.x + room1.width > room2.x &&
            room1.y < room2.y + room2.height &&
            room1.y + room1.height > room2.y
        );
    }

    calculateMST(edges) {
        // Sort edges by weight
        edges.sort((a, b) => a.weight - b.weight);

        const numRooms = this.rooms.length; // Assuming this.rooms holds your rooms
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

    applyCARules(): TileType[][] {
        const newGrid: TileType[][] = this.createEmptyGrid();

        for (let y = 0; y < GRID_HEIGHT; y++) {
            for (let x = 0; x < GRID_WIDTH; x++) {
            const neighbors = this.countAliveNeighbors(x, y);
            if (this.grid[y][x] === TileType.Wall) {
                newGrid[y][x] = neighbors > 4 ? TileType.Wall : TileType.Floor;
            } else {
                newGrid[y][x] = neighbors > 3 ? TileType.Wall : TileType.Floor;
            }
            }
        }

        return newGrid;
    }

    countAliveNeighbors(x: number, y: number): number {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
            const nx = x + i;
            const ny = y + j;
            if (i === 0 && j === 0) continue; // Skip the center cell
            if (nx < 0 || ny < 0 || nx >= GRID_WIDTH || ny >= GRID_HEIGHT) {
                count++; // Treat out-of-bounds as walls
            } else if (this.grid[ny][nx] === TileType.Wall) {
                count++;
            }
            }
        }
        return count;
    }

    drawPlayer() {
        // Player is now correctly centered with odd-numbered viewport dimensions
        const playerX = Math.floor(VIEWPORT_WIDTH / 2) * TILE_SIZE;
        const playerY = Math.floor(VIEWPORT_HEIGHT / 2) * TILE_SIZE;
        this.ctx.fillStyle = '#0000FF'; // Blue color for the player
        this.ctx.fillRect(playerX, playerY, TILE_SIZE, TILE_SIZE);
    }

    handleKeyPress(event: KeyboardEvent) {
        // Determine the direction of movement
        let deltaX = 0;
        let deltaY = 0;

        switch (event.key) {
            case 'ArrowUp': deltaY = -1; break;
            case 'ArrowDown': deltaY = 1; break;
            case 'ArrowLeft': deltaX = -1; break;
            case 'ArrowRight': deltaX = 1; break;
            default: return; // Exit if a different key is pressed
        }

        // Calculate the position the player is trying to move to
        // Considering the camera is centered around the player, we check one tile in the direction from the center
        const nextX = this.cameraX + VIEWPORT_WIDTH / 2 + deltaX;
        const nextY = this.cameraY + VIEWPORT_HEIGHT / 2 + deltaY;

        // Check if the position is within the grid bounds and not a wall
        if (nextX >= 0 && nextX < GRID_WIDTH && nextY >= 0 && nextY < GRID_HEIGHT && this.grid[nextY][nextX] === TileType.Floor) {
            // Move the camera (viewport) in the direction of movement
            this.cameraX += deltaX;
            this.cameraY += deltaY;
            this.render(); // Re-render to update the viewport
        }
    }
}

class Room {
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    // Method to check if a given point is inside this room
    contains(x: number, y: number): boolean {
        return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height;
    }

    // Get the center of the room (useful for connecting rooms with corridors)
    getCenter(): { x: number, y: number } {
        return {
            x: Math.floor(this.x + this.width / 2),
            y: Math.floor(this.y + this.height / 2)
        };
    }
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

// Initialize the game
onMounted(() => {
    new Game('gameCanvas');
});

</script>

<template>
    <div class="flex flex-col gap-2">
        <h1 class="text-3xl font-bold">
            Dungeon Delve
        </h1>
        <p class="text-white/50">
            Welcome to the dungeon. You can explore the dungeon and find treasure, but be careful, there are monsters lurking around every corner.
        </p>
        <button class="btn btn-outline btn-sm w-fit">
            Begin your adventure
        </button>
    </div>
    <div class="h-full w-full overflow-hidden p-8">
        <canvas ref="gameCanvas" width="440" height="440" class="aspect-square h-full mx-auto"></canvas>
    </div>
</template>