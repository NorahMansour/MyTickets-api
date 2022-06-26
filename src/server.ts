import fastifyAutoload from '@fastify/autoload';
import fastifySwagger from '@fastify/swagger';
import { ajvTypeBoxPlugin, TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastify from 'fastify';
import { join } from 'path'; // join from library to path, autoload


// create server(fastify)
export const server = fastify({logger: true,
	ajv: {
		customOptions: {
			removeAdditional: 'all',
			ownProperties: true,
		},
		plugins: [ajvTypeBoxPlugin],
	},
}).withTypeProvider<TypeBoxTypeProvider>();

//fastifySwagger
server.register(fastifySwagger, {
	routePrefix: '/docs',
	exposeRoute: true,
	mode: 'dynamic',
	openapi: {
		info: {
			title: 'myTickets API',
			version: '0.0.1',
		},
	},
});
// fastify- autload // يروح لمجلد ويسوي كل funcation 
server.register(fastifyAutoload, {
	dir: join(__dirname, 'routes'),
});
