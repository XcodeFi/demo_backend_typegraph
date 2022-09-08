import mongoose from "mongoose";

export interface JWTPayload {
  id: mongoose.Types.ObjectId;
  username: string;
}
