import mongoose, {Schema} from "mongoose"
import {Response,Request} from "express";
import {SchoolSchema} from "../model/schoolModel";
import {UserSchema} from "../model/userModel";
import jwt from "jsonwebtoken"
import config from "../config/config";
import {userInfo} from "os";


const School = mongoose.model("schools",SchoolSchema)
const User = mongoose.model("users",UserSchema)

export class SchoolController{

    public createSchool(req:Request, res:Response){

        // 1. 권한 확인
        let token = req.header("x-access-token")

        if( token ){
            jwt.verify(token,config.jwt_secret_key, (err,decoded) =>{

                if( decoded) {
                    let stringify = JSON.stringify(decoded)
                    let decodedJson = JSON.parse( JSON.stringify(decoded) )
                    let parseId = decodedJson._id;

                    User.findById(parseId).exec(
                        (error, user) => {
                            if(error||!user){
                                res.json({"message":"해당아이디가 없습니다."});
                            } else {

                                let userJson = user.toJSON()

                                if( userJson.role == "admin"){
                                    let checkSchool = School.findOne({"name":req.body.name})
                                    if(!checkSchool){
                                        res.json({
                                            message:"해당 학교는 이미 존재합니다."
                                        })
                                    }else {
                                        let newSchool = new School(req.body)
                                        newSchool.save((error,school)=>{
                                            if(error){
                                                res.send(error.message)
                                            } else {
                                                res.json(school)
                                            }
                                        })
                                    }
                                } else {
                                  res.json({"message:":"관리자만 등록가능합니다."})
                                }
                            }


                        }
                    )
                }
            })
        } else {
            res.json({"message":"error"})
        }
    }

    public getSchools(req:Request, res:Response){
        School.find().exec((error,School) =>{
            if(error){
                res.json(error.message)
            }
            res.json(School)
        })
    }

}