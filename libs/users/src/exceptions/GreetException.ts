import { Exception } from "@libs/commons/exceptions/CommonExceptions";
import { UserErrorCodes } from "./UserErrorCodes";





export class GreetException extends Exception {
  constructor (taskId?:string, inner?:any) {
  	super(
        UserErrorCodes.NOT_GREETED,
      `USER not greeted. Who the guy is?`,
      'User',
      'TS',
      taskId,
      inner
     
    );
  }
}