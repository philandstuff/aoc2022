import fs from 'fs';
import readline from 'readline';
import { Transform } from 'node:stream';

const input_filename = "day3-input.txt";

const isLower = /\p{Ll}/u;
const isUpper = /\p{Lu}/u;

const charCodea = 'a'.charCodeAt(0);
const charCodeA = 'A'.charCodeAt(0);

function priority(ch: string): number {
    const ord = ch.charCodeAt(0);
    if (isLower.test(ch)) {
        return ord - charCodea + 1;
    }
    return ord - charCodeA + 27;
}

async function* inThrees(iterable: readline.Interface): AsyncGenerator<string[]> {
    let buf: string[] = [];
    for await (const item of iterable) {
        buf.push(item);
        if (buf.length == 3) {
            yield buf;
            buf = [];
        }
    }
}

async function processLineByLine(in_filename: string) {
    var score: number = 0;
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream(in_filename),
            crlfDelay: Infinity
        });

        loop1:
        for await (const threelines of inThrees(rl)) {
            const [line1, line2, line3] = threelines;
            for (let ch of line1) {
                if (line2.includes(ch) && line3.includes(ch)) {
                    score+=(priority(ch));
                    continue loop1;
                }
            }
        }
        // for await (const line of rl) {
        //     const len = line.length;
        //     const first = line.substring(0, len / 2);
        //     const second = line.substring(len / 2, len);
        //     var char = 'a';
        //     for (let i of first) {
        //         if (second.includes(i)) {
        //             char = i;
        //         }
        //     }
        //     // console.log('char %s has priority %d', char, priority(char));
        //     score += priority(char);
        // }
        console.log('total: %d', score);

    } catch (err) {
        console.error(err);
    }
};

processLineByLine('day3-example.txt');
processLineByLine('day3-input.txt');
