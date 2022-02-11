import { dbService } from '../services/db-service.js';

async function verificaToken(req, res, next) {
  
  let authorization = null;
  if(req.method === 'GET')
  authorization = req.headers.authorization;
	else if(req.method === 'POST')
  authorization = req.body.Authorization;

  const token = authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).send("Não autorizado!");
	}
  
  const session = await dbService.find("sessions",{ token: token });

  if (!session.length) {
    return res.status(401).send("Sessão encerrada!");
  }
  
  const user = await dbService.find("users", { 
		_id: session[0].userId 
	});
    
  if(user.length) {
        delete user[0].password;
        res.locals.user = user[0];
        if(req.method === 'POST')
        {
          delete req.body.Authorization;
          res.locals.postdata = req.body;
        }
    next();
    return;
  } 

  return res.status(404).send("Usuário não existe!");
 
}

async function deleteSession(req, res)
{
    const token = req.header('token');
    const matchSession = await dbService.find("sessions", { token: token });
    if(matchSession.length)
    {    
        const returnedRemovedSession = await dbService.deleteMany("sessions", { token: token });
        if(returnedRemovedSession)
        {
            return  res.sendStatus(200);
        }

        return res.status(500).send("Erro no servidor, falha ao tentar deletar a sessão");
    }
    
    res.status(404).send("Erro no servidor, a sessão não foi encontrada");
}

export { verificaToken, deleteSession };
