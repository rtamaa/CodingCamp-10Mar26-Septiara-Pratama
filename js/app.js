// State Management
let timerInterval = null;
let timeLeft = 25 * 60;
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let links = JSON.parse(localStorage.getItem('links')) || [];
let userName = localStorage.getItem('userName') || null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateTime();
    updateGreeting();
    renderTodos();
    renderLinks();
    setupEventListeners();
    setInterval(updateTime, 1000);
});

// Theme Management
function initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    document.getElementById('themeToggle').textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    document.getElementById('themeToggle').textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

// Time & Greeting
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('timeDisplay').textContent = timeString;
    
    const dateString = now.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    document.getElementById('dateDisplay').textContent = dateString;
}

function updateGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Selamat Malam';
    if (hour >= 5 && hour < 12) greeting = 'Selamat Pagi';
    else if (hour >= 12 && hour < 18) greeting = 'Selamat Siang';
    
    if (!userName) {
        userName = prompt('Siapa nama kamu?') || 'Teman';
        localStorage.setItem('userName', userName);
    }
    
    document.getElementById('greeting').textContent = `${greeting}, ${userName}!`;
}

// Focus Timer
function startTimer() {
    if (timerInterval) return;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            stopTimer();
            alert('Waktu fokus selesai! Istirahat sebentar.');
            resetTimer();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    stopTimer();
    timeLeft = 25 * 60;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timerDisplay').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// To-Do List
function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    
    if (!text) return;
    
    // Prevent duplicates
    if (todos.some(todo => todo.text.toLowerCase() === text.toLowerCase())) {
        alert('Tugas ini sudah ada!');
        return;
    }
    
    todos.push({ id: Date.now(), text, completed: false });
    saveTodos();
    renderTodos();
    input.value = '';
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    const newText = prompt('Edit tugas:', todo.text);
    if (newText && newText.trim()) {
        const trimmedText = newText.trim();
        
        // Check for duplicates (excluding current todo)
        if (todos.some(t => t.id !== id && t.text.toLowerCase() === trimmedText.toLowerCase())) {
            alert('Tugas ini sudah ada!');
            return;
        }
        
        todo.text = trimmedText;
        saveTodos();
        renderTodos();
    }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    const list = document.getElementById('todoList');
    list.innerHTML = '';
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo(${todo.id})">
            <span onclick="toggleTodo(${todo.id})">${todo.text}</span>
            <button onclick="editTodo(${todo.id})">Edit</button>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">Hapus</button>
        `;
        
        list.appendChild(li);
    });
}

// Quick Links
function addLink() {
    const nameInput = document.getElementById('linkName');
    const urlInput = document.getElementById('linkUrl');
    
    const name = nameInput.value.trim();
    const url = urlInput.value.trim();
    
    if (!name || !url) return;
    
    links.push({ id: Date.now(), name, url });
    saveLinks();
    renderLinks();
    
    nameInput.value = '';
    urlInput.value = '';
}

function removeLink(id) {
    links = links.filter(l => l.id !== id);
    saveLinks();
    renderLinks();
}

function saveLinks() {
    localStorage.setItem('links', JSON.stringify(links));
}

function renderLinks() {
    const grid = document.getElementById('linksGrid');
    grid.innerHTML = '';
    
    links.forEach(link => {
        const card = document.createElement('div');
        card.className = 'link-card';
        
        card.innerHTML = `
            <button class="remove-link" onclick="removeLink(${link.id})">×</button>
            <a href="${link.url}" target="_blank">${link.name}</a>
        `;
        
        grid.appendChild(card);
    });
}

// Event Listeners
function setupEventListeners() {
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('startBtn').addEventListener('click', startTimer);
    document.getElementById('stopBtn').addEventListener('click', stopTimer);
    document.getElementById('resetBtn').addEventListener('click', resetTimer);
    document.getElementById('addTodoBtn').addEventListener('click', addTodo);
    document.getElementById('addLinkBtn').addEventListener('click', addLink);
    
    document.getElementById('todoInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
}
