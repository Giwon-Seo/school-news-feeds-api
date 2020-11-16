import express, {Request,Response,Express} from 'express'
import {AuthController} from "../controller/authController";
import {SchoolController} from "../controller/schoolController";
import {NewsController} from "../controller/newsController";
import {SubscribeController} from "../controller/subscribeController";


export class Routes{

    public AuthController : AuthController = new AuthController();
    public SchoolController : SchoolController = new SchoolController();
    public NewsController : NewsController = new NewsController();
    public SubscribeController : SubscribeController = new SubscribeController();

    public routes(app:express.Application):void {
        app.route("/").get(
            (req:Request, res:Response) =>{
                res.status(200).send({
                    message:"test"
                })
            }
        )

        // 권한

        app.route('/auth/login').post(this.AuthController.login);
        app.route('/auth/signup').post(this.AuthController.signup);


        // 학교
        app.route('/school').post(this.SchoolController.createSchool);
        app.route('/school').get(this.SchoolController.getSchools);

        // 뉴스
        app.route('/school/:id/news').post(this.NewsController.createNews);
        app.route('/school/:id/news').put(this.NewsController.updateNews);
        app.route('/school/:id/news').delete(this.NewsController.deleteNews);

        // 구독
        app.route('/subscribe').get(this.SubscribeController.getSubscribeSchool);
        app.route('/subscribe/news').get(this.SubscribeController.getSubscribeSchoolNews);
        app.route('/subscribe/:id').put(this.SubscribeController.setSubscribeSchool)
        app.route('/unsubscribe/:id').put(this.SubscribeController.setUnsubscribeSchool);

    }

}
