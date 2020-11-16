import mongoose from "mongoose"
import {Response, Request, NextFunction} from "express";
import {newSchema} from "../model/newsModel";
import {SchoolSchema} from "../model/schoolModel";
import {AuthController} from "./authController";
import {create} from "domain";
import jwt from "jsonwebtoken";
import {UserSchema} from "../model/userModel";

const SchoolModel = mongoose.model("school",SchoolSchema)
const NewsModel = mongoose.model("news",newSchema)
const UserModel = mongoose.model("users",UserSchema)

export class SubscribeController{

    public async getSubscribeSchool(req:Request, res:Response, next:NextFunction){

        // 권한 가져오기
        let checkAuth:any = await AuthController.checkAuth(req,res)

        if( checkAuth.status != 200){
            res.status(checkAuth.status).json({"message":checkAuth.message})
        } else {
            let user = checkAuth.user;
            if( user.role === 'student'){

                let userId = user._id
                await UserModel.findById(userId).exec()
                    .then((userResults:any)=>{

                        if(userResults==null){
                            res.status(204).json({"message":"해당학생이 없습니다."})
                        }else{
                            SchoolModel.find({_id:userResults.schools}).exec()
                                .then((schoolResults)=>{
                                    res.status(200).json(schoolResults)
                                }).catch((e)=>{
                                res.status(400).json({"message":"서버에러가 발생했습니다."})
                            })
                        }
                    }).catch((e)=>{
                        console.log(e)
                      res.status(400).json({"message":"서버에러가 발생했습니다."})
                    })
            } else {
                res.status(401 ).json({
                    "message" : "학생 권한이 아닙니다."
                })
            }
        }
    }

    public async setSubscribeSchool(req:Request, res:Response, next:NextFunction){
        let checkAuth:any = await AuthController.checkAuth(req,res)

        if( checkAuth.status != 200){
            res.status(checkAuth.status).json({"message":checkAuth.message})
        } else {
            let user = checkAuth.user;

            if( user.role === 'student'){

                let userId = user._id
                let insertSchool = req.params.id

                await SchoolModel.findOneAndUpdate({_id:insertSchool}
                    ,{$addToSet:{subscribe_users:userId}},
                    {useFindAndModify:true}).exec()
                    .then((result)=>{
                        if(result==null){
                            res.status(400).json({
                                "message":"서버에러입니다."
                            });
                        } else {
                            return UserModel.findOneAndUpdate(
                                {_id:userId},
                                {$addToSet:{schools:insertSchool},$set:{update_dt:Date()}},
                                {new:true,useFindAndModify:true})
                                .exec()
                        }
                    }).then((result)=>{
                        if(result==null){
                            console.log("test")
                            res.status(400).json({
                                "message":"서버에러입니다."
                            });
                        } else {
                            res.status(200).json({
                                result
                            });
                        }
                    }).catch((error)=>{
                        res.status(400).json({
                            "message":error.message
                        });
                    })
            } else {
                res.status(401 ).json({
                    "message" : "학생 권한이 아닙니다."
                })
            }
        }
    }

    public async setUnsubscribeSchool(req:Request, res:Response, next:NextFunction){
        // 권한 가져오기
        let checkAuth:any = await AuthController.checkAuth(req,res)

        if( checkAuth.status != 200){
            res.status(checkAuth.status).json({"message":checkAuth.message})
        } else {
            let user = checkAuth.user;

            if( user.role === 'student'){

                let userId = user._id
                let insertSchool = req.params.id

                await SchoolModel.findOneAndUpdate({_id:insertSchool}
                    ,{$pull:{subscribe_users:userId}},
                    {useFindAndModify:false}).exec()
                    .then((result)=>{
                        if(result==null){
                            res.status(400).json({
                                "message":"서버에러입니다."
                            });
                        } else {
                            return UserModel.findOneAndUpdate(
                                {_id:userId},
                                {$pull:{schools:insertSchool},$set:{update_dt:Date()}},
                                {new:true,useFindAndModify:false})
                                .exec()
                        }
                    }).then((result)=>{
                        if(result==null){
                            console.log("test")
                            res.status(400).json({
                                "message":"서버에러입니다."
                            });
                        } else {
                            res.status(200).json({
                                result
                            });
                        }
                    }).catch((error)=>{
                        res.status(400).json({
                            "message":error.message
                        });
                    })

                /*
                await UserModel.findOneAndUpdate(
                    {_id:userId},
                    {$pull:{schools:insertSchool},$set:{update_dt:Date()}},
                    {new:true})
                    .exec().then((result)=>{
                        console.log(result)
                        res.status(200).json({
                            result
                        });
                    }).catch((error)=>{
                        res.status(400).json({
                            "message":error.message
                        });
                    })*/
            } else {
                res.status(401 ).json({
                    "message" : "학생 권한이 아닙니다."
                })
            }
        }
    }

    public async getSubscribeSchoolNews(req:Request,res:Response,next:NextFunction){

        let checkAuth:any = await AuthController.checkAuth(req,res)

        if( checkAuth.status != 200){
            res.status(checkAuth.status).json({"message":checkAuth.message})
        } else {
            let user = checkAuth.user;
            if( user.role === 'student'){
                let userId = user._id
                await UserModel.findById(userId).exec()
                    .then((results:any)=>{
                        if(results==null){
                            res.status(204).json({"message":"해당학생이 없습니다."})
                        }else{
                            NewsModel.find({_id:results.news},{},{})
                                .sort({create_dt:-1}).exec()
                                .then((resultNews)=>{
                                    res.status(200).json(resultNews)
                                })
                                .catch((e)=>{
                                    res.status(400).json({"message":"서버에러가 발생했습니다."})
                                })
                        }
                    }).catch((e)=>{
                        res.status(400).json({"message":"서버에러가 발생했습니다."})
                    })
            } else {
                res.status(401 ).json({
                    "message" : "학생 권한이 아닙니다."
                })
            }
        }
    }
}