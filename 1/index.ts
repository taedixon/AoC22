import * as fs from "fs"

const input = fs.readFileSync("input.txt").toString()
.split("\n")
.reduce((accum, cur) => {
	if (cur != "") {
		accum[accum.length-1].push(+cur)
	} else {
		accum.push([])
	}
	return accum
}, [[]] as Array<Array<number>>)
.map(e => e.reduce((accum, cur) => accum + cur, 0))
.sort((a, b) => b-a)

console.log(input[0])
console.log(input[0] + input[1] + input[2])