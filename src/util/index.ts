import path from "path";
import {SwaggerDefinition, Options} from 'swagger-jsdoc'

const swaggerDefinition:SwaggerDefinition= {

    // swagger 정보
    info :{
        title: 'school-news-feeds-api 사이트',
        version : '1.0.0',
        description:'school-news-feeds-api 사이트'
    },
    // 기본 루트 경로
    basePath:'/',
    // 사용 가능한 통신 방식
    schemes:['http'],

    components: {
        res: {
            BadRequest: {
                description: '잘못된 요청.',
                schema: {
                    $ref: '#/components/errorResult/Error'
                }
            },
            Forbidden: {
                description: '권한이 없슴.',
                schema: {
                    $ref: '#/components/errorResult/Error'
                }
            },
            NotFound: {
                description: '없는 리소스 요청.',
                schema: {
                    $ref: '#/components/errorResult/Error'
                }
            }, test : {
                description: '없는 리소스 요청.',
                schema: {
                    $ref: '#/components/tokenResult/Success'
                }
            }
        },
        errorResult: {
            Error: {
                type: 'object',
                properties: {
                    errMsg: {
                        type: 'string',
                        description: '에러 메시지 전달.'
                    }
                }
            }
        },
        tokenResult: {
            Success: {
                type: 'object',
                properties: {
                    token: {
                        type: 'string',
                        description: 'x-access-token 전달.'
                    }
                }
            }
        }
    },
};

export default {
    swaggerDefinition,
    // 라우트 경로 (API 위치)
    apis:[path.join((__dirname + "/../routes/**/*.ts")), path.join((__dirname + "/../util/swagger.yml"))]
}