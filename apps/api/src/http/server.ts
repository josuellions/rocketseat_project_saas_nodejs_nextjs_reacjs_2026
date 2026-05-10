import { fastify } from 'fastify';
import fastifyJwt  from "@fastify/jwt";
import fastifyCors  from "@fastify/cors";
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';

import { 
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider 
} from 'fastify-type-provider-zod';

import { authenticateWithPassword } from './routes/auth/authenticate-with-password';
import { authenticateWithGithub } from './routes/auth/authenticate-with-github';
import { requestPasswordRecover } from './routes/auth/request-password-recover';
import { requestPasswordReset } from './routes/auth/request-password-reset';
import { createAccount } from './routes/auth/create-account';
import { getUserProfile } from './routes/auth/get-profile';
import { errorHandler } from './error-handler';

import { env } from '@saas_node_next_react/env';

const port = env.SERVER_PORT;
const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.setErrorHandler(errorHandler);

app.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.0',

    info: {
      title: 'SAAS-NEXT-PROJECTS',
      description: 'Full-stack SaaS app with multi-tenant & RBAC',
      version: '1.0.0',
    },

    components: {
      securitySchemes: {
        Authorization: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'JWT obtained from authentication route.',
        },
      },
    },

    security: [
      {
        Authorization: [],
      },
    ],

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

app.register(fastifyJwt, {
  secret: env.JWT_SECRET
})

app.register(fastifyCors);
app.register(createAccount);
app.register(getUserProfile);
app.register(requestPasswordReset);
app.register(requestPasswordRecover);
app.register(authenticateWithGithub);
app.register(authenticateWithPassword);


app.listen({ port }).then(() => {
  console.info(`HTTP server running, port: ${port}`)
})
