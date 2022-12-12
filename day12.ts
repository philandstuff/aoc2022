import * as fs from 'fs';

const START_HEIGHT = 97, TARGET_HEIGHT = 122;

class Point {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Dijkstra {
    tentative: Point[]
    map: string[]
    bestByCoord: number[][]
    start: Point = { x: 0, y: 0 }
    end: Point = { x: 0, y: 0 }

    constructor(map: string) {
        let mapLines = map.split("\n");
        const height = mapLines.length;
        const width = mapLines[0].length;
        this.map = mapLines;
        this.bestByCoord = [];
        for (let j = 0; j < height; j++) {
            const row = new Array(width);
            row.fill(Infinity);
            let i: number;
            if ((i = this.map[j].indexOf('S')) != -1) {
                row[i] = 0;
                this.start = new Point(i, j);
            }
            if ((i = this.map[j].indexOf('E')) != -1) {
                this.end = new Point(i, j);
            }
            this.bestByCoord.push(row);
        }
        this.tentative = [this.start];
    }

    best(p: Point) {
        return this.bestByCoord[p.y][p.x];
    }

    setBest(p: Point, val: number) {
        this.bestByCoord[p.y][p.x] = val;
    }

    height(p: Point) {
        const ch = this.map[p.y][p.x];
        if (ch == 'S') {
            return 'a'.charCodeAt(0);
        }
        if (ch == 'E') {
            return 'z'.charCodeAt(0);
        }
        return ch.charCodeAt(0);
    }

    try(from: Point, to: Point) {
        if (to.x < 0
            || to.x >= this.map[0].length
            || to.y < 0
            || to.y >= this.map.length) {
            return;
        }
        // try {
            if (this.best(to) == Infinity && this.height(to) <= this.height(from) + 1) {
                this.setBest(to, this.best(from) + 1);
                this.tentative.push(to);
                console.log('can move from %s to %s, total distance %d', from, to, this.best(to));
            }
        // } catch (error) {
        //     console.log('errored reading %s, %s', to, error);
        // }
    }

    calculate() {
        while (this.best(this.end) == Infinity) {
            const focus = this.tentative.shift()!;
            this.try(focus, new Point(focus.x + 1, focus.y));
            this.try(focus, new Point(focus.x - 1, focus.y));
            this.try(focus, new Point(focus.x, focus.y + 1));
            this.try(focus, new Point(focus.x, focus.y - 1));
        }
        // console.log(this.bestByCoord);
        console.log(this.best(this.end));
    }
}

const example =
    `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

const input = fs.readFileSync('day12-input.txt').toString().trim();

const d1 = new Dijkstra(example);
d1.calculate();

const d2 = new Dijkstra(input);
d2.calculate();
