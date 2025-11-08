import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	todos: defineTable({
		text: v.string(),
		completed: v.boolean(),
	}),
	matchmaking: defineTable({
		userId: v.string(),
		hpAmount: v.number(),
		atkAmount: v.number(),
		crtAmount: v.number(),
		defAmount: v.number(),
		spdAmount: v.number(),
		intAmount: v.number(),
		powerLevel: v.number(),
		status: v.union(v.literal("waiting"), v.literal("matched"), v.literal("cancelled")),
		matchedWith: v.optional(v.id("matchmaking")),
		battleId: v.optional(v.id("battles")),
		createdAt: v.number(),
	}).index("by_status_and_power", ["status", "powerLevel"])
	  .index("by_user", ["userId"]),
	battles: defineTable({
		player1Id: v.id("matchmaking"),
		player2Id: v.id("matchmaking"),
		currentTurn: v.union(v.literal("player1"), v.literal("player2")),
		player1HP: v.number(),
		player2HP: v.number(),
		status: v.union(v.literal("active"), v.literal("finished")),
		winner: v.optional(v.union(v.literal("player1"), v.literal("player2"))),
		createdAt: v.number(),
	}),
});
