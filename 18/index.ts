import {Helper, Point3} from "../helper"

const start = Date.now()

const points = Helper.getInputList("input.txt")
.map(line => {
	const [x, y, z] = line.split(",")
	return {x: +x, y: +y, z: +z}
})
const bounds = {
	x: Helper.get_range(points.map(p => p.x)),
	y: Helper.get_range(points.map(p => p.y)),
	z: Helper.get_range(points.map(p => p.z))
}

const inbound = (p: Point3) => (p.x >= (bounds.x.min-1) && p.x <= (bounds.x.max+1))
	&& (p.y >= (bounds.y.min-1) && p.y <= (bounds.y.max+1))
	&& (p.z >= (bounds.z.min-1) && p.z <= (bounds.z.max+1))

const serial = (p: Point3) => `${p.x}:${p.y}:${p.z}`

let pointset = new Set<string>(points.map(serial))
const sides_simple = Helper.sum(points.map(p => 
	6 - Helper.orthogonal3(p).map(serial).filter(s => pointset.has(s)).length))
console.log(sides_simple)

let sides_true = 0
let floodnext = [{x: bounds.x.min-1, y: bounds.y.min-1, z: bounds.z.min-1}]
let flood = new Set<string>(serial(floodnext[0]))
while (floodnext.length > 0 ) {
	const cur = floodnext.shift()!
	const next = Helper.orthogonal3(cur).filter(p => inbound(p) && !flood.has(serial(p)))
	const next_air = next.filter(p => !pointset.has(serial(p)))
	next_air.map(serial).forEach(s => flood.add(s))
	sides_true += next.length - next_air.length
	floodnext = [...floodnext, ...next_air]
}
console.log(sides_true)
console.log((Date.now() - start) / 1000)