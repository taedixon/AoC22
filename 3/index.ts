import * as fs from "fs"
import {Helper} from "../helper"

const encoder = new TextEncoder();

const ascii2priority = (item: number) => item > 97 ? item - 96 : item - 64 + 26

const input = Helper.getInputList("input.txt")

const answ1 = input.map(sac => {
	var lhs = encoder.encode(sac.substring(0, sac.length/2))
	var rhs = encoder.encode(sac.substring(sac.length/2))
	for (let i = 0; i < lhs.length; i++) {
		var item = lhs[i]
		if (rhs.includes(item)) {
			return ascii2priority(item)
		}
	}
	return 0;
})
.reduce((accum, cur) => accum + cur, 0)

console.log(answ1);

const answ2 = Helper.unflatten(input.map(sac => encoder.encode(sac)), 3)
.map(triplet => {
	var first = triplet[0]
	for (let i = 0; i < first.length; i++) {
		const item = first[i];
		if (triplet[1].includes(item) && triplet[2].includes(item)) {
			return ascii2priority(item)
		}
	}
	return 0;
})
.reduce((accum, cur) => accum + cur, 0)

console.log(answ2);
