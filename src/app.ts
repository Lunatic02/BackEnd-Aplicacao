import fastify from 'fastify'
import { userRoutes } from './routes/userRoutes'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import { hiRoutes } from './routes/hiRoutes';
import fastifyJwt from '@fastify/jwt';
import dotenv from 'dotenv';

export const app = fastify()
dotenv.config();
app.register(cookie)
app.register(cors, {
  methods: ['GET', 'POST']
})
const secret = process.env.JWT_SECRET;
app.register(fastifyJwt, {
  secret: `${secret}`
})



app.register(userRoutes)
app.register(hiRoutes)