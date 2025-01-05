import { Test, TestingModule } from "@nestjs/testing";
import { WsGateway } from "./ws.gateway";
import { SocketService } from "../services/socket.service";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Socket } from "socket.io";



describe('WS Gateway', () => {
    const originalEnv = process.env;
    let controller: WsGateway;
    
  
    let socketService: SocketService;
    let amqpConnection: AmqpConnection;
     let server: Socket;
  
    beforeAll(()=>{
        socketService = jest.createMockFromModule('../services/socket.service')
        amqpConnection = jest.createMockFromModule('@golevelup/nestjs-rabbitmq');
        server= jest.createMockFromModule('socket.io');
   
    })
  afterEach(()=>{
    jest.clearAllMocks();
    process.env = originalEnv;
   
  })
    beforeEach(async () => {
        jest.resetModules();
        process.env = {
          ...originalEnv,
          NODE_ENV: 'dev',
        };
  
      const app: TestingModule = await Test.createTestingModule({
       
        providers:[
            WsGateway,
            {
          provide: SocketService, useValue: socketService
        },
        {
          provide: AmqpConnection, useValue: amqpConnection
        }
      ]
       
      }).compile();
  
      controller = app.get<WsGateway>(WsGateway);
      controller.setServer(server) 
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
      });
   
     
  
      it(`should send messages to WS to the right topic`, async () => {
        const topic = 'right_topic'; const message = {message:'abc',userId:'123456'};
        process.env = {
            ...originalEnv,
            NODE_ENV: 'dev',
            WS_TOPIC:topic

          };
        const emitMock = jest.fn();
        controller.getServer().emit=emitMock;
        controller.sendMessageToWS(message)
        expect(emitMock.mock.calls).toEqual([[topic,message]]);
      });
  
     
    
  });