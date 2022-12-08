import fs from 'fs';
import readline from 'readline';
import { Transform } from 'node:stream';

function countVisibleTrees(field: string) {
    let treeHeights: number[][] = [];
    let treeVisible: number[][] = [];

    for (let row of field.split('\n')) {
        let rowHeights: number[] = [];
        treeHeights.push(rowHeights);
        let visible: number[] = [];
        treeVisible.push(visible);
        for (let tree of row) {
            rowHeights.push(parseInt(tree));
            visible.push(0);
        }
    }

    const width = treeHeights[0].length;
    const depth = treeHeights.length;

    // visible from left/right
    for (let i = 0; i < depth; i++) {
        let highestSeen = -1;
        for (let j = 0; j < width; j++) {
            const tree = treeHeights[i][j];
            if (tree > highestSeen) {
                treeVisible[i][j] = 1;
                highestSeen = tree;
            }
        }
        highestSeen = -1;
        for (let j = width - 1; j >= 0; j--) {
            const tree = treeHeights[i][j];
            if (tree > highestSeen) {
                treeVisible[i][j] = 1;
                highestSeen = tree;
            }
        }
    }
    // visible from top/bottom
    for (let j = 0; j < width; j++) {
        let highestSeen = -1;
        for (let i = 0; i < depth; i++) {
            const tree = treeHeights[i][j];
            if (tree > highestSeen) {
                treeVisible[i][j] = 1;
                highestSeen = tree;
            }
        }
        highestSeen = -1;
        for (let i = depth - 1; i >= 0; i--) {
            const tree = treeHeights[i][j];
            if (tree > highestSeen) {
                treeVisible[i][j] = 1;
                highestSeen = tree;
            }
        }
    }
    // console.log(treeHeights);
    // console.log(treeVisible);

    console.log(treeVisible.flat().reduce((a,b) => a+b));
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
