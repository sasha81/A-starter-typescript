import { composeZodMessage } from "./zod.utils";

describe('Zod Urils',()=>{
    it('should correctly compose an exception message', () => {
        //@ts-ignore
        const issues:ZodIssue[]=[{path:['age'],message:'Broken!' }]       
        const message: string = composeZodMessage(issues);
      
          expect(message).toEqual(JSON.stringify([{fields:issues[0].path, reason:issues[0].message}]));        
     
      
      });
})