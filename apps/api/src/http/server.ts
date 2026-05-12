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
import { transferOrganization } from './routes/orgs/transfer-organization';
import { createOrganization } from './routes/orgs/create-organization';
import { updateOrganization } from './routes/orgs/update-organization';
import { deleteOrganization } from './routes/orgs/delete-organization';
import { getOrganizations } from './routes/orgs/get-organizations';
import { getOrganization } from './routes/orgs/get-organization';
import { createProject } from './routes/projects/create-project';
import { deleteProject } from './routes/projects/delete-project';
import { updateProject } from './routes/projects/update-project';
import { createInvite } from './routes/invites/create-invite';
import { getMembership } from './routes/orgs/get-membership';
import { createAccount } from './routes/auth/create-account';
import { updateMember } from './routes/members/update-member';
import { removeMember } from './routes/members/remove-member';
import { acceptInvite } from './routes/invites/accept-invite';
import { rejectInvite } from './routes/invites/reject-invite';
import { revokeInvite } from './routes/invites/revoke-invite';
import { getProjects } from './routes/projects/get-projects';
import { getProject } from './routes/projects/get-project';
import { getUserProfile } from './routes/auth/get-profile';
import { getMembers } from './routes/members/get-members';
import { getInvites } from './routes/invites/get-invites';
import { getInvite } from './routes/invites/get-invite';
import { errorHandler } from './error-handler';

import { env } from '@saas_node_next_react/env';

const port = env.SERVER_PORT;
const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.setErrorHandler(errorHandler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'SAAS-NEXT-PROJECTS',
      description: 'Full-stack SaaS app with multi-tenant & RBAC',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: '/docs'
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET
})

app.register(fastifyCors);
app.register(createAccount);
app.register(getMembership);
app.register(getUserProfile);
app.register(getOrganization);
app.register(getOrganizations);
app.register(createOrganization);
app.register(updateOrganization);
app.register(deleteOrganization);
app.register(transferOrganization);
app.register(requestPasswordReset);
app.register(requestPasswordRecover);
app.register(authenticateWithGithub);
app.register(authenticateWithPassword);

app.register(createProject);
app.register(deleteProject);
app.register(updateProject);
app.register(getProjects);
app.register(getProject);

app.register(updateMember);
app.register(removeMember);
app.register(getMembers);

app.register(createInvite);
app.register(acceptInvite);
app.register(rejectInvite);
app.register(revokeInvite)
app.register(getInvites);
app.register(getInvite);

app.listen({ port }).then(() => {
  console.info(`HTTP server running, port: ${port}`)
})
