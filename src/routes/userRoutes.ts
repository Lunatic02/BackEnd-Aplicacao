import { FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { verifyJwt } from "../controller/user";
import { request } from "http";


const prisma = new PrismaClient()

export const userRoutes = async (app: FastifyInstance)=>{
  app.post('/register', async (request: FastifyRequest, response: FastifyReply)=>{
    const bodyUserParamsSchema = z.object({
      email: z.string(),
      password: z.string().min(6),
      name: z.string()
    })
    const {email, password, name} = bodyUserParamsSchema.parse(request.body)
    
     const user = await prisma.user.create({
        data: {
          email,
          password,
          name,
        }
      })
      return response.status(200).send(user)
    })
  app.post('/login', async (request: FastifyRequest, response: FastifyReply)=>{ 
      const bodyUserParamsSchema = z.object({
        email: z.string(),
        password: z.string().min(6),
      })
      const {email, password } = bodyUserParamsSchema.parse(request.body)
      const user : any= await prisma.user.findUnique({
        where: {
          email: email,
          password: password,
        }
      })

      const token = await response.jwtSign(
        {},
        {
          sign: {
            sub: user.id,
          },
        },
      )


  
      if(!user){
        return response.status(400).send('Usuario incorreto')
      }
      
    return response.status(200).send({token: token})
   })
  app.get('/me/:id', {onRequest: [verifyJwt]}, async (request: FastifyRequest, response: FastifyReply)=>{
    const {id} = request.params
    const user = await prisma.user.findUnique({
      where: {
        email: id
      }
    })
    response.code(200).send(user)
  })
}