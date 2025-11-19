import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
		clerkId: v.string(),
		name: v.optional(v.string()),
		email: v.string(),
		picture: v.optional(v.string()),
		nickname: v.optional(v.string()),
		given_name: v.optional(v.string()),
		family_name: v.optional(v.string()),
		phone_number: v.optional(v.string()),
		email_verified: v.optional(v.boolean()),
		phone_number_verified: v.optional(v.boolean()),
		updated_at: v.optional(v.number()),
		createdAt: v.number(),
	}).index("by_clerk_id", ["clerkId"])
	  .index("by_email", ["email"]),
	characters: defineTable({
		userId: v.string(),
		hpAmount: v.number(),
		atkAmount: v.number(),
		crtAmount: v.number(),
		defAmount: v.number(),
		spdAmount: v.number(),
		intAmount: v.number(),
		createdAt: v.number(),
		updatedAt: v.number(),
	}).index("by_user", ["userId"]),
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
		// Player 1 details
		player1: v.object({
			userId: v.string(),
			hpAmount: v.number(),
			currentHP: v.number(),
			atkAmount: v.number(),
			crtAmount: v.number(),
			defAmount: v.number(),
			spdAmount: v.number(),
			intAmount: v.number(),
			powerLevel: v.number(),
		}),
		// Player 2 details
		player2: v.object({
			userId: v.string(),
			hpAmount: v.number(),
			currentHP: v.number(),
			atkAmount: v.number(),
			crtAmount: v.number(),
			defAmount: v.number(),
			spdAmount: v.number(),
			intAmount: v.number(),
			powerLevel: v.number(),
		}),
		// Battle state
		currentTurn: v.union(v.literal("player1"), v.literal("player2")),
		turnCount: v.number(),
		status: v.union(v.literal("active"), v.literal("finished")),
		winner: v.optional(v.union(v.literal("player1"), v.literal("player2"))),
		battleLog: v.array(v.object({
			turn: v.number(),
			player: v.union(v.literal("player1"), v.literal("player2")),
			action: v.string(),
			damage: v.optional(v.number()),
			isCritical: v.optional(v.boolean()),
			timestamp: v.number(),
		})),
		createdAt: v.number(),
		finishedAt: v.optional(v.number()),
	}).index("by_user", ["player1.userId"])
	  .index("by_user2", ["player2.userId"]),
});
