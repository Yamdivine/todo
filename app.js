document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const todoList = document.getElementById('todo-list'); // Todo list container
    const titleInput = document.getElementById('title'); // Title input field
    const descriptionInput = document.getElementById('description'); // Description textarea
    const dueDateInput = document.getElementById('due-date'); // Due date input
    const prioritySelect = document.getElementById('priority'); // Priority select dropdown
    const addTodoBtn = document.getElementById('add-todo'); // Add todo button
    const showFormBtn = document.getElementById('show-form-btn'); // Show form button
    const todoForm = document.getElementById('todo-form'); // Todo form
    const cancelFormBtn = document.getElementById('cancel-form'); // Cancel form button
    const searchInput = document.getElementById('search'); // Search input
    const filterAllBtn = document.getElementById('filter-all'); // Filter all button
    const filterActiveBtn = document.getElementById('filter-active'); // Filter active button
    const filterCompletedBtn = document.getElementById('filter-completed'); // Filter completed button
    const themeToggle = document.getElementById('theme-toggle'); // Theme toggle button
    const sortSelect = document.getElementById('sort'); // Sort select dropdown
    const countAll = document.getElementById('count-all'); // All todos count
    const countActive = document.getElementById('count-active'); // Active todos count
    const countCompleted = document.getElementById('count-completed'); // Completed todos count
    
    // State Management
    let todos = []; // Array to store all todos
    let currentFilter = 'all'; // Current filter state (all, active, completed)
    let searchQuery = ''; // Current search query
    let currentSort = 'newest'; // Current sort order (newest, oldest)
    
    // Initialize the application
    function init() {
      todos = loadTodos(); // Load todos from storage
      loadTheme(); // Load saved theme
      updateCounts(); // Update todo counts
      renderTodos(); // Render todo list
      setupEventListeners(); // Set up event listeners
    }
    
    // Update todo counts display
    function updateCounts() {
      countAll.textContent = todos.length;
      countActive.textContent = todos.filter(t => !t.completed).length;
      countCompleted.textContent = todos.filter(t => t.completed).length;
    }
    
    // Update theme toggle button icon based on current theme
    function updateThemeToggleIcon(isDark) {
      const moonIcon = themeToggle.querySelector('.fa-moon');
      const sunIcon = themeToggle.querySelector('.fa-sun');
      moonIcon.classList.toggle('hidden', isDark);
      sunIcon.classList.toggle('hidden', !isDark);
    }
    
    // Load theme from storage and apply it
    function loadTheme() {
      const savedTheme = getTheme();
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      updateThemeToggleIcon(savedTheme === 'dark');
      renderTodos(); // Re-render to ensure correct colors
    }
    
    // Set up all event listeners
    function setupEventListeners() {
      // Show form when clicking add todo button
      showFormBtn.addEventListener('click', () => {
        todoForm.classList.remove('hidden');
        showFormBtn.classList.add('hidden');
        titleInput.focus();
      });
      
      // Hide form when clicking cancel
      cancelFormBtn.addEventListener('click', () => {
        resetForm();
        todoForm.classList.add('hidden');
        showFormBtn.classList.remove('hidden');
      });
      
      // Add new todo on button click or Enter key
      addTodoBtn.addEventListener('click', addTodo);
      titleInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
      });
      
      // Debounced search input
      let searchTimeout;
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          searchQuery = searchInput.value.toLowerCase();
          renderTodos();
        }, 300);
      });
      
      // Filter button listeners
      filterAllBtn.addEventListener('click', () => setFilter('all'));
      filterActiveBtn.addEventListener('click', () => setFilter('active'));
      filterCompletedBtn.addEventListener('click', () => setFilter('completed'));
      
      // Sort select listener
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderTodos();
      });
      
      // Theme toggle listener
      themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Toggle between light and dark themes
    function toggleTheme() {
      const html = document.documentElement;
      const isDark = html.classList.contains('dark');
      html.classList.toggle('dark');
      saveTheme(isDark ? 'light' : 'dark');
      updateThemeToggleIcon(!isDark);
      renderTodos(); // Re-render to apply new theme colors
    }
    
    // Add a new todo item
    function addTodo() {
      const title = titleInput.value.trim();
      if (!title) return;
      
      const newTodo = {
        id: Date.now(), // Unique ID based on timestamp
        title,
        description: descriptionInput.value.trim(),
        dueDate: dueDateInput.value,
        priority: prioritySelect.value,
        completed: false,
        createdAt: new Date().toISOString()
      };
      
      todos.unshift(newTodo);
      saveTodos(todos);
      updateCounts();
      renderTodos();
      resetForm();
      
      // Hide form after adding
      todoForm.classList.add('hidden');
      showFormBtn.classList.remove('hidden');
    }
    
    // Reset form inputs
    function resetForm() {
      titleInput.value = '';
      descriptionInput.value = '';
      dueDateInput.value = '';
      prioritySelect.value = 'none';
    }
    
    // Set current filter and update UI
    function setFilter(filter) {
      currentFilter = filter;
      
      // Update filter button styles
      [filterAllBtn, filterActiveBtn, filterCompletedBtn].forEach(btn => {
        const isActive = btn.id === `filter-${filter}`;
        btn.classList.toggle('bg-blue-600', isActive);
        btn.classList.toggle('dark:bg-blue-700', isActive);
        btn.classList.toggle('text-white', isActive);
        btn.classList.toggle('bg-gray-200', !isActive);
        btn.classList.toggle('dark:bg-gray-700', !isActive);
        btn.classList.toggle('text-gray-900', !isActive && !btn.classList.contains('dark'));
        btn.classList.toggle('dark:text-gray-100', !isActive);
      });
      
      renderTodos();
    }
    
    // Render todo list based on filter and sort
    function renderTodos() {
      // Filter todos based on current filter and search query
      let filteredTodos = todos.filter(todo => {
        const matchesSearch = todo.title.toLowerCase().includes(searchQuery) || 
                           (todo.description && todo.description.toLowerCase().includes(searchQuery));
        
        if (currentFilter === 'active') {
          return matchesSearch && !todo.completed;
        } else if (currentFilter === 'completed') {
          return matchesSearch && todo.completed;
        }
        return matchesSearch;
      });
      
      // Sort todos based on current sort option
      filteredTodos = [...filteredTodos].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        
        if (currentSort === 'newest') {
          return dateB - dateA;
        } else {
          return dateA - dateB;
        }
      });
      
      // Display message if no todos match
      if (filteredTodos.length === 0) {
        todoList.innerHTML = `
          <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center text-gray-500 dark:text-gray-400">
            No todos ${currentFilter === 'all' ? '' : currentFilter}${searchQuery ? ' matching "' + searchQuery + '"' : ''}
          </div>
        `;
        return;
      }
      
      // Render todo items
      todoList.innerHTML = filteredTodos.map(todo => `
        <div class="todo-item bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-3 border-l-4 ${getPriorityBorder(todo.priority)}" data-id="${todo.id}">
          <div class="flex items-start justify-between">
            <div class="flex items-start flex-1">
              <!-- Complete todo button -->
              <button class="complete-btn mr-3 mt-1 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <i class="fas ${todo.completed ? 'fa-check-circle text-green-500' : 'fa-circle text-gray-400 dark:text-gray-500'}"></i>
              </button>
              <div class="flex-1">
                <!-- Todo title -->
                <h3 class="text-lg font-medium ${todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}">${todo.title}</h3>
                <!-- Todo description -->
                ${todo.description ? `<p class="text-gray-600 dark:text-gray-300 mt-1">${todo.description}</p>` : ''}
                <!-- Todo due date -->
                ${todo.dueDate ? `<p class="text-sm ${todo.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'} mt-2"><i class="far fa-calendar-alt mr-1"></i> Due: ${formatDate(todo.dueDate)}</p>` : ''}
              </div>
            </div>
            <div class="flex space-x-2">
              <!-- Edit button -->
              <button class="edit-btn p-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <i class="fas fa-pencil-alt"></i>
              </button>
              <!-- Delete button -->
              <button class="delete-btn p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>
      `).join('');
      
      // Add event listeners to dynamic buttons
      document.querySelectorAll('.complete-btn').forEach(btn => {
        btn.addEventListener('click', toggleComplete);
      });
      
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', startEdit);
      });
      
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', deleteTodo);
      });
    }
    
    // Toggle todo completion status
    function toggleComplete(e) {
      const todoId = parseInt(e.target.closest('.todo-item').dataset.id);
      const todo = todos.find(t => t.id === todoId);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodos(todos);
        updateCounts();
        renderTodos();
      }
    }
    
    // Start editing a todo
    function startEdit(e) {
      const todoId = parseInt(e.target.closest('.todo-item').dataset.id);
      const todo = todos.find(t => t.id === todoId);
      if (!todo) return;
      
      const todoElement = e.target.closest('.todo-item');
      todoElement.innerHTML = `
        <div class="edit-form">
          <!-- Edit title input -->
          <div class="mb-3">
            <input type="text" class="edit-title w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" value="${todo.title}" required>
          </div>
          <!-- Edit description textarea -->
          <div class="mb-3">
            <textarea class="edit-description w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">${todo.description || ''}</textarea>
          </div>
          <!-- Edit due date input -->
          <div class="mb-3">
            <input type="date" class="edit-due-date w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" value="${todo.dueDate || ''}">
          </div>
          <div class="flex space-x-2">
            <!-- Save edit button -->
            <button class="save-edit bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-lg">Save</button>
            <!-- Cancel edit button -->
            <button class="cancel-edit bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-lg">Cancel</button>
          </div>
        </div>
      `;
      
      todoElement.querySelector('.save-edit').addEventListener('click', () => saveEdit(todoId));
      todoElement.querySelector('.cancel-edit').addEventListener('click', renderTodos);
    }
    
    // Save edited todo
    function saveEdit(todoId) {
      const todo = todos.find(t => t.id === todoId);
      if (!todo) return;
      
      const todoElement = document.querySelector(`.todo-item[data-id="${todoId}"]`);
      const newTitle = todoElement.querySelector('.edit-title').value.trim();
      if (!newTitle) return;
      
      todo.title = newTitle;
      todo.description = todoElement.querySelector('.edit-description').value.trim();
      todo.dueDate = todoElement.querySelector('.edit-due-date').value;
      
      saveTodos(todos);
      updateCounts();
      renderTodos();
    }
    
    // Delete a todo
    function deleteTodo(e) {
      const todoId = parseInt(e.target.closest('.todo-item').dataset.id);
      todos = todos.filter(t => t.id !== todoId);
      saveTodos(todos);
      updateCounts();
      renderTodos();
    }
    
    // Format date for display
    function formatDate(dateString) {
      if (!dateString) return '';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    // Get priority border color
    function getPriorityBorder(priority) {
      switch (priority) {
        case 'high': return 'border-red-500';
        case 'medium': return 'border-yellow-500';
        case 'low': return 'border-green-500';
        default: return 'border-transparent';
      }
    }
    
    // Start the application
    init();
  });