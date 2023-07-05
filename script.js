if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
      console.log('Service Worker is registered', registration);
    }, function (err) {
      console.error('Registration failed:', err);
    });
  });
}


let projects = [];

function addProject(name, description, dueDate) {
  const project = {
    name: name,
    description: description,
    dueDate: dueDate,
    tasks: [],
  };

  projects.push(project);
  displayProjects();
  hideProjectForm();
}

function deleteProject(index) {
  if (index >= 0 && index < projects.length) {
    projects.splice(index, 1);
    displayProjects();
    displayTasks(-1);
  }
}

function addTask(projectIndex, title, description, responsible) {
  if (projectIndex >= 0 && projectIndex < projects.length) {
    const task = {
      title: title,
      description: description,
      responsible: responsible,
      completed: false,
    };

    projects[projectIndex].tasks.push(task);
    displayTasks(projectIndex);
  }
}

function deleteTask(projectIndex, taskIndex) {
  if (
    projectIndex >= 0 &&
    projectIndex < projects.length &&
    taskIndex >= 0 &&
    taskIndex < projects[projectIndex].tasks.length
  ) {
    projects[projectIndex].tasks.splice(taskIndex, 1);
    displayTasks(projectIndex);
  }
}

function deleteCompletedTasks(projectIndex) {
  if (projectIndex >= 0 && projectIndex < projects.length) {
    projects[projectIndex].tasks = projects[projectIndex].tasks.filter(
      (task) => !task.completed
    );
    displayTasks(projectIndex);
  }
}

function toggleTaskStatus(projectIndex, taskIndex) {
  if (
    projectIndex >= 0 &&
    projectIndex < projects.length &&
    taskIndex >= 0 &&
    taskIndex < projects[projectIndex].tasks.length
  ) {
    projects[projectIndex].tasks[taskIndex].completed = !projects[projectIndex]
      .tasks[taskIndex].completed;
    displayTasks(projectIndex);
  }
}

function createTaskForm(projectIndex) {
  const taskFormContainer = document.getElementById("task-form-container");
  taskFormContainer.innerHTML = ""; // Limpa o conteúdo anterior

  const taskForm = document.createElement("form");
  taskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-description").value;
    const responsible = document.getElementById("task-responsible").value;
    addTask(projectIndex, title, description, responsible);
    taskForm.reset();
  });

  const titleLabel = document.createElement("label");
  titleLabel.textContent = "Título da Tarefa:";
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.id = "task-title";
  titleInput.required = true;
  taskForm.appendChild(titleLabel);
  taskForm.appendChild(titleInput);

  const descriptionLabel = document.createElement("label");
  descriptionLabel.textContent = "Descrição da Tarefa:";
  const descriptionTextarea = document.createElement("textarea");
  descriptionTextarea.id = "task-description";
  descriptionTextarea.required = true;
  taskForm.appendChild(descriptionLabel);
  taskForm.appendChild(descriptionTextarea);

  const responsibleLabel = document.createElement("label");
  responsibleLabel.textContent = "Responsável pela Tarefa:";
  const responsibleInput = document.createElement("input");
  responsibleInput.type = "text";
  responsibleInput.id = "task-responsible";
  responsibleInput.required = true;
  taskForm.appendChild(responsibleLabel);
  taskForm.appendChild(responsibleInput);

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Adicionar Tarefa";
  taskForm.appendChild(submitButton);

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = "Ocultar formulário de tarefas";
  cancelButton.addEventListener("click", function () {
    taskForm.reset();
    taskFormContainer.style.display = "none";
  });
  taskForm.appendChild(cancelButton);

  taskFormContainer.appendChild(taskForm);
  taskFormContainer.style.display = "block";
}

function hideProjectForm() {
  const projectForm = document.getElementById("project-form");
  projectForm.reset();
  projectForm.style.display = "none";
}

function displayProjects() {
  const projectList = document.getElementById("project-list");
  projectList.innerHTML = ""; // Limpa o conteúdo anterior

  projects.forEach((project, index) => {
    const projectElement = document.createElement("div");
    projectElement.classList.add("project");
    projectElement.addEventListener("click", function () {
      displayTasks(index);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Excluir Projeto";
    deleteButton.addEventListener("click", function (event) {
      event.stopPropagation();
      deleteProject(index);
    });

    const nameElement = document.createElement("h3");
    nameElement.textContent = project.name;

    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = project.description;

    const dueDateElement = document.createElement("p");
    dueDateElement.textContent = "Data de Vencimento: " + project.dueDate;

    projectElement.appendChild(nameElement);
    projectElement.appendChild(descriptionElement);
    projectElement.appendChild(dueDateElement);
    projectElement.appendChild(deleteButton);
  
    projectList.appendChild(projectElement);
  });
}

function displayTasks(projectIndex) {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = ""; // Limpa o conteúdo anterior

  if (projectIndex >= 0 && projectIndex < projects.length) {
    const selectedProject = projects[projectIndex];

    const projectDescriptionElement = document.createElement("p");
    projectDescriptionElement.textContent = "Projeto: " + selectedProject.name;
    taskList.appendChild(projectDescriptionElement);

    const taskHeader = document.createElement("h3");
    taskHeader.textContent = "Tarefas:";
    taskList.appendChild(taskHeader);

    if (selectedProject.tasks.length === 0) {
      const noTasksMessage = document.createElement("p");
      noTasksMessage.textContent = "Nenhuma tarefa encontrada.";
      taskList.appendChild(noTasksMessage);
    } else {
      selectedProject.tasks.forEach((task, index) => {
        const taskElement = document.createElement("div");
        taskElement.classList.add("task");

        const taskTitleElement = document.createElement("h4");
        taskTitleElement.textContent = task.title + " : ";

        const taskDescriptionElement = document.createElement("p");
        taskDescriptionElement.textContent = task.description + " - ";

        const taskResponsibleElement = document.createElement("p");
        taskResponsibleElement.textContent = task.responsible;


        const taskStatusElement = document.createElement("input");
        taskStatusElement.type = "checkbox";
        taskStatusElement.checked = task.completed;
        taskStatusElement.addEventListener("change", function () {
          toggleTaskStatus(projectIndex, index);
        });

        taskElement.appendChild(taskTitleElement);
        taskElement.appendChild(taskDescriptionElement);
        taskElement.appendChild(taskResponsibleElement);
        taskElement.appendChild(taskStatusElement);
        taskList.appendChild(taskElement);
      });
    }

    const deleteCompletedButton = document.createElement("button");
    deleteCompletedButton.textContent = "Excluir Tarefas Concluídas";
    deleteCompletedButton.addEventListener("click", function () {
      deleteCompletedTasks(projectIndex);
    });
    taskList.appendChild(deleteCompletedButton);

    createTaskForm(projectIndex);
  }
}

const projectForm = document.getElementById("project-form");
projectForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = document.getElementById("project-name").value;
  const description = document.getElementById("project-description").value;
  const dueDate = document.getElementById("due-date").value;
  addProject(name, description, dueDate);
  projectForm.reset();
});

displayProjects();
