import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { upsertEventsController } from '../controllers/upsert-event';


//const querystring = require ('querystring')
const Event = Type.Object({
	id: Type.String({ format: 'uuid' }),
	name: Type.String(),
	deta: Type.String(),
	Start_endTime:Type.String(),
	location:Type.String(),


});

type Event = Static<typeof Event>;//typebox

const GetContactsQuery = Type.Object({
	name: Type.Optional(Type.String()),
});
type GetContactsQuery = Static<typeof GetContactsQuery>;

export let events: Event[] = [
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', name: 'winterWonderLand',deta: '10jan-8jul' ,Start_endTime:'3:00pm-12:00am',location:'Riyadh'},
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa5', name: 'winterWonderLand',deta: '23jan-8jul' ,Start_endTime:'3:00pm-12:00am',location:'Riyadh' },
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa2', name: 'BLVD', deta: '12jan-8jul' ,Start_endTime:'3:00pm-12:00am',location:'Riyadh'},
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa1', name: 'BLVD', deta: '20jan-8jul' ,Start_endTime:'3:00pm-12:00am',location:'Riyadh'},
	{ id: '3fa85f64-5717-4562-b3fc-2c963f66afa3', name: 'muc', deta: '27jan-9jul' ,Start_endTime:'3:00pm-12:00am',location:'Riyadh' },
	{ id: '3', name: 'StageShow' ,deta:'20jan-8jul',Start_endTime:'9:00pm-12:00am',location:'Riyadh' },
];

export default async function (server: FastifyInstance) {
	server.route({
		method: 'PUT',
		url: '/events',
		schema: {
			summary: 'Creates new event + all properties are required',
			tags: ['Events'],
			body: Event,
		},
		handler: async (request, reply) => {
			const newEvent: any = request.body;
			return upsertEventsController(events, newEvent);
		},
	});

	server.route({
		method: 'PATCH',
		url: '/events/:id',
		schema: {
			summary: 'Update a event by id + you dont need to pass all properties',
			tags: ['Events'],
			body: Type.Partial(Event),
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const newEvent: any = request.body;
			return upsertEventsController(events, newEvent);
		},
	});

	server.route({
		method: 'DELETE',
		url: '/events/:id',
		schema: {
			summary: 'Deletes a events',
			tags: ['Events'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			events = events.filter((c) => c.id !== id);

			return events;
		},
	});

	server.route({
		method: 'GET',
		url: '/events/:id',
		schema: {
			summary: 'Returns one event or null',
			tags: ['Events'],
			params: Type.Object({
				id: Type.String({ format: 'uuid' }),
			}),
			response: {
				'2xx': Type.Union([Event, Type.Null()]),
			},
		},
		handler: async (request, reply) => {
			const id = (request.params as any).id as string;

			return events.find((c) => c.id === id) ?? null;
		},
	});

	server.route({
		method: 'GET',
		url: '/events',
		schema: {
			summary: 'Gets all events',
			tags: ['Events'],
			querystring: GetContactsQuery, // get ,querystring
			response: {
				'2xx': Type.Array(Event),
			},
		},
		handler: async (request, reply) => {
			const query = request.query as GetContactsQuery;

			if (query.name) {
				return events.filter((c) => c.name.includes(query.name ?? ''));
			} else {
				return events;
			}
		},
	});
}
