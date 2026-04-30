
let tasks = [];          // Array of task objects
let currentFilter = 'all'; // 'all' | 'pending' | 'completed'

// ---- DOM REFERENCES ----
const taskInput  = document.getElementById('taskInput');
const addBtn     = document.getElementById('addBtn');
const taskList   = document.getElementById('taskList');
const taskCount  = document.getElementById('taskCount');


window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    tasks = JSON.parse(saved); // parse stored JSON string → array
  }
  renderTasks();
});

addBtn.addEventListener('click', addTask);

// Also allow pressing Enter key
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

function addTask() {
  const text = taskInput.value.trim(); // remove extra spaces

  // Validation — don't add empty task
  if (!text) {
    alert('⚠️ Please enter a task!');
    return;
  }

  // Create task object
  const newTask = {
    id: Date.now(),       // unique ID using timestamp
    text: text,
    completed: false
  };

  tasks.push(newTask);   // add to array
  taskInput.value = '';  // clear input
  saveToLocalStorage();  // save updated array
  renderTasks();         // re-render list
}

function deleteTask(id) {
  // Filter out the task with matching id
  tasks = tasks.filter(task => task.id !== id);
  saveToLocalStorage();
  renderTasks();
}

function toggleComplete(id) {
  tasks = tasks.map(task =>
    task.id === id
      ? { ...task, completed: !task.completed }  
      : task
  );
  saveToLocalStorage();
  renderTasks();
}

function editTask(id) {
  const li = document.querySelector(`[data-id="${id}"]`);
  const task = tasks.find(t => t.id === id);

  // Replace text span with input field
  li.innerHTML = `
    <input class="edit-input" id="edit-${id}" value="${task.text}" />
    <div class="task-actions">
      <button class="save-btn" onclick="saveTask(${id})">💾 Save</button>
      <button class="delete-btn" onclick="deleteTask(${id})">🗑️ Delete</button>
    </div>
  `;

  // Auto-focus the edit input
  document.getElementById(`edit-${id}`).focus();
}
 
function saveTask(id) {
  const newText = document.getElementById(`edit-${id}`).value.trim();

  if (!newText) {
    alert('⚠️ Task cannot be empty!');
    return;
  }

  // Update the task text in array
  tasks = tasks.map(task =>
    task.id === id ? { ...task, text: newText } : task
  );

  saveToLocalStorage();
  renderTasks();
}
 
function filterTasks(filter) {
  currentFilter = filter;

  // Update active button style
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  renderTasks();
}

// ============================================
// 8. RENDER TASKS TO DOM
// ============================================
function renderTasks() {
  taskList.innerHTML = ''; // clear current list

  // Apply filter
  let filtered = tasks;
  if (currentFilter === 'pending')   filtered = tasks.filter(t => !t.completed);
  if (currentFilter === 'completed') filtered = tasks.filter(t => t.completed);

  // Show message if no tasks
  if (filtered.length === 0) {
    taskList.innerHTML = `<p style="color:#888; text-align:center; padding:20px;">No tasks found 📭</p>`;
    updateCount();
    return;
  }

  // Create list items
  filtered.forEach(task => {
    const li = document.createElement('li');
    li.classList.add('task-item');
    if (task.completed) li.classList.add('completed');
    li.setAttribute('data-id', task.id); // store id on element

    li.innerHTML = `
      <input 
        type="checkbox" 
        ${task.completed ? 'checked' : ''} 
        onchange="toggleComplete(${task.id})" 
      />
      <span class="task-text">${task.text}</span>
      <div class="task-actions">
        <button class="edit-btn"   onclick="editTask(${task.id})">✏️ Edit</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})">🗑️ Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateCount();
}

// ============================================
// 9. UPDATE TASK COUNT
// ============================================
function updateCount() {
  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending   = total - completed;
  taskCount.textContent = `Total: ${total} | ✅ Done: ${completed} | ⏳ Pending: ${pending}`;
}
 
function saveToLocalStorage() {
  // Convert array to JSON string and store
  localStorage.setItem('tasks', JSON.stringify(tasks));
}