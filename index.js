const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");

/* include controllers */
const homeController = require("./controllers/homeController");
const todoController = require("./controllers/todoController");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Routes */
app.get('/', homeController.home);
app.get('/about', homeController.about);
app.get('/todos', todoController.list);
app.post('/todos', todoController.add);

app.get('/todos/findone/:id', todoController.findOne);
app.post('/delete/todo/:id', todoController.delete);
app.post('/todo/update/:id/:state', todoController.update);



app.use(express.static("public"));
app.listen(3000);


