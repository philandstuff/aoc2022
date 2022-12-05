import events from 'events';
import fs from 'fs';
import readline from 'readline';

const input_filename = "day1a-input.txt";

(async function processLineByLine() {
    var max: number = 0;
    var current: number = 0;
    var elfs: number[] = [];
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream(input_filename),
            crlfDelay: Infinity
        });


        for await (const line of rl) {
            if (line.trim() == '') {
                if (current > max) {
                    max = current;
                    console.log('biggest so far: %d', max);
                }
                elfs.push(current);
                current = 0;
            } else {
                current += parseInt(line.trim());
            }
        }
        elfs.sort((a,b) => b-a); // sort descending
        console.log('biggest calories: %d', max);
        console.log('top three: %d %d %d', elfs[0],elfs[1],elfs[2]);
        console.log('total of top three: %d', elfs[0]+elfs[1]+elfs[2]);

        console.log('Reading file line by line with readline done.');
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
    } catch (err) {
        console.error(err);
    }
})();
