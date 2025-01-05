
import { Test } from '@nestjs/testing';
import { UserQueryHandler } from './find-user.query.handler';
import { FindAllUsersQuery } from '../find-users.query';
import { UserQueryService } from '../user.query.service';
import { UserQueryDto } from '../query-dto/read-users.dto';
import { Group } from '@libs/users/users-mongodb/entities/users-view-mongodb.entity';


describe('UserQueryHandler', () => {
  let userQueryHandler: UserQueryHandler;
  let userQueryService: UserQueryService;
  const id = 1; const name = "Sasha"; const age = 42; const groups: Group[] = [{ groupId: 'abc', groupName: 'A', groupStatus: true, userId: id.toString(), userStatus: false }]
  const userDto = new UserQueryDto(id.toString(), name, age, groups)
  const userArray = [userDto];
  const resultFindAll = Promise.resolve(userArray)

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UserQueryHandler,
        {
          provide: UserQueryService,
          useValue: {
            findAllUsers: (arg) => {
              return resultFindAll
            },
          }
        }

      ],
    }).compile();
    userQueryHandler = moduleRef.get<UserQueryHandler>(UserQueryHandler);

  });


  it('should find all users', async () => {

    const query = new FindAllUsersQuery()
    const queryResult = await userQueryHandler.execute(query)

    expect(queryResult.length).toBe(userArray.length);
    expect(queryResult[0].userId).toEqual(id.toString())
    expect(queryResult[0].name).toEqual(name)
    expect(queryResult[0].age).toEqual(age)
    expect(queryResult[0].groups?.length).toEqual(groups.length)

  });

});
