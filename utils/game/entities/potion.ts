export default class Potion {
    public x: number;
    public y: number;
    public healthRestore: number;

    constructor(x: number, y: number, healthRestore: number) {
        this.x = x;
        this.y = y;
        this.healthRestore = healthRestore; // The amount of health restored when picked up
    }
}