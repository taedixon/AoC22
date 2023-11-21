import {Helper} from "../helper"
type Monkey = {name: string, others: Monkey[], op: string|number, args: string[]}
const start = Date.now()

const input: Monkey[] = Helper.getInputList(process.argv[2])
.map(line => {
	const parts = line.split(": ")
	if (parts[1].match(/\d/)) {
		return {name: parts[0], others: [], op: +parts[1], args: [parts[1]]}
	} else {
		return {name: parts[0], others: [], op: parts[1].split(" ")[1], args: parts[1].split(" ")}
	}
})

const mapping = new Map<string, Monkey>()
input.forEach(m => mapping.set(m.name, m))
input.forEach(m => {
	if (m.args.length > 1) {
		m.others = [mapping.get(m.args[0])!, mapping.get(m.args[2])!]
	}
})

const calc = (m: Monkey, solver: (m: Monkey) => number|string) => {
	const [sm1, sm2] = [solver(m.others[0]), solver(m.others[1])]
	if (typeof(sm1) == "string" || typeof(sm2) == "string") {
		return `(${sm1})${m.op}(${sm2})`
	} else {
		switch (m.op) {
			case "+": return sm1+sm2
			case "-": return sm1-sm2
			case "*": return sm1*sm2
			case "/": return sm1/sm2
		}
		return 0
	}
}

const solve1 = (m: Monkey): number|string => typeof(m.op) == "number" ? m.op : calc(m, solve1)

const solve2 = (m: Monkey): number|string => {
	if (m.name == "humn") {
		return "humn"
	} else {
		return typeof(m.op) == "number" ? m.op : calc(m, solve2)
	}
}

const root = mapping.get("root")!
console.log(solve1(root))

console.log(`${solve2(root.others[0])} = ${solve2(root.others[1])}`)

console.log((Date.now() - start) / 1000)