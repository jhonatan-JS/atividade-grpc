import { loadPackageDefinition, credentials } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

const tasksDefs = loadSync("./tasks.proto");
const tasksProto = loadPackageDefinition(tasksDefs);

const clientGRPC = new tasksProto.TaskService(
  "127.0.0.1:5050",
  credentials.createInsecure()
);

const addTask = (task) => {
  clientGRPC.addTask(task, (err, response) => {
    if (err) {
      console.log("Error adding task:", err);
      return;
    }
    console.log("Task added:", response);
  });
};

const updateTask = (task) => {
  clientGRPC.updateTask(task, (err, response) => {
    if (err) {
      console.log("Error updating task:", err);
      return;
    }
    console.log("Task updated:", response);
  });
};

const deleteTask = (taskId) => {
  clientGRPC.deleteTask({ id: taskId }, (err, response) => {
    if (err) {
      console.log("Error deleting task:", err);
      return;
    }
    console.log("Task deleted:", response);
  });
};

const listAllTasks = () => {
  clientGRPC.listAll({}, (err, response) => {
    if (err) {
      console.log("Error listing tasks:", err);
      return;
    }
    console.log(response);
  });
};

const newTask = {
  id: 2,
  title: "Task 2",
  description: "Description of Task 2",
};
addTask(newTask);

const taskToUpdate = {
  id: 2,
  title: "Task 2 Updated",
  description: "Description of Task 2 Updated",
};
updateTask(taskToUpdate);

const taskIdToDelete = 2;
deleteTask(taskIdToDelete);

listAllTasks();
