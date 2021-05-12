const { TodoModel } = require('../db/sequelize');
const todo = require('../models/todo');

exports.list = async function (req, res){
  const todos = await TodoModel.findAll({
    order: [
      ['message', 'ASC'], // Sorts by COLUMN_NAME_EXAMPLE in ascending order
],
  }) ;
  res.render("todo/list", {todos: todos});
  
}

exports.add = (req, res) => {
  // Validate request
  if (!req.body.message) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  id = Math.floor((Math.random() * 100) + 1);
  state = "OPEN";
  // Create a task
  const todo = {
    id,
    message: req.body.message,
    state
  };

  // Save task in the database
  TodoModel.create(todo)
    .then(data => {
      console.log('dataaaa',data)
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Task."
      });
    });    
   res.redirect("/todos");
};


exports.findOne = (req, res) => {
  const id = req.params.id;

  TodoModel.findByPk(id)
    .then(data => {
      res.send(data);
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

exports.update= (req, res) => {
  const id = req.params.id;
  
  state = "OPEN";
  
  const todo = {
    id,
    message: req.body.message,
    state
  };
  TodoModel.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Task was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Task with id=${id}. Maybe Task was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id
      });
    });
};




exports.markCompleted = function(req, res, next) {
  if (!req.body.completed) return next(new Error('Param is missing.'));
  var completed = req.body.completed === 'true';
  req.db.tasks.updateById(req.task._id, {$set: {completeTime: completed ? new Date() : null, completed: completed}}, function(error, count) {
    if (error) return next(error);
    if (count !==1) return next(new Error('Something went wrong.'));
    console.info('Marked task %s with id=%s completed.', req.task.name, req.task._id);
    res.redirect('/todos');
  })
};

/*exports.completed = function(req, res, next) {
  req.db.tasks.find({completed: true}).toArray(function(error, tasks) {
    res.render('tasks_completed', {
      title: 'Completed',
      tasks: tasks || []
    });
  });
};


};*/