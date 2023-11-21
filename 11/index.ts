import {Helper} from "../helper"
type Monkey = {items: number[], op: (v: number) => number, test: (v: number) => number, inspections: number }

const input = Helper.getInputList("input.txt")
.filter(l => !(l.startsWith("Monk") || l === ""))
.map(l => l.substring(l.indexOf(":")+1))

const monkeys = Helper.unflatten(input, 5)
.map(data => ({
	items: JSON.parse(`[${data[0]}]`),
	op: (old: number) => {
		let newval = 0; 
		eval(data[1].replace("new", "newval"));
		return newval},
	test: (cur: number) => (cur % +(data[2].match(/\d+/)![0])) == 0  
			? +(data[3].match(/\d+/)![0])
			: +(data[4].match(/\d+/)![0]),
	inspections: 0,
})) as Monkey[];

const inspect = (m: Monkey, item: number) => {
	item = Math.floor(m.op(item))
	item = item % 9699690
	monkeys[m.test(item)].items.push(item)
	m.inspections++;
}

for (let i = 0; i < 10000; i++) {
	monkeys.forEach(m => {
		while (m.items.length > 0) {
			inspect(m, m.items.shift()!)
		}
	})
}
const counts = monkeys.map(m => m.inspections).sort((a, b) => b - a)
console.log(counts[0] * counts[1])

/*
	{
		items: [66, 71],
		op: (old: number) => old + 4,
		test: (val: number) => (val % 3) == 0 ? 0 : 3,
		inspections: 0,
	},
	{
		items: [76, 55, 80, 55, 55, 96, 78],
		op: (old: number) => old + 2,
		test: (val: number) => (val % 5) == 0 ? 7 : 4,
		inspections: 0,
	},
	{
		items: [93, 69, 76, 66, 89, 54, 59, 94],
		op: (old: number) => old + 7,
		test: (val: number) => (val % 7) == 0 ? 5 : 2,
		inspections: 0,
	},
	{
		items: [80, 54, 58, 75, 99],
		op: (old: number) => old * 17,
		test: (val: number) => (val % 11) == 0 ? 1 : 6,
		inspections: 0,
	},
	{
		items: [69, 70, 85, 83],
		op: (old: number) => old + 8,
		test: (val: number) => (val % 19) == 0 ? 2 : 7,
		inspections: 0,
	},
	{
		items: [89],
		op: (old: number) => old + 6,
		test: (val: number) => (val % 2) == 0 ? 0 : 1,
		inspections: 0,
	},
	{
		items: [62, 80, 58, 57, 93, 56],
		op: (old: number) => old * old,
		test: (val: number) => (val % 13) == 0 ? 6 : 4,
		inspections: 0,
	}
]
/*
const inspect = (m: typeof monkeys[0], item: number) => {
	item = Math.floor(m.op(item) / 3)
	monkeys[m.test(item)].items.push(item)
	m.inspections++;
}

for (let i = 0; i < 20; i++) {
	monkeys.forEach(m => {
		while (m.items.length > 0) {
			inspect(m, m.items.shift()!)
		}
	})
}
const counts = monkeys.map(m => m.inspections).sort((a, b) => b - a)
console.log(counts[0] * counts[1])
*/
/*
const inspect = (m: typeof monkeys[0], item: number) => {
	item = Math.floor(m.op(item))
	item = item % 9699690
	monkeys[m.test(item)].items.push(item)
	m.inspections++;
}

for (let i = 0; i < 10000; i++) {
	monkeys.forEach(m => {
		while (m.items.length > 0) {
			inspect(m, m.items.shift()!)
		}
	})
}
const counts = monkeys.map(m => m.inspections).sort((a, b) => b - a)
console.log(counts[0] * counts[1])
*/