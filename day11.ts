class Monkey {
    items: bigint[]
    operation: (n: bigint) => bigint
    testMod: bigint
    ifTrue: number
    ifFalse: number
    handled: number

    constructor(items: bigint[], operation: (n: bigint) => bigint, testMod: bigint, ifTrue: number, ifFalse: number) {
        this.items = items;
        this.operation = operation;
        this.testMod = testMod;
        this.ifTrue = ifTrue;
        this.ifFalse = ifFalse;
        this.handled = 0;
    }

    test(n: bigint) {
        return n % this.testMod == 0n;
    }
}

class Day11 {
    monkeys: Monkey[]
    worryMod: bigint

    constructor(monkeys: Monkey[]) {
        this.monkeys = monkeys;
        this.worryMod = monkeys.map(m => m.testMod).reduce((a,b) => a*b);
    }

    tick() {
        for (const monkey of this.monkeys) {
            for (const item of monkey.items) {
                let worry = monkey.operation(item);
                worry = worry % this.worryMod;
                monkey.handled++;
                const index = monkey.test(worry) ? monkey.ifTrue : monkey.ifFalse;
                this.monkeys[index].items.push(worry);
            }
            monkey.items = [];
        }
    }

    monkeyBusiness(): number {
        let inspected = this.monkeys.map(m => m.handled);
        inspected.sort((a, b) => b - a); // sort descending
        return inspected[0] * inspected[1];
    }
}

const example1 = new Day11([
    new Monkey([79n, 98n], n => n * 19n,  23n, 2, 3),
    new Monkey([54n, 65n, 75n, 74n], n => n + 6n, 19n, 2, 0),
    new Monkey([79n, 60n, 97n], n => n * n,  13n, 1, 3),
    new Monkey([74n], n => n + 3n,  17n, 0, 1),

])

for (let i = 0; i < 10000; i++) {
    example1.tick();
}
console.log(example1.monkeyBusiness());

const input = new Day11([
    new Monkey([98, 89, 52].map(BigInt), n => n * 2n,  5n , 6, 1),
    new Monkey([57, 95, 80, 92, 57, 78].map(BigInt), n => n * 13n,  2n, 2, 6),
    new Monkey([82, 74, 97, 75, 51, 92, 83].map(BigInt), n => n + 5n,  19n, 7, 5),
    new Monkey([97, 88, 51, 68, 76].map(BigInt), n => n + 6n,  7n, 0, 4),
    new Monkey([63].map(BigInt), n => n + 1n,  17n, 0, 1),
    new Monkey([94, 91, 51, 63].map(BigInt), n => n + 4n,  13n, 4, 3),
    new Monkey([61, 54, 94, 71, 74, 68, 98, 83].map(BigInt), n => n + 2n,  3n, 2, 7),
    new Monkey([90, 56].map(BigInt), n => n * n,  11n, 3, 5),
])

for (let i = 0; i < 10000; i++) {
    input.tick();
}
console.log(input.monkeyBusiness());
