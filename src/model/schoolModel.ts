import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const SchoolSchema = new Schema({
    name :{
        type : String,
        required : [true,"학교명을 입력해주세요"],
        index:true,
        unique:true
    },
    area : {
        type : String,
        required : [true, "지역을 입력해주세요"]
    },
    subscribe_users:{
        type:[Schema.Types.ObjectId]
        , ref:'users'
    }
})

