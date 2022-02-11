import express, { json } from 'express';
import cors from 'cors';
import { userSignUp, userSignIn } from './controllers/userController.js';
import { postRegistry, getRegistries } from './controllers/registryController.js';
import { verificaToken, deleteSession } from './controllers/sessionController.js';

const app = express();
app.use(json());
app.options('*', cors());
app.use(cors());

///////////////////////////////////////////////////////////////////////////////////////SERVER ROUTES

app.post('/user/signup', userSignUp);

app.post('/user/signin', userSignIn);

app.post('/registry', verificaToken, postRegistry);

app.get('/registry', verificaToken, getRegistries);

app.delete('/session', deleteSession);

app.listen(process.env.PORT, (port) => {
	console.log("Server running on port " + process.env.PORT);
});