import fs from 'fs';
import readline from 'readline';
import { Transform } from 'node:stream';

const pattern = /(\d+)-(\d+),(\d+)-(\d+)/;

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
                const [, als, ars, bls, brs] = result;
                const al = parseInt(als);
                const ar = parseInt(ars);
                const bl = parseInt(bls);
                const br = parseInt(brs);
                // console.log([al, ar, bl, br]);
                if (al <= bl && ar >= bl) {
                    score++;
                } else if (bl <= al && br >= al) {
                    score++;
                }
            }
        }
        console.log('total: %d', score);

    } catch (err) {
        console.error(err);
    }
};

processLineByLine('day4-example.txt');
processLineByLine('day4-input.txt');
