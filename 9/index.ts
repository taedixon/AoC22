import {Helper} from "../helper"
type StepDir = "U"|"D"|"R"|"L"
type Knot = {x: 0, y: 0}

const input = Helper.getInputList("input.txt")
.flatMap(i => {
	const s = i.split(" ")
	return new Array(+s[1]).fill(s[0]) as StepDir[]
})
const step = {"U": {x: 0, y: -1}, "D": {x: 0, y: 1},
	"L": {x: -1, y: 0}, "R": {x: 1, y: 0}}

const moveRopeTail = (head: Knot, tail: Knot) => {
	var dx = head.x - tail.x; var dy = head.y - tail.y
	if (dx === 0 || dy === 0) {
		tail.x += Math.trunc(dx / 2); tail.y += Math.trunc(dy / 2)
	} else if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
		tail.x += Helper.clamp(dx, -1, 1); tail.y += Helper.clamp(dy, -1, 1)
	}
	return tail;
}

const moveRope = (dir: StepDir, rope: Knot[]) => {
	const offset = step[dir]
	rope[0].x += offset.x; rope[0].y += offset.y
	const tail = rope.reduce(moveRopeTail)
	return `${tail.x}:${tail.y}`
}

const rope1 = Array.from(new Array(2), (_) => ({x: 0, y: 0})) as Knot[]
const touched = input.map((dir: StepDir) => moveRope(dir, rope1))
console.log(new Set(touched).size)

const rope2 = Array.from(new Array(10), (_) => ({x: 0, y: 0})) as Knot[]
const touched2 = input.map((dir: StepDir) => moveRope(dir, rope2))
console.log(new Set(touched2).size)

