const methods = ['body', 'params', 'headers', 'query']


export const validation = (schema) => {
    let validateArray = [];
    try {
        return (req, res, next) => {
            methods.forEach(key => {
                if (schema[key]) {
                    const validationresult = schema[key].validate(req[key], { abortearly: false });  // {abortearly: false} >> to return all the errors not the first only

                    if (validationresult?.error?.details) { // if there an error print it 
                        validateArray.push(validationresult.error.details)
                    }
                }
            })
            if (validateArray.length > 0) {
                res.json({ message: "Validate Error", err: validateArray })
            } else {
                next()
            }
        }
    } catch (error) {
        res.json({ message: "catch validate Error", error })

    }
}
