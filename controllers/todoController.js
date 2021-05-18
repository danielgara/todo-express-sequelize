const { TodoModel } = require('../db/sequelize');
const todo = require('../models/todo');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

exports.list = async function (req, res) {

  const todos = await TodoModel.findAll({
    /* order: [
      ['message', 'ASC'], // Sorts by COLUMN_NAME_EXAMPLE in ascending order
    ],
 */
  });
  let rsp = todos.filter(todo => todo.state === 'OPEN')
  res.render("todo/list", { todos: todos });
}

exports.add = (req, res) => {
  // Validate request
  id = Math.floor((Math.random() * 100) + 1);
  state = "OPEN";
  let newpath = '';
  let image = ''

  // Read file imcomming 
  const form = new formidable.IncomingForm();

  form.parse(req, function (err, fields, files) {
    if (fields.message == '') {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    } else {
      if (files.filetoupload.name != '') {
        console.log(`Files ${JSON.stringify(files)}\nfields ${JSON.stringify(fields)}\nError${err}`);
        const oldpath = files.filetoupload.path;
        const dirPath = path.join(__dirname.replace('controllers', ''), '/public/img/');
        newpath = dirPath + files.filetoupload.name;
        fs.rename(oldpath, newpath, function (err) {
          if (err) throw err;
        });
        image = files.filetoupload.name
      }
      // Create a task

      const todo = {
        id,
        message: fields.message,
        state,
        image
      };

      // Save task in the database
      TodoModel.create(todo)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Task."
          });
        });
      res.redirect("/todos");
    }
  });
};


exports.findOne = async (req, res) => {
  const id = req.params.id;
  await TodoModel.findByPk(id)
    .then(data => {
      res.send(data.dataValues)
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Task with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  TodoModel.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Task was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Task with id=${id}. Maybe Task was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Task with id=" + id
      });
    });
  res.redirect("/todos");
};

exports.update = (req, res) => {
  const id = req.params.id;
  const state = req.params.state;
  const todo = {
    state
  };
  TodoModel.update(todo, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.redirect("/todos");
      } else {
        res.send({
          message: `Cannot update Task with id=${id}. Maybe Task was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Task with id=" + id
      });
    });
};






