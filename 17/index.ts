import {Helper, Point} from "../helper"

type Rock = Point & {points: Point[], height: number, width: number}
const start = Date.now()

const sequence = Helper.unflatten(Helper.getInputList("pieces.txt")
.map(line => line.split("")), 4)
.map(group => {
	const shape: Rock = {
		x: 0,
		y: 0,
		points: [] as Point[],
		height: 0,
		width: 0,
	}
	group.forEach((line, idy) => line.forEach(
		(char, idx) => {if (char === "#") shape.points.push({x: idx, y: 3-idy})}))
	shape.height = 1 + Helper.largest(shape.points.map(p => p.y))
	shape.width = 1  + Helper.largest(shape.points.map(p => p.x))
	return shape;
})
const input = Helper.getInputList("input.txt")[0].split("")

const overlaps = (rock: Rock, at_rest: Set<string>) => rock.points
.map(p => at_rest.has(`${p.x + rock.x}:${p.y + rock.y}`))
.reduce((a, c) => a||c)

let seqpos = 0
const spawn_rock = (highest: number) => {
	const rock = JSON.parse(JSON.stringify(sequence[seqpos])) as Rock
	seqpos = (seqpos +1) % sequence.length
	rock.x = 2
	rock.y = highest + 3
	return rock
}
const serialize_board = (at_rest: Set<string>, inputpos: number, lowest: number, highest: number) => {
	let blocks: string[] = []
	for (let y = lowest; y <= highest; y++) {
		for (let x = 0; x < 7; x++) {
			const serial = `${x}:${y}`
			if (at_rest.has(serial)) {
				blocks.push(`${x}:${y-lowest}`)
			}
		}
	}
	return `${inputpos}#${seqpos}#${blocks.join(".")}`
}


for (const target_pieces of [2022, 1000000000000]) {
	seqpos = 0
	let highest = 0; let lowest = 0; let fallen = 0; let inputpos = 0;
	let height_from_cycle = 0; let find_cycle = true; let cur_rock = spawn_rock(highest)
	let boardstates = new Map<string, {pieces: number, height: number}>()
	let at_rest = new Set<string>()
	while (true) {
		const c = input[inputpos]
		inputpos = (inputpos+1) % input.length
		var dx = c === "<" ? -1 : 1
		cur_rock.x += dx
		if (cur_rock.x < 0 || (cur_rock.x + cur_rock.width) > 7 || overlaps(cur_rock, at_rest)) {
			cur_rock.x -= dx
		}
		cur_rock.y -= 1
		if (cur_rock.y < 0 || overlaps(cur_rock, at_rest)) {
			cur_rock.y += 1
			highest = Math.max(cur_rock.y + cur_rock.height, highest)
			cur_rock.points.forEach(p => at_rest.add(`${p.x + cur_rock.x}:${p.y + cur_rock.y}`))
			lowest = Helper.smallest(Helper.range(7)
			.map(col => Helper.largest(Helper.range(highest-lowest+1, lowest)
				.map(row => at_rest.has(`${col}:${row}`) ? row : lowest))))
			cur_rock = spawn_rock(highest)
			fallen+= 1
			if (fallen >= target_pieces) {
				break;
			}
			if (find_cycle) {
				const serial = serialize_board(at_rest, inputpos, lowest, highest)
				const serial_data = {pieces: fallen, height: highest}
				if (!boardstates.has(serial)) {
					boardstates.set(serial, serial_data)
				} else {
					const logged_serial = boardstates.get(serial)!
					console.log(`Found cycle: ${JSON.stringify(logged_serial)} -> ${JSON.stringify(serial_data)}`)
					const cycle_pieces = serial_data.pieces - logged_serial.pieces
					const cycle_height = serial_data.height - logged_serial.height
					const cycle_loops = Math.floor((target_pieces - fallen) / cycle_pieces)
					console.log(`Executing cycle ${cycle_loops} times`)
					fallen += cycle_loops * cycle_pieces
					height_from_cycle = cycle_loops * cycle_height
					find_cycle = false
				}
			}
		}
	}
	console.log(highest + height_from_cycle)
}

console.log((Date.now() - start) / 1000)