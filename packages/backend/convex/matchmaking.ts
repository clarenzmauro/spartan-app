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
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const userId = identity.subject;

    // Get character stats from database
    const character = await ctx.db
      .query("characters")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!character) {
      throw new Error("Character not found");
    }

    // Calculate power level
    const powerLevel = calculatePowerLevel(character);

    // Check if user is already in matchmaking
    const existingEntry = await ctx.db
      .query("matchmaking")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "waiting"))
      .first();

    if (existingEntry) {
      return { matchmakingId: existingEntry._id, status: "already_in_queue" };
    }

    // Create matchmaking entry
    const matchmakingId = await ctx.db.insert("matchmaking", {
      userId,
      hpAmount: character.hpAmount,
      atkAmount: character.atkAmount,
      crtAmount: character.crtAmount,
      defAmount: character.defAmount,
      spdAmount: character.spdAmount,
      intAmount: character.intAmount,
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
      // Determine who goes first based on speed
      const player1GoesFirst = character.spdAmount >= potentialMatches.spdAmount;
      
      // Create battle with full player details
      const battleId = await ctx.db.insert("battles", {
        player1: {
          userId,
          hpAmount: character.hpAmount,
          currentHP: character.hpAmount,
          atkAmount: character.atkAmount,
          crtAmount: character.crtAmount,
          defAmount: character.defAmount,
          spdAmount: character.spdAmount,
          intAmount: character.intAmount,
          powerLevel,
        },
        player2: {
          userId: potentialMatches.userId,
          hpAmount: potentialMatches.hpAmount,
          currentHP: potentialMatches.hpAmount,
          atkAmount: potentialMatches.atkAmount,
          crtAmount: potentialMatches.crtAmount,
          defAmount: potentialMatches.defAmount,
          spdAmount: potentialMatches.spdAmount,
          intAmount: potentialMatches.intAmount,
          powerLevel: potentialMatches.powerLevel,
        },
        currentTurn: player1GoesFirst ? "player1" : "player2",
        turnCount: 1,
        status: "active",
        battleLog: [],
        createdAt: Date.now(),
      });

      // Update both matchmaking entries with battleId
      await ctx.db.patch(matchmakingId, {
        status: "matched",
        matchedWith: potentialMatches._id,
        battleId,
      });

      await ctx.db.patch(potentialMatches._id, {
        status: "matched",
        matchedWith: matchmakingId,
        battleId,
      });

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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const entry = await ctx.db.get(args.matchmakingId);

    // Verify the entry belongs to the authenticated user
    if (!entry || entry.userId !== identity.subject) {
      return { success: false, reason: "Entry not found or access denied" };
    }

    if (entry.status === "waiting") {
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const entry = await ctx.db.get(args.matchmakingId);

    // Verify the entry belongs to the authenticated user
    if (!entry || entry.userId !== identity.subject) {
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

// Cleanup matchmaking entries for a battle
export const cleanupMatchmakingForBattle = mutation({
  args: {
    battleId: v.id("battles"),
  },
  handler: async (ctx, args) => {
    // Find all matchmaking entries for this battle
    const matchmakingEntries = await ctx.db
      .query("matchmaking")
      .filter((q) => q.eq(q.field("battleId"), args.battleId))
      .collect();

    // Delete all matching entries
    for (const entry of matchmakingEntries) {
      await ctx.db.delete(entry._id);
    }

    return { deleted: matchmakingEntries.length };
  },
});
