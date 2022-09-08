import mongoose from "mongoose";
import { Ref } from "~/types/ref";
import { User } from "~/user/models/users.model";

export interface Entity {
    _id: mongoose.Types.ObjectId;
    created_by?: Ref<User>;
    created_at?: Date;
    updated_by?: Ref<User>;
    updated_at?: Date;
}