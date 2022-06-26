import { server } from './server';


/*const mongoose = any {}
mongoose.co (()=>)*/


server.listen({ port: 3000 }).catch((err) => {
	server.log.error(err);
	process.exit(1);
});
