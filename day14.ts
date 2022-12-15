import * as fs from 'fs';

function* eachCons<T>(arr: Array<T>, num: number): Generator<Array<T>> {
    for (let i = 0; i <= arr.length - num; i++) {
        yield arr.slice(i, i + num);
    }
}

type Point = {
    x: number;
    y: number;
}

function mkPoint(coords: Array<number>): Point { return { x: coords[0], y: coords[1] }; }

function* moveFrom(from: Point, to: Point): Generator<Point> {
    if (from.x == to.x) {
        if (from.y < to.y) {
            for (let y = from.y; y <= to.y; y++) {
                yield { x: from.x, y: y };
            }
        } else {
            for (let y = from.y; y >= to.y; y--) {
                yield { x: from.x, y: y };
            }
        }
    } else {
        if (from.x < to.x) {
            for (let x = from.x; x <= to.x; x++) {
                yield { x: x, y: from.y };
            }
        } else {
            for (let x = from.x; x >= to.x; x--) {
                yield { x: x, y: from.y };
            }
        }
    }
}

function makeMap(lineInput: string): Array<Array<number>> {
    const output = new Array(1000);
    for (let i = 0; i < output.length; i++) {
        output[i] = new Array(200);
        output[i].fill(0);
    }

    for (const line of lineInput.split("\n")) {
        console.log(line);
        const pointList = line.split(" -> ")
            .map(c => c.split(',').map(n => parseInt(n)))
            .map(mkPoint);
        for (const [first, second] of eachCons(pointList, 2)) {
            for (const point of moveFrom(first, second)) {
                output[point.x][point.y] = 2;
            }
        }
    }
    return output;
}

function addSandGrain(map: Array<Array<number>>) : boolean {
    let x = 500;
    for (let y = 0; y < 199; y++) {
        if (map[x][y + 1] != 0) {
            if (map[x - 1][y + 1] == 0) {
                x--;
                continue;
            }
            if (map[x+1][y+1] == 0) {
                x++;
                continue;
            }
            map[x][y] = 1;
            return true;
        }
    }
    return false;
}

function drawMap(map: Array<Array<number>>) {
    for (let j = 0; j < 20; j++) {
        let str = "";
        for (let i = 470; i <= 530; i++) {
            switch (map[i][j]) {
                case 0:
                    str += '.';
                    break;
                case 1:
                    str += 'o';
                    break;
                case 2:
                    str += '#';
                    break;
                default:
                    str += map[i][j];
                    break;
            }
        }
        console.log(str);
    }
}

function day14(lineInput: string) {
    const map = makeMap(lineInput);
    let grains = 0;
    while(addSandGrain(map)) {
        grains++;
    }
    
    drawMap(map);
    console.log(grains);
}

const example = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

const input = fs.readFileSync('day14-input.txt').toString().trim();

// day14(example);
day14(input);
