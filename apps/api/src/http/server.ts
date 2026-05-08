import { fastify } from 'fastify';
import { fastifyCors } from "@fastify/cors";

import { 
  // jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider 
} from 'fastify-type-provider-zod';

import { createAccount } from './routes/auth/create-account';

const port = 3333;
const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors);
app.register(createAccount)

app.listen({ port }).then(() => {
  console.info(`HTTP server running, port: ${port}`)
})
