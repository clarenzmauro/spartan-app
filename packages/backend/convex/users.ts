import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create or update user after sign-in
export const createOrUpdateUser = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const clerkId = identity.subject;
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        name: args.name,
        email: args.email,
        picture: args.picture,
        nickname: args.nickname,
        given_name: args.given_name,
        family_name: args.family_name,
        phone_number: args.phone_number,
        email_verified: args.email_verified,
        phone_number_verified: args.phone_number_verified,
        updated_at: args.updated_at,
      });

      return { userId: existingUser._id, isNew: false };
    } else {
      // Create new user
      const userId = await ctx.db.insert("users", {
        clerkId,
        name: args.name,
        email: args.email,
        picture: args.picture,
        nickname: args.nickname,
        given_name: args.given_name,
        family_name: args.family_name,
        phone_number: args.phone_number,
        email_verified: args.email_verified,
        phone_number_verified: args.phone_number_verified,
        updated_at: args.updated_at,
        createdAt: Date.now(),
      });

      // Create default character for new user
      await ctx.db.insert("characters", {
        userId,
        hpAmount: 100,
        atkAmount: 10,
        crtAmount: 5,
        defAmount: 5,
        spdAmount: 5,
        intAmount: 5,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      return { userId, isNew: true };
    }
  },
});

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      return null;
    }

    // If the requester is the same as the target user, return full profile
    if (identity && identity.subject === args.clerkId) {
      return user;
    }

    // Otherwise, return public profile only (redact sensitive info)
    return {
      _id: user._id,
      clerkId: user.clerkId,
      name: user.name,
      picture: user.picture,
      nickname: user.nickname,
      createdAt: user.createdAt,
    };
  },
});

// Get user by email
export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      return null;
    }

    // If the requester is the same as the target user, return full profile
    if (identity && identity.subject === user.clerkId) {
      return user;
    }

    // Otherwise, return public profile only (redact sensitive info)
    return {
      _id: user._id,
      clerkId: user.clerkId,
      name: user.name,
      picture: user.picture,
      nickname: user.nickname,
      createdAt: user.createdAt,
    };
  },
});
