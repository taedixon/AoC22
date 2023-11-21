import * as fs from "fs"

export type Range = {min: number, max: number}
export type Point = {x: number, y: number}
export type Point3 = {x: number, y: number, z: number}
export type NGrid = Array<number[]>
export type SGrid = Array<string[]>

export class Helper {
	public readonly ascii_a = 97
	public readonly ascii_A = 65
	
	public static getInputList(fname: fs.PathOrFileDescriptor) {
		return fs.readFileSync(fname).toString().split("\n")	
	}

	public static unflatten<T>(array: Array<T>, grouping: number) {
		return array.reduce((accum, sac) => {
			let cur = accum[accum.length-1]
			if (cur.length == grouping) {
				cur = [sac]
				accum.push(cur)
			} else {
				cur.push(sac)
			}
			return accum
		}, [[]] as Array<Array<T>>)
	}

	public static sum(array: Array<number>) {
		return array.reduce((accum, cur) => accum + cur, 0)
	}

	public static transpose<T>(matrix: Array<Array<T>>) {
		return matrix[0].map((_col, i) => matrix.map(row => row[i]));
	}

	public static largest(array: Array<number>) {
		return array.sort((a, b) => b - a)[0]
	}

	public static smallest(array: Array<number>) {
		return array.sort((a, b) => a-b)[0]
	}

	public static arrayMerge<T>(a1: Array<T>, a2: Array<T>, mergeOp: (l: T, r: T) => T) {
		return a1.map((item, idx) => mergeOp(item, a2[idx]))
	}

	public static clamp(v: number, min: number, max: number) {
		return Math.min(Math.max(v, min), max)
	}

	public static orthogonal(p: Point) {
		return [
			{x: p.x-1, y: p.y},
			{x: p.x+1, y: p.y},
			{x: p.x, y: p.y-1},
			{x: p.x, y: p.y+1}
		]
	}
	public static orthogonal3(p: Point3) {
		return [
			{x: p.x-1, y: p.y, z: p.z},
			{x: p.x+1, y: p.y, z: p.z},
			{x: p.x, y: p.y-1, z: p.z},
			{x: p.x, y: p.y+1, z: p.z},
			{x: p.x, y: p.y, z: p.z-1},
			{x: p.x, y: p.y, z: p.z+1},
		]
	}

	public static range = (size: number, startAt = 0) => {
		return [...Array(size).keys()].map(i => i + startAt);
	}

	public static get_range = (array: number[]) => {
		const sorted = array.sort((a, b) => a-b)
		return {min: sorted[0], max: sorted[sorted.length-1]}
	}

	public static visualize_grid = (array: number[][]) => {
		return array.map(row => row.join("")).join("\n")
	}

	static *makeCombinationIterator<T>(items: T[]) {
		const bitmax = (1 << items.length)
		if (bitmax > 1000) {
			console.log(`Iterating ${bitmax} combinations`)
		}
		for (let mask = 1; mask <= bitmax; mask++) {
			yield items.filter((_, i) => ((1<<(i)) & mask) != 0)
		}
		return []
	}
}