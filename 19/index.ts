import {Helper} from "../helper"

type Resources = {ore: number, clay: number, obsidian: number, geode: number}
type Blueprint = {
	ore_robot_cost: RobotCost,
	clay_robot_cost: RobotCost,
	obsidian_robot_cost: RobotCost,
	geode_robot_cost: RobotCost,
}
type RobotCost = {ore?: number, clay?: number, obsidian?: number, geode?: number}
const reskey: Array<keyof Resources> = ["ore", "clay", "obsidian", "geode"]
const bpkey: Array<keyof Blueprint> = [
	"ore_robot_cost", 
	"clay_robot_cost", 
	"obsidian_robot_cost", 
	"geode_robot_cost"
]
const mapping = {
	"ore_robot_cost": "ore", 
	"clay_robot_cost": "clay", 
	"obsidian_robot_cost": "obsidian", 
	"geode_robot_cost": "geode"
} as {[key: string]: keyof Resources}

const start = Date.now()

const blueprints = Helper.getInputList(process.argv[2])
.map(line => line.match(/\d+/g)!.map(v => +v))
.map(digits => {
	const [, ore_robo, clay_robo, obsidian_ore, obsidian_clay, 
		geode_ore, geode_obsidian] = digits
	return {
		ore_robot_cost: { ore: ore_robo },
		clay_robot_cost: {ore: clay_robo},
		obsidian_robot_cost: {ore: obsidian_ore, clay: obsidian_clay},
		geode_robot_cost: {ore: geode_ore, obsidian: geode_obsidian}
	}
})

const get_limit = (bp: Blueprint) => ({
	ore: Helper.largest(bpkey.map(k => bp[k].ore ?? 0)),
	clay: Math.ceil(Helper.largest(bpkey.map(k => bp[k].clay ?? 0))/2+2),
	obsidian: Math.ceil(Helper.largest(bpkey.map(k => bp[k].obsidian ?? 0))/2+2),
	geode: 999999
})

const canbuild = (bots: Resources, bp: Blueprint, bp_limit: Resources) => {
	return bpkey.filter(bpk => bots[mapping[bpk]] < bp_limit[mapping[bpk]])
	.filter(bpk => (Object.keys(bp[bpk]) as Array<keyof Resources>)
		.map(resk => bots[resk] > 0).reduce((a, c) => a&&c))
}

const nextPurchase = (res: Resources, bots: Resources, bp: Blueprint, 
		time: number, tobuild: keyof Blueprint, bp_limit: Resources): number => {
	const plan = Object.assign({}, bp[tobuild])
	const timerequired = Helper.largest((Object.keys(plan) as Array<keyof Resources>)
		.map(k => Math.ceil(Math.max(0, (plan[k]! - res[k])/bots[k])))) + 1
	if (timerequired >= time) {
		return res.geode + time * bots.geode
	} else {
		reskey.forEach(k => res[k] += timerequired * bots[k] - (plan[k] ?? 0))
		bots[mapping[tobuild]] += 1
		return Helper.largest(canbuild(bots, bp, bp_limit).map(k => nextPurchase(
			Object.assign({}, res), Object.assign({}, bots), 
			bp, time - timerequired, k, bp_limit
		)))
	}
}

const opts: Array<keyof Blueprint> = ["ore_robot_cost", "clay_robot_cost"]
const solve = (bplist: Blueprint[], time: number) => bplist.map((bp) => {
	return Helper.largest(opts.map(k => nextPurchase(
		{ore: 0, clay: 0, obsidian: 0, geode: 0},
		{ore: 1, clay: 0, obsidian: 0, geode: 0},
		bp, time, k, get_limit(bp)
	)))
})

console.log(Helper.sum(solve(blueprints, 24).map((v, idx) => v*(idx+1))))
console.log(solve(blueprints.slice(0, 3), 32).reduce((a, c) => a*c))


console.log((Date.now() - start) / 1000)