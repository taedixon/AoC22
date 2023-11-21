import {Helper} from "../helper"
type pos = {x: number, y: number}
type posdist = {x: number, y: number, dist: number}
type distarray = Array<Array<number>>

const enc = new TextEncoder()
const input = Helper.getInputList("input.txt")

const p1StartPosition: pos[] = []
const p2StartPosition: pos[] = []
const targetpos: pos = {x: 0, y: 0}

const height = input.length;
const width = input[0].length;
const heights = input.map(r => enc.encode(r)).map(a => Array.from(a))

input.forEach((row, idy) => row.split("").forEach((c, idx) => {
	if (c === "S" || c === "a") {
		p2StartPosition.push({x: idx, y: idy})
		if (c === "S") {
			heights[idy][idx] = 97
			p1StartPosition.push({x: idx, y: idy})
		}
	} else if (c === "E") {
		targetpos.x = idx
		targetpos.y = idy
		heights[idy][idx] = 122
	}
}))

const visitable = (coord: pos, cur_height: number) => 
	   coord.x >= 0 && coord.x < width 
	&& coord.y >= 0 && coord.y < height 
	&& (cur_height+1) >= heights[coord.y][coord.x]
	
const set_dist = (distances: distarray, pd: posdist) => {
	distances[pd.y][pd.x] = pd.dist
}
const shorter_trip = (distances: distarray, coord: posdist) => {
	var c = distances[coord.y][coord.x]
	return (c === -1) || c > coord.dist
}

const solve = (start: pos) => {
	let dist = heights.map(r => r.map(_ => -1))
	const to_check: posdist[] = [{x: start.x, y: start.y, dist: 0}]
	set_dist(dist, to_check[0])

	const process_point = (coord: posdist) => {
		const cur_height = heights[coord.y][coord.x]
		coord.dist += 1
		const nextones: posdist[] = (Helper.orthogonal(coord) as posdist[])
		.map(c => {c.dist = coord.dist; return c})
		.filter(c => visitable(c, cur_height))
		.filter(c => shorter_trip(dist, c))
		nextones.forEach(i => {set_dist(dist, i); to_check.push(i)})
	}

	while (to_check.length > 0) {
		const next = to_check.shift()!
		process_point(next)
	}
	return dist[targetpos.y][targetpos.x]
}

console.log(p1StartPosition.map(solve)[0])
console.log(Helper.smallest(p2StartPosition.map(solve).filter(v => v > 0)))