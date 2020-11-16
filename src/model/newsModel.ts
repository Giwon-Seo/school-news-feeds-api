import mongoose from "mongoose"

const Schema = mongoose.Schema

export const newSchema = new Schema({
    sj : {
        type:String,
        required:[true,"뉴스제목을 입력해주세요"]
    },
    cn : {
        type:String,
        required:[true,"내용을 입력해주세요"]
    } ,
    create_dt:{
        type:Date
        , default:Date.now()
    },
    update_dt: {
        type: Date
    },
    school: {
        type:Schema.Types.ObjectId
        , ref:'School'
        , required:[true,"학교를 입력해주세요"]
    }
})