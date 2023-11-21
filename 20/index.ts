import {Helper} from "../helper"

const start = Date.now()

const input = Helper.getInputList(process.argv[2]).map(n => (+n))
.map((n, i) =>({value: n, idx: i}))
const len = input.length

const input2 = input.map(i => Object.assign({}, i))
input2.forEach(i => i.value *= 811589153)

const wrap = (n: number) => {
	if (n >= len) {return n % len}
	else { while (n < 0) n += len; return n	}
}
const mix = (list: typeof input) => list.forEach(next => {
	let offset = next.value % (len-1)
	let basis = next.idx
	let final = wrap(next.idx + offset)
	let step = -Math.sign(offset)
	if (final != (next.idx + offset)) {
		final -= step
		offset = final - basis
		step = -step
	}
	const update_keys = new Set(
		Helper.range(Math.abs(offset), Math.min(basis+1, final)).map(wrap))
		list.filter(v => update_keys.has(v.idx)).forEach(v => v.idx = wrap(v.idx + step))
	next.idx = final
})
const solve = (list: typeof input) => {
	const zeroidx = list.find(n => n.value == 0)!.idx
	const special = new Set([zeroidx+1000, zeroidx+2000, zeroidx+3000].map(wrap))
	console.log(Helper.sum(list.filter(v => special.has(v.idx)).map(v => v.value)))
}
mix(input)
solve(input)

Helper.range(10).forEach(() => mix(input2))
solve(input2)



console.log((Date.now() - start) / 1000)