import fs from 'fs';

const movePattern = /(\w) (\d+)/

function simulateRope(instructions: string) {
    let headX = 0, headY = 0, tailX = 0, tailY = 0;
    let tailvisited: Record<number, Record<number, boolean>>= 
    {0: {0: true}};

    function moveHead(dir: string) {
        switch (dir) {
            case 'R': headX++; break;
            case 'L': headX--; break;
            case 'U': headY++; break;
            case 'D': headY--; break;
        }
    }

    function moveTail() {
        // cases:
        // - move diagonally, when head and tail on distinct coords
        // - move laterally, when head and tail share a single coord
        // - don't move, when head and tail touching
        if ((Math.abs(headX - tailX) < 2) && (Math.abs(headY - tailY) < 2)) {
            return;
        }
        if (headY > tailY) {
            tailY++;
        } else if (headY < tailY) {
            tailY--;
        }
        if (headX > tailX) {
            tailX++;
        } else if (headX < tailX) {
            tailX--;
        }
        // mark new location as visited
        if (tailvisited[tailX] == null) {
            tailvisited[tailX] = {};    
        }
        tailvisited[tailX][tailY] = true;
    }

    for (let move of instructions.split('\n')) {
        let result;
        if (move.trim() == '') {continue;}
        if ((result = movePattern.exec(move)) !== null) {
            const [, dir, dist] = result;
            for (let i = 0; i < parseInt(dist); i++) {
                moveHead(dir);
                moveTail();
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

simulateRope(example);
const input = fs.readFileSync('day9-input.txt');
if (input !== null) {
    simulateRope(input.toString());
}
