export default class Enemy {
    public x: number;
    public y: number;
    public health: number = 100;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}