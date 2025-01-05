import { ArgumentsHost } from "@nestjs/common";
import { ZodValidationExceptionFilter } from "./zod-filter";
import { Test, TestingModule } from "@nestjs/testing";
import { ZodError } from "zod";
import { randomUUID } from "crypto";
import { ZodValidationException } from "nestjs-zod";
import { composeZodMessage } from "@libs/commons/zod/zod.utils";




describe('ZodExeptionFilter', () => {
    let filter: ZodValidationExceptionFilter;
    let host: ArgumentsHost;
    let sendMock;
   
    
    beforeAll(async () => {
      
      host = jest.createMockFromModule('@nestjs/common')
    })
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
  
        providers: [ZodValidationExceptionFilter],
      }).compile();
  
      filter = module.get<ZodValidationExceptionFilter>(ZodValidationExceptionFilter);
     
      sendMock = jest.fn()
      
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
  
  
    it('should be defined', () => {
      expect(filter).toBeDefined();
    });
   
      it('should return correct error message, code', () => {
        //@ts-ignore
        const issues:ZodIssue[]=[{path:['age'],message:'Broken!' }];
        const zodError = new ZodError(issues);
    
        const exception = new ZodValidationException(zodError);
        
       
        const data = {
              
          userId: randomUUID(),
          message:'Msg_A'    
        } 
    
        host.switchToWs = jest.fn().mockImplementation(() => {
          return {
                  getClient:  <T>() => {
                                  return {
                                      send: sendMock
                                  }
                  },
                   getData: <T>()=>{
                                return data
                  }
          }
        });
        filter.catch(exception, host);
        expect(sendMock).toBeCalledWith(expect.objectContaining({userId: data.userId}));
        expect(sendMock).toBeCalledWith(expect.objectContaining({message: data.message}));
        expect(sendMock).toBeCalledWith(expect.objectContaining({error:composeZodMessage(issues)}));
              
      
        
      });
})