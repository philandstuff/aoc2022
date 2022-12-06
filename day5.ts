import fs from 'fs';
import readline from 'readline';

const pattern = /move (\d+) from (\d+) to (\d+)/;

let stacks: string[][] = [
    [],
    'B Z T'.split(' '),
    'V H T D N'.split(' '),
    'B F M D'.split(' '),
    'T J G W V Q L'.split(' '),
    'W D G P V F Q M'.split(' '),
    'V Z Q G H F S'.split(' '),
    'Z S N R L T C W'.split(' '),
    'Z H W D J N R M'.split(' '),
    'M Q L F D S'.split(' '),
]

async function processLineByLine(in_filename: string) {
    var score: number = 0;
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream(in_filename),
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            const result = line.match(pattern);
            // console.log(result);
            if (result !== null) {
                const [, num, from, to] = result;
                for (let i = 0; i < parseInt(num); i++) {
                    const block = stacks[parseInt(from)].pop();
                    stacks[parseInt(to)].push(block!);
                }
            }
        }
        stacks.shift(); // remove dummy stack 0
        console.log(stacks);
    } catch (err) {
        console.error(err);
    }
};

processLineByLine('day5-input.txt');
