import fs from 'fs';
import readline from 'readline';
import { Transform } from 'node:stream';

function countVisibleTrees(field: string) {
    let treeHeights: number[][] = [];
    let treeScores: number[][] = [];

    for (let row of field.split('\n')) {
        let rowHeights: number[] = [];
        treeHeights.push(rowHeights);
        let visible: number[] = [];
        treeScores.push(visible);
        for (let tree of row) {
            rowHeights.push(parseInt(tree));
            visible.push(0);
        }
    }

    const width = treeHeights[0].length;
    const depth = treeHeights.length;

    for (let x = 0; x < depth; x++) {
        for (let y = 0; y < width; y++) {
            let scores: number[] = [];
            let score = 0, heightLimit = treeHeights[x][y];

            for (let i = x-1; i >= 0; i--) {
                score++;
                if (treeHeights[i][y] >= heightLimit) {
                    break;
                }
            }
            scores.push(score);

            score = 0;
            for (let i = x+1; i <= depth-1; i++) {
                score++;
                if (treeHeights[i][y] >= heightLimit) {
                    break;
                }
            }
            scores.push(score);

            score = 0;
            for (let j = y-1; j >= 0; j--) {
                score++;
                if (treeHeights[x][j] >= heightLimit) {
                    break;
                }
            }
            scores.push(score);

            score = 0;
            for (let j = y+1; j <= width-1; j++) {
                score++;
                if (treeHeights[x][j] >= heightLimit) {
                    break;
                }
            }
            scores.push(score);

            const totalScore = scores.reduce((a,b) => a*b);
            treeScores[x][y]=totalScore;
            // console.log(x,y,scores,totalScore);
        }
    }


    // console.log(treeHeights);
    // console.log(treeScores);

    console.log(treeScores.flat().reduce((a, b) => a > b ? a : b));
}

const example = `30373
25512
65332
33549
35390`;

countVisibleTrees(example);
const input = fs.readFileSync('day8-input.txt');
if (input !== null) {
    countVisibleTrees(input.toString());
}
