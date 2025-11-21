```
root/
└── server/
    └── src/
        ├── package.json               [js]
        ├── server.js                   [js] Entry point
        ├── app.js                      [js] Express app init
        ├── socket.js                   [js] Socket.IO gateway
        │
        ├── config/                     [folder]
        │   ├── index.js                [js]
        │   ├── db.js                   [js] MongoDB connection
        │   ├── redis.js                [js] Redis connection
        │   └── logger.js               [js] Logger
        │
        ├── middleware/                 [folder]
        │   ├── auth.middleware.js      [js]
        │   ├── rateLimit.middleware.js [js]
        │   ├── upload.middleware.js    [js]
        │   └── error.middleware.js     [js]
        │
        ├── utils/                       [folder]
        │   ├── jwt.js                   [js]
        │   ├── response.js              [js]
        │   ├── validators.js            [js]
        │   ├── encryption.js            [js] optional E2E
        │   ├── s3.js                    [js] cloud uploads
        │   ├── rtc.js                   [js] WebRTC ICE utils
        │   └── constants.js             [js]
        │
        ├── database/                    [folder]
        │   ├── models/                  [folder]
        │   │   ├── user.model.js        [model]
        │   │   ├── chat.model.js        [model]
        │   │   ├── message.model.js     [model]
        │   │   ├── group.model.js       [model]
        │   │   ├── call.model.js        [model]
        │   │   ├── status.model.js      [model]
        │   │   └── notification.model.js [model]
        │   │
        │   └── repositories/           [folder]
        │       ├── user.repo.js        [repo]
        │       ├── chat.repo.js        [repo]
        │       ├── message.repo.js     [repo]
        │       ├── call.repo.js        [repo]
        │       └── status.repo.js      [repo]
        │
        ├── modules/                     [folder]
        │   ├── auth/                    [folder]
        │   │   ├── auth.controller.js   [controller]
        │   │   ├── auth.service.js      [service]
        │   │   ├── auth.routes.js       [routes]
        │   │   └── auth.socket.js       [socket]
        │   │
        │   ├── user/                    [folder]
        │   │   ├── user.controller.js   [controller]
        │   │   ├── user.service.js      [service]
        │   │   ├── user.routes.js       [routes]
        │   │   └── user.socket.js       [socket]
        │   │
        │   ├── chat/                    [folder]
        │   │   ├── chat.controller.js   [controller]
        │   │   ├── chat.service.js      [service]
        │   │   ├── chat.routes.js       [routes]
        │   │   ├── chat.socket.js       [socket]
        │   │   ├── typing.socket.js     [socket]
        │   │   └── delivery.socket.js   [socket]
        │   │
        │   ├── call/                    [folder]
        │   │   ├── call.controller.js   [controller]
        │   │   ├── call.service.js      [service]
        │   │   ├── call.routes.js       [routes]
        │   │   └── call.socket.js       [socket]
        │   │
        │   ├── status/                  [folder]
        │   │   ├── status.controller.js [controller]
        │   │   ├── status.service.js    [service]
        │   │   ├── status.routes.js     [routes]
        │   │   └── status.socket.js     [socket]
        │   │
        │   ├── notification/            [folder]
        │   │   ├── notification.controller.js [controller]
        │   │   ├── notification.service.js    [service]
        │   │   ├── notification.routes.js     [routes]
        │   │   └── notification.socket.js     [socket]
        │   │
        │   └── media/                   [folder]
        │       ├── media.controller.js  [controller]
        │       ├── media.service.js     [service]
        │       ├── media.routes.js      [routes]
        │       └── file.socket.js       [socket]
        │
        ├── sockets/                     [folder]
        │   ├── init.js                  [js] loads all module sockets
        │   ├── presence.js              [socket]
        │   ├── chatEvents.js            [socket]
        │   ├── callEvents.js            [socket]
        │   └── statusEvents.js          [socket]
        │
        ├── services/                    [folder]
        │   ├── notification.worker.js   [service/worker]
        │   ├── media.processor.js       [service/worker]
        │   └── message.queue.js         [service/worker]
        │
        └── tests/                       [folder]
            ├── unit/                    [folder]
            └── integration/             [folder]
```

--- [======== Day 3 =========]
```
root/
└── server/
    └── src/
        ├── package.json               
        ├── server.js                   
        ├── app.js                      
        ├── socket.js                   
        │
        ├── config/                     
        │   ├── index.js                
        │   ├── db.js                   
        │   ├── redis.js                
        │   └── logger.js               
        │
        ├── middleware/                 
        │   ├── auth.middleware.js      
        │   ├── rateLimit.middleware.js 
        │   ├── upload.middleware.js    
        │   └── error.middleware.js     
        │
        ├── utils/                       
        │   ├── jwt.js                   
        │   ├── response.js              
        │   ├── validators.js            
        │   ├── encryption.js            
        │   ├── s3.js                    
        │   ├── rtc.js                   
        │   └── constants.js             
        │
        ├── database/                    
        │   ├── models/                  
        │   │   ├── user.model.js        
        │   │   ├── chat.model.js        
        │   │   ├── message.model.js     
        │   │   ├── group.model.js       
        │   │   ├── call.model.js        
        │   │   ├── status.model.js      
        │   │   ├── notification.model.js
        │   │   └── otp.model.js              ← ★ Day 3
        │   │
        │   └── repositories/           
        │       ├── user.repo.js        
        │       ├── chat.repo.js        
        │       ├── message.repo.js     
        │       ├── call.repo.js        
        │       ├── status.repo.js      
        │       └── otp.repo.js               ← ★ Day 3
        │
        ├── modules/                     
        │   ├── auth/                    
        │   │   ├── auth.controller.js        ← ★ Day 3
        │   │   ├── auth.service.js           ← ★ Day 3
        │   │   ├── auth.routes.js            ← ★ Day 3 (later)
        │   │   ├── auth.socket.js           
        │   │   └── utils/                    ← ★ Day 3 directory
        │   │        └── identifier.utils.js  ← ★ Day 3
        │   │
        │   ├── user/                    
        │   │   ├── user.controller.js   
        │   │   ├── user.service.js      
        │   │   ├── user.routes.js       
        │   │   └── user.socket.js       
        │   │
        │   ├── chat/                    
        │   │   ├── chat.controller.js   
        │   │   ├── chat.service.js      
        │   │   ├── chat.routes.js       
        │   │   ├── chat.socket.js       
        │   │   ├── typing.socket.js     
        │   │   └── delivery.socket.js   
        │   │
        │   ├── call/                    
        │   │   ├── call.controller.js   
        │   │   ├── call.service.js      
        │   │   ├── call.routes.js       
        │   │   └── call.socket.js       
        │   │
        │   ├── status/                  
        │   │   ├── status.controller.js 
        │   │   ├── status.service.js    
        │   │   ├── status.routes.js     
        │   │   └── status.socket.js     
        │   │
        │   ├── notification/            
        │   │   ├── notification.controller.js 
        │   │   ├── notification.service.js    
        │   │   ├── notification.routes.js     
        │   │   └── notification.socket.js     
        │   │
        │   └── media/                   
        │       ├── media.controller.js  
        │       ├── media.service.js     
        │       ├── media.routes.js      
        │       └── file.socket.js       
        │
        ├── sockets/                     
        │   ├── init.js                  
        │   ├── presence.js              
        │   ├── chatEvents.js            
        │   ├── callEvents.js            
        │   └── statusEvents.js          
        │
        ├── services/                    
        │   ├── notification.worker.js   
        │   ├── media.processor.js       
        │   └── message.queue.js         
        │
        └── tests/                       
            ├── unit/                    
            └── integration/             

```
