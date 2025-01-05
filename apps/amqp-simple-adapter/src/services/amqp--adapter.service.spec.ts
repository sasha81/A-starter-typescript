import { Test, TestingModule } from "@nestjs/testing";
import { AmqpAdapterService } from "./amqp-adapter.service";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { GreetQuery } from "@libs/users/queries/greet.query";
import { AmqpCreateUserDto, AmqpUpdateUserDto } from "../dto/users-dto";


describe('AmqpAdapterService', () => {
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  let senderService: AmqpAdapterService;
  beforeAll(async () => {
    jest.useRealTimers()

    commandBus = jest.createMockFromModule('@nestjs/cqrs');
    queryBus = jest.createMockFromModule('@nestjs/cqrs');
  })
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({

      providers: [AmqpAdapterService, { provide: CommandBus, useValue: commandBus }, { provide: QueryBus, useValue: queryBus }],
    }).compile();

    senderService = module.get<AmqpAdapterService>(AmqpAdapterService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should be defined', () => {
    expect(senderService).toBeDefined();
  });

  it('should emit a correct query when called  greetUser(...)', async () => {
    const name = 'ABC'; const greet = 'Hello ';
    const query = new GreetQuery(name)
    const executeMock = jest.fn().mockReturnValue(Promise.resolve(greet + name));
    queryBus.execute = executeMock;
    const result = await senderService.greetUser(name);
    expect(result).toEqual(greet + name)
    expect(executeMock).toBeCalledWith(expect.objectContaining({ name }))

  });
  it('should emit a correct command when called  createUser(...)', async () => {
    const name = 'ABC'; const age = 18; const userId = 'abcdef'; const createUserDto: AmqpCreateUserDto = {
      name,
      age
    }
    const user: AmqpUpdateUserDto = { userId, name, age }
    const query = new GreetQuery(name)
    const executeMock = jest.fn().mockReturnValue(Promise.resolve(user.userId));
    commandBus.execute = executeMock;
    const result = await senderService.createUser(createUserDto);
    expect(result).toEqual(user)
    expect(executeMock).toBeCalledWith(expect.objectContaining(createUserDto))

  });

});
