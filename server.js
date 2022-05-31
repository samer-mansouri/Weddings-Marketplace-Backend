const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// server listening 

const UserRoutes = require('./routes/UserRoutes');
const AnnonceRoutes = require('./routes/AnnonceRoutes');
const CategoryRoutes = require('./routes/CategoryRoutes');
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

app.use('/',  UserRoutes.router);
app.use('/',  AnnonceRoutes.router);
app.use('/',  CategoryRoutes.router);
/*app.use('/',  VehiculeRoutes.router);
app.use('/',  ReservationRoutes.router);
app.use('/',  TrajetRoutes.router);
app.use('/', NoteRoutes.router);
app.use('/', CovoiturageRoutes.router);
app.use('/', AdminRoutes.router);
app.use('/', DeclarationRoutes.router);*/
