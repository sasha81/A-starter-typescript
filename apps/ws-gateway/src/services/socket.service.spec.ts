import { Test, TestingModule } from "@nestjs/testing";
import { SocketService } from "./socket.service";
import { Socket } from "socket.io";







describe('WS Socket Service', () => {
   
    let socketService: SocketService;
   
     let server: Socket;
  
    beforeAll(()=>{
      
       
        server= jest.createMockFromModule('socket.io');
   
    })
  afterEach(()=>{
    jest.clearAllMocks();
    
   
  })
    beforeEach(async () => {
        jest.resetModules();
       
  
      const app: TestingModule = await Test.createTestingModule({
       
        providers:[
            SocketService
      ]
       
      }).compile();
  
      socketService = app.get<SocketService>(SocketService);
       
    });
    it('should be defined', () => {
        expect(socketService).toBeDefined();
      });
   
      it(`should add a new connection when connected, socket on disconnect callback added`, () => {
        const onMock = jest.fn()
        server.on = onMock;
       
        socketService.handleConnection(server);
        expect(socketService.getConnectedClients().size).toEqual(1)
        expect(onMock.mock.calls[0][0]).toEqual('disconnect')
      });
  
    
  
     
    
  });