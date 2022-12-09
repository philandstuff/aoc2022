import fs from 'fs';

const movePattern = /(\w) (\d+)/

type knot = {
    x: number;
    y: number;
}

function simulateRope(instructions: string) {
    let rope: knot[] = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
    let tailvisited: Record<number, Record<number, boolean>> =
        { 0: { 0: true } };

    function moveHead(dir: string) {
        switch (dir) {
            case 'R': rope[0].x++; break;
            case 'L': rope[0].x--; break;
            case 'U': rope[0].y++; break;
            case 'D': rope[0].y--; break;
        }
    }

    function moveKnot(i: number) {
        // cases:
        // - move diagonally, when head and tail on distinct coords
        // - move laterally, when head and tail share a single coord
        // - don't move, when head and tail touching
        if ((Math.abs(rope[i - 1].x - rope[i].x) < 2) && (Math.abs(rope[i - 1].y - rope[i].y) < 2)) {
            return;
        }
        if (rope[i - 1].y > rope[i].y) {
            rope[i].y++;
        } else if (rope[i - 1].y < rope[i].y) {
            rope[i].y--;
        }
        if (rope[i - 1].x > rope[i].x) {
            rope[i].x++;
        } else if (rope[i - 1].x < rope[i].x) {
            rope[i].x--;
        }
    }

    function moveRope(dir: string) {
        moveHead(dir);
        for (let i = 1; i < rope.length; i++) {
            moveKnot(i);
        }
        // mark new location as visited
        const tail = rope.length-1;
        if (tailvisited[rope[tail].x] == null) {
            tailvisited[rope[tail].x] = {};
        }
        tailvisited[rope[tail].x][rope[tail].y] = true;
    }

    for (let move of instructions.split('\n')) {
        let result;
        if (move.trim() == '') { continue; }
        if ((result = movePattern.exec(move)) !== null) {
            const [, dir, dist] = result;
            for (let i = 0; i < parseInt(dist); i++) {
                moveRope(dir);
            }
        } else {
            throw new Error("unknown move: " + move);
        }
    }

    let total = 0;
    for (const val of Object.values(tailvisited)) {
        total += Object.keys(val).length;
    }
    console.log(total);
}

const example = `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

const example2 = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`;

simulateRope(example);
simulateRope(example2);
const input = fs.readFileSync('day9-input.txt');
if (input !== null) {
    simulateRope(input.toString());
}
