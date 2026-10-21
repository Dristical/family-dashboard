// State Management
const store = {
    user: localStorage.getItem('hub_user') || null,
    announcements: JSON.parse(localStorage.getItem('hub_announcements')) || ["Welcome to the family hub!"],
    sharedTasks: JSON.parse(localStorage.getItem('hub_shared_tasks')) || [{ text: "Buy groceries", done: false }],
    personalTasks: JSON.parse(localStorage.getItem('hub_personal_tasks')) || {},
    personalEvents: JSON.parse(localStorage.getItem('hub_personal_events')) || {},
    chores: JSON.parse(localStorage.getItem('hub_chores')) || [{ text: "Clean living room", assignee: "Hany", done: false }]
};

function saveStore() {
    localStorage.setItem('hub_announcements', JSON.stringify(store.announcements));
    localStorage.setItem('hub_shared_tasks', JSON.stringify(store.sharedTasks));
    localStorage.setItem('hub_personal_tasks', JSON.stringify(store.personalTasks));
    localStorage.setItem('hub_personal_events', JSON.stringify(store.personalEvents));
    localStorage.setItem('hub_chores', JSON.stringify(store.chores));
}

// Authentication
document.getElementById('login-btn').addEventListener('click', () => {
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;

    if (pass === user) {
        store.user = user;
        localStorage.setItem('hub_user', user);
        initApp();
    } else {
        document.getElementById('login-error').innerText = "Incorrect password.";
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('hub_user');
    store.user = null;
    location.reload();
});

// Tab Switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        e.target.classList.add('active');
        document.getElementById(e.target.dataset.tab).classList.add('active');
    });
});

// App Initialization
function initApp() {
    if (!store.user) {
        document.getElementById('login-screen').classList.remove('dashboard-hidden');
        document.getElementById('dashboard-app').classList.add('dashboard-hidden');
        return;
    }

    document.getElementById('login-screen').classList.add('dashboard-hidden');
    document.getElementById('dashboard-app').classList.remove('dashboard-hidden');

    document.getElementById('welcome-name').innerText = store.user;
    document.getElementById('user-badge').innerText = `${store.user} ${store.user === 'Jeyad' ? '(Admin)' : ''}`;

    renderAll();
}

function renderAll() {
    renderOverview();
    renderPersonalSpace();
    renderFamilyBoard();
    renderChores();
}

// Render Functions
function renderOverview() {
    document.getElementById('overview-announcements').innerHTML = store.announcements
        .slice(-3).map(a => `<div class="list-item">📢 ${a}</div>`).join('');
    
    document.getElementById('overview-tasks').innerHTML = store.sharedTasks
        .slice(-3).map(t => `<div class="list-item ${t.done ? 'done' : ''}">📌 ${t.text}</div>`).join('');
}

function renderPersonalSpace() {
    const myTasks = store.personalTasks[store.user] || [];
    const myEvents = store.personalEvents[store.user] || [];

    document.getElementById('personal-tasks-list').innerHTML = myTasks.length ? myTasks.map((t, i) => `
        <div class="list-item ${t.done ? 'done' : ''}">
            <input type="checkbox" ${t.done ? 'checked' : ''} onclick="togglePersonalTask(${i})">
            <span>${t.text}</span>
        </div>
    `).join('') : '<p style="color: var(--text-muted);">No personal tasks yet.</p>';

    document.getElementById('personal-events-list').innerHTML = myEvents.length ? myEvents.map(e => `
        <div class="list-item">🗓️ ${e}</div>
    `).join('') : '<p style="color: var(--text-muted);">No upcoming events.</p>';
}

function addPersonalTask() {
    const input = document.getElementById('new-personal-task');
    if (input.value.trim()) {
        if (!store.personalTasks[store.user]) store.personalTasks[store.user] = [];
        store.personalTasks[store.user].push({ text: input.value.trim(), done: false });
        input.value = '';
        saveStore();
        renderPersonalSpace();
    }
}

function togglePersonalTask(i) {
    store.personalTasks[store.user][i].done = !store.personalTasks[store.user][i].done;
    saveStore();
    renderPersonalSpace();
}

function addPersonalEvent() {
    const input = document.getElementById('new-personal-event');
    if (input.value.trim()) {
        if (!store.personalEvents[store.user]) store.personalEvents[store.user] = [];
        store.personalEvents[store.user].push(input.value.trim());
        input.value = '';
        saveStore();
        renderPersonalSpace();
    }
}

function renderFamilyBoard() {
    document.getElementById('family-announcements-list').innerHTML = store.announcements.map(a => `
        <div class="list-item">📢 ${a}</div>
    `).join('');

    document.getElementById('shared-tasks-list').innerHTML = store.sharedTasks.map((t, i) => `
        <div class="list-item ${t.done ? 'done' : ''}">
            <input type="checkbox" ${t.done ? 'checked' : ''} onclick="toggleSharedTask(${i})">
            <span>${t.text}</span>
        </div>
    `).join('');
}

function addAnnouncement() {
    const input = document.getElementById('new-announcement');
    if (input.value.trim()) {
        store.announcements.push(`${store.user}: ${input.value.trim()}`);
        input.value = '';
        saveStore();
        renderFamilyBoard();
        renderOverview();
    }
}

function addSharedTask() {
    const input = document.getElementById('new-shared-task');
    if (input.value.trim()) {
        store.sharedTasks.push({ text: input.value.trim(), done: false });
        input.value = '';
        saveStore();
        renderFamilyBoard();
        renderOverview();
    }
}

function toggleSharedTask(i) {
    store.sharedTasks[i].done = !store.sharedTasks[i].done;
    saveStore();
    renderFamilyBoard();
    renderOverview();
}

function renderChores() {
    document.getElementById('chores-list').innerHTML = store.chores.map((c, i) => `
        <div class="list-item ${c.done ? 'done' : ''}">
            <input type="checkbox" ${c.done ? 'checked' : ''} onclick="toggleChore(${i})">
            <span><b>${c.assignee}:</b> ${c.text}</span>
        </div>
    `).join('');
}

function addChore() {
    const text = document.getElementById('new-chore-text').value.trim();
    const assignee = document.getElementById('new-chore-assignee').value;
    if (text) {
        store.chores.push({ text, assignee, done: false });
        document.getElementById('new-chore-text').value = '';
        saveStore();
        renderChores();
    }
}

function toggleChore(i) {
    store.chores[i].done = !store.chores[i].done;
    saveStore();
    renderChores();
}

// Theme Toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
});

// Run
initApp();
// Theme Toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
});

// Run on load
initApp();