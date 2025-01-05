import { ArgumentsHost, BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ZodValidationExceptionFilter } from "./zod-exception-filter";
import { ZodError, ZodIssue, ZodIssueCode } from "zod";
import { ZodValidationException } from "nestjs-zod";
import { composeZodMessage } from "@libs/commons/zod/zod.utils";




describe('RestExeptionFilter', () => {
    let filter: ZodValidationExceptionFilter;
    let host: ArgumentsHost;
   
    
    beforeAll(async () => {
      
      host = jest.createMockFromModule('@nestjs/common')
    })
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
  
        providers: [ZodValidationExceptionFilter],
      }).compile();
  
      filter = module.get<ZodValidationExceptionFilter>(ZodValidationExceptionFilter);

      
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
  
  
    it('should be defined', () => {
      expect(filter).toBeDefined();
    });
   
    it('should throw a correct exception', () => {
     //@ts-ignore
     const issues:ZodIssue[]=[{path:['age'],message:'Broken!' }]
     const error = new ZodError(issues);
      const exception = new ZodValidationException(error);
      const message: string = composeZodMessage(error.issues );
     
    try{
        filter.catch(exception)
    }catch(err){
        expect(err instanceof BadRequestException).toBeTruthy();
        expect(err.message).toEqual(message);
    }
    
    });
})