import * as fs from "fs";

const winvals = {
	"A": { "Y": 8, "X": 4, "Z": 3},
	"B": { "Z": 9, "Y": 5, "X": 1},
	"C": { "X": 7, "Z": 6, "Y": 2},
}
const input = fs.readFileSync("input.txt").toString().split("\n")
console.log(input.map(str => {
	const myhand = str.charAt(2) as "X" || "Y" || "Z"
	const theirhand = str.charAt(0) as "A" || "B" || "C" 
	return winvals[theirhand][myhand]
})
.reduce((accum, cur) => accum + cur, 0))

const scorevals = {
	"X": { "A": 3, "B": 1, "C": 2},
	"Y": { "A": 4, "B": 5, "C": 6},
	"Z": { "A": 8, "B": 9, "C": 7}
}
console.log(input.map(str => {
	const theirhand = str.charAt(0) as "A" || "B" || "C"
	const winlosedraw = str.charAt(2) as "X" || "Y" || "Z"
	return scorevals[winlosedraw][theirhand]
})
.reduce((accum, cur) => accum + cur, 0));