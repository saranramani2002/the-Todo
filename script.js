const todoForm = document.querySelector('.todo-form');
const todoInput = document.querySelector('.todo-input');
const todoItemsList = document.querySelector('.todo-items');
let todos = [];
renderTodos(todos);


todoForm.addEventListener('submit', function (event) {
  event.preventDefault();
  addTodo(todoInput.value);
});

function addTodo(item) {
  if (item == '')
    showToast("Enter Todo statement");
  const exists = todos.some(todo => todo.name === item);
  if (exists) {
    showToast("This todo already exists!");
  }

  else if (item !== '') {

    const todo = {
      id: Date.now(),
      name: item,
      completed: false
    };
    todos.push(todo);
    addToLocalStorage(todos);
    showToast("Todo added successfully!");
    todoInput.value = '';

  }
}

function renderTodos(todos) {

  todoItemsList.innerHTML = '';
  todos.forEach(function (item) {

    const checked = item.completed ? 'checked' : null;

    const li = document.createElement('li');

    li.setAttribute('class', 'item');

    li.setAttribute('data-key', item.id);

    if (item.completed === true) {
      li.classList.add('checked');
    } li.innerHTML = `
      <input type="checkbox" class="checkbox" ${checked}>
      ${item.name}
      <button class="delete-button">🗑️</button>
      <button class="edit-button">✏️</button>
    `;

    todoItemsList.append(li);
  });
}

function addToLocalStorage(todos) {

  localStorage.setItem('todos', JSON.stringify(todos));

  renderTodos(todos);
}


function getFromLocalStorage() {
  const reference = localStorage.getItem('todos');

  if (reference) {

    todos = JSON.parse(reference);
    renderTodos(todos);
  }
}


function toggle(id) {
  todos.forEach(function (item) {

    if (item.id == id) {

      item.completed = !item.completed;
    }
  }); addToLocalStorage(todos);

}


function deleteTodo(id) {
  const confirmed = confirm("Are you sure you want to delete this todo?");
  if (confirmed == true) {
    todos = todos.filter(function (item) {
      return item.id != id;
    });
    addToLocalStorage(todos);
    showToast("Todo Deleted successfully!");
  }
}

//To display the items in the screen after deletion  
getFromLocalStorage();
todoItemsList.addEventListener('click', function (event) {

  if (event.target.type === 'checkbox') {

    toggle(event.target.parentElement.getAttribute('data-key'));
  }
  if (event.target.classList.contains('delete-button')) {

    deleteTodo(event.target.parentElement.getAttribute('data-key'));
  }


  function editTodo(id) {
    const todoIndex = todos.findIndex(item => item.id == id);
    if (todoIndex !== 1) {
      const todo = todos[todoIndex];
      todoInput.value = todo.name;
      todos.splice(todoIndex, 1);
      addToLocalStorage(todos);

    }
  }
 
 
  // The Local storage updated with the  edited list and display on the screen
  getFromLocalStorage();

  todoItemsList.addEventListener('click', function (event) {
    if (event.target.type === 'checkbox') {
      toggle(event.target.parentElement.getAttribute('data-key'));
    }
    if (event.target.classList.contains('delete-button')) {
      deleteTodo(event.target.parentElement.getAttribute('data-key'));
    }
    if (event.target.classList.contains('edit-button')) {
      editTodo(event.target.parentElement.getAttribute('data-key'));
    }
  });
});

//toast message
function showToast(message) {
  const toast = document.createElement('div');  //is to organize the toast in a form
  toast.classList.add('toast');
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
