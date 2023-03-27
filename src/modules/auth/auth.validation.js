import joi from'joi';

export const signup = {

    body: joi.object().required().keys({
        name: joi.string().min(3).max(15).required(),  // .messages({  'error type' : "newmessage" ,  'error type' : "new message"}) to change message text
        email: joi.string().email().required(),
        password: joi.string().min(3).max(20).required(),
 
    })

}
export const signin = {
    body: joi.object().required().keys({
        email: joi.string().email().required().messages({
            'any.required': 'email is required',
        }),
        password: joi.string().required(),
    })

}


 