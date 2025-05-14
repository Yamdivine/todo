
document.addEventListener('DOMContentLoaded', () => {
  const todoList = [];
  const listContainer = document.getElementById('todoContainer');
  const filters = document.querySelectorAll('[data-filter]');
  const counter = document.getElementById('count');
  const search = document.getElementById('searchInput');
  const formContainer = document.getElementById('todoFormContainer');
  const form = document.getElementById('todoForm');

  function getCurrentFilter() {
    return document.querySelector('[data-filter].bg-blue-600')?.dataset.filter || 'all';
  }

  function renderTodos(filter = 'all', searchTerm = '') {
    listContainer.innerHTML = '';
    let filtered = todoList;

    if (filter !== 'all') {
      filtered = filtered.filter(t => t.status === filter);
    }

    if (searchTerm) {
      filtered = filtered.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    counter.textContent = `(${filtered.length})`;

    if (filtered.length === 0) {
      listContainer.innerHTML = `<p class="text-center text-gray-400 dark:text-gray-500">No ${filter} todos</p>`;
      return;
    }

    filtered.forEach((todo, index) => {
      const item = document.createElement('div');
      item.className = 'flex justify-between items-center bg-white dark:bg-white px-4 py-2 rounded mb-2  text-black';
      item.innerHTML = `
        <span class="${todo.status === 'completed' ? 'line-through text-gray-400' : ''}">
          ${todo.title}
        </span>
        <div class="space-x-2">
          <button onclick="toggleComplete(${index})"><i class="fas fa-check text-green-500"></i></button>
          <button onclick="deleteTodo(${index})"><i class="fas fa-trash text-red-500"></i></button>
        </div>
      `;
      listContainer.appendChild(item);
    });
  }

  window.toggleComplete = function (index) {
    todoList[index].status = todoList[index].status === 'completed' ? 'active' : 'completed';
    renderTodos(getCurrentFilter(), search.value);
  };

  window.deleteTodo = function (index) {
    todoList.splice(index, 1);
    renderTodos(getCurrentFilter(), search.value);
  };

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('bg-blue-600'));
      btn.classList.add('bg-blue-600');
      renderTodos(btn.dataset.filter, search.value);
    });
  });

  search.addEventListener('input', () => {
    renderTodos(getCurrentFilter(), search.value);
  });

  document.getElementById('add-todo').addEventListener('click', () => {
    formContainer.classList.remove('hidden');
  });

  document.getElementById('cancelForm').addEventListener('click', () => {
    form.reset();
    formContainer.classList.add('hidden');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('todoTitle').value.trim();
    const description = document.getElementById('todoDescription').value.trim();
    const date = document.getElementById('todoDate').value;
    const priority = document.getElementById('todoPriority').value;

    if (title) {
      todoList.push({
        title,
        description,
        date,
        priority,
        status: 'active'
      });
      form.reset();
      formContainer.classList.add('hidden');
      renderTodos(getCurrentFilter(), search.value);
    }
  });

  renderTodos();
});
