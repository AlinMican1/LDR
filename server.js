import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import axios from "axios";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.NODE_ENV || 3000;
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
      io.to(data.roomId).emit("receive_msg", data);
    });

    socket.on("join_room_loverRequest", (requestConnection) => {
      // console.log(`Server log: ${requestConnection} joined their room`);
      socket.join(requestConnection);
    });

    socket.on("update_latest_messageTimestamp", async (data) => {
      const { email, roomId, lastRead, userId } = data;

      try {
        // Fetch the updated user data
        const response = await axios.get(
          `${process.env.NEXTAUTH_URL}/api/users/${email}`
        );
        const { user } = response.data;

        // Emit the updated timestamp to the client
        socket.emit("get_last_messageTimestamp", {
          lastRead: user.messageLastRead,
        });
      } catch (error) {
        console.error("Error updating or fetching data:", error);
      }
    });

    socket.on("send_lover_request", async (data) => {
      try {
        // Simulate fetching user data from the backend for the user sending the request
        const senderEmail = data.senderEmail; // Make sure to send senderEmail in the event data
        const { data: senderData } = await axios.get(
          `${process.env.NEXTAUTH_URL}/api/users/${senderEmail}`
        );
        const receiverId =
          (senderData.user.request.to && senderData.user.request.to._id) ||
          (senderData.user.request.from && senderData.user.request.from._id) ||
          null;
        // Send the 'receive_lover_request' event to the receiver with sender detail
        if (receiverId) {
          socket.to(receiverId).emit("receive_lover_request", {
            ...data,
            sender: senderData.user, // Attach sender's data to the event
          });
          // Notify the sender
          socket.emit("update_sender_request", {
            message: "Request sent successfully!",
            sender: senderData.user,
          });
        } else {
          console.error("Error: receiverLoverTag is undefined.");
        }
      } catch (error) {
        console.error("Error fetching sender data:", error);
      }
    });

    socket.on("cancel_lover_request", async (data) => {
      const { receiverId, senderId } = data;

      try {
        io.to(senderId).emit("lover_request_cancelled");
        io.to(receiverId).emit("lover_request_cancelled");
      } catch (error) {
        console.error(
          "Error deleting match request:",
          error.response?.data || error.message
        );
      }
    });

    socket.on("accept_lover_request", async (data) => {
      const { receiverId, senderId } = data;
      io.to(senderId).emit("lover_request_accepted");
      io.to(receiverId).emit("lover_request_accepted");
    });

    //CONNECTIONS AFTER ADDING EACH OTHER
    socket.on("join_via_connectionID", ({ connectionId }) => {
      socket.join(connectionId);
      console.log(`user with id-${socket.id} joined room - ${connectionId}`);
    });

    socket.on("add_meetDate", (data) => {
      const { meetDate, connectionId } = data;
      console.log("MEET", meetDate);
      console.log("MEET2", connectionId);

      io.to(connectionId).emit("display_meetDate", meetDate);

      // try {
      //   // Make sure to send senderEmail in the event data
      //   const { data: senderData } = await axios.get(
      //     `${process.env.NEXTAUTH_URL}/api/users/${email}`
      //   );
      //   const lover = senderData.user.lover;
      //   console.log(lover, " DFHAD");
      //   // Send the 'receive_lover_request' event to the receiver with sender detail

      //   io.to(lover).emit("display_meetDate", meetDate);
      //   io.to(connectionId).emit("display_meetDate", meetDate);
      //   socket.to(lover).emit("display_meetDate", meetDate);
      // } catch {}

      // socket.to(connectionId).emit("display_meetDate", meetDate);
      // try {
      //   const response = await axios.post(
      //     `${process.env.NEXTAUTH_URL}/api/users/meetdate`,
      //     dateData
      //   );
      //   if (response.status === 200) {
      //     console.log("HI FROM ESERVERERs");
      //   }
      //   // Simulate fetching user data from the backend for the user sending the request
      //   const { data: senderData } = await axios.get(
      //     `${process.env.NEXTAUTH_URL}/api/users/${email}`
      //   );
      //   const meetDate = senderData.user.meetDate;
      //   console.log("GFG", meetDate);
      //   if (meetDate) {
      //     io.to(connectionId).emit("display_meetDate", meetDate);
      //   }
      // } catch (error) {
      //   console.error("Error fetching sender data:", error);
      // }
    });
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
