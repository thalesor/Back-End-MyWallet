import { dbService } from '../services/db-service.js';
import { validateRegistry } from '../services/joi-service.js';

async function postRegistry(req, res)
{
    const postdata = res.locals.postdata;
    const validation = validateRegistry(postdata);
    if(validation.hasErrors === false)
    {
        try
        {
            const result = await dbService.insert("registries",
            postdata
            );
            if(result)
            {
                res.sendStatus(201);
                return;
            }
            const response = `
            Não será possível registrar a entrada devido a um erro na base de dados`;
            res.status(500).json(response);
            return;
        }
        catch(err)
        {
            const response = `
            Não será possível registrar a entrada devido a um erro no servidor`;
            res.status(500).json(response);
            return;
        } 
    }
    res.status(422).send(`Erros durante a validação dos dados no servidor:
    ${validation.errors}`);
}

async function getRegistries(req, res)
{
   try 
   {
       const  userid  = res.locals.user._id.toString();
       const registries = await dbService.find("registries", {userId: userid});
       if(registries.length)
       {
          return  res.status(200).json(registries);
       }
       res.status(500).json("Não há dados registrados ainda!");
   }
   catch(err)
   {
       res.status(500).json("Erro no servidor ao tentar retornar as operações registradas");
   }	
}

export { 
    postRegistry,
    getRegistries
}