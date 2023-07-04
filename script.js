if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
      console.log('Service Worker is registered', registration);
    }, function (err) {
      console.error('Registration failed:', err);
    });
  });
}


const projectForm = document.getElementById("project-form");
const projectNameInput = document.getElementById("project-name");
const projectDescInput = document.getElementById("project-description");
const dueDateInput = document.getElementById("due-date");
const projectList = document.getElementById("project-list");
const taskFormContainer = document.getElementById("task-form-container");
const taskList = document.getElementById("task-list");
const backButton = document.getElementById("back-button");

const projects = [];

function displayTasks(projectIndex) {
  taskList.innerHTML = "";

  if (projects[projectIndex].tasks.length === 0) {
    const noTaskMessage = document.createElement("p");
    noTaskMessage.textContent = "Nenhuma tarefa adicionada.";
    taskList.appendChild(noTaskMessage);
  } else {
    projects[projectIndex].tasks.forEach((task, taskIndex) => {
      const taskElement = document.createElement("div");
      taskElement.classList.add("task");
      taskElement.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <input type="checkbox" id="task-${taskIndex}" data-project="${projectIndex}" data-task="${taskIndex}">
        <label for="task-${taskIndex}">Concluída</label>
      `;
      taskList.appendChild(taskElement);
    });
  }
}

function addProject(name, description, dueDate) {
  const project = {
    name: name,
    description: description,
    dueDate: dueDate,
    tasks: [],
  };

  projects.push(project);
  displayProjects();
}

function addTask(projectIndex, title, description) {
  const task = {
    title: title,
    description: description,
    completed: false,
  };

  projects[projectIndex].tasks.push(task);
  displayTasks(projectIndex);
}

function deleteProject(projectIndex) {
  projects.splice(projectIndex, 1);
  displayProjects();
  taskFormContainer.style.display = "none";
  projectForm.style.display = "block";
}

function deleteCompletedTasks(projectIndex) {
  projects[projectIndex].tasks = projects[projectIndex].tasks.filter((task) => !task.completed);
  displayTasks(projectIndex);
}

function displayProjects() {
  projectList.innerHTML = "";

  projects.forEach((project, index) => {
    const projectElement = document.createElement("div");
    projectElement.classList.add("project");
    projectElement.innerHTML = `
      <h2>${project.name}</h2>
      <p>${project.description}</p>
      <p>Data de Vencimento: ${project.dueDate}</p>
      <button type="button" onclick="deleteProject(${index})">Excluir Projeto</button>
    `;
    projectElement.addEventListener("click", function () {
      taskFormContainer.innerHTML = "";
      taskFormContainer.appendChild(createTaskForm(index));
      displayTasks(index);
      projectForm.style.display = "none";
      taskFormContainer.style.display = "block";
    });
    projectList.appendChild(projectElement);
  });
}

function createTaskForm(projectIndex) {
  const taskForm = document.createElement("form");
  taskForm.innerHTML = `
    <label for="task-title">Título da Tarefa:</label>
    <input type="text" id="

task-title" name="task-title" required>

    <label for="task-description">Descrição da Tarefa:</label>
    <textarea id="task-description" name="task-description" required></textarea>

    <button type="submit">Adicionar Tarefa</button>
    <button type="button" onclick="deleteCompletedTasks(${projectIndex})">Excluir Tarefas Concluídas</button>
    <button type="button" id="back-button">Voltar para Lista de Projetos</button>
  `;

  taskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const taskTitle = taskForm.elements["task-title"].value;
    const taskDescription = taskForm.elements["task-description"].value;
    addTask(projectIndex, taskTitle, taskDescription);
    taskForm.reset();
  });

  return taskForm;
}

backButton.addEventListener("click", function () {
  taskFormContainer.style.display = "none";
  projectForm.style.display = "block";
  backButton.style.display = "none";
});

projectForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const projectName = projectNameInput.value;
  const projectDesc = projectDescInput.value;
  const dueDate = dueDateInput.value;
  addProject(projectName, projectDesc, dueDate);
  projectForm.reset();
});

displayProjects();

