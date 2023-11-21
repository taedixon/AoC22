import {Helper} from "../helper"
type element = Array<element>|number
const input = Helper.unflatten(Helper.getInputList("input.txt")
.filter(l => l.trim() != "").map(l => JSON.parse(l)), 2)

const compareList = (left: element, right: element): number => {
	if (!Array.isArray(left) && !Array.isArray(right)) {
		return Helper.clamp(right - left, -1, 1)
	}
	const [lefta, righta] = [left, right].map(each => Array.isArray(each) ? each : [each])
	for (let i = 0; i < lefta.length; i++) {
		if (i >= righta.length) {
			return -1
		}
		const comp = compareList(lefta[i], righta[i])
		if (comp != 0) {
			return comp
		}
	}
	return lefta.length < righta.length ? 1 : 0
}

const answ1 = input.map(pair => {
	const [left, right] = pair
	return compareList(left, right)
})

console.log(Helper.sum(answ1.map((v, idx) => v > 0 ? idx+1 : 0)))

const answ2 = [...input.flat(), [[2]], [[6]]]
.sort(compareList)
.reverse()
.map(i => JSON.stringify(i))

console.log((answ2.indexOf("[[6]]")+1) * (answ2.indexOf("[[2]]")+1))
