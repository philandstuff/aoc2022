import fs from 'fs';
import readline from 'readline';
import { Transform } from 'node:stream';

const pattern = /(\d+)-(\d+),(\d+)-(\d+)/;

async function* inFours(input: string): AsyncGenerator<any> {
    let buf: string[] = [];
    let i: number = 0;

    for await (const ch of input) {
        if (buf.length < 4) {
            buf.push(ch);
            i++;
            continue;
        }
        yield [i, buf];
        buf.push(ch);
        buf.shift();
        i++;
    }
}

async function* inFourteens(input: string): AsyncGenerator<any> {
    let buf: string[] = [];
    let i: number = 0;

    for await (const ch of input) {
        if (buf.length < 14) {
            buf.push(ch);
            i++;
            continue;
        }
        yield [i, buf];
        buf.push(ch);
        buf.shift();
        i++;
    }
}

async function findStartOfMessage(data: string) {
    for await (const [i, buf] of inFourteens(data)) {
        let obj: Record<string,boolean> = {};
        for (const ch of buf) {
            obj[ch] = true;
        }
        if (Object.keys(obj).length == 14) {
            console.log([i, buf]);
            break;
        }
    }
};
async function findStartOfPacket(data: string) {
    for await (const [i, [a, b, c, d]] of inFours(data)) {
        let obj: Record<string,boolean> = {};
        obj[a] = obj[b] = obj[c] = obj[d] = true;
        if (Object.keys(obj).length == 4) {
            console.log([i, a, b, c, d]);
            break;
        }
    }
};

findStartOfMessage('bvwbjplbgvbhsrlpgdmjqwftvncz');
findStartOfMessage('nppdvjthqldpwncqszvftbrmjlhg');
findStartOfMessage('nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg');
findStartOfMessage('zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw');
const input = fs.readFileSync('day6-input.txt');
if (input !== null) {
    findStartOfMessage(input.toString());
}
