import {Helper, Point} from "../helper"
type MapRow = {start: number, len: number, data: string[]}
type Turn = "L"|"R"
type Dir = "L"|"R"|"U"|"D"
const rotate = {L:{L:"D",R:"U"},U:{L:"L",R:"R"},R:{L:"U",R:"D"},D:{L:"R",R:"L"}}
const start = Date.now()

const map: MapRow[] = []
const turtle = {x: 0, y: 0, facing: "R" as Dir}
const input = Helper.getInputList(process.argv[2])

for (const l of input) {
	if (l === "") break;
	map.push({
		start: l.match(/^ */)![0].length,
		len: l.length,
		data: l.match(/[#_]/g)!
	})
}
turtle.x = map[0].start
const seq: Array<"."|Turn> = input[input.length-1].match(/\d+|\w/g)!.flatMap(i => {
	let n = +i
	if (!isNaN(n)) {
		return new Array(n).fill(".")
	} else {
		return i as Turn
	}
})

const diroffset = {L: {x: -1, y: 0}, U: {x: 0, y: -1}, R: {x: 1, y: 0}, D: {x: 0, y: 1}}

const trywarp = (p: Point, d: Dir) => {
	const next = {x: p.x, y: p.y}
	if (next.y < 0) next.y = map.length-1
	else if (next.y >= map.length) next.y = 0
	const row = map[next.y]
	const oob = (next.x < row.start) || (next.x >= row.len)
	if (oob) {
		switch (d) {
			case "L":
				next.x = row.len - 1
				break;
			case "R":
				next.x = row.start
				break;
			case "U":
				for (let y = map.length-1; y>0; y--) {
					if (next.x >= map[y].start && next.x < (map[y].len)) {
						next.y = y; break;
					}
				}
				break;
			case "D":
				for (let y = 0; y < map.length; y++) {
					if (next.x >= map[y].start && next.x < (map[y].len)) {
						next.y = y; break;
					}
				}
				break;
		}
	}
	return next
}

seq.forEach(d => {
	if (d === ".") {
		const step = diroffset[turtle.facing]
		const nextpos = trywarp({x: turtle.x + step.x, y: turtle.y + step.y}, turtle.facing)
		const row = map[nextpos.y]
		if (row.data[nextpos.x-row.start] !== "#") {
			turtle.x = nextpos.x
			turtle.y = nextpos.y
			//console.log(`${turtle.x}, ${turtle.y}`)
		}
		else {
			//console.log(`${JSON.stringify(nextpos)} : ${JSON.stringify(row)}`)
		}
	} else {
		console.log(d)
		turtle.facing = rotate[turtle.facing][d] as Dir
		console.log(turtle.facing)
	}
})
const dirscore = {R: 0, D: 1, L: 2, U: 3}
const score = (turtle.y+1)*1000 + (turtle.x+1)*4 + dirscore[turtle.facing]
console.log(JSON.stringify(turtle))
console.log(score)

console.log((Date.now() - start) / 1000)