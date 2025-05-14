
// Theme toggle
function toggleTheme() {
  document.documentElement.classList.toggle('dark');
}


  document.addEventListener('DOMContentLoaded', () => {
    let todoList = JSON.parse(localStorage.getItem('todos')) || [];

    const input = document.getElementById('newTodoInput');
    const listContainer = document.getElementById('todoContainer');
    const filters = document.querySelectorAll('[data-filter]');
    const counter = document.getElementById('count');
    const search = document.getElementById('searchInput');

    function saveTodos() {
      localStorage.setItem('todos', JSON.stringify(todoList));
    }

    function renderTodos(filter = 'all', searchTerm = '') {
      listContainer.innerHTML = '';
      let filtered = todoList;

      if (filter !== 'all') {
        filtered = filtered.filter(t => t.status === filter);
      }

      if (searchTerm) {
        filtered = filtered.filter(t => t.text.toLowerCase().includes(searchTerm.toLowerCase()));
      }

      counter.textContent = `(${filtered.length})`;

      if (filtered.length === 0) {
        listContainer.innerHTML = `<p class="text-center text-gray-400 dark:text-gray-500">No ${filter} todos</p>`;
      } else {
        filtered.forEach((todo, index) => {
          const item = document.createElement('div');
          item.className = 'flex justify-between items-center bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded mb-2';
          item.innerHTML = `
            <span class="${todo.status == 'completed' ? 'line-through text-gray-400' : ''}">${todo.text}</span>
            <div class="space-x-2">
              <button onclick="toggleComplete(${index})"><i class="fas fa-check text-green-500"></i></button>
              <button onclick="deleteTodo(${index})"><i class="fas fa-trash text-red-500"></i></button>
            </div>
          `;
          listContainer.appendChild(item);
        });
      }
    }

    window.addTodo = function () {
      if (input && input.value.trim() !== '') {
        todoList.push({ text: input.value.trim(), status: 'active' });
        input.value = '';
        saveTodos();
        renderTodos(getCurrentFilter(), search.value);
      }
    };

    window.toggleComplete = function (index) {
      todoList[index].status = todoList[index].status === 'completed' ? 'active' : 'completed';
      saveTodos();
      renderTodos(getCurrentFilter(), search.value);
    };

    window.deleteTodo = function (index) {
      todoList.splice(index, 1);
      saveTodos();
      renderTodos(getCurrentFilter(), search.value);
    };

    function getCurrentFilter() {
      return document.querySelector('[data-filter].bg-blue-600')?.dataset.filter || 'all';
    }

    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('bg-blue-600', 'text-white'));
        btn.classList.add('bg-blue-600', 'text-white');
        renderTodos(btn.dataset.filter, search.value);
      });
    });

    search.addEventListener('input', () => {
      renderTodos(getCurrentFilter(), search.value);
    });

    renderTodos();
  });


document.addEventListener('DOMContentLoaded', () => {
  const todoList = [];
  const input = document.getElementById('newTodoInput');
  const listContainer = document.getElementById('todoContainer');
  const filters = document.querySelectorAll('[data-filter]');
  const counter = document.getElementById('count');
  const search = document.getElementById('searchInput');

  function renderTodos(filter = 'all', searchTerm = '') {
    listContainer.innerHTML = '';
    let filtered = todoList;
    if (filter !== 'all') {
      filtered = filtered.filter(t => t.status === filter);
    }
    if (searchTerm) {
      filtered = filtered.filter(t => t.text.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    counter.textContent = `(${filtered.length})`;
    if (filtered.length === 0) {
      listContainer.innerHTML = `<p class="text-center text-gray-400 dark:text-gray-500">No ${filter} todos</p>`;
    } else {
      filtered.forEach((todo, index) => {
        const item = document.createElement('div');
        item.className = 'flex justify-between items-center bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded mb-2';
        item.innerHTML = `
          <span class="${todo.status === 'completed' ? 'line-through text-gray-400' : ''}">${todo.text}</span>
          <div class="space-x-2">
            <button onclick="toggleComplete(${index})"><i class="fas fa-check text-green-500"></i></button>
            <button onclick="deleteTodo(${index})"><i class="fas fa-trash text-red-500"></i></button>
          </div>
        `;
        listContainer.appendChild(item);
      });
    }
  }

  window.addTodo = function () {
    if (input.value.trim() !== '') {
      todoList.push({ text: input.value.trim(), status: 'active' });
      input.value = '';
      renderTodos(getCurrentFilter());
    }
  };

  window.toggleComplete = function (index) {
    todoList[index].status = todoList[index].status === 'completed' ? 'active' : 'completed';
    renderTodos(getCurrentFilter());
  };

  window.deleteTodo = function (index) {
    todoList.splice(index, 1);
    renderTodos(getCurrentFilter());
  };

  function getCurrentFilter() {
    return document.querySelector('[data-filter].bg-blue-600')?.dataset.filter || 'all';
  }

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('bg-blue-600', 'text-white'));
      btn.classList.add('bg-blue-600', 'text-white');
      renderTodos(btn.dataset.filter);
    });
  });

  search.addEventListener('input', () => {
    renderTodos(getCurrentFilter(), search.value);
  });

  renderTodos();
});