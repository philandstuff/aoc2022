class Monkey {
    items: number[]
    operation: (n: number) => number
    test: (n: number) => boolean
    ifTrue: number
    ifFalse: number
    handled: number

    constructor(items: number[], operation: (n: number) => number, test: (n: number) => boolean, ifTrue: number, ifFalse: number) {
        this.items = items;
        this.operation = operation;
        this.test = test;
        this.ifTrue = ifTrue;
        this.ifFalse = ifFalse;
        this.handled = 0;
    }
}

class Day11 {
    monkeys: Monkey[]

    constructor(monkeys: Monkey[]) {
        this.monkeys = monkeys;
    }

    tick() {
        for (const monkey of this.monkeys) {
            for (const item of monkey.items) {
                let worry = monkey.operation(item);
                worry = Math.floor(worry / 3);
                monkey.handled++;
                if (monkey.test(worry)) {
                    this.monkeys[monkey.ifTrue].items.push(worry);
                } else {
                    this.monkeys[monkey.ifFalse].items.push(worry);
                }
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
    new Monkey([79, 98], n => n * 19, n => n % 23 == 0, 2, 3),
    new Monkey([54, 65, 75, 74], n => n + 6, n => n % 19 == 0, 2, 0),
    new Monkey([79, 60, 97], n => n * n, n => n % 13 == 0, 1, 3),
    new Monkey([74], n => n + 3, n => n % 17 == 0, 0, 1),

])

for (let i = 0; i < 20; i++) {
    example1.tick();
}
console.log(example1.monkeys);
console.log(example1.monkeyBusiness());

const input = new Day11([
    new Monkey([98, 89, 52], n => n * 2, n => n % 5 == 0, 6, 1),
    new Monkey([57, 95, 80, 92, 57, 78], n => n * 13, n => n % 2 == 0, 2, 6),
    new Monkey([82, 74, 97, 75, 51, 92, 83], n => n + 5, n => n % 19 == 0, 7, 5),
    new Monkey([97, 88, 51, 68, 76], n => n + 6, n => n % 7 == 0, 0, 4),
    new Monkey([63], n => n + 1, n => n % 17 == 0, 0, 1),
    new Monkey([94, 91, 51, 63], n => n + 4, n => n % 13 == 0, 4, 3),
    new Monkey([61, 54, 94, 71, 74, 68, 98, 83], n => n + 2, n => n % 3 == 0, 2, 7),
    new Monkey([90, 56], n => n * n, n => n % 11 == 0, 3, 5),
])

for (let i = 0; i < 20; i++) {
    input.tick();
}
console.log(input.monkeyBusiness());
