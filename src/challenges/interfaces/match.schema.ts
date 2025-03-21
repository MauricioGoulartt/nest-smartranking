import * as mongoose from "mongoose";

export const MatchSchema = new mongoose.Schema(
  {
    category: { type: String },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
      },
    ],
    defender: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
    result: [{ set: { type: String } }],
  },
  { timestamps: true, collection: "matches" }
);
