import {Helper} from "../helper"

const input = Helper.getInputList("input.txt")
.flatMap(line => line.startsWith("noop") ? 0 : [0, +line.split(" ")[1]])

const notable = [20, 60, 100, 140, 180, 220]
const signal = input.reduce((accum, cur) => [...accum, accum[accum.length-1] + cur], [1])
const answ1 = notable.reduce((accum, cur) => accum + cur * signal[cur-1], 0)
console.log(answ1)

const image = signal
.map((spritepos, idx) => (Math.abs(spritepos - ((idx) % 40)) <= 1) ? "#" : " ")
console.log(Helper.unflatten(image, 40).map(row=>row.join("")).join("\n"))

