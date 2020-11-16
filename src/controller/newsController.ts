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

export class NewsController{

    public async createNews(req:Request, res:Response, next:NextFunction){

        // 권한 가져오기
        let checkAuth:any = await AuthController.checkAuth(req,res)

        if( checkAuth.status != 200){
            res.status(checkAuth.status).json({"message":checkAuth.message})
        } else {
            let user = checkAuth.user;
            if( user.role === 'admin'){
                let schoolId = req.params.id;
                let schoolInfo = SchoolModel.findById(schoolId,(error,results)=>{

                    if(error){
                        res.status(400).json({
                            "message":error.message
                        });
                    } else {
                        if( results == null){
                            res.status(204).json({"message":"해당학교가 없습니다."})
                        } else {
                            let resultNews:any;
                            new NewsModel({
                                sj:req.body.sj,
                                cn:req.body.cn,
                                school:results
                            }).save().then((results2:any)=>{
                                resultNews = results2
                                if( results2 == null){
                                    res.status(400).json({"message":"서버에 에러가 발생했습니다."})
                                } else {

                                    return UserModel.updateMany({schools:results._id}
                                    ,{$addToSet:{news:results2._id}}
                                    ,{}).exec()

                                }
                            }).then((results3)=>{
                                res.status(200).json(resultNews)

                            }).catch((e)=>{
                                console.log(e)
                                res.status(400).json({
                                    "message":"서버에러가 발생했습니다."
                                })
                            })
                        }

                    }
                })
            } else {
                res.status(401 ).json({
                    "message" : "관리자 권한이 아닙니다."
                })
            }
        }

    }

    public async deleteNews(req:Request, res:Response){
        // 권한 가져오기
        let checkAuth:any = await AuthController.checkAuth(req,res)

        if( checkAuth.status != 200){
            res.status(checkAuth.status).json({"message":checkAuth.message})
        } else {
            let user = checkAuth.user;
            if( user.role === 'admin'){
                let schoolId = req.params.id;
                let schoolInfo = SchoolModel.findById(schoolId,(error,results)=>{
                    if(error){
                        res.status(400).json({
                            "message":error.message
                        });
                    } else {
                        if( results == null){
                            res.status(204).json({"message":"해당학교가 없습니다."})
                        } else {
                            NewsModel.findOne({_id:req.body._id}).exec()
                                .then((result)=>{
                                    let reqBody = req.body;
                                    if(result){
                                        return NewsModel.deleteOne({_id:result._id}
                                        ).exec()
                                    } else {
                                        res.status(204).json({"messgae":"해당 뉴스가 없습니다."})
                                    }
                                }).then((updatedResult)=> {
                                res.status(200).json(updatedResult)
                            }).catch((error)=>{
                                res.status(400).json({"message":error.message})
                            })
                        }
                    }
                })
            } else {
                res.status(401 ).json({
                    "message" : "관리자 권한이 아닙니다."
                })
            }
        }
    }

    public async updateNews(req:Request, res:Response){
        // 권한 가져오기
        let checkAuth:any = await AuthController.checkAuth(req,res)

        if( checkAuth.status != 200){
            res.status(checkAuth.status).json({"message":checkAuth.message})
        } else {
            let user = checkAuth.user;
            if( user.role === 'admin'){
                let schoolId = req.params.id;
                let schoolInfo = SchoolModel.findById(schoolId,(error,results)=>{
                    if(error){
                        res.status(400).json({
                            "message":error.message
                        });
                    } else {
                        if( results == null){
                            res.status(204).json({"message":"해당학교가 없습니다."})
                        } else {
                            NewsModel.findOne({_id:req.body._id}).exec()
                                .then((result)=>{
                                    let reqBody = req.body;

                                    if(result){
                                        return NewsModel.findOneAndUpdate({_id:result._id}
                                        ,{$set:{
                                                cn:reqBody.cn
                                                , sj:reqBody.sj
                                            }
                                        },{new:true}).exec()
                                    }
                                }).then((updatedResult)=> {
                                res.status(200).json(updatedResult)
                            }).catch((error)=>{
                                res.status(400).json({"message":error.message})
                            })
                        }
                    }
                })
            } else {
                res.status(401 ).json({
                    "message" : "관리자 권한이 아닙니다."
                })
            }
        }
    }
}

