import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { verifyJwt } from "../controller/user"
import { PrismaClient } from "@prisma/client"
import { UserProps } from "../@types/types"
import { z } from "zod"

const prisma = new PrismaClient()

export async function transactionRoutes(app: FastifyInstance) {
  app.post('/transaction/:id', {onRequest: [verifyJwt]},async (request: FastifyRequest, response: FastifyReply) => {
    const {id}= request.params as { id: string }
    const user: any = await prisma.user.findUnique({
      where: {
        email: id
      }
    })

    const bodyTransactionsParamsSchema = z.object({
      title: z.string(),
      amount: z.number(),
      description: z.string(),
      category: z.string(),
      type: z.string()
    });

    const { title, amount, description, category, type } = bodyTransactionsParamsSchema.parse(request.body);
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        title,
        amount,
        description,
        category,
        type
      }
    })
    if(transaction){
      return response.status(200).send(transaction);
    }else{
      return response.status(400).send('transaction');
    }
  })
  app.get('/transaction/:id', {onRequest: [verifyJwt]},async (request: FastifyRequest, response: FastifyReply) => {
    const {id}= request.params as { id: string }
    const user: any = await prisma.user.findUnique({
      where: {
        email: id
      }
    })
    const transaction = await prisma.transaction.findMany({
     where: {
      userId: user.id
     }
    })

    return response.status(200).send(transaction);
  })
}