import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function createAccount(app:FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/users', {
    schema: {
      body: z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)

      })
    }
  }, (req, res) => {
    const {name, email, password } = req.body;
    return {message:'User created', response: {name, email, password}};
  })
}