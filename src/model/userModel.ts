import mongoose from "mongoose";

const Schema = mongoose.Schema

export const UserSchema = new Schema({
        id: {
            type: String,
            required: [true, 'Please enter a full id'],
            unique:true
            ,index: true
        },
        name: {
            type: String,
            required: [true, 'Please enter a full name']
            // index: true,
        },

        password: {
            type:String,
            required: [true, 'Please enter a password']
        },

        role: {
            type: String,
            default: 'student'
        },

        news : {
            type:[Schema.Types.ObjectId]
            , ref:'news'
        },

        schools : {
            type:[Schema.Types.ObjectId]
            , ref:'schools'
        },

        create_dt: {
            type:Date,
            required:true,
            default : Date()
        },
        update_dt:{
            type:Date,
            default : null
        }
    }
);