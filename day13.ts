import * as fs from 'fs';

type Packet = number | Array<Packet>

function comparePackets(a: Packet, b: Packet): number {
    if (typeof a == 'number' && typeof b == 'number') {
        return a - b;
    }
    a = typeof a == 'number' ? [a] : a;
    b = typeof b == 'number' ? [b] : b;
    
    for (let i = 0; i < a.length; i++) {
        if (i >= b.length) {
            return 1;
        }
        const cmp = comparePackets(a[i], b[i]);
        if (cmp != 0) {
            return cmp;
        }
    }
    if (a.length < b.length) {
        return -1;
    }
    return 0;
}

function day13(input: string): number {
    let sum = 0;
    const pairs = input.split("\n\n");
    console.log(pairs.length);
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split("\n");
        const first = JSON.parse(pair[0]);
        const second = JSON.parse(pair[1]);
        if (comparePackets(first, second) < 0) {
            sum += i+1;
        }
    }
    console.log(sum);
    return sum;
}

const example =
    `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

const input = fs.readFileSync('day13-input.txt').toString().trim();

day13(example);
day13(input);
