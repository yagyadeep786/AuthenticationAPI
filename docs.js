const swaggerJsDoc= require("swagger-jsdoc");
const swaggerUi= require("swagger-ui-express");
const route= require("express").Router();

const options={
    definition:{
        openapi:"3.0.0",
        info:{
            title:"Authentication Api",
            version:"1.0.0",
        },
        servers:[
            {
                url:"http://localhost:3000"
            }
        ]
    },
    apis:['./docs.js']
}

const swaggerSpec= swaggerJsDoc(options);


route.use("/",swaggerUi.serve,swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 *  componets:
 *      schema:
 *          user:
 *              type:object
 *              properties:
 *                  name:
 *                      type:string
 *                  email:
 *                      type:string
 *                  password:
 *                      type:string
 * 
 */

/**
 * @swagger
 * /:
 *  get:
 *      summary: This is the best
 *      discription: THis is api
 *      responses:
 *          200:
 *              discription: To test method
 *              content:
 *                  application/json:
 *                      schema:
 *                      type:array
 *                      items:
 *                     $ref:componets/schema/user
 */


module.exports= route;
