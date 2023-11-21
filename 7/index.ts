import {Helper} from "../helper"

class FFile {
	public readonly name: string;
	public readonly size: number;

	constructor(name: string, size: number) {
		this.name = name;
		this.size = size;
	}
}

class FDir {
	public readonly parent?: FDir;
	public readonly name: string;
	private _size: number;
	get size(): number { return this._size; }
	public readonly children: {[key:string]: FDir|FFile} = {}

	constructor(name: string, parent?: FDir) {
		this.name = name;
		this.parent = parent;
		this._size = 0;
	}

	public addChild(chil: FDir|FFile) {
		if (!(chil.name in this.children)) {
			this.addSizeFromChild(chil.size)
			this.children[chil.name] = chil
		}
	}

	public addSizeFromChild(childsize: number) {
		this._size += childsize;
		this.parent?.addSizeFromChild(childsize)
	}

	public getDirectorySizes(): number[] {
		return [this._size, ...Object.values(this.children)
		.filter((o): o is FDir => o instanceof FDir)
		.flatMap(dir => dir.getDirectorySizes()) ]
	}
}

const fileroot = new FDir("/")
let fcurrent = fileroot;
const input = Helper.getInputList("input.txt")
.filter(line => line != "$ ls")
.map(line => line.replace("$ ", "").split(" "))

input.forEach(params => {
	switch (params[0]) {
		case "cd":
			switch (params[1]) {
				case "/":
					fcurrent = fileroot
					break;
				case "..":
					fcurrent = fcurrent.parent!
					break;
				default:
					fcurrent = fcurrent.children[params[1]] as FDir
					break;
			}
			break;
		case "dir":
			fcurrent.addChild(new FDir(params[1], fcurrent))
			break;
		default:
			fcurrent.addChild(new FFile(params[1], +params[0]))
			break;
	}
})
console.log(fileroot.size)

const dir_sizes = fileroot.getDirectorySizes()

const answ1 = dir_sizes.filter(size => size <= 100000)
console.log(Helper.sum(answ1))

const space_needed = 30000000 - (70000000 - fileroot.size)
const answ2 = dir_sizes.filter(d => d >= space_needed)
.sort((a, b) => a - b)[0]
console.log(answ2)

