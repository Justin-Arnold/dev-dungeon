import MST from "~/utils/minimumSpanningTree";

const VIEWPORT_DIMENSION= 440; // Viewport width and height in pixels
const VIEWPORT_TILE_DIMENSION = 11; // Viewport width and height in tiles
const GRID_TILE_DIMENSION = 100; // Grid width and height in tiles
const TILE_SIZE = VIEWPORT_DIMENSION / VIEWPORT_TILE_DIMENSION;

enum TileType {
    Wall = 0,
    Floor = 1,
}

export default class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private grid: TileType[][];
    private cameraX: number = GRID_TILE_DIMENSION / 2 - VIEWPORT_TILE_DIMENSION / 2;
    private cameraY: number = GRID_TILE_DIMENSION / 2 - VIEWPORT_TILE_DIMENSION / 2;
    private rooms: Room[] = [];

    constructor(canvasId: string) {
        const gameCanvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!gameCanvas) {
            createError('Canvas element not found');
        }
        gameCanvas.width = VIEWPORT_DIMENSION;
        gameCanvas.height = VIEWPORT_DIMENSION;
        this.canvas = gameCanvas
        this.ctx = gameCanvas.getContext('2d')!;
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
        for (let y = 0; y < GRID_TILE_DIMENSION; y++) {
            const row: TileType[] = [];
            for (let x = 0; x < GRID_TILE_DIMENSION; x++) {
                row.push(TileType.Wall); // Initialize all tiles as walls
            }
            grid.push(row);
        }
        return grid;
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas

        for (let y = 0; y < VIEWPORT_TILE_DIMENSION; y++) {
            for (let x = 0; x < VIEWPORT_TILE_DIMENSION; x++) {
                // Make sure to round down to get whole numbers for the tile indices
                const tileX = Math.floor(this.cameraX + x) + 1;
                const tileY = Math.floor(this.cameraY + y) + 1;
                if (tileX >= 0 && tileX < GRID_TILE_DIMENSION && tileY >= 0 && tileY < GRID_TILE_DIMENSION) {
                    this.ctx.fillStyle = this.grid[tileY][tileX] === TileType.Floor ? '#FFF' : '#000';
                    this.ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
            }
        }

        // Draw enemies
        this.rooms.forEach(room => {
            room.enemies.forEach(enemy => {
                // Convert grid positions to pixel positions for drawing
                const pixelX = (enemy.x - this.cameraX) * TILE_SIZE;
                const pixelY = (enemy.y - this.cameraY) * TILE_SIZE;
                this.ctx.fillStyle = 'red';
                this.ctx.fillRect(pixelX, pixelY, TILE_SIZE, TILE_SIZE);
            });
        });

        this.drawPlayer();
    }

    generateDungeon() {
        this.grid = this.createEmptyGrid(); // Reset the grid to all walls

        // Adjust the central room creation to use the Room class
        const centralRoomX = Math.floor(GRID_TILE_DIMENSION / 2) - 3;
        const centralRoomY = Math.floor(GRID_TILE_DIMENSION / 2) - 3;
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

        this.rooms.forEach(room => {
            // const numberOfEnemies = Math.floor(Math.random() * 3); // For example, up to 4 enemies per room
            const numberOfEnemies = 1;
            room.generateEnemies(numberOfEnemies);

        });

        // Step 2: Create a Graph of Rooms
        let edges = MST.calculateEdges(this.rooms);


        // Step 3: Calculate MST
        let mst = MST.calculateMST(edges, this.rooms);


        // Step 4: Draw Corridors based on MST
        mst.forEach(edge => {
            this.connectRoomsDirectly(this.rooms[edge.from], this.rooms[edge.to]);
        });
    }

    addRoomToGrid(room: Room) {
        for (let y = room.y; y < room.y + room.height; y++) {
            for (let x = room.x; x < room.x + room.width; x++) {
                if (x >= 0 && x < GRID_TILE_DIMENSION && y >= 0 && y < GRID_TILE_DIMENSION) {
                    this.grid[y][x] = TileType.Floor;
                }
            }
        }
    }

    connectRoomsDirectly(roomA: Room, roomB: Room) {
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
            let room: Room;
            let overlap = false;
            let attempts = 0;
            const maxAttempts = 100; // Prevent infinite loop by limiting the number of attempts

            do {
                // Randomly generate room dimensions
                const roomWidth = Math.floor(Math.random() * 6) + 8; // Room width between 3 and 8 tiles
                const roomHeight = Math.floor(Math.random() * 6) + 8; // Room height between 3 and 8 tiles
                // Randomly generate room position, ensuring it fits within the grid
                const roomX = Math.floor(Math.random() * (GRID_TILE_DIMENSION - roomWidth));
                const roomY = Math.floor(Math.random() * (GRID_TILE_DIMENSION - roomHeight));

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

    isVisibleOnCamera(x: number, y: number): boolean {
        return x >= this.cameraX && x < this.cameraX + VIEWPORT_TILE_DIMENSION &&
            y >= this.cameraY && y < this.cameraY + VIEWPORT_TILE_DIMENSION;
    }

    checkRoomOverlap(room1: Room, room2: Room) {
        // Check if room1 overlaps with room2
        return (
            room1.x < room2.x + room2.width &&
            room1.x + room1.width > room2.x &&
            room1.y < room2.y + room2.height &&
            room1.y + room1.height > room2.y
        );
    }

    drawPlayer() {
        // Player is now correctly centered with odd-numbered viewport dimensions
        const playerX = Math.floor(VIEWPORT_TILE_DIMENSION / 2) * TILE_SIZE;
        const playerY = Math.floor(VIEWPORT_TILE_DIMENSION / 2) * TILE_SIZE;
        this.ctx.fillStyle = '#0000FF'; // Blue color for the player
        this.ctx.fillRect(playerX, playerY, TILE_SIZE, TILE_SIZE);
    }

    updateEnemies() {
        const playerCenterX = Math.floor(this.cameraX + VIEWPORT_TILE_DIMENSION / 2);
        const playerCenterY = Math.floor(this.cameraY + VIEWPORT_TILE_DIMENSION / 2);
        const detectionRange = 3; // Tiles

        this.rooms.forEach(room => {
            room.enemies.forEach(enemy => {
                const dx = playerCenterX - enemy.x;
                const dy = playerCenterY - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < detectionRange) {
                    // Move enemy towards player
                    enemy.x += dx / distance; // Normalize vector
                    enemy.y += dy / distance; // Normalize vector
                }
            });
        });
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
        const nextX = this.cameraX + VIEWPORT_TILE_DIMENSION / 2 + deltaX;
        const nextY = this.cameraY + VIEWPORT_TILE_DIMENSION / 2 + deltaY;

        // Check if the position is within the grid bounds and not a wall
        if (nextX >= 0 && nextX < GRID_TILE_DIMENSION && nextY >= 0 && nextY < GRID_TILE_DIMENSION && this.grid[nextY][nextX] === TileType.Floor) {
            // Move the camera (viewport) in the direction of movement
            this.cameraX += deltaX;
            this.cameraY += deltaY;
            this.updateEnemies(); // Update enemy positions
            this.render(); // Re-render to update the viewport
        }
    }
}

class Enemy {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Room {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public enemies: Enemy[] = [];

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

    generateEnemies(numberOfEnemies: number) {
        for (let i = 0; i < numberOfEnemies; i++) {
            // Ensure enemy positions are integers within the room boundaries
            const enemyX = Math.floor(Math.random() * (this.width - 1)) + this.x;
            const enemyY = Math.floor(Math.random() * (this.height - 1)) + this.y;
            this.enemies.push(new Enemy(enemyX, enemyY));
        }
    }
}