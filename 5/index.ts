import {Helper} from "../helper"

const stacks = [[],[],[],[],[],[],[],[],[]] as Array<Array<String>>

const input = Helper.getInputList("input.txt")

while (true) {
	const thisline = input.shift()!
	if (thisline.charAt(1) === "1") {
		input.shift()
		break;
	}
	for (let idx = 1; idx < thisline.length; idx += 4) {
		const c = thisline.charAt(idx);
		if (c !== " ") {
			stacks[(idx-1)/4].unshift(c)
		}
	}
}
const stacks2 = JSON.parse(JSON.stringify(stacks)) as Array<Array<String>>
const commands = input.map(line => line.match(/\d+/g)!.map(raw => +raw))

commands.forEach(command => {
	let [count, from, to] = command!
	let bighand = [] as String[]
	while (count > 0) {
		stacks[to-1].push(stacks[from-1].pop()!)
		bighand.unshift(stacks2[from-1].pop()!)
		count -= 1
	}
	stacks2[to-1].push(...bighand)
})

console.log(stacks.map(stack => stack[stack.length-1]).join(""))
console.log(stacks2.map(stack => stack[stack.length-1]).join(""))
