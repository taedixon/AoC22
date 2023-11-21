import {Helper, Point} from "../helper"
import * as fs from "fs"

// parse input
const input = Helper.getInputList("input.txt")
const linedata = input.map(row => row.split(" -> ")
.map(pair => {const sep = pair.split(","); return {x: +sep[0], y: +sep[1]}}))

// build field + normalize dimensions
const all_x = linedata.flatMap(row => row.map(i => i.x)).sort((a, b) => a-b)
const xmin = all_x[0]; const xmax = all_x[all_x.length-1]
const ymax = Helper.largest(linedata.flatMap(row => row.map(i => i.y)))
const spawn = {x: 500-xmin, y: ymax}
linedata.forEach(line => line.forEach(p => p.x -= (xmin)))

let field = Array.from(new Array(ymax+1), (_) => new Array((xmax-xmin)+1).fill(0))
linedata.forEach(line => line.reduce((p1, p2) => {
	if (p1.x == p2.x) {
		let ymin = Math.min(p1.y, p2.y)
		let ymax = Math.max(p1.y, p2.y)
		for (let i = ymin; i <= ymax; i++) {
			field[i][p1.x] = 1
		}
	} else {
		let xmin = Math.min(p1.x, p2.x)
		let xmax = Math.max(p1.x, p2.x)
		for (let i = xmin; i <= xmax; i++) {
			field[p1.y][i] = 1
		}
	}
	return p2
}))
field.reverse()










// simulation part1
const cell_inbound = (x: number, y: number) => 
	x >= 0 && x < field[0].length && y >= 0

const get_cell = (x: number, y: number) => 
	cell_inbound(x, y) ? field[y][x] : 0

const set_cell = (x: number, y: number, val: number) => {
	if (cell_inbound(x, y)) { field[y][x] = val } else unstable = false }

const try_move_sand = (xfrom: number, yfrom: number, xoff: number) => {
	if (get_cell(xfrom + xoff, yfrom-1) == 0) {
		set_cell(xfrom + xoff, yfrom-1, 2)
		set_cell(xfrom, yfrom, 0)
		return true
	}
	return false
}

const simulate = (cell: number, x: number, y: number) => {
	if (cell == 2) {
		try_move_sand(x, y, 0) || try_move_sand(x, y, -1) 
			|| try_move_sand(x, y, 1) || (field[y][x] = 3)
		return field[y][x]
	}
	return cell
}

let unstable = true
while (unstable) {
	field[spawn.y][spawn.x] = 2
	field.forEach((row, idy) => row.forEach((cell, idx) => simulate(cell, idx, idy)))
}
console.log(Helper.sum(field.flatMap(row => row.map(i => i == 3 ? 1 : 0))))









// print a picture :)
const symbol = [".", "#", "~", "o"]
fs.writeFileSync("field.txt", field.map(row => row.map(v => `${symbol[v]}`).join("")).join("\n"))


// part2
const sand2 = new Set<string>()
let sand2new: Array<Point> = [spawn]
const will_have_sand = (p: Point, xoff: number) => {
	return p.y > -1 && (get_cell(p.x + xoff, p.y-1) != 1)
}
while (sand2new.length > 0) {
	const cur = sand2new.shift()!
	const str = `${cur.x}:${cur.y}`
	if (!sand2.has(str)) {
		sand2.add(str)
		sand2new = [
			...sand2new, 
			...[-1, 0, 1].filter(xoff => will_have_sand(cur, xoff))
				.map(xoff => ({x: cur.x + xoff, y: cur.y-1}))
		]
	}
}
console.log(sand2.size)