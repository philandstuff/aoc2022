import * as fs from 'fs';
import * as readline from 'node:readline/promises';

const FS_CAPACITY = 70000000;
const NEEDED_SPACE = 30000000;

const cd = /\$ cd (.*)/;
const ls = /\$ ls/;

const dirEntry = /dir (.*)/;
const fileEntry = /(\d+) (.*)/;

type RegularFile = {
    size: number
};

const totalSize = Symbol('totalSize');

type Directory = {
    [name: string]: File,
    [totalSize]: number,
 };

type File =
    | RegularFile
    | Directory

async function* traverseDirs(root: Directory) :AsyncGenerator<Directory> {
    for (let entry in root) {
        const file = root[entry];
        if ((<Directory>file)[totalSize] !== undefined) {
            const dir = file as Directory;
            yield dir;
            yield* traverseDirs(dir);
        }
    }
}

async function processLineByLine(in_filename: string) {
    let root: Directory = {[totalSize]: 0};
    let path: string[] = [];
    let cwd = root;
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream(in_filename),
            crlfDelay: Infinity
        });

        const iterator = rl[Symbol.asyncIterator]();

        for (let cmd = await iterator.next(); cmd.done != true; cmd = await iterator.next()) {
            let result;
            if (ls.test(cmd.value)) {
                // noop
            } else if ((result = cd.exec(cmd.value)) !== null) {
                const dir = result[1];
                switch (dir) {
                    case '/': path = []; break;
                    case '..': path.pop(); break;
                    default: path.push(dir); break;
                }
                cwd = root;
                for (let name of path) {
                    cwd = cwd[name] as Directory;
                }
            } else if ((result = dirEntry.exec(cmd.value)) !== null) {
                const dir = result[1];
                cwd[dir] = {[totalSize]: 0};
            } else if ((result = fileEntry.exec(cmd.value)) !== null) {
                const [, sizeStr, name] = result;
                const size = parseInt(sizeStr);
                cwd[name] = { size: size };
                let ccwd = root;
                root[totalSize] += size;
                for (let name of path) {
                    ccwd = ccwd[name] as Directory;
                    ccwd[totalSize] += size;
                }
            } else {
                console.log('unknown cmd: %s', cmd.value);
            }
        }
        let total = 0;
        let smallest = Infinity;
        const freeSpace = FS_CAPACITY - root[totalSize];
        console.log('current usage: %d', root[totalSize]);
        console.log('free space: %d', freeSpace);
        for await (let dir of traverseDirs(root)) {
            if (dir[totalSize] + freeSpace >= NEEDED_SPACE) {
                if (dir[totalSize] < smallest){
                    smallest = dir[totalSize];
                }
            }
        }
        console.log(smallest);
        console.log(smallest + freeSpace);
    } catch (err) {
        console.error(err);
    }
};

(async function main() {
    await processLineByLine('day7-example.txt');
    await processLineByLine('day7-input.txt');
}())
