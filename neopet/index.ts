import { isMainThread, workerData } from "node:worker_threads";
import {Helper} from "../helper.js"
import { PlayPiece, Puzzle, PuzzleBoard, PuzzlePiece } from "./puzzle.js";

const beginTime = Date.now();
let solutionAttempts = 0;
let report = 0
let reportStep = 1000000

const inputFile = isMainThread ? process.argv[2] : workerData.input
const input_string = Helper.getInputList(inputFile)
	.map(s => s.replaceAll("░", "0").replaceAll("█", "1").trim())

const [board_x, board_y, stages] = input_string[0].split(" ").map(s => +s)

const input_digit = input_string.slice(1).map(s => s.split("").map(s => +s))

let processed_input: number[][][] = []
let current_board: number[][] = []
let board_started = false
for (const line of input_digit) {
	if (line.length == 0) {
		if (board_started) {
			while (current_board.length < board_y) {
				let line: number[] = Array(board_x)
				line.fill(0)
				current_board.push(line)
			}
			processed_input.push(current_board)
			board_started = false
			current_board = []
		}
	} else {
		board_started = true
		var thisline = line
		while (thisline.length < board_x) {
			thisline.push(0)
		}
		current_board.push(thisline)
	}
}

const initial_state = processed_input[0]
const moves  = processed_input.slice(1)
.map((move, idx) => new PuzzlePiece(move, idx, board_x))

/*
let it = Helper.makeIncreasingCombinationIterator([0, 1, 2])
for (const combi of it) {
	console.log(combi)
}
console.log("===")
it = Helper.makeBitwiseCombinationIterator([0,1,2])
for (const combi of it) {
	console.log(combi)
}
process.exit(0)
*/

//console.log(moves)

/*
const boardcount = (board: number[][]) => {
	return Helper.sum(board.flat(2))
}
*/

const puzzle = new Puzzle(new PuzzleBoard(initial_state, stages), moves, stages)

if (isMainThread) {
	puzzle.solve(true).then(result => {
		const answSorted = result.sort((a, b) => a.piece.originalIndex - b.piece.originalIndex)
		console.log(answSorted.map(p => p.piece.originalIndex))
	
		answSorted.forEach((play, step_idx) => {
			console.log(`${step_idx+1}.\n${Helper.visualize_grid(play.piece.get_shifted(play.position)).replaceAll("1", "█").replaceAll("0", "░")}\n\n`)
		})
	
		const endTime = Date.now();
	
		console.log(`Found a solution in ${((endTime - beginTime)/1000).toPrecision(4)}s after ${solutionAttempts} attempts.`);
	})
} else {
	puzzle.solve(true)
}

/*
const all_moves = moves.map(board => {
	const truecount = boardcount(board);
	let variants: number[][][] = []
	for (let x = 0; x < board_x; x++) {
		for (let y = 0; y < board_y; y++) {
			variants.push(shift(board, x, y))
		}
	}
	return [board, ...variants.filter(v => truecount == boardcount(v))]
})

const apply_move = (state: number[][], move: number[][]) => {
	// console.log(state)
	// console.log(move)
	// console.log("####")
	return state.map((row, y) => row.map((v, x) => (v + move[y][x]) % (stages+1)))
}

const solve = (state: number[][], moves: number[][][][], sequence: number[]):number[] => {
	if (moves.length == 0) {
		solutionAttempts += 1;
		if (solutionAttempts > report) {
			console.log(`Attempted ${report}`)
			report += reportStep
		}
		if (boardcount(state) == (board_x*board_y*stages)) {
			return sequence
		} else {
			return []
		}
	}
	const this_moves = moves[0]
	const next_moves = moves.slice(1);
	var idx = 0
	for (const move of this_moves) {
		var solution = solve(apply_move(state, move), next_moves, [...sequence, idx])
		if (solution.length > 0) {
			return solution
		}
		idx += 1
	}
	return []
}

*/