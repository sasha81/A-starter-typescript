import { Exception } from "@libs/commons/exceptions/CommonExceptions";
import { UserErrorCodes } from "./UserErrorCodes";

export class UsersNotFoundException extends Exception {
  constructor (taskId?: string, inner?:any) {
  	super(
        UserErrorCodes.NOT_FOUND,
      `USERS not found!`,
      'User',
      'TS',
      taskId,
      inner
     
    );
  }
}

export class UsersMalformedRequestException extends Exception {
  constructor (taskId?: string, inner?:any) {
  	super(
        UserErrorCodes.MALFORMED_REQUEST,
      `Malformed request for Users!`,
      'User',
      'TS',
      taskId,
      inner
     
    );
  }
}

export class UsersAggregateNotCreatedException extends Exception {
  constructor (userName: string, inner?:any) {
  	super(
        UserErrorCodes.AGGREGATE_NOT_CREATED,
      `Failed to create an aggregate for User: ${userName}`,
      'User',
      'TS',   
      inner
     
    );
  }
}
export class UsersAggregateNotUpdatedException extends Exception {
  constructor (userName: string, userId?: string, inner?:any) {
  	super(
        UserErrorCodes.AGGREGATE_NOT_UPDATED,
        userId ?`Failed to update an aggregate for UserId: ${userId}` : `Failed to update an aggregate: no userId for: ${userName}`,
      'User',
      'TS',   
      inner     
    );
  }
}