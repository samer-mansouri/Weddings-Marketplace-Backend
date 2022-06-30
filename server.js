const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

const socket = require("socket.io");


// server listening 

const UserRoutes = require('./routes/UserRoutes');
const AnnonceRoutes = require('./routes/AnnonceRoutes');
const CategoryRoutes = require('./routes/CategoryRoutes');
const ReservationRoutes = require('./routes/ReservationRoutes');
const MessageRoutes = require('./routes/MessageRoutes');
/*const AdminRoutes = require('./routes/AdminRoutes');
const VehiculeRoutes = require('./routes/VehiculeRoutes');
const ReservationRoutes = require('./routes/ReservationRoutes');
const TrajetRoutes = require('./routes/TrajetRoutes');
const NoteRoutes = require('./routes/NoteRoutes');
const DeclarationRoutes = require('./routes/DeclarationRoutes');
const CovoiturageRoutes = require('./routes/CovoiturageRoutes');
*/
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("connected ", userId)
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    console.log(data);
    console.log(socket.id);
    console.log(onlineUsers);
    console.log(sendUserSocket);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      console.log("emited");
    }
  });

  // socket.on("disconnect", (data) => {
  //   console.log("disconnected");
  //   onlineUsers.forEach((value, key) => {
  //     if (value === data.user) {
  //       onlineUsers.delete(key);
  //     }
  //   });
  // });

});

app.use('/',  UserRoutes.router);
app.use('/',  AnnonceRoutes.router);
app.use('/',  CategoryRoutes.router);
app.use('/',  ReservationRoutes.router);
app.use('/',  MessageRoutes.router);
/*app.use('/',  VehiculeRoutes.router);
app.use('/',  ReservationRoutes.router);
app.use('/',  TrajetRoutes.router);
app.use('/', NoteRoutes.router);
app.use('/', CovoiturageRoutes.router);
app.use('/', AdminRoutes.router);
app.use('/', DeclarationRoutes.router);*/
 