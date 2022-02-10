import Joi from 'joi';
import pkg from 'joi-translation-pt-br';

const {messages} = pkg;

const userSchema = Joi.object({
  name: Joi.string().trim().min(3).regex(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  password: Joi.string().min(6).required(),
  repassword: Joi.string().min(6).required().valid(Joi.ref('password'))
});

const userSignSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().min(6).required()
  });
  
  const registrySchema = Joi.object({
    value: Joi.string().regex(/^(\d{1,3}(\.\d{3})*|\d+)(\,\d{2})?$/).required().label('valor'),
    description: Joi.string().min(6).required().label('descrição'),
    userId: Joi.string().required().label('identificação do usuário'),
    create_date: Joi.date().timestamp().required().label('data de criação'),
    type: Joi.valid('income', 'outcome').required().label('tipo da operação')
  });

function validateUser(userData) 
{
    const validation = userSchema.validate(userData, { messages, abortEarly: false });
    if(validation.error)
    {
        return {
            hasErrors: true,
            errors: validation.error.details.map(err => `*${err.message} 
            
            `)
        }
    }
    else
    {
        return {
            hasErrors: false
        }
    }
}

function validateSignUser(userData) 
{
    const validation = userSignSchema.validate(userData, { messages, abortEarly: false });
    if(validation.error)
    {
        return {
            hasErrors: true,
            errors: validation.error.details.map(err => `*${err.message} 
            
            `)
        }
    }
    else
    {
        return {
            hasErrors: false
        }
    }
}

function validateRegistry(data) 
{
    const validation = registrySchema.validate(data, { messages, abortEarly: false });
    if(validation.error)
    {
        return {
            hasErrors: true,
            errors: validation.error.details.map(err => `*${err.message} 
            
            `)
        }
    }
    else
    {
        return {
            hasErrors: false
        }
    }
}

export {
    validateUser,
    validateSignUser,
    validateRegistry
}