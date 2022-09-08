import { ObjectId } from "mongoose";
import mongoose = require("mongoose");
import { User } from "~/user/models/users.model";

export const DOCUMENT_NAME = "Category";
export const COLLECTION_NAME = "comments";

export interface Category {
    _id: ObjectId,
    id: number,
    name: string,
    description: string,
    isActive: boolean,
    status: number, // -1: delete, 0: hidden, 1 
    createdBy?: User | mongoose.Types.ObjectId;
    updatedBy?: User | mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const schema = new mongoose.Schema<Category>(
    {
        id: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
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

export const CategoryModel = mongoose.model<Category>(
    DOCUMENT_NAME,
    schema,
    COLLECTION_NAME
);