import { Helper, Point } from "../helper.js";

import { Worker, isMainThread, workerData, parentPort } from "node:worker_threads"

type Grid = number[][]

export interface PlayPiece {
	position: Point,
	piece: PuzzlePiece
}

export interface PlayPieceSerial {
	position: Point,
	piece: number
}

let boardcount = 0

const log_newboard = function() {
	boardcount++
	if ((boardcount % 100000) == 0) {
		console.log(`Created ${boardcount} boards on ${workerData.id}`)
	}
}

const worker_count = 8;



export class Puzzle {
	private currentState: PuzzleBoard;
	private currentPieces: PuzzlePiece[];
	private solutionSteps: number;
	private sumTarget: number;


	constructor(state: PuzzleBoard, pieces: PuzzlePiece[], steps: number) {
		log_newboard()
		this.currentState = state;
		this.currentPieces = pieces;
		this.solutionSteps = steps;
		this.sumTarget = this.solutionSteps * state.height * state.toprow().length
	}

	is_solvable = () => {
		const tallest_piece = Helper.largest(this.currentPieces.map(p => p.height))
		if (tallest_piece > this.currentState.height) {
			return false
		}
		return true
	}

	solve = async (isOriginalBoard = false): Promise<PlayPiece[]> => {
		if (isOriginalBoard) {
			if (isMainThread) {
				let promises: Promise<string>[] = []
				let workers: Worker[] = []
				console.log(`Spawning ${worker_count} workers`);
				for (let i = 0; i < worker_count; i++) {
					promises.push(new Promise((resolve, reject) => {
						const thread = new Worker("./index.js", {
							workerData: {threads: 4, id: i, input: process.argv[2]}
						})
						workers.push(thread)
						thread.on("message", msg => resolve(msg))
						thread.on("error", err => reject(err))
					}))
				}
				const ans = await Promise.any(promises);
				workers.forEach(w => w.terminate())
				const deserialized = JSON.parse(ans) as PlayPieceSerial[]
				return deserialized.map(p => ({position: p.position, piece: this.currentPieces.find(_p => _p.originalIndex == p.piece)!}))
			} else {
				console.log(`Beginning search on ${workerData.id}`)
				let combi_index = 0
				for (const combi of Helper.makeCombinationIterator(this.currentPieces)) {
					if ((combi_index % workerData.threads) == workerData.id) {
						var ans = await this.try_solve_combination(combi)
						if (ans.length > 0) {
							console.log(`Found answer on thread ${workerData.id}, combi ${combi_index}`)
							parentPort?.postMessage(JSON.stringify(ans.map(pp => ({
								position: pp.position,
								piece: pp.piece.originalIndex
							}))))
						}
					}
					combi_index++
				}
			}
		} else {
			for (const combi of Helper.makeCombinationIterator(this.currentPieces)) {
				var ans = await this.try_solve_combination(combi)
				if (ans.length > 0) {
					return ans
				}
			}
		}
		return []
	}

	try_solve_combination = async (combi: PuzzlePiece[]): Promise<PlayPiece[]> => {
		//console.log(combi.map(p => p.originalIndex))
		for (const sequence of this.get_combi_valid_plays(combi)) {
			if (sequence.length == 0) {
				var toprow = this.currentState.toprow()
				 if (Helper.sum(toprow) != this.solutionSteps * toprow.length) {
					continue;
				 }
			}
			//console.log(sequence.map(p => `${this.currentState.height} ${p.piece.originalIndex}:${p.position.x}.${p.position.y}`))
			const resulting_board = this.play_sequence(sequence);
			if (sequence.length == this.currentPieces.length) {
				// no more pieces, check for a win
				if (resulting_board.sum() == this.sumTarget) {
					return sequence
				}
			} else if (resulting_board.can_shave) {
				const played = sequence.map(play => play.piece)
				const unplayed = this.currentPieces.filter(piece => !played.includes(piece))
				const newboard = resulting_board.shave()
				const subpuzzle = new Puzzle(newboard, unplayed, this.solutionSteps)
				if (subpuzzle.is_solvable()) {
					const subsolution = await subpuzzle.solve()
					if (subsolution.length > 0) {
						subsolution.forEach(play => play.position.y += 1)
						return [...sequence, ...subsolution]
					}
				}
			}
		}
		return []
	}

	play_sequence = (seq: PlayPiece[]) => {
		let state = this.currentState;
		for (const play of seq) {
			state = state.apply_move(play.piece.variants[play.position.x])
		}
		return state
	}

	*get_combi_valid_plays(to_play: PuzzlePiece[]) {
		const solved_row = this.solutionSteps * this.currentState.toprow().length
		if (to_play.length == 0) {
			yield []
			return
		}
		let table = to_play.map(_ => 0)
		let limits = to_play.map(piece => piece.variants.length)
		while (true) {
			var possible = to_play.map((play, idx) => play.variants[table[idx]])
			let row = this.currentState.toprow()
			for (const play of possible) {
				row = this.apply_toprow(row, play)
			}
			if (Helper.sum(row) == solved_row) {
				yield table.map((piece_pos, piece_idx) => ({position: {x: piece_pos, y: 0}, piece: to_play[piece_idx]}))
			}
			let addto_idx = 0
			let carry = true
			while(carry) {
				table[addto_idx] = table[addto_idx] + 1
				if (table[addto_idx] >= limits[addto_idx]) {
					table[addto_idx] = 0
					addto_idx += 1
					if (addto_idx >= table.length) {
						break
					}
				} else {
					carry = false
				}
			}
			if (carry) {
				break;
			}
		}
		/*

		let possible_plays: PlayPiece[][] = [[]]
		for (const piece of to_play) {
			possible_plays = possible_plays.flatMap(subseq => 
				piece.variants.map((_, i) => [...subseq, {position: {x: i, y: 0}, piece}]))
		}
		return possible_plays.filter(playlist => {
			let row = this.currentState.toprow()
			for (const play of playlist) {
				row = this.apply_toprow(row, play.piece.variants[play.position.x])
			}
			return Helper.sum(row) == this.solutionSteps * row.length;
		})
		*/
	}

	apply_toprow = (toprow: number[], move: Grid) => {
		return toprow.map((val, i) => (val + move[0][i]) % (this.solutionSteps + 1))
	}
}


export class PuzzleBoard {
	private state: Grid;
	private stages: number;

	height: number;

	get can_shave() { return this.height > 1 }

	constructor(state: number[][], stages: number) {
		this.state = state;
		this.stages = stages;
		this.height = state.length;
	}
	
	apply_move = (move: Grid) => {
		return new PuzzleBoard(this.state.map((row, y) => 
			row.map((v, x) => (v + move[y][x]) % (this.stages+1))), this.stages)
	}

	toprow = () => {
		return this.state[0];
	}

	sum = () => {
		return Helper.sum(this.state.map(row => Helper.sum(row)))
	}

	shave = () => {
		return new PuzzleBoard(this.state.slice(1), this.stages)
	}
}

export class PuzzlePiece {
	originalIndex: number

	variants: Grid[];

	width: number = 0;
	height: number = 0;

	constructor(locations: Grid, idx: number, board_width: number) {
		this.originalIndex = idx;

		for (let y = 0; y < locations.length; y++) {
			const row = locations[y]
			for (let x = 0; x < row.length; x++) {
				if (locations[y][x] != 0) {
					this.width = Math.max(this.width, x+1)
					this.height = Math.max(this.height, y+1)
				}
			}
		}
		this.variants = [locations]
		const n_variants = board_width - this.width
		for (let x = 1; x <= (n_variants); x++) {
			this.variants.push(this.shift(locations, x, 0))
		}
	}

	get_shifted = (coord: Point) => {
		return this.shift(this.variants[0], coord.x, coord.y)
	}

	private shift = (board: Grid, x=0, y=0) => {
		return board.map((row, _y) => {
			const thisy = _y - y
			return row.map((_, _x) => {
				const thisx = _x - x
				return (thisx < 0 || thisy < 0) ? 0 : board[thisy][thisx]
			})
		})
	}
}