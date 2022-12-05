import events from 'events';
import fs from 'fs';
import readline from 'readline';

const input_filename = "day2a-input.txt";

const scores: Record<string,number> = {
    'A X': 3,
    'A Y': 4,
    'A Z': 8,
    'B X': 1,
    'B Y': 5,
    'B Z': 9,
    'C X': 2,
    'C Y': 6,
    'C Z': 7,
};

(async function processLineByLine() {
    var score: number = 0;
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream(input_filename),
            crlfDelay: Infinity
        });


        for await (const line of rl) {
            if (line.trim() == '') {
                continue;
                
            }
            score += scores[line];
        }
        console.log('total: %d', score);

    } catch (err) {
        console.error(err);
    }
})();
