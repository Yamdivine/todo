 // Use a unique key for the Todo app to avoid conflicts
const STORAGE_KEY = "NewwwTodoApp";

function getTodos() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveTodos(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}