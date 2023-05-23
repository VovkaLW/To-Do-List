class TaskManager {
  constructor() {
    this.taskInput = document.getElementById('taskInput');
    this.addTaskBtn = document.getElementById('addTaskBtn');
    this.taskList = document.getElementById('taskList');
    this.trashBinBtn = document.getElementById('trashBinBtn');
    this.trashBin = document.getElementById('trashBin');
    this.deletedTaskList = document.getElementById('deletedTaskList');
    this.clearDeletedTasksBtn = document.getElementById('clearDeletedTasksBtn');
    this.count = 0;

    this.loadTasks();
    this.addTaskBtn.addEventListener('click', this.addTask.bind(this));
    this.trashBinBtn.addEventListener('click', this.toggleTrashBin.bind(this));
    this.clearDeletedTasksBtn.addEventListener('click', this.clearDeletedTasks.bind(this));
  }
  moveTaskUp(event) {
    const task = event.target.closest('.task');
    const previousTask = task.previousElementSibling;
    if (previousTask) {
      this.taskList.insertBefore(task, previousTask);
      this.saveTasks();
    }
  }

  moveTaskDown(event) {
    const task = event.target.closest('.task');
    const nextTask = task.nextElementSibling;
    if (nextTask) {
      this.taskList.insertBefore(nextTask, task);
      this.saveTasks();
    }
  }

  bindTaskMoveButtons() {
    const moveUpButtons = this.taskList.querySelectorAll('.btn-move-up');
    const moveDownButtons = this.taskList.querySelectorAll('.btn-move-down');

    moveUpButtons.forEach((button) => {
      button.addEventListener('click', this.moveTaskUp.bind(this));
    });

    moveDownButtons.forEach((button) => {
      button.addEventListener('click', this.moveTaskDown.bind(this));
    });
  }
  loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach((task) => {
      tasks.sort((a, b) => a.order - b.order);
      const taskElement = this.createTaskElement(task.text, task.completed);
      this.taskList.appendChild(taskElement);
    });
  }

  saveTasks() {
    const tasks = [];
    const taskElements = this.taskList.querySelectorAll('.task');
    taskElements.forEach((taskElement, index) => {
      const taskText = taskElement.querySelector('span').textContent;
      const taskCompleted = taskElement.querySelector('input[type="checkbox"]').checked;
      tasks.push({
        text: taskText,
        completed: taskCompleted,
        order: index
      });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  addTask() {
    const taskText = this.taskInput.value;
    if (taskText !== '') {
      const task = this.createTaskElement(taskText);
      this.taskList.appendChild(task);
      this.taskInput.value = '';
      this.saveTasks();
    }
  }

  createTaskElement(taskText, completed = false) {
    const task = document.createElement('div');
    task.classList.add('task', 'd-flex', 'align-items-center', 'row');

    this.count += 1;
    const taskCheckbox = document.createElement('input');
    taskCheckbox.type = 'checkbox';
    taskCheckbox.classList.add('taskCheckbox', 'col-sm-auto', 'btn-check');
    taskCheckbox.id = `btncheck${this.count}`;
    taskCheckbox.autocomplete = 'off';
    taskCheckbox.checked = completed;
    taskCheckbox.addEventListener('change', this.toggleTask.bind(this));

    const label = document.createElement('label');
    label.classList.add('btn', 'btn-outline-secondary', 'col-sm-auto');
    label.setAttribute('for', `btncheck${this.count}`);
    label.id = `label`;
    label.innerText = '+';

    const taskLabel = document.createElement('span');
    taskLabel.classList.add('input-group-text', 'bg-dark-subtle', 'col', `text-truncate`);
    taskLabel.textContent = taskText;
    if (completed) {
      taskLabel.classList.add('completed');
    }

    const editButton = document.createElement('button');
    editButton.classList.add('btn', 'btn-primary', 'mr-2', 'col-md-auto');
    editButton.id = 'Edit';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', this.editTask.bind(this));

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-danger', 'col-md-auto');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', this.deleteTask.bind(this));
    const moveUpButton = document.createElement('button');
    moveUpButton.classList.add('btn', 'btn-secondary', 'btn-move-up', 'col-md-auto');
    moveUpButton.innerHTML = '&uarr;';
    moveUpButton.addEventListener('click', this.moveTaskUp.bind(this));

    const moveDownButton = document.createElement('button');
    moveDownButton.classList.add('btn', 'btn-secondary', 'btn-move-down', 'col-md-auto');
    moveDownButton.innerHTML = '&darr;';
    moveDownButton.addEventListener('click', this.moveTaskDown.bind(this));



    task.appendChild(taskCheckbox);
    task.appendChild(label);
    task.appendChild(taskLabel);
    task.appendChild(editButton);
    task.appendChild(moveUpButton);
    task.appendChild(moveDownButton);
    task.appendChild(deleteButton);


    return task;
  }

  toggleTask(event) {
    const task = event.target.closest('.task');
    const taskLabel = task.querySelector('span');

    if (event.target.checked) {
      taskLabel.classList.add('completed');
    } else {
      taskLabel.classList.remove('completed');
    }
    this.saveTasks();
  }

  deleteTask(event) {
    const task = event.target.closest('.task');
    this.taskList.removeChild(task);
    const deletedTask = this.createDeletedTaskElement(task.querySelector('span').textContent);
    this.deletedTaskList.appendChild(deletedTask);
    this.trashBin.classList.remove('hidden');
    this.saveTasks();
  }

  createDeletedTaskElement(taskText) {
    const task = document.createElement('div');
    task.classList.add('task', 'd-flex', 'align-items-center', 'row');

    const taskLabel = document.createElement('span');
    taskLabel.textContent = taskText;
    taskLabel.classList.add('completed', 'deleted', 'col');

    const restoreButton = document.createElement('button');
    restoreButton.classList.add('btn', 'btn-info', 'mr-2', 'col-sm-auto');
    restoreButton.textContent = 'Restore';
    restoreButton.addEventListener('click', this.restoreTask.bind(this));

    task.appendChild(taskLabel);
    task.appendChild(restoreButton);

    return task;
  }

  restoreTask(event) {
    const task = event.target.closest('.task');
    const taskText = task.querySelector('span').textContent;
    const restoredTask = this.createTaskElement(taskText);
    this.taskList.appendChild(restoredTask);
    this.deletedTaskList.removeChild(task);
    if (this.deletedTaskList.children.length === 0) {
      this.trashBin.classList.add('hidden');
    }
    this.saveTasks();
  }

  clearDeletedTasks() {
    this.deletedTaskList.innerHTML = '';
    this.trashBin.classList.add('hidden');
    this.saveTasks();
  }

  editTask(event) {
    const task = event.target.closest('.task');
    const taskLabel = task.querySelector('span');
    const editButton = task.querySelector('.btn-primary');
    const deleteButton = task.querySelector('.btn-danger');
    const moveUpButton = task.querySelector('.btn-move-up');
    const moveDownButton = task.querySelector('.btn-move-down');

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.classList.add('form-control', 'editTaskInput', 'col');
    editInput.value = taskLabel.textContent;

    const saveButton = document.createElement('button');
    saveButton.classList.add('btn', 'btn-success');
    saveButton.textContent = 'Save';

    const cancelButton = document.createElement('button');
    cancelButton.classList.add('btn', 'btn-secondary');
    cancelButton.textContent = 'Cancel';

    const editTaskButtons = document.createElement('div');
    editTaskButtons.classList.add('editTaskButtons', 'col-sm-auto');
    editTaskButtons.appendChild(saveButton);
    editTaskButtons.appendChild(cancelButton);

    task.replaceChild(editInput, taskLabel);
    task.replaceChild(editTaskButtons, editButton);
    task.removeChild(moveUpButton);
    task.removeChild(moveDownButton);
    task.removeChild(deleteButton);

    saveButton.addEventListener('click', () => {
      const newTaskText = editInput.value;
      if (newTaskText !== '') {
        taskLabel.textContent = newTaskText;
        task.replaceChild(taskLabel, editInput);
        task.replaceChild(editButton, editTaskButtons);
        task.appendChild(moveUpButton);
        task.appendChild(moveDownButton);
        task.appendChild(deleteButton);
        this.saveTasks();
      } else {
        // Display an error or alert message if the task text is empty
        alert('Task text cannot be empty');
      }
    });

    cancelButton.addEventListener('click', () => {
      task.replaceChild(taskLabel, editInput);
      task.replaceChild(editButton, editTaskButtons);
      task.appendChild(moveUpButton);
      task.appendChild(moveDownButton);
      task.appendChild(deleteButton);
    });
  }

  toggleTrashBin() {
    this.trashBin.classList.toggle('hidden');
  }
}

// Create an instance of the TaskManager class
const taskManager = new TaskManager();
