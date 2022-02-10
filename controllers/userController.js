import { dbService } from '../services/db-service.js';
import { validateUser, validateSignUser } from '../services/joi-service.js';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

async function userSignUp(req, res)
{
    const validation = validateUser(req.body);
    if(validation.hasErrors === false)
    {
        try
        {
            delete req.body.repassword;
            req.body.password = bcrypt.hashSync(req.body.password, 10);
            const result = await dbService.insert("users",
            {...req.body}
            );
            if(result)
            {
                res.sendStatus(201);
                return;
            }
            const response = `
            Não será possível realizar o cadastro devido a um erro na base de dados`;
            res.status(500).json(response);
            return;
        }
        catch(err)
        {
            const response = `
            Não será possível realizar o cadastro devido a um erro no servidor`;
            res.status(500).json(response);
            return;
        } 
    }
    res.status(422).send(`Erros durante a validação do usuário :
    ${validation.errors}`);
}

async function userSignIn(req, res)
{
    const validation = validateSignUser(req.body);
    if(validation.hasErrors === false)
    {
        const user = await dbService.find("users",
         {email: req.body.email}
        );
        if(user[0])
        {
            if(bcrypt.compareSync(req.body.password, user[0].password))
            {
                const token = uuid();
                const sessionObj = {
					userId: user[0]._id,
					token: token
				};
				const result = await dbService.insert("sessions", sessionObj);
                if(result)
                {
                    sessionObj.name = user[0].name;
                    res.status(200).json(sessionObj);
                }
                else
                {
                    const response = `Erro ao tentar gravar a identificação do usuário`;
                    res.status(500).json(response);
                }
            }
            else
            {
                //a senha não bateu, mandar mensagem erro
                const response = `
                A senha digitada não confere com a base de dados!`;
                res.status(500).json(response);
            }
            return;
        }
        //não há usuários
        const response = `
        Não existem usuários com o email cadastrado!`;
        res.status(500).json(response);
        return; 
    }
    res.status(422).send(`Erros durante a validação do usuário :
    ${validation.errors}`);
}

export { 
    userSignUp,
    userSignIn
}