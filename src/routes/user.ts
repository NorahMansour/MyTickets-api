import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
//import { type } from 'os';
import { upsertUserController } from "../controllers/upsert-user";

const user = Type.Object({
  id: Type.String({ format: "uuid" }),
  name: Type.String(),
  password: Type.String(),
});

type User = Static<typeof user>; // typebox

export let users: User[] = [
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    name: "Norah",
    password: "1234@nn",
  },
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa5",
    name: "wad",
    password: "4567@nn",
  },
];

export default async function (server: FastifyInstance) {
  server.route({
    method: "PUT",
    url: "/user/create",
    schema: {
      summary: "Creates new user + all properties are required",
      tags: ["User"],
      body: users,
    },
    handler: async (request, reply) => {
      const newUser: any = request.body;
      return upsertUserController(users, newUser);
    },
  });

  server.route({
    method: "DELETE",
    url: "/users/:id",
    schema: {
      summary: "Deletes a user",
      tags: ["User"],
      params: Type.Object({
        id: Type.String({ format: "uuid" }),
      }),
    },
    handler: async (request, reply) => {
      const id = (request.params as any).id as string;

      users = users.filter((c) => c.id !== id);

      return users;
    },
  });
}
