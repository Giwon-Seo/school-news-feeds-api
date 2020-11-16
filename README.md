**1.프로젝트 실행**
- 
`$npm run nodemon` : 개발용 서버 실행(소스변경시 서버 바로 재실행)<br>
`$npm run dev` : 개발용 서버 실행<br>
`$npm run build` : 소스 빌드(*.ts->*.js)<br>
------------------------
**2.디렉토리 구조**
- 
* src/config/config.ts : 환결설정 파일(ex:PORT,jwt_scret_key,db_url)
* src/controller : 컨트롤러 폴더
* src/model : 모델(스키마) 폴더
* src/routes/index.ts : 라우터 폴더
* src/app.ts : 미들웨어및 라우터 적용 파일
* src/util : swagger(API명세서) 파일

**3.API 명세서**

**서버실행후, /doc 주소로 접근, ex)localhost:4000/docs**
<br>
* 권한이 필요한경우, request header 에 <br>
**x-access-token={token:/auth/login}값 필요**





