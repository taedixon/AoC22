import {Helper} from "../helper"
type Valve = {id: string, rate: number, connects: Valve[]}
type ValveDist = {from: Valve, to: {valve: Valve, dist: number}[]}
// parse input
const nodes: Valve[] = Helper.getInputList("input.txt")
.map(line => {
	const [, idstr, , , ratestr, , , , , ...connection] = line.split(" ")
	return {
		id: idstr,
		rate: +(ratestr.match(/\d+/)![0]),
		connects: connection.map(str => str.replace(",", "")) as unknown as Valve[]
	}
})
nodes.forEach(n => n.connects = (n.connects as unknown as string[])
	.map(str => nodes.find(other => other.id == str)! as unknown as Valve))

const get_dist = (cur: Valve, target: Valve, dist: number, visited: Set<string>): number => {
	if (cur.id == target.id) {
		return dist
	}
	const new_visited = new Set([...visited, cur.id])
	return Helper.smallest(cur.connects.filter(next => !visited.has(next.id))
	.map(next => get_dist(next, target, dist+1, new_visited)))
}

const explore = (current: Valve, visited: Set<string>, time: number, pressure: number): number => {
	const options = nodedist.find(nd => nd.from.id == current.id)!.to
		.filter(target => !visited.has(target.valve.id))
		.filter(target => target.dist < time)
	if (options.length == 0) {
		return pressure
	} else {
		return Helper.largest(options.map(o => explore(
			o.valve, 
			new Set([...visited, o.valve.id]),
			time-o.dist,
			pressure + (time-o.dist)*o.valve.rate)))
	}
}

let curnode = nodes.find(n => n.id == "AA")!
let notable = nodes.filter(n => n.rate > 0)
let nodedist: ValveDist[] = [curnode, ...notable]
.map(n => ({
	from: n, 
	to: notable.filter(other => other != n)
		.map(c => ({valve: c, dist: get_dist(n, c, 1, new Set())}))
	}))


let pressure = explore(curnode, new Set(), 30, 0);
console.log(pressure)