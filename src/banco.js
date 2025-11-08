const tasksDB = [];
let idCounter = 1;

module.exports = {
  createTask: (title, description) => {
    const newTask = {
      id: idCounter++,
      title: title,
      description: description || "",
      status: 'A Fazer',
      createdAt: new Date()
    };

    tasksDB.push(newTask);
    return newTask;
  },

  getAllTasks: () => {
    return [...tasksDB];
  }
};
