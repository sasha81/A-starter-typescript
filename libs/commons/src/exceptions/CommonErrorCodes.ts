export enum CommonErrorCodes {
    AUTHENTICATION= 401,
    AUTHORIZATION = 403,
    NOT_FOUND = 404,
    CLIENT = 400,
    SERVER = 500,
  }

export  const commonExceptionTypesMap = new Map<string, number>()
	.set('authentication', 401)
	.set('authorization', 403)
	.set('not_found', 404)
	.set('client', 400)
	.set('server', 500);