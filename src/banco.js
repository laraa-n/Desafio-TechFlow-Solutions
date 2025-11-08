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
    },

    findById: (id) => {
       const taskId = parseInt(id, 10);
        return tasksDB.find(task => task.id === taskId);
    },

    updateTask: (id, updates) => {
        const taskToUpdate = module.exports.findById(id);

        if (!taskToUpdate) {
        return null;
        }

        taskToUpdate.title = updates.title || taskToUpdate.title;
        taskToUpdate.description = updates.description || taskToUpdate.description;
        taskToUpdate.status = updates.status || taskToUpdate.status;

        return taskToUpdate;
    }
};


