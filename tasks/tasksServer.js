import {
  loadPackageDefinition,
  Server,
  status,
  ServerCredentials,
} from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

const tasksDefs = loadSync("./tasks.proto");
const tasksProto = loadPackageDefinition(tasksDefs);

const tasks = [
  { id: 1, title: "Task 1", description: "Description of Task 1" },
];

const grpcServer = new Server();

grpcServer.addService(tasksProto.TaskService.service, {
  listAll: (call, callback) => {
    callback(null, { tasks });
  },

  addTask: (call, callback) => {
    const task = call.request;
    console.log("addTask:", task);

    tasks.push(task);
    callback(null, task);
  },

  updateTask: (call, callback) => {
    const taskToUpdate = call.request;
    console.log("updateTask:", taskToUpdate);

    const index = tasks.findIndex((task) => task.id === taskToUpdate.id);

    if (index === -1) {
      callback({
        code: status.NOT_FOUND,
        details: "Task not found",
      });
      return;
    }

    tasks[index] = taskToUpdate;
    callback(null, taskToUpdate);
  },

  deleteTask: (call, callback) => {
    const { id } = call.request;
    console.log("deleteTask:", id);

    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) {
      callback({
        code: status.NOT_FOUND,
        details: "Task not found",
      });
      return;
    }

    tasks.splice(index, 1);
    callback(null, { id });
  },
});

const serverAddress = "0.0.0.0:5050";
grpcServer.bindAsync(
  serverAddress,
  ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.log(`Server failed to start: ${err.message}`);
      return;
    }
    console.info(`Server started on ${serverAddress}`);
  }
);
