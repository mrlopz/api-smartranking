import mongoose from 'mongoose';

export const ChallengeSchema = new mongoose.Schema(
  {
    challengeDatetime: { type: Date },
    status: { type: String },
    requestDatetime: { type: Date },
    responseDatetime: { type: Date },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    category: { type: String },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
    match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
  },
  { timestamps: true, collection: 'challenges' },
);
