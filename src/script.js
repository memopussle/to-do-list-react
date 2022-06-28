//checkStatus
const checkStatus = (response) => {
  if (response.ok) {
    //.ok returns true if response status is 200 -299
    return response;
  }
  throw new Error("Request was either a 404 or 500");
};

const json = (response) => response.json(); //convert raw json data to JS object

//render the tasks
class Task extends React.Component {
  render() {
    const { task, onDelete, onComplete } = this.props;

    const { id, content, completed } = task;
    return (
      <div className="row mb-1">
        <p className="col">{content}</p>
        <button
          className="btn btn-primary btn-small"
          onClick={() => onDelete(id)}
        >
          Delete
        </button>
        <input
          className="d-inline-block mt-2 ml-2"
          type="checkbox"
          onChange={() => onComplete(id, completed)}
          checked={completed}
        ></input>
      </div>
    );
  }
}

//we need to add value for each input so that React can have controll of input's state and update its state  ( controlled element)

class ToDoList extends React.Component {
  constructor(props) {
    super(props);
    //store initial state of form component
    this.state = {
      new_task: "",
      tasks: [],
      filter: "all", //add this
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchTasks = this.fetchTasks.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.toggleComplete = this.toggleComplete.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
  }

  //make the Fetch request after the component has loaded
  componentDidMount() {
    this.fetchTasks(); // get task on Mount
  }

  fetchTasks() {
    // move the get tasks code into its own method so we can use it at other places
    fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=48")
      .then(checkStatus)
      .then(json)
      .then((response) => {
        console.log(response);
        this.setState({ tasks: response.tasks }); //update component state "tasks" with the response data
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  handleChange(event) {
    this.setState({
      new_task: event.target.value, //update value of new_task property in object this.state
    });
  }

  handleSubmit(event) {
    event.preventDefault(); // prevent page reloads and reset form element
    let { new_task } = this.state;
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
          content: new_task,
        },
      }),
    })
      .then(checkStatus)
      .then(json)
      .then((data) => {
        this.setState({ new_task: "" });
        this.fetchTasks();
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      });
  }

  deleteTask(id) {
    if (!id) {
      return; // if no id is supplied, early return
    }
    fetch(
      `https://altcademy-to-do-list-api.herokuapp.com/tasks/${id}?api_key=48`,
      {
        method: "DELETE",
        mode: "cors",
      }
    )
      .then(checkStatus)
      .then(json)
      .then((data) => {
        this.fetchTasks(); // fetch tasks after delete
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      });
  }

  toggleComplete(id, completed) {
    if (!id) {
      return; // early return if no id
    }
    const newState = completed ? "active" : "complete";
    fetch(
      `https://altcademy-to-do-list-api.herokuapp.com/tasks/${id}/mark_${newState}?api_key=48`,
      {
        method: "PUT",
        mode: "cors",
      }
    )
      .then(checkStatus)
      .then(json)
      .then((data) => {
        this.fetchTasks();
      })
      .catch((error) => {
        this.setState({ error: error.message });
        console.log(error);
      });
  }

  toggleFilter(e) {
    console.log(e.target.name);
    this.setState({
      filter: e.target.name,
    });
  }

  render() {
    const { new_task, tasks, filter } = this.state;
    return (
      //Build a frame to-do list
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="mb-3">To Do List</h2>
            {tasks.length > 0 ? (
              tasks
                .filter((task) => {
                  if (filter === "all") {
                    return true;
                  } else if (filter === "active") {
                    return !task.completed;
                  } else {
                    return task.completed;
                  }
                })
                .map((task) => {
                  return (
                    <Task
                      key={task.id}
                      task={task}
                      onDelete={this.deleteTask}
                      onComplete={this.toggleComplete}
                    />
                  ); //Task component above
                })
            ) : (
              <p>No task here</p>
            )}

            <div className="mt-3">
              <label>
                <input
                  type="checkbox"
                  name="all"
                  checked={filter === "all"}
                  onChange={this.toggleFilter}
                />{" "}
                All
              </label>
              <label>
                <input
                  type="checkbox"
                  name="active"
                  checked={filter === "active"}
                  onChange={this.toggleFilter}
                />{" "}
                Active
              </label>
              <label>
                <input
                  type="checkbox"
                  name="completed"
                  checked={filter === "completed"}
                  onChange={this.toggleFilter}
                />{" "}
                Completed
              </label>
            </div>

            <form onSubmit={this.handleSubmit} className="form-inline my-4">
              <input
                type="text"
                className="form-control mr-sm-2 mb-2"
                placeholder="new task"
                value={new_task}
                onChange={this.handleChange}
              />
              <button type="submit" className="btn btn-primary mb-2">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <ToDoList />,

  document.getElementById("root")
);
