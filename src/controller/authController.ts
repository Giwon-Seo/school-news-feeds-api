import mongoose from "mongoose"
import {Response,Request} from "express";
import {UserSchema} from "../model/userModel";
import jwt from "jsonwebtoken"
import config from "../config/config";
import {promises} from "dns";
import {userInfo} from "os";

const User = mongoose.model('user',UserSchema)

export class AuthController{

    public signup(req:Request,res:Response){

        let newUser = new User(req.body);
        const checkUser = User.findOne(req.body)

        if(!checkUser){
            res.send({
                message:"해당 아이디는 이미 존재 합니다."
            });
        } else {
            newUser.save((error, user)=>{
                if(error){
                    res.send(error.message)
                } else {
                    let token = AuthController.getToken(user.id);
                    res.json({user,token:token})
                }
            });
        }
    }

    public login(req:Request, res:Response) {
        User.findOne(req.body).then( ( userInfo )=>{
            if( userInfo != null){
                console.log(userInfo._id)
                let token = AuthController.getToken(userInfo._id);
               return res.json({token:token});
            } else {
                return res.json({"message":"비밀번호,아이디가 틀렸습니다."});
            }
        });
    }

    private static getToken(id:String) {
        console.log("Token");
        let token = jwt.sign({
            _id:id
        }, config.jwt_secret_key);
        return token;
    }

    public static async checkAuth(req:Request, res:Response):Promise<any>{
        let token = req.header("x-access-token")

        let returnJson = null;

        if( token ) {
            try{
            const decode:any = jwt.verify(token, config.jwt_secret_key);
            let decodeId = decode._id

            let user:any = await User.findById(decodeId).exec().then((result)=>{
                return result;
            })

            returnJson = {
                "status" : 200
                , "user" : user
            }
            return returnJson;
            } catch (e) {
                return {
                    "status" : 500
                    ,"message":"x-access-token 값이 잘못됬습니다."
                }
            }
        } else {
            returnJson = {
                "status" : 400
                ,"message" : "header 에 x-access-token 값이 없습니다."
            }
            return returnJson;
        }
    }
}

