import { FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { verifyJwt } from "../controller/user";
import { request } from "http";
import { compare, hash } from "bcryptjs";


const prisma = new PrismaClient()

export const userRoutes = async (app: FastifyInstance)=>{
  app.post('/register', async (request: FastifyRequest, response: FastifyReply) => {
    const bodyUserParamsSchema = z.object({
      email: z.string(),
      password: z.string().min(6),
      name: z.string()
    });
    const { email, password, name } = bodyUserParamsSchema.parse(request.body);
  
    // Criar um hash da senha antes de salvar no banco de dados
    const passwordHash = await hash(password, 10); // Use o valor de salto desejado (aqui 10)
  
    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHash, // Salve o hash no banco de dados
        name,
      }
    });
  
    return response.status(200).send(user);
  });
  app.post('/login', async (request: FastifyRequest, response: FastifyReply) => {
    const bodyUserParamsSchema = z.object({
      email: z.string(),
      password: z.string().min(6),
    });
    const { email, password } = bodyUserParamsSchema.parse(request.body);
  
    const user = await prisma.user.findUnique({
      where: {
        email,
      }
    });
  
    if (!user) {
      return response.status(400).send('Usuário incorreto');
    }
  
    const passwordMatches = await compare(password, user.password);
  
    if (!passwordMatches) {
      return response.status(400).send('Senha incorreta');
    }
  
    const token = await response.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )

  
    return response.status(200).send({ token });
  });

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

