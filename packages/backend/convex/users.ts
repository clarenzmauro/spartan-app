import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create or update user after sign-in
export const createOrUpdateUser = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
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
        clerkId: args.clerkId,
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
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    return user;
  },
});

// Get user by email
export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    return user;
  },
});
