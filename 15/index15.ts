import {Helper, Point, Range} from "../helper"
type Sensor = {sen: Point, bea: Point, dist: number}
const manhattan = (p1: Point, p2: Point) => Math.abs(p1.x-p2.x) + Math.abs(p1.y-p2.y)

// parse input
const sensors: Sensor[] = Helper.getInputList("input.txt")
.map(line => line.match(/-?\d+/g)!.map(str => +str))
.map(data => ({sen: {x: data[0], y: data[1]}, bea: {x: data[2], y: data[3]}}))
.map(data => ({sen: data.sen, bea: data.bea, dist: manhattan(data.sen, data.bea)}))

const beacons = new Set(sensors.map(s => `${s.bea.x}:${s.bea.y}`))

const get_coverage_single = (y: number, s: Sensor) => {
	const dx = s.dist - Math.abs(y-s.sen.y)
	return dx >= 0 ? {min: s.sen.x-dx, max: s.sen.x+dx} : -1
}
const overlap = (r1: Range, r2: Range) => 
	((r1.max >= r2.min-1) && (r1.min <= r2.min)) 
	|| ((r2.max >= r1.min-1) && (r2.min <= r1.min))

const joinrange = (r1: Range, r2: Range) => 
	({min: Math.min(r1.min, r2.min), max: Math.max(r2.max, r1.max)})

const join_coverage = (ranges: Range[]): Range[] => {
	const reduced = ranges.reduce((accum, cur) => {
		if (accum.length > 0 && accum.map(r => overlap(r, cur)).reduce((a, b) => a||b)) {
			return accum.map(r => overlap(r, cur) ? joinrange(r, cur) : r)
		} else {
			return [...accum, cur]
		}
	}, [] as Range[])
	return reduced.length == ranges.length ? ranges : join_coverage(reduced)
}

const get_coverage = (y: number) => join_coverage(
	sensors.map(s => get_coverage_single(y, s))
	.filter((i): i is Range => i != -1))











// answ1
const yline = 2000000
console.log(Helper.sum(get_coverage(yline)
.map(range => Helper.range(range.max-range.min+1, range.min)
	.filter(xpos => !beacons.has(`${xpos}:${yline}`)).length)
))

// answ2
const search = 4000000
for (let y = 0; y <= search; y++) {
	const ranges = get_coverage(y).filter(r => r.max > 0 || r.min <= search)
	if (ranges.length == 2) {
		console.log((search*Math.min(ranges[0].max, ranges[1].max)+1) + y)
		break;
	}
}

