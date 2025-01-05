import { ZodIssue } from "zod"

export const composeZodMessage=(issues: ZodIssue[]):string=>{   
    const outputArr = issues.map(issue=>{
        return {fields:issue.path, reason:issue.message}     
    })
    return JSON.stringify(outputArr)

} 