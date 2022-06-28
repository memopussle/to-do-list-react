var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//checkStatus
var checkStatus = function checkStatus(response) {
  if (response.ok) {
    //.ok returns true if response status is 200 -299
    return response;
  }
  throw new Error("Request was either a 404 or 500");
};

var json = function json(response) {
  return response.json();
}; //convert raw json data to JS object

//render the tasks

var Task = function (_React$Component) {
  _inherits(Task, _React$Component);

  function Task() {
    _classCallCheck(this, Task);

    return _possibleConstructorReturn(this, (Task.__proto__ || Object.getPrototypeOf(Task)).apply(this, arguments));
  }

  _createClass(Task, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          task = _props.task,
          onDelete = _props.onDelete,
          onComplete = _props.onComplete;
      var id = task.id,
          content = task.content,
          completed = task.completed;

      return React.createElement(
        "div",
        { className: "row mb-1" },
        React.createElement(
          "p",
          { className: "col" },
          content
        ),
        React.createElement(
          "button",
          {
            className: "btn btn-primary btn-small",
            onClick: function onClick() {
              return onDelete(id);
            }
          },
          "Delete"
        ),
        React.createElement("input", {
          className: "d-inline-block mt-2 ml-2",
          type: "checkbox",
          onChange: function onChange() {
            return onComplete(id, completed);
          },
          checked: completed
        })
      );
    }
  }]);

  return Task;
}(React.Component);

//we need to add value for each input so that React can have controll of input's state and update its state  ( controlled element)

var ToDoList = function (_React$Component2) {
  _inherits(ToDoList, _React$Component2);

  function ToDoList(props) {
    _classCallCheck(this, ToDoList);

    //store initial state of form component
    var _this2 = _possibleConstructorReturn(this, (ToDoList.__proto__ || Object.getPrototypeOf(ToDoList)).call(this, props));

    _this2.state = {
      new_task: "",
      tasks: [],
      filter: "all" //add this
    };
    _this2.handleChange = _this2.handleChange.bind(_this2);
    _this2.handleSubmit = _this2.handleSubmit.bind(_this2);
    _this2.fetchTasks = _this2.fetchTasks.bind(_this2);
    _this2.deleteTask = _this2.deleteTask.bind(_this2);
    _this2.toggleComplete = _this2.toggleComplete.bind(_this2);
    _this2.toggleFilter = _this2.toggleFilter.bind(_this2);
    return _this2;
  }

  //make the Fetch request after the component has loaded


  _createClass(ToDoList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.fetchTasks(); // get task on Mount
    }
  }, {
    key: "fetchTasks",
    value: function fetchTasks() {
      var _this3 = this;

      // move the get tasks code into its own method so we can use it at other places
      fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=48").then(checkStatus).then(json).then(function (response) {
        console.log(response);
        _this3.setState({ tasks: response.tasks }); //update component state "tasks" with the response data
      }).catch(function (error) {
        console.log(error.message);
      });
    }
  }, {
    key: "handleChange",
    value: function handleChange(event) {
      this.setState({
        new_task: event.target.value //update value of new_task property in object this.state
      });
    }
  }, {
    key: "handleSubmit",
    value: function handleSubmit(event) {
      var _this4 = this;

      event.preventDefault(); // prevent page reloads and reset form element
      var new_task = this.state.new_task;

      new_task = new_task.trim();
      if (!new_task) {
        // make sure the input element isn't empty before sending the request
        return;
      }
      fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=48", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: {
            content: new_task
          }
        })
      }).then(checkStatus).then(json).then(function (data) {
        _this4.setState({ new_task: "" });
        _this4.fetchTasks();
      }).catch(function (error) {
        _this4.setState({ error: error.message });
        console.log(error);
      });
    }
  }, {
    key: "deleteTask",
    value: function deleteTask(id) {
      var _this5 = this;

      if (!id) {
        return; // if no id is supplied, early return
      }
      fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks/" + id + "?api_key=48", {
        method: "DELETE",
        mode: "cors"
      }).then(checkStatus).then(json).then(function (data) {
        _this5.fetchTasks(); // fetch tasks after delete
      }).catch(function (error) {
        _this5.setState({ error: error.message });
        console.log(error);
      });
    }
  }, {
    key: "toggleComplete",
    value: function toggleComplete(id, completed) {
      var _this6 = this;

      if (!id) {
        return; // early return if no id
      }
      var newState = completed ? "active" : "complete";
      fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks/" + id + "/mark_" + newState + "?api_key=48", {
        method: "PUT",
        mode: "cors"
      }).then(checkStatus).then(json).then(function (data) {
        _this6.fetchTasks();
      }).catch(function (error) {
        _this6.setState({ error: error.message });
        console.log(error);
      });
    }
  }, {
    key: "toggleFilter",
    value: function toggleFilter(e) {
      console.log(e.target.name);
      this.setState({
        filter: e.target.name
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this7 = this;

      var _state = this.state,
          new_task = _state.new_task,
          tasks = _state.tasks,
          filter = _state.filter;


      return (
        //Build a frame to-do list
        React.createElement(
          "div",
          { className: "container" },
          React.createElement(
            "div",
            { className: "row" },
            React.createElement(
              "div",
              { className: "col-12" },
              React.createElement(
                "h2",
                { className: "mb-3" },
                "To Do List"
              ),
              tasks.length > 0 ? tasks.filter(function (task) {
                if (filter === "all") {
                  return true;
                } else if (filter === "active") {
                  return !task.completed;
                } else {
                  return task.completed;
                }
              }).map(function (task) {
                return React.createElement(Task, {
                  key: task.id,
                  task: task,
                  onDelete: _this7.deleteTask,
                  onComplete: _this7.toggleComplete
                }); //Task component above
              }) : React.createElement(
                "p",
                null,
                "No task here"
              ),
              React.createElement(
                "div",
                { className: "mt-3" },
                React.createElement(
                  "label",
                  null,
                  React.createElement("input", {
                    type: "checkbox",
                    name: "all",
                    checked: filter === "all",
                    onChange: this.toggleFilter
                  }),
                  " ",
                  "All"
                ),
                React.createElement(
                  "label",
                  null,
                  React.createElement("input", {
                    type: "checkbox",
                    name: "active",
                    checked: filter === "active",
                    onChange: this.toggleFilter
                  }),
                  " ",
                  "Active"
                ),
                React.createElement(
                  "label",
                  null,
                  React.createElement("input", {
                    type: "checkbox",
                    name: "completed",
                    checked: filter === "completed",
                    onChange: this.toggleFilter
                  }),
                  " ",
                  "Completed"
                )
              ),
              React.createElement(
                "form",
                { onSubmit: this.handleSubmit, className: "form-inline my-4" },
                React.createElement("input", {
                  type: "text",
                  className: "form-control mr-sm-2 mb-2",
                  placeholder: "new task",
                  value: new_task,
                  onChange: this.handleChange
                }),
                React.createElement(
                  "button",
                  { type: "submit", className: "btn btn-primary mb-2" },
                  "Submit"
                )
              )
            )
          )
        )
      );
    }
  }]);

  return ToDoList;
}(React.Component);

ReactDOM.render(React.createElement(ToDoList, null), document.getElementById("root"));