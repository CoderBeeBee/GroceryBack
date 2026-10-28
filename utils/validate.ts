import { type NextFunction,type Request,type Response } from "express"
import z, { ZodType } from "zod"
import { CustomError } from "./customError.ts"

type RequestQuery = 'query' | 'params' | 'body'
type ValidateQuery = 'validatedQuery' | 'validatedBody' | 'validatedParams'



const validate =<T extends ZodType> (schema: T,query: RequestQuery,validated:ValidateQuery)=> (req:Request,res:Response,next:NextFunction) => {
    
    const result = schema.safeParse(req[query])
   
    if(!result.success){
        const {fieldErrors} = z.flattenError(result.error)
       
        throw new CustomError({message: 'Validation Error', statusCode:422, errors:fieldErrors})
    }

    req[validated] = result.data
    next()

}

export default validate