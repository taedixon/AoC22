import {Helper} from "../helper"

const parserange = (str: String) => {
	const [lhs, rhs] = str.split("-")
	return {min: +lhs, max: +rhs}
}
const input = Helper.getInputList("input.txt")
const answ1 = input.map(str => {
	const [elf1, elf2] = str.split(",").map(parserange)
	return (elf1.min <= elf2.min && elf1.max >= elf2.max) ||
		(elf2.min <= elf1.min && elf2.max >= elf1.max)
})
.reduce((accum, tf) => accum + (tf ? 1 : 0), 0)
console.log(answ1)

const answ2 = input.map(str => {
	const [elf1, elf2] = str.split(",").map(parserange)
	return !((elf1.min < elf2.min && elf1.max < elf2.min) ||
		(elf2.min < elf1.min && elf2.max < elf1.min))
})
.reduce((accum, tf) => accum + (tf ? 1 : 0), 0)
console.log(answ2)