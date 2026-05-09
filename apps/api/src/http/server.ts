import { fastify } from 'fastify';
import { fastifyCors } from "@fastify/cors";
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';

import { 
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider 
} from 'fastify-type-provider-zod';

import { createAccount } from './routes/auth/create-account';

const port = 3333;
const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'SAAS-NEXT-PROJECTS',
      description: 'Full-stack SassS app woth multi-tenant & RBAC',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,

  // You can also create transform with custom skiplist of endpoints that should not be included in the specification:
  //
  // transform: createJsonSchemaTransform({
  //   skipList: [ '/documentation/static/*' ]
  // })
});

app.register(fastifySwaggerUI, {
  routePrefix: '/docs'
})

app.register(fastifyCors);
app.register(createAccount)

app.listen({ port }).then(() => {
  console.info(`HTTP server running, port: ${port}`)
})
