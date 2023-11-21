import {Helper} from "../helper"

type GrabBag = {cur: number, visible: Array<string>, rowidx: number }

const input = Helper.getInputList("input.txt")
.map(l => l.split("").map(n => +n))
const input_flip = Helper.transpose(input)

/**** Part 1 ****/

const reducer = (accum: GrabBag, val: number, idx: number) => {
	if (val > accum.cur) {
		accum.cur = val;
		accum.visible.push(`${idx}:${accum.rowidx}`)
	}
	return accum;
}
const mapper = (row: Array<number>, idy: number) => {
	return row.reduce(reducer, {cur: -1, visible: [], rowidx: idy}).visible
		.concat(row.reduceRight(reducer, {cur: -1, visible: [], rowidx: idy}).visible)
}

const flipper = (item: string) => {
	const digits = item.split(":")
	return `${digits[1]}:${digits[0]}`
}

const visible = input.flatMap(mapper)
.concat(input_flip.flatMap(mapper).map(flipper))

console.log(new Set(visible).size)


/**** Part 2 ****/
type GrabBag2 = {max: number, count: number, blocked: boolean}
const reducer2 = (accum: GrabBag2, val: number) => {
	if (!accum.blocked) {
		accum.blocked = val >= accum.max
		accum.count++;
	}
	return accum;
}
const getScenic = (height: number, idx: number, arr: Array<number>) => {
	const accum1 = {max: height, count: 0, blocked: false}
	const accum2 = {max: height, count: 0, blocked: false}
	return arr.slice(0, idx).reduceRight(reducer2, accum1).count
		* arr.slice(idx+1).reduce(reducer2, accum2).count
}

const hScenic = input.map(arr => arr.map(getScenic))
const vScenic = Helper.transpose(input_flip.map(arr => arr.map(getScenic)))

const best = hScenic.flatMap((row, y) => row.map((val, x) => val * vScenic[y][x]))
console.log(Helper.largest(best))

/** Part 1 better */
const or = (a: number, b: number) => a|b

function markVisible1(cur: number) {
	if (cur > this.tallest) {
		this.tallest = cur;
		return 1
	}
	return 0;
}
const handlerow_1 = (row: Array<number>) => {
	return Helper.arrayMerge(
		row.map(markVisible1, {tallest: -1}),
		row.slice(0).reverse().map(markVisible1, {tallest: -1}).reverse(), 
		or)
}
const seenFromOutside = Helper.arrayMerge(
	input.flatMap(handlerow_1),
	Helper.transpose(input_flip.map(handlerow_1)).flat(),
	or
)
console.log(Helper.sum(seenFromOutside))