import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import axios from "axios";
import { user } from "@nextui-org/theme";

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
      io.to(data.roomId).emit("receive_msg", data);
    });

    // socket.on("join_room_loverTag", (loverTag) => {
    //   console.log(`Server log: ${loverTag} joined their room`);
    //   socket.join(loverTag);
    // });

    socket.on("join_room_loverRequest", (requestConnection) => {
      console.log(`Server log: ${requestConnection} joined their room`);
      socket.join(requestConnection);
    });

    socket.on("update_latest_messageTimestamp", async (data) => {
      const { email, roomId, lastRead, userId } = data;

      try {
        // Update the message read status
        // await axios.put(`${process.env.NEXTAUTH_URL}/api/message/${roomId}`, {
        //   userId,
        // });

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
        console.log("Fetched sender data:", senderData);
        const receiverId =
          (senderData.user.request.to && senderData.user.request.to._id) ||
          (senderData.user.request.from && senderData.user.request.from._id) ||
          null;
        // Send the 'receive_lover_request' event to the receiver with sender details
        console.log("AAAA", receiverId);
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
        // socket.emit("update_sender_request", {
        //   message: "Request sent successfully!",
        //   sender: senderData.user,
        // });
      } catch (error) {
        console.error("Error fetching sender data:", error);
      }
    });
    //   socket.on("cancel_lover_request", async (data) => {
    //     const { senderTag, receiverTag } = data;
    //     // try {
    //     //   const response = await axios.delete(
    //     //     `${
    //     //       process.env.NEXTAUTH_URL
    //     //     }/api/users/matchrequest/${encodeURIComponent(senderTag)}`
    //     //   );
    //     //   socket.emit("lover_request_canceled");
    //     //   socket.to(senderTag).emit("lover_request_cancelled");
    //     //   socket.to(receiverTag).emit("lover_request_cancelled");
    //     // } catch (error) {
    //     //   console.error(
    //     //     "Error deleting match request for loverTag:",
    //     //     senderTag,
    //     //     error.response?.data || error.message
    //     //   );
    //     // }
    //     console.log("senderTag", senderTag);
    //     console.log("receiverTag", receiverTag);
    //     // if (senderTag) {
    //     //   socket.to(senderTag).emit("lover_request_cancelled");
    //     // }
    //     // if (receiverTag) {
    //     //   socket.to(receiverTag).emit("lover_request_cancelled");
    //     // }
    //     io.to(data.senderTag).emit("lover_request_cancelled");

    //     // socket.emit("lover_request_cancelled");
    //   });
    // });

    socket.on("cancel_lover_request", async (data) => {
      const { email, senderId, senderTag } = data;

      try {
        // Remove the request in the backend (optional if you're handling this in the database)
        const { data: senderData } = await axios.get(
          `${process.env.NEXTAUTH_URL}/api/users/${email}`
        );

        const receiverId =
          (senderData.user.request.to && senderData.user.request.to._id) ||
          (senderData.user.request.from && senderData.user.request.from._id) ||
          null;

        // const { user } = response.data;
        console.log("CHECKING", senderData);
        console.log("ABBBB", receiverId);

        await axios.delete(
          `${
            process.env.NEXTAUTH_URL
          }/api/users/matchrequest/${encodeURIComponent(senderTag)}`
        );

        // Notify both users that the lover request is canceled
        // if (senderTag) {
        //   io.to(senderTag).emit("lover_request_cancelled", {
        //     message: "Lover request canceled by sender.",
        //     senderTag,
        //     receiverTag,
        //   });
        // }
        // if (receiverTag) {
        //   io.to(receiverTag).emit("lover_request_cancelled", {
        //     message: "Lover request canceled by sender.",
        //     senderTag,
        //     receiverTag,
        //   });
        // }

        io.to(senderId).emit("lover_request_cancelled");
        io.to(receiverId).emit("lover_request_cancelled");
      } catch (error) {
        console.error(
          "Error deleting match request:",
          error.response?.data || error.message
        );
      }
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
