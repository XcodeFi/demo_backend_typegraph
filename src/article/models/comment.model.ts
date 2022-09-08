import mongoose = require("mongoose");
import { User } from "~/user/models/users.model";

export const DOCUMENT_NAME = "Comment";
export const COLLECTION_NAME = "comments";

export interface Comment {
    body: string,
    createdBy?: User | mongoose.Types.ObjectId;
    updatedBy?: User | mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const schema = new mongoose.Schema<Comment>(
    {
        body: {
            type: String,
            required: true
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            // required: true,
            select: false,
            index: true,
        },
        updatedBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            select: false,
        },
        createdAt: {
            type: Date,
            required: true,
        },
        updatedAt: {
            type: Date,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

export const CommentModel = mongoose.model<Comment>(
    DOCUMENT_NAME,
    schema,
    COLLECTION_NAME
);