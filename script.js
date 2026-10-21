// LocalStorage Database initialization
const db = {
    currentUser: localStorage.getItem('family_current_user') || null,
    announcements: JSON.parse(localStorage.getItem('family_announcements')) || ["Welcome to the Kuwait Family Hub!"],
    chores: JSON.parse(localStorage.getItem('family_chores')) || [{text: "Clean living room", assigned: "Hany", done: false}],
    schedule: JSON.parse(localStorage.getItem('family_schedule')) || { Jeyad: ["Study IGCSE"], Hany: ["Work tasks"], Mila: ["School prep"], Maya: ["Art practice"] },
    familyTasks: JSON.parse(localStorage.getItem('family_tasks')) || [{text: "Buy groceries from Sultan Center", done: false}]
};

function saveDb() {
    localStorage.setItem('family_announcements', JSON.stringify(db.announcements));
    localStorage.setItem('family_chores', JSON.stringify(db.chores));
    localStorage.setItem('family_schedule', JSON.stringify(db.schedule));
    localStorage.setItem('family_tasks', JSON.stringify(db.familyTasks));
}

// Authentication Logic
document.getElementById('login-btn').addEventListener('click', () => {
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;
    
    if (pass === user) {
        db.currentUser = user;
        localStorage.setItem('family_current_user', user);
        initApp();
    } else {
        document.getElementById('login-error').innerText = "Incorrect password! (Tip: matches username)";
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('family_current_user');
    db.currentUser = null;
    location.reload();
});

function initApp() {
    if (!db.currentUser) {
        document.getElementById('login-screen').classList.remove('dashboard-hidden');
        document.getElementById('dashboard-app').classList.add('dashboard-hidden');
        return;
    }
    document.getElementById('login-screen').classList.add('dashboard-hidden');
    document.getElementById('dashboard-app').classList.remove('dashboard-hidden');
    document.getElementById('user-badge').innerText = `👤 Logged in as: ${db.currentUser} ${db.currentUser === 'Jeyad' ? '(Admin)' : '(Member)'}`;
    
    renderAll();
}

// Render UI Elements
function renderAll() {
    renderAnnouncements();
    renderChores();
    renderSchedule();
    renderFamilyTasks();
}

function renderAnnouncements() {
    const box = document.getElementById('announcements-list');
    box.innerHTML = db.announcements.map(a => `<p>📢 ${a}</p>`).join('');
}

function addAnnouncement() {
    const val = document.getElementById('new-announcement').value.trim();
    if (val) {
        db.announcements.push(`${db.currentUser}: ${val}`);
        saveDb();
        document.getElementById('new-announcement').value = '';
        renderAnnouncements();
    }
}

function renderChores() {
    const box = document.getElementById('chores-list');
    box.innerHTML = db.chores.map((c, i) => `
        <div>
            <input type="checkbox" ${c.done ? 'checked' : ''} onclick="toggleChore(${i})">
            <span style="${c.done ? 'text-decoration: line-through;' : ''}">${c.text} (Assigned: <b>${c.assigned}</b>)</span>
        </div>
    `).join('');
}

function toggleChore(i) {
    db.chores[i].done = !db.chores[i].done;
    saveDb();
    renderChores();
}

function addChore() {
    const text = document.getElementById('new-chore').value.trim();
    const assigned = document.getElementById('chore-assigned').value;
    if (text) {
        db.chores.push({ text, assigned, done: false });
        saveDb();
        document.getElementById('new-chore').value = '';
        renderChores();
    }
}

function renderSchedule() {
    const box = document.getElementById('schedule-list');
    const userSchedule = db.schedule[db.currentUser] || [];
    box.innerHTML = userSchedule.map(s => `<p>🗓️ ${s}</p>`).join('');
}

function addScheduleItem() {
    const task = document.getElementById('schedule-task').value.trim();
    if (task) {
        if (!db.schedule[db.currentUser]) db.schedule[db.currentUser] = [];
        db.schedule[db.currentUser].push(task);
        saveDb();
        document.getElementById('schedule-task').value = '';
        renderSchedule();
    }
}

function renderFamilyTasks() {
    const box = document.getElementById('family-tasks-list');
    box.innerHTML = db.familyTasks.map((t, i) => `
        <div>
            <input type="checkbox" ${t.done ? 'checked' : ''} onclick="toggleFamilyTask(${i})">
            <span style="${t.done ? 'text-decoration: line-through;' : ''}">${t.text}</span>
        </div>
    `).join('');
}

function toggleFamilyTask(i) {
    db.familyTasks[i].done = !db.familyTasks[i].done;
    saveDb();
    renderFamilyTasks();
}

function addFamilyTask() {
    const text = document.getElementById('new-family-task').value.trim();
    if (text) {
        db.familyTasks.push({ text, done: false });
        saveDb();
        document.getElementById('new-family-task').value = '';
        renderFamilyTasks();
    }
}

// Theme Toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
});

// Run on load
initApp();