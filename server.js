import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import axios from "axios";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    // console.log("connected");

    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      // console.log(`user with id-${socket.id} joined room - ${roomId}`);
    });

    // You can emit events to clients like this
    socket.on("send_msg", (data) => {
      // console.log(data, "DATA");
      //This will send a message to a specific room ID
      socket.to(data.roomId).emit("receive_msg", data);
    });

    socket.on("join_room_loverTag", (loverTag) => {
      console.log(`Server log: ${loverTag} joined their room`);
      socket.join(loverTag);
    });

    socket.on("send_lover_request", async (data) => {
      try {
        // Simulate fetching user data from the backend for the user sending the request
        const senderEmail = data.senderEmail; // Make sure to send senderEmail in the event data
        const { data: senderData } = await axios.get(
          `http://localhost:3000/api/users/${senderEmail}`
        );
        console.log("Fetched sender data:", senderData);

        // Send the 'receive_lover_request' event to the receiver with sender details
        if (data.receiverLoverTag) {
          socket.to(data.receiverLoverTag).emit("receive_lover_request", {
            ...data,
            sender: senderData.user, // Attach sender's data to the event
          });
          // console.log(
          //   "Sent receive_lover_request event with sender data:",
          //   senderData
          // );
        } 
       
        else {
          console.error("Error: receiverLoverTag is undefined.");
        }
        socket.emit("update_sender_request",  {
          message: "Request sent successfully!",
          sender: senderData.user,
        });
      } catch (error) {
        console.error("Error fetching sender data:", error);
      }
    });
    socket.on("cancel_lover_request", async (data) =>{
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/users/matchrequest/${encodeURIComponent(data.loverTag)}`
        );
        console.log("Brev")
        socket.emit("lover_request_canceled");
      } catch (error) {
        console.error(
          "Error deleting match request for loverTag:",
          data.loverTag,
          error.response?.data || error.message
        );
      }
    });
    
    // socket.on("cancel_lover_request", (data) => {
    //   // const receiverRoom = data.receiverLoverTag;
    //   if (receiverRoom) {
    //     socket.to(receiverRoom).emit("lover_request_canceled", data);
    //     console.log("Sent lover_request_canceled event with data:", data);
    //   } else {
    //     console.error("Error: receiverLoverTag is undefined.");
    //   }
    // });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
