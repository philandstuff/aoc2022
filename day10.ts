import fs from 'fs';

const addxCmdRe = /addx (-?\d+)/;
const noopCmdRe = /noop/;

class Noop {
    complete(p: Processor) { }
    schedule(p: Processor) { p.pipeline.push(this); }
}

class AddX {
    operand: number

    constructor(operand: number) {
        this.operand = operand;
    }

    complete(p: Processor) {
        p.X += this.operand;
    }

    schedule(p: Processor) {
        p.pipeline.push(new Noop());
        p.pipeline.push(this);
    }
}

interface Command {
    complete: (p: Processor) => void;
    schedule: (p: Processor) => void;
}

function parseCmd(cmdstr: string): Command {
    if (noopCmdRe.test(cmdstr)) {
        return new Noop();
    }
    let result;
    if ((result = addxCmdRe.exec(cmdstr)) !== null) {
        const [, operandStr] = result;
        return new AddX(parseInt(operandStr));
    }
    throw new Error("unknown command " + cmdstr);
}

class Processor {
    cycle: number
    X: number
    pipeline: Command[]

    constructor() {
        this.cycle = 1;
        this.X = 1;
        this.pipeline = [];
    }

    tick(): void {
        this.cycle++;
        const cmd = this.pipeline.shift();
        if (cmd !== undefined) {
            cmd.complete(this);
        }
    }

    load(instructions: string) {
        for (const cmdstr of instructions.split("\n")) {
            parseCmd(cmdstr).schedule(this);
        }
    }

    renderLine() {
        let line = '';
        for (let i = 0; i < 40; i++) {
            if (Math.abs(this.X - i) <= 1) {
                line += '#';
            } else {
                line += '.';
            }
            this.tick();
        }
        console.log(line);
    }

    renderScreen() {
        for (let i = 0; i < 6; i++) {
            this.renderLine();
        }
    }

    signalStrength() { return this.cycle * this.X; }
}

function execute(instructions: string, keyCycles: number[], until: number) {
    const p = new Processor();
    p.load(instructions);

    let strengthSum = 0;

    for (let i = 0; i < until; i++) {
        p.tick();
        if (keyCycles.includes(p.cycle)) {
            console.log("%d %d %d", p.cycle, p.X, p.signalStrength());
            strengthSum += p.signalStrength();
        }
    }
    console.log(strengthSum);
}

const example1 =
    `noop
addx 3
addx -5`

const example2 = `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`

// execute(example1);
// execute(example2, [20, 60, 100, 140, 180, 220], 220);

const p = new Processor();
p.load(example2);
p.renderScreen();

const input = fs.readFileSync('day10-input.txt');
if (input !== null) {
    const p = new Processor();
    p.load(input.toString().trim());
    p.renderScreen();
    // execute(input.toString().trim(), [20, 60, 100, 140, 180, 220], 220);
}
