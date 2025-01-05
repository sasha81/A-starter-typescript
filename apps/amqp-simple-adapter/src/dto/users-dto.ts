import { CreateUserDto } from "@libs/users/commands/command-dto/create-user.dto";
import { UpdateUserDto } from "@libs/users/commands/command-dto/update-user.dto";
import { UserQueryDto } from "@libs/users/queries/query-dto/read-users.dto";




export class AmqpCreateUserDto extends CreateUserDto {}

export class AmqpUpdateUserDto extends UpdateUserDto {}

export class AmqpUserViewDto extends UserQueryDto {}

