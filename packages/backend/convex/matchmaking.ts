import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Calculate power level from stats
function calculatePowerLevel(stats: {
  hpAmount: number;
  atkAmount: number;
  crtAmount: number;
  defAmount: number;
  spdAmount: number;
  intAmount: number;
}): number {
  return (
    stats.atkAmount +
    stats.defAmount +
    stats.spdAmount +
    stats.crtAmount +
    stats.intAmount +
    stats.hpAmount / 10
  );
}

// Join matchmaking queue
export const joinMatchmaking = mutation({
  args: {
    userId: v.string(),
    hpAmount: v.number(),
    atkAmount: v.number(),
    crtAmount: v.number(),
    defAmount: v.number(),
    spdAmount: v.number(),
    intAmount: v.number(),
  },
  handler: async (ctx, args) => {
    // Calculate power level
    const powerLevel = calculatePowerLevel(args);

    // Check if user is already in matchmaking
    const existingEntry = await ctx.db
      .query("matchmaking")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("status"), "waiting"))
      .first();

    if (existingEntry) {
      return { matchmakingId: existingEntry._id, status: "already_in_queue" };
    }

    // Create matchmaking entry
    const matchmakingId = await ctx.db.insert("matchmaking", {
      userId: args.userId,
      hpAmount: args.hpAmount,
      atkAmount: args.atkAmount,
      crtAmount: args.crtAmount,
      defAmount: args.defAmount,
      spdAmount: args.spdAmount,
      intAmount: args.intAmount,
      powerLevel,
      status: "waiting",
      createdAt: Date.now(),
    });

    // Try to find a match
    const powerDifferential = 50;
    const minPower = powerLevel - powerDifferential;
    const maxPower = powerLevel + powerDifferential;

    // Find waiting players within power level range
    const potentialMatches = await ctx.db
      .query("matchmaking")
      .withIndex("by_status_and_power")
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "waiting"),
          q.neq(q.field("_id"), matchmakingId),
          q.gte(q.field("powerLevel"), minPower),
          q.lte(q.field("powerLevel"), maxPower)
        )
      )
      .first();

    if (potentialMatches) {
      // Create battle
      const battleId = await ctx.db.insert("battles", {
        player1Id: matchmakingId,
        player2Id: potentialMatches._id,
        currentTurn: "player1",
        player1HP: args.hpAmount,
        player2HP: potentialMatches.hpAmount,
        status: "active",
        createdAt: Date.now(),
      });

      // Delete both matchmaking entries (no longer needed)
      await ctx.db.delete(matchmakingId);
      await ctx.db.delete(potentialMatches._id);

      return { matchmakingId, status: "matched", battleId };
    }

    return { matchmakingId, status: "waiting" };
  },
});

// Cancel matchmaking
export const cancelMatchmaking = mutation({
  args: {
    matchmakingId: v.id("matchmaking"),
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.matchmakingId);
    
    if (entry && entry.status === "waiting") {
      // Delete the entry from database
      await ctx.db.delete(args.matchmakingId);
      return { success: true };
    }

    return { success: false, reason: "Already matched or invalid entry" };
  },
});

// Check matchmaking status
export const getMatchmakingStatus = query({
  args: {
    matchmakingId: v.id("matchmaking"),
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.matchmakingId);
    
    if (!entry) {
      return null;
    }

    if (entry.status === "matched" && entry.battleId) {
      const battle = await ctx.db.get(entry.battleId);
      return {
        status: entry.status,
        battleId: entry.battleId,
        battle,
      };
    }

    return {
      status: entry.status,
      powerLevel: entry.powerLevel,
    };
  },
});
