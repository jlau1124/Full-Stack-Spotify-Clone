import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

// initialize Socket.IO server
export const intializeSocket = (server) => {
    const clientOrigin = process.env.CLIENT_URL || "http://localhost:5173";
    const io = new Server(server, {
        cors: {
            origin: [clientOrigin, "http://localhost:3000"],
            credentials: true,
        },
    });

    const userSockets= new Map(); 
    const userActivities = new Map(); 

    io.on("connection", (socket) =>{ 


        socket.on("user_connected", (userId) => {
            userSockets.set(userId, socket.id); 
            userActivities.set(userId, "Idle"); 
           
            io.emit("user_connected", userId);
            
            socket.emit("users_online", Array.from(userSockets.keys()));
           
            io.emit("activities", Array.from(userActivities.entries()));
        });

       
        socket.on("update_activity", (payload) => {
            try {
                const { userId, activity } = payload || {};
                if (!userId) return;

                userActivities.set(userId, activity);
                io.emit("activity_updated", { userId, activity }); 
            } catch (err) {
                console.error('update_activity error:', err);
            }
        });

        
        socket.on("send_message", async (data) => {
            try {
                const { senderId, receiverId, content } = data

                
                const message = await Message.create({
                    senderId,
                    receiverId,
                    content,
                })

                const receiverSockerId = userSockets.get(receiverId);
                if(receiverSockerId){
                    io.to(receiverSockerId).emit("receive_message", message)
                }

                socket.emit("message_sent", message)

            } catch (error) {
                console.error("Message error:", error);
                socket.emit("message_error", error.message) 
            }
        });

        
        socket.on("disconnect", () => {
            let disconnectUserId;
            for(const [userId, socketId] of userSockets.entries()) {
                if(socketId === socket.id){ 
                    disconnectUserId = userId;
                    userSockets.delete(userId); 
                    userActivities.delete(userId); 
                    break; 
                }
            }
            if(disconnectUserId){
                io.emit("user_disconnected", disconnectUserId); 
            }
        })
    }); 
}
