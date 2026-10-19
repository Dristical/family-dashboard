(() => {
  "use strict";

  const STORAGE_KEYS = {
    accounts: "homebase.accounts",
    schedule: "homebase.schedule",
    links: "homebase.links",
    notes: "homebase.notes",
    layout: "homebase.layout",
    meals: "homebase.meals",
    contacts: "homebase.contacts",
    theme: "homebase.theme",
    session: "homebase.session",
    shopping: "homebase.shopping",
    countdowns: "homebase.countdowns",
    chores: "homebase.chores"
  };

  const defaultAccounts = [
    { username: "jeyad", password: "jeyad", name: "Jeyad", role: "admin" },
    { username: "hany", password: "hany", name: "Hany", role: "member" },
    { username: "mila", password: "mila", name: "Mila", role: "member" },
    { username: "maya", password: "maya", name: "Maya", role: "member" }
  ];
  const defaultSchedule = [
    { id: "event-math", title: "Math tuition", time: "16:00", category: "Academic/Tuition", assignedTo: "Jeyad", completed: false },
    { id: "event-laundry", title: "Fold the laundry", time: "17:30", category: "Chores", assignedTo: "Everyone", completed: false },
    { id: "event-dinner", title: "Family dinner", time: "19:00", category: "Family Events", assignedTo: "Everyone", completed: false }
  ];
  const defaultLinks = [
    { id: "link-school", title: "School portal", url: "https://classroom.google.com" },
    { id: "link-utilities", title: "Utilities", url: "https://www.google.com/maps" },
    { id: "link-shopping", title: "Shopping", url: "https://www.amazon.com" }
  ];
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const mealTypes = ["Breakfast", "Lunch", "Dinner"];
  const defaultMeals = {
    Monday: { Breakfast: "Oatmeal & fruit", Lunch: "Chicken wraps", Dinner: "Pasta night" },
    Tuesday: { Breakfast: "Eggs & toast", Lunch: "Leftovers", Dinner: "Taco bowls" },
    Wednesday: { Breakfast: "Yogurt & granola", Lunch: "Grilled cheese", Dinner: "Roast chicken" },
    Thursday: { Breakfast: "Pancakes", Lunch: "Chicken salad", Dinner: "Vegetable curry" },
    Friday: { Breakfast: "Cereal & fruit", Lunch: "School lunch", Dinner: "Homemade pizza" },
    Saturday: { Breakfast: "Weekend brunch", Lunch: "Soup & bread", Dinner: "Family favorite" },
    Sunday: { Breakfast: "Eggs & avocado", Lunch: "Sunday roast", Dinner: "Light supper" }
  };
  const defaultContacts = {
    wifiName: "Home Wi-Fi",
    wifiPassword: "Ask a parent",
    emergency: "Emergency services: 112",
    doctor: "Family doctor: add contact number",
    maintenance: "Building maintenance: add contact number"
  };
  const shoppingCategories = ["Groceries", "Household Essentials", "Snacks"];
  const prayerNames = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const defaultChores = [
    { id: "chore-kitchen", title: "Tidy the kitchen", assignedTo: "Jeyad", completed: false },
    { id: "chore-laundry", title: "Fold and put away laundry", assignedTo: "Hany", completed: false },
    { id: "chore-living-room", title: "Straighten the living room", assignedTo: "Mila", completed: false },
    { id: "chore-bins", title: "Take out the bins", assignedTo: "Maya", completed: false },
    { id: "chore-table", title: "Set the dinner table", assignedTo: "Hany", completed: false },
    { id: "chore-plants", title: "Water the plants", assignedTo: "Mila", completed: false },
    { id: "chore-entry", title: "Tidy the entryway", assignedTo: "Maya", completed: false },
    { id: "chore-supplies", title: "Check household supplies", assignedTo: "Jeyad", completed: false }
  ];
  const categories = ["Academic/Tuition", "Chores", "Personal", "Family Events"];
  const elements = {
    loginOverlay: document.querySelector("#loginOverlay"),
    loginForm: document.querySelector("#loginForm"),
    loginError: document.querySelector("#loginError"),
    appShell: document.querySelector("#appShell"),
    greeting: document.querySelector("#userGreeting"),
    signOut: document.querySelector("#signOutButton"),
    currentDate: document.querySelector("#currentDate"),
    clock: document.querySelector("#clock"),
    scheduleList: document.querySelector("#scheduleList"),
    scheduleCount: document.querySelector("#scheduleCount"),
    scheduleForm: document.querySelector("#scheduleForm"),
    quickLinks: document.querySelector("#quickLinks"),
    linkForm: document.querySelector("#linkForm"),
    linkFormTitle: document.querySelector("#linkFormTitle"),
    linkSubmitButton: document.querySelector("#linkSubmitButton"),
    cancelLinkEdit: document.querySelector("#cancelLinkEdit"),
    notesGrid: document.querySelector("#notesGrid"),
    noteForm: document.querySelector("#noteForm"),
    clearNotes: document.querySelector("#clearNotesButton"),
    layoutSetting: document.querySelector("#layoutSetting"),
    dashboardGrid: document.querySelector(".dashboard-grid"),
    mealBoard: document.querySelector("#mealBoard"),
    mealsForm: document.querySelector("#mealsForm"),
    mealEditGrid: document.querySelector("#mealEditGrid"),
    contactsList: document.querySelector("#contactsList"),
    contactsForm: document.querySelector("#contactsForm"),
    themeToggle: document.querySelector("#themeToggle"),
    prayerDate: document.querySelector("#prayerDate"),
    weatherSummary: document.querySelector("#weatherSummary"),
    prayerCountdown: document.querySelector("#prayerCountdown"),
    prayerStatus: document.querySelector("#prayerStatus"),
    prayerTable: document.querySelector("#prayerTable"),
    shoppingList: document.querySelector("#shoppingList"),
    shoppingForm: document.querySelector("#shoppingForm"),
    clearShopping: document.querySelector("#clearShoppingButton"),
    countdownList: document.querySelector("#countdownList"),
    countdownCount: document.querySelector("#countdownCount"),
    countdownForm: document.querySelector("#countdownForm"),
    choreList: document.querySelector("#choreList"),
    choreProgress: document.querySelector("#choreProgress"),
    choreProgressFill: document.querySelector("#choreProgressFill"),
    choreProgressText: document.querySelector("#choreProgressText")
  };
  let activeUser = null;
  let currentFilter = "All";
  let editingLinkId = null;
  let prayerSchedule = null;

  function readStored(key, fallback) {
    const stored = localStorage.getItem(key);
    if (stored === null) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    try {
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) throw new Error(`Stored ${key} data is not a list.`);
      return parsed;
    } catch (error) {
      console.error(`Unable to read ${key} from localStorage.`, error);
      throw error;
    }
  }

  function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getAccounts() {
    return readStored(STORAGE_KEYS.accounts, defaultAccounts);
  }

  function getSchedule() {
    return readStored(STORAGE_KEYS.schedule, defaultSchedule);
  }

  function getLinks() {
    return readStored(STORAGE_KEYS.links, defaultLinks);
  }

  function getNotes() {
    return readStored(STORAGE_KEYS.notes, []);
  }

  function getLayout() {
    const layout = localStorage.getItem(STORAGE_KEYS.layout);
    if (layout === null) {
      localStorage.setItem(STORAGE_KEYS.layout, "comfortable");
      return "comfortable";
    }
    return layout === "compact" ? "compact" : "comfortable";
  }

  function getMeals() {
    const stored = localStorage.getItem(STORAGE_KEYS.meals);
    if (stored === null) {
      save(STORAGE_KEYS.meals, defaultMeals);
      return structuredClone(defaultMeals);
    }
    try {
      const meals = JSON.parse(stored);
      if (!meals || typeof meals !== "object" || Array.isArray(meals)) {
        throw new Error("Stored meal plan is invalid.");
      }
      return meals;
    } catch (error) {
      console.error("Unable to read the saved meal plan.", error);
      throw error;
    }
  }

  function getContacts() {
    const stored = localStorage.getItem(STORAGE_KEYS.contacts);
    if (stored === null) {
      save(STORAGE_KEYS.contacts, defaultContacts);
      return { ...defaultContacts };
    }
    try {
      const contacts = JSON.parse(stored);
      if (!contacts || typeof contacts !== "object" || Array.isArray(contacts)) {
        throw new Error("Stored emergency contact details are invalid.");
      }
      return { ...defaultContacts, ...contacts };
    } catch (error) {
      console.error("Unable to read saved emergency contact details.", error);
      throw error;
    }
  }

  function getShopping() {
    return readStored(STORAGE_KEYS.shopping, []);
  }

  function getCountdowns() {
    const stored = localStorage.getItem(STORAGE_KEYS.countdowns);
    if (stored === null) {
      const firstDeadline = new Date();
      firstDeadline.setDate(firstDeadline.getDate() + 7);
      firstDeadline.setHours(9, 0, 0, 0);
      const secondDeadline = new Date();
      secondDeadline.setDate(secondDeadline.getDate() + 21);
      secondDeadline.setHours(12, 0, 0, 0);
      const thirdDeadline = new Date();
      thirdDeadline.setDate(thirdDeadline.getDate() + 35);
      thirdDeadline.setHours(9, 0, 0, 0);
      const defaults = [
        { id: "countdown-exam", title: "Study exam", date: firstDeadline.toISOString() },
        { id: "countdown-trip", title: "Family trip", date: secondDeadline.toISOString() },
        { id: "countdown-deadline", title: "Important deadline", date: thirdDeadline.toISOString() }
      ];
      save(STORAGE_KEYS.countdowns, defaults);
      return defaults;
    }
    try {
      const countdowns = JSON.parse(stored);
      if (!Array.isArray(countdowns)) throw new Error("Stored countdown data is not a list.");
      return countdowns;
    } catch (error) {
      console.error("Unable to read saved countdowns.", error);
      throw error;
    }
  }

  function getKuwaitDateParts(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kuwait",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(date);
    return Object.fromEntries(parts.filter(part => part.type !== "literal").map(part => [part.type, Number(part.value)]));
  }

  function getWeekKey() {
    const { year, month, day } = getKuwaitDateParts();
    const date = new Date(Date.UTC(year, month - 1, day));
    const weekday = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() - weekday + 1);
    return date.toISOString().slice(0, 10);
  }

  function getChores() {
    const week = getWeekKey();
    const stored = localStorage.getItem(STORAGE_KEYS.chores);
    if (stored === null) {
      const initial = { week, tasks: structuredClone(defaultChores) };
      save(STORAGE_KEYS.chores, initial);
      return initial.tasks;
    }
    try {
      const data = JSON.parse(stored);
      if (!data || typeof data !== "object" || Array.isArray(data) || !Array.isArray(data.tasks)) {
        throw new Error("Stored weekly chore data is invalid.");
      }
      if (data.week !== week) {
        const nextWeek = { week, tasks: structuredClone(defaultChores) };
        save(STORAGE_KEYS.chores, nextWeek);
        return nextWeek.tasks;
      }
      return data.tasks;
    } catch (error) {
      console.error("Unable to read saved weekly chores.", error);
      throw error;
    }
  }

  function saveChores(tasks) {
    save(STORAGE_KEYS.chores, { week: getWeekKey(), tasks });
  }

  function getTheme() {
    const theme = localStorage.getItem(STORAGE_KEYS.theme);
    if (theme === null) {
      localStorage.setItem(STORAGE_KEYS.theme, "light");
      return "light";
    }
    return theme === "dark" ? "dark" : "light";
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.body.dataset.theme = isDark ? "dark" : "light";
    elements.themeToggle.setAttribute("aria-pressed", String(isDark));
    elements.themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
    elements.themeToggle.querySelector(".theme-icon").textContent = isDark ? "☀" : "☾";
    elements.themeToggle.querySelector(".theme-label").textContent = isDark ? "Light mode" : "Dark mode";
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function isAdmin() {
    return activeUser && activeUser.role === "admin";
  }

  function setLoginState(user) {
    activeUser = user;
    const signedIn = Boolean(user);
    elements.loginOverlay.hidden = signedIn;
    elements.appShell.setAttribute("aria-hidden", String(!signedIn));
    elements.appShell.inert = !signedIn;
    document.body.classList.toggle("is-locked", !signedIn);
    if (!signedIn) {
      elements.loginForm.reset();
      elements.loginError.hidden = true;
      document.querySelector("#username").focus();
      return;
    }
    elements.greeting.innerHTML = `👋 Welcome back, <strong>${escapeHtml(user.name)}</strong>&nbsp;<span class="user-role">${escapeHtml(user.role.toUpperCase())}</span>`;
    document.querySelectorAll(".admin-only").forEach(control => {
      control.hidden = !isAdmin();
    });
    elements.layoutSetting.value = getLayout();
    elements.dashboardGrid.classList.toggle("compact-layout", getLayout() === "compact");
    renderSchedule();
    renderLinks();
    renderNotes();
    renderMeals();
    renderContacts();
    renderShopping();
    renderCountdowns();
    renderChores();
  }

  function showLoginError(message) {
    elements.loginError.textContent = message;
    elements.loginError.hidden = false;
  }

  function makeId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function renderSchedule() {
    const events = getSchedule()
      .filter(event => currentFilter === "All" || event.category === currentFilter)
      .sort((a, b) => a.time.localeCompare(b.time));
    const total = getSchedule().length;
    elements.scheduleCount.textContent = `${total} ${total === 1 ? "item" : "items"}`;
    if (events.length === 0) {
      elements.scheduleList.innerHTML = '<p class="empty-state">Nothing planned here yet.</p>';
      return;
    }
    elements.scheduleList.innerHTML = events.map(event => {
      const safeId = escapeHtml(event.id);
      const actions = isAdmin()
        ? `<button class="event-delete" type="button" data-delete-event="${safeId}" aria-label="Delete ${escapeHtml(event.title)}">Delete</button>`
        : "";
      return `<article class="schedule-item${event.completed ? " is-complete" : ""}">
        <time class="event-time">${escapeHtml(formatTime(event.time))}</time>
        <input class="task-check" type="checkbox" data-toggle-event="${safeId}" aria-label="Mark ${escapeHtml(event.title)} complete"${event.completed ? " checked" : ""}>
        <div class="event-info">
          <p class="event-title">${escapeHtml(event.title)}</p>
          <div class="event-meta"><span class="category-tag">${escapeHtml(event.category)}</span><span>${escapeHtml(event.assignedTo)}</span></div>
        </div>
        <div class="event-actions">${actions}</div>
      </article>`;
    }).join("");
  }

  function formatTime(time) {
    const [hours, minutes] = time.split(":").map(Number);
    const suffix = hours >= 12 ? "PM" : "AM";
    return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${suffix}`;
  }

  function renderLinks() {
    const links = getLinks();
    if (!links.length) {
      elements.quickLinks.innerHTML = '<p class="empty-state">Add a shortcut for the family to use.</p>';
      return;
    }
    elements.quickLinks.innerHTML = links.map(link => {
      const hostname = new URL(link.url).hostname.replace(/^www\./, "");
      const controls = isAdmin()
        ? `<span class="link-card-actions">
            <button class="link-action" type="button" data-edit-link="${escapeHtml(link.id)}" aria-label="Edit ${escapeHtml(link.title)}">Edit</button>
            <button class="link-action" type="button" data-delete-link="${escapeHtml(link.id)}" aria-label="Delete ${escapeHtml(link.title)}">×</button>
          </span>`
        : "";
      return `<div class="quick-link">
        <span class="link-icon" aria-hidden="true">${escapeHtml(link.title.slice(0, 1).toUpperCase())}</span>
        <a class="link-name" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.title)}</a>
        <span class="link-host">${escapeHtml(hostname)}</span>
        ${controls}
      </div>`;
    }).join("");
  }

  function renderNotes() {
    const notes = getNotes();
    if (!notes.length) {
      elements.notesGrid.innerHTML = '<p class="empty-state">The fridge is clear. Pin a note to get started.</p>';
      return;
    }
    elements.notesGrid.innerHTML = notes.map(note => `<article class="sticky-note ${escapeHtml(note.color)}">
      <p class="note-message">${escapeHtml(note.text)}</p>
      <span class="note-byline">— ${escapeHtml(note.author)}</span>
      ${isAdmin() ? `<button class="note-delete" type="button" data-delete-note="${escapeHtml(note.id)}" aria-label="Remove note">×</button>` : ""}
    </article>`).join("");
  }

  function renderMeals() {
    const meals = getMeals();
    elements.mealBoard.innerHTML = weekdays.map(day => {
      const dayMeals = meals[day] || {};
      return `<article class="meal-day">
        <h3>${day}</h3>
        <dl>${mealTypes.map(type => `<div class="meal-entry">
          <dt>${type}</dt><dd>${escapeHtml(dayMeals[type] || "—")}</dd>
        </div>`).join("")}</dl>
      </article>`;
    }).join("");

    elements.mealEditGrid.innerHTML = weekdays.map(day => `<fieldset class="meal-edit-day">
      <legend>${day}</legend>
      ${mealTypes.map(type => `<label class="field">${type}
        <input name="${day}-${type.toLowerCase()}" maxlength="80" value="${escapeHtml((meals[day] && meals[day][type]) || "")}">
      </label>`).join("")}
    </fieldset>`).join("");
  }

  function renderContacts() {
    const contacts = getContacts();
    const fields = [
      ["Wi-Fi network", contacts.wifiName],
      ["Wi-Fi password", contacts.wifiPassword],
      ["Emergency", contacts.emergency],
      ["Doctor", contacts.doctor],
      ["Building maintenance", contacts.maintenance]
    ];
    elements.contactsList.innerHTML = fields.map(([label, value]) => `<div class="contact-entry">
      <span class="contact-label">${label}</span><span class="contact-value">${escapeHtml(value || "Not provided")}</span>
    </div>`).join("");
    for (const [key, value] of Object.entries(contacts)) {
      elements.contactsForm.elements[key].value = value;
    }
  }

  function formatClockTime(time) {
    const [hours, minutes] = String(time).split(":").map(Number);
    return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kuwait" })
      .format(new Date(Date.UTC(2020, 0, 1, hours - 3, minutes)));
  }

  function renderPrayerTimes() {
    const { year, month, day } = getKuwaitDateParts();
    const today = new Date(Date.UTC(year, month - 1, day));
    elements.prayerDate.textContent = new Intl.DateTimeFormat(undefined, {
      weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "Asia/Kuwait"
    }).format(today);
    if (!prayerSchedule) return;
    elements.prayerTable.innerHTML = prayerNames.map(name => `
      <div class="prayer-row${name === "Sunrise" ? " prayer-sunrise" : ""}">
        <span>${name}</span><time>${escapeHtml(formatClockTime(prayerSchedule[name]))}</time>
      </div>`).join("");
    updatePrayerCountdown();
  }

  function updatePrayerCountdown() {
    if (!prayerSchedule) return;
    const now = new Date();
    const { year, month, day, hour, minute, second } = Object.fromEntries(
      new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kuwait",
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23"
      }).formatToParts(now).filter(part => part.type !== "literal").map(part => [part.type, Number(part.value)])
    );
    const currentLocal = Date.UTC(year, month - 1, day, hour, minute, second);
    const upcoming = prayerNames.filter(name => name !== "Sunrise").map(name => {
      const [timeHour, timeMinute] = prayerSchedule[name].split(":").map(Number);
      let target = Date.UTC(year, month - 1, day, timeHour, timeMinute);
      if (target <= currentLocal) target += 24 * 60 * 60 * 1000;
      return { name, target };
    }).sort((a, b) => a.target - b.target)[0];
    if (!upcoming) return;
    const secondsRemaining = Math.max(0, Math.floor((upcoming.target - currentLocal) / 1000));
    const hours = Math.floor(secondsRemaining / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);
    const seconds = secondsRemaining % 60;
    elements.prayerCountdown.textContent = `Next prayer: ${upcoming.name} in ${hours}h ${minutes}m ${seconds}s`;
  }

  async function loadPrayerAndWeather() {
    const latitude = 29.3759;
    const longitude = 47.9774;
    renderPrayerTimes();
    try {
      const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=9`);
      if (!response.ok) throw new Error(`Prayer time request failed (${response.status}).`);
      const result = await response.json();
      if (result.code !== 200 || !result.data || !result.data.timings) {
        throw new Error("Prayer time service returned an invalid response.");
      }
      prayerSchedule = Object.fromEntries(prayerNames.map(name => [
        name,
        String(result.data.timings[name] || "").split(" ")[0]
      ]));
      if (prayerNames.some(name => !/^\d{2}:\d{2}$/.test(prayerSchedule[name]))) {
        throw new Error("Prayer time service returned incomplete timings.");
      }
      elements.prayerStatus.textContent = "Prayer times for Kuwait City · Aladhan";
      renderPrayerTimes();
    } catch (error) {
      console.error("Unable to load Kuwait prayer times.", error);
      elements.prayerStatus.textContent = "Prayer times unavailable. Check your connection and reload.";
      elements.prayerCountdown.textContent = "Today's next prayer countdown is unavailable.";
    }

    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code&timezone=Asia%2FKuwait`);
      if (!response.ok) throw new Error(`Weather request failed (${response.status}).`);
      const result = await response.json();
      if (!result.current || typeof result.current.temperature_2m !== "number") {
        throw new Error("Weather service returned an invalid response.");
      }
      const weatherDescriptions = {
        0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
        45: "Foggy", 48: "Rime fog", 51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
        61: "Light rain", 63: "Rain", 65: "Heavy rain", 71: "Light snow", 73: "Snow",
        75: "Heavy snow", 80: "Rain showers", 81: "Rain showers", 82: "Heavy showers",
        95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with hail"
      };
      const description = weatherDescriptions[result.current.weather_code] || "Current conditions";
      elements.weatherSummary.textContent = `${Math.round(result.current.temperature_2m)}°C · ${description} · feels like ${Math.round(result.current.apparent_temperature)}°C`;
    } catch (error) {
      console.error("Unable to load Kuwait weather.", error);
      elements.weatherSummary.textContent = "Weather is unavailable. Check your connection.";
    }
  }

  function renderShopping() {
    const items = getShopping();
    if (!items.length) {
      elements.shoppingList.innerHTML = '<p class="empty-state">Your shopping list is empty. Add the first item below.</p>';
      return;
    }
    elements.shoppingList.innerHTML = shoppingCategories.map(category => {
      const categoryItems = items.filter(item => item.category === category);
      if (!categoryItems.length) return "";
      return `<section class="shopping-category">
        <h3>${escapeHtml(category)}</h3>
        ${categoryItems.map(item => `<label class="shopping-item${item.completed ? " is-complete" : ""}">
          <input type="checkbox" data-toggle-shopping="${escapeHtml(item.id)}"${item.completed ? " checked" : ""}>
          <span class="shopping-item-name">${escapeHtml(item.item)}</span>
          <span class="shopping-quantity">${escapeHtml(item.quantity)}</span>
        </label>`).join("")}
      </section>`;
    }).join("");
  }

  function renderCountdowns() {
    const countdowns = getCountdowns().sort((a, b) => new Date(a.date) - new Date(b.date));
    elements.countdownCount.textContent = `${countdowns.length} ${countdowns.length === 1 ? "event" : "events"}`;
    if (!countdowns.length) {
      elements.countdownList.innerHTML = '<p class="empty-state">No upcoming countdowns yet.</p>';
      return;
    }
    elements.countdownList.innerHTML = countdowns.map(item => {
      const timestamp = new Date(item.date).getTime();
      const actions = isAdmin()
        ? `<button class="link-action countdown-delete" type="button" data-delete-countdown="${escapeHtml(item.id)}" aria-label="Delete ${escapeHtml(item.title)}">Delete</button>`
        : "";
      return `<article class="countdown-item">
        <div class="countdown-details">
          <h3>${escapeHtml(item.title)}</h3>
          <time datetime="${escapeHtml(item.date)}">${escapeHtml(new Intl.DateTimeFormat(undefined, {
            weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
          }).format(new Date(item.date)))}</time>
          <p data-countdown-timer="${Number.isFinite(timestamp) ? timestamp : ""}"></p>
        </div>
        ${actions}
      </article>`;
    }).join("");
    updateCountdownTimers();
  }

  function updateCountdownTimers() {
    elements.countdownList.querySelectorAll("[data-countdown-timer]").forEach(timer => {
      const deadline = Number(timer.dataset.countdownTimer);
      if (!Number.isFinite(deadline)) {
        timer.textContent = "Invalid date";
        return;
      }
      const remaining = deadline - Date.now();
      if (remaining <= 0) {
        timer.textContent = "This event has started";
        return;
      }
      const totalHours = Math.floor(remaining / 3600000);
      const days = Math.floor(totalHours / 24);
      const hours = totalHours % 24;
      timer.textContent = `${days}d ${hours}h remaining`;
    });
  }

  function renderChores() {
    const chores = getChores();
    const completed = chores.filter(chore => chore.completed).length;
    const percentage = chores.length ? Math.round(completed / chores.length * 100) : 0;
    elements.choreProgressFill.style.width = `${percentage}%`;
    elements.choreProgress.setAttribute("aria-valuenow", String(percentage));
    elements.choreProgressText.textContent = `${completed} of ${chores.length} · ${percentage}%`;
    if (!chores.length) {
      elements.choreList.innerHTML = '<p class="empty-state">No chores assigned for this week.</p>';
      return;
    }
    elements.choreList.innerHTML = chores.map(chore => {
      const canComplete = isAdmin() || (activeUser && activeUser.name === chore.assignedTo);
      return `<label class="chore-item${chore.completed ? " is-complete" : ""}">
        <input type="checkbox" data-toggle-chore="${escapeHtml(chore.id)}"${chore.completed ? " checked" : ""}${canComplete ? "" : " disabled"}>
        <span class="chore-title">${escapeHtml(chore.title)}</span>
        <span class="chore-assignee">${escapeHtml(chore.assignedTo)}</span>
      </label>`;
    }).join("");
  }

  function updateClock() {
    const now = new Date();
    elements.currentDate.textContent = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" }).format(now);
    elements.currentDate.dateTime = now.toISOString().slice(0, 10);
    elements.clock.textContent = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(now);
  }

  function resetLinkForm() {
    elements.linkForm.reset();
    editingLinkId = null;
    elements.linkFormTitle.textContent = "Add a shortcut";
    elements.linkSubmitButton.textContent = "Add link";
    elements.cancelLinkEdit.hidden = true;
  }

  elements.loginForm.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData(elements.loginForm);
    const username = String(formData.get("username")).trim().toLowerCase();
    const password = String(formData.get("password"));
    const user = getAccounts().find(account => account.username.toLowerCase() === username && account.password === password);
    if (!user) {
      showLoginError("That username and password don’t match. Please try again.");
      return;
    }
    const session = { username: user.username };
    save(STORAGE_KEYS.session, session);
    elements.loginError.hidden = true;
    setLoginState(user);
  });

  elements.signOut.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEYS.session);
    setLoginState(null);
    document.querySelector("#username").focus();
  });

  document.querySelectorAll(".filter-chip").forEach(button => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter;
      document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("active", chip === button));
      renderSchedule();
    });
  });

  elements.scheduleForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!isAdmin()) return;
    const formData = new FormData(elements.scheduleForm);
    const eventData = {
      id: makeId("event"),
      title: String(formData.get("title")).trim(),
      time: String(formData.get("time")),
      category: String(formData.get("category")),
      assignedTo: String(formData.get("assignedTo")),
      completed: false
    };
    if (!eventData.title || !categories.includes(eventData.category)) return;
    const events = getSchedule();
    events.push(eventData);
    save(STORAGE_KEYS.schedule, events);
    elements.scheduleForm.reset();
    renderSchedule();
  });

  elements.scheduleList.addEventListener("change", event => {
    const id = event.target.dataset.toggleEvent;
    if (!id || !activeUser) return;
    const events = getSchedule();
    const item = events.find(entry => entry.id === id);
    if (!item) return;
    item.completed = event.target.checked;
    save(STORAGE_KEYS.schedule, events);
    renderSchedule();
  });

  elements.scheduleList.addEventListener("click", event => {
    const id = event.target.dataset.deleteEvent;
    if (!id || !isAdmin()) return;
    save(STORAGE_KEYS.schedule, getSchedule().filter(item => item.id !== id));
    renderSchedule();
  });

  elements.linkForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!isAdmin()) return;
    const formData = new FormData(elements.linkForm);
    const title = String(formData.get("title")).trim();
    const rawUrl = String(formData.get("url")).trim();
    let parsedUrl;
    try {
      parsedUrl = new URL(rawUrl);
    } catch (error) {
      elements.linkForm.elements.url.setCustomValidity("Enter a valid website address.");
      elements.linkForm.elements.url.reportValidity();
      elements.linkForm.elements.url.setCustomValidity("");
      return;
    }
    if (!["http:", "https:"].includes(parsedUrl.protocol) || !title) {
      elements.linkForm.elements.url.setCustomValidity("Use a valid http or https website address.");
      elements.linkForm.elements.url.reportValidity();
      elements.linkForm.elements.url.setCustomValidity("");
      return;
    }
    const links = getLinks();
    if (editingLinkId) {
      const link = links.find(entry => entry.id === editingLinkId);
      if (!link) return;
      link.title = title;
      link.url = parsedUrl.href;
    } else {
      links.push({ id: makeId("link"), title, url: parsedUrl.href });
    }
    save(STORAGE_KEYS.links, links);
    resetLinkForm();
    renderLinks();
  });

  elements.quickLinks.addEventListener("click", event => {
    const editId = event.target.dataset.editLink;
    const deleteId = event.target.dataset.deleteLink;
    if (!isAdmin()) return;
    if (editId) {
      const link = getLinks().find(entry => entry.id === editId);
      if (!link) return;
      editingLinkId = editId;
      elements.linkForm.elements.title.value = link.title;
      elements.linkForm.elements.url.value = link.url;
      elements.linkFormTitle.textContent = "Edit shortcut";
      elements.linkSubmitButton.textContent = "Save changes";
      elements.cancelLinkEdit.hidden = false;
      elements.linkForm.elements.title.focus();
    } else if (deleteId) {
      save(STORAGE_KEYS.links, getLinks().filter(link => link.id !== deleteId));
      renderLinks();
      if (editingLinkId === deleteId) resetLinkForm();
    }
  });

  elements.cancelLinkEdit.addEventListener("click", resetLinkForm);

  elements.mealsForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!isAdmin()) return;
    const formData = new FormData(elements.mealsForm);
    const meals = {};
    for (const day of weekdays) {
      meals[day] = {};
      for (const type of mealTypes) {
        meals[day][type] = String(formData.get(`${day}-${type.toLowerCase()}`) || "").trim();
      }
    }
    save(STORAGE_KEYS.meals, meals);
    renderMeals();
  });

  elements.contactsForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!isAdmin()) return;
    const formData = new FormData(elements.contactsForm);
    const contacts = Object.fromEntries(
      ["wifiName", "wifiPassword", "emergency", "doctor", "maintenance"]
        .map(key => [key, String(formData.get(key) || "").trim()])
    );
    save(STORAGE_KEYS.contacts, contacts);
    renderContacts();
  });

  elements.noteForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!activeUser) return;
    const formData = new FormData(elements.noteForm);
    const text = String(formData.get("text")).trim();
    const color = String(formData.get("color"));
    if (!text || !["yellow", "pink", "blue", "green"].includes(color)) return;
    const notes = getNotes();
    notes.unshift({ id: makeId("note"), text, color, author: activeUser.name, createdAt: new Date().toISOString() });
    save(STORAGE_KEYS.notes, notes);
    elements.noteForm.reset();
    renderNotes();
  });

  elements.notesGrid.addEventListener("click", event => {
    const id = event.target.dataset.deleteNote;
    if (!id || !isAdmin()) return;
    save(STORAGE_KEYS.notes, getNotes().filter(note => note.id !== id));
    renderNotes();
  });

  elements.clearNotes.addEventListener("click", () => {
    if (!isAdmin()) return;
    if (!window.confirm("Remove every note from the family fridge?")) return;
    save(STORAGE_KEYS.notes, []);
    renderNotes();
  });

  elements.shoppingForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!activeUser) return;
    const formData = new FormData(elements.shoppingForm);
    const item = String(formData.get("item")).trim();
    const quantity = String(formData.get("quantity")).trim();
    const category = String(formData.get("category"));
    if (!item || !quantity || !shoppingCategories.includes(category)) return;
    const items = getShopping();
    items.push({ id: makeId("shopping"), item, quantity, category, completed: false });
    save(STORAGE_KEYS.shopping, items);
    elements.shoppingForm.reset();
    renderShopping();
  });

  elements.shoppingList.addEventListener("change", event => {
    const id = event.target.dataset.toggleShopping;
    if (!id || !activeUser) return;
    const items = getShopping();
    const item = items.find(entry => entry.id === id);
    if (!item) return;
    item.completed = event.target.checked;
    save(STORAGE_KEYS.shopping, items);
    renderShopping();
  });

  elements.clearShopping.addEventListener("click", () => {
    if (!isAdmin()) return;
    const remaining = getShopping().filter(item => !item.completed);
    save(STORAGE_KEYS.shopping, remaining);
    renderShopping();
  });

  elements.countdownForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!isAdmin()) return;
    const formData = new FormData(elements.countdownForm);
    const title = String(formData.get("title")).trim();
    const rawDate = String(formData.get("date"));
    const date = new Date(rawDate);
    if (!title || !Number.isFinite(date.getTime()) || date.getTime() <= Date.now()) {
      elements.countdownForm.elements.date.setCustomValidity("Choose a future date and time.");
      elements.countdownForm.elements.date.reportValidity();
      elements.countdownForm.elements.date.setCustomValidity("");
      return;
    }
    const countdowns = getCountdowns();
    countdowns.push({ id: makeId("countdown"), title, date: date.toISOString() });
    save(STORAGE_KEYS.countdowns, countdowns);
    elements.countdownForm.reset();
    renderCountdowns();
  });

  elements.countdownList.addEventListener("click", event => {
    const id = event.target.dataset.deleteCountdown;
    if (!id || !isAdmin()) return;
    save(STORAGE_KEYS.countdowns, getCountdowns().filter(item => item.id !== id));
    renderCountdowns();
  });

  elements.choreList.addEventListener("change", event => {
    const id = event.target.dataset.toggleChore;
    if (!id || !activeUser) return;
    const chores = getChores();
    const chore = chores.find(item => item.id === id);
    if (!chore || (!isAdmin() && activeUser.name !== chore.assignedTo)) {
      renderChores();
      return;
    }
    chore.completed = event.target.checked;
    saveChores(chores);
    renderChores();
  });

  elements.layoutSetting.addEventListener("change", () => {
    if (!isAdmin()) {
      elements.layoutSetting.value = getLayout();
      return;
    }
    const layout = elements.layoutSetting.value;
    if (!["comfortable", "compact"].includes(layout)) return;
    localStorage.setItem(STORAGE_KEYS.layout, layout);
    elements.dashboardGrid.classList.toggle("compact-layout", layout === "compact");
  });

  elements.themeToggle.addEventListener("click", () => {
    const theme = getTheme() === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    applyTheme(theme);
  });

  save(STORAGE_KEYS.accounts, defaultAccounts);
  getSchedule();
  getLinks();
  getNotes();
  getLayout();
  getMeals();
  getContacts();
  getShopping();
  getCountdowns();
  getChores();
  applyTheme(getTheme());
  updateClock();
  window.setInterval(updateClock, 1000);
  renderPrayerTimes();
  loadPrayerAndWeather();
  window.setInterval(() => {
    updatePrayerCountdown();
    updateCountdownTimers();
  }, 1000);
  window.setInterval(loadPrayerAndWeather, 30 * 60 * 1000);

  const savedSession = localStorage.getItem(STORAGE_KEYS.session);
  if (savedSession) {
    try {
      const session = JSON.parse(savedSession);
      const user = getAccounts().find(account => account.username === session.username);
      if (user) setLoginState(user);
      else localStorage.removeItem(STORAGE_KEYS.session);
    } catch (error) {
      console.error("Unable to restore the saved session.", error);
      localStorage.removeItem(STORAGE_KEYS.session);
    }
  } else {
    setLoginState(null);
  }
})();
