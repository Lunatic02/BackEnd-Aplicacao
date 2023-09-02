import fastify from 'fastify'
import { userRoutes } from './routes/userRoutes'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import { hiRoutes } from './routes/hiRoutes';
import fastifyJwt from '@fastify/jwt';


export const app = fastify()

app.register(cookie)
app.register(cors, {
  methods: ['GET', 'POST']
})
app.register(fastifyJwt, {
  secret: 'asdasdasd'
})



app.register(userRoutes)
app.register(hiRoutes)