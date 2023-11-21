import {Helper} from "../helper"

const input = Helper.getInputList("input.txt")[0]
for (const packlen of [4, 14]) {
	const marker = []
	let i = 0;
	for (i = 0; i < input.length; i++) {
		marker.push(input[i])
		if (marker.length > packlen) {
			marker.shift()
		}
		if (new Set(marker).size == packlen) {
			break;
		}
	}
	console.log(i+1);
}
