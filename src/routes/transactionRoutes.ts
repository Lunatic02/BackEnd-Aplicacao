import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { verifyJwt } from "../controller/user"


export async function transactionRoutes(app: FastifyInstance) {
  app.get('/hi', {onRequest: [verifyJwt]},(request: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send('oiii')
  })
}