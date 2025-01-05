
import { Test } from '@nestjs/testing';
import { GreetQueryHandler } from './greet.query.handler';
import { GreetQuery } from '../greet.query';


describe('GreetQueryHandler', () => {
  let greetQueryHandler: GreetQueryHandler;


  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({

      providers: [GreetQueryHandler],
    }).compile();

    greetQueryHandler = moduleRef.get<GreetQueryHandler>(GreetQueryHandler);

  });

  describe('Greet', () => {
    it('should great a user', async () => {
      const name = 'Sasha';
      const greetQuery = new GreetQuery(name)

      expect(await greetQueryHandler.execute(greetQuery)).toBe('Greet handler greets ' + name);
    });
  });
});
