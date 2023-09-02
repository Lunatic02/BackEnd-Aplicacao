import fastify from 'fastify'
import { userRoutes } from './routes/userRoutes'
import jwt from "jsonwebtoken";
import cookie from '@fastify/cookie'
import { hiRoutes } from './routes/hiRoutes';
import fastifyJwt from '@fastify/jwt';


export const app = fastify()

app.register(cookie)
app.register(fastifyJwt, {
  secret: 'asdasdasd'
})



app.register(userRoutes)
app.register(hiRoutes)