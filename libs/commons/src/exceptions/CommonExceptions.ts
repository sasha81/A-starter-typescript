

export abstract class Exception extends Error{
    
      constructor (
      public readonly code: number | string,
      public readonly message: string,          
      public readonly module?: string,
      public readonly language?: string,
      public readonly taskId?: string, 
      public readonly inner?: any,      

    ) {
          super();
      }
  
      toString (): string {
        let returnObject= {code: this.code, message: this.message} as any
        if(this.module) returnObject = {...returnObject, module: this.module}
        if(this.language) returnObject = {...returnObject, language: this.language}
        if(this.inner) returnObject = {...returnObject, inner: this.inner}      

        return JSON.stringify(returnObject)
      
    }
  }

 