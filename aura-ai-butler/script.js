const $ = (selector) => document.querySelector(selector);
const readStore = (key, fallback) => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
};
let tasks = readStore("aura.tasks", [
  { id: 1, text: "Prepare for the next interview", done: false },
  { id: 2, text: "Review SQL joins and filtering", done: false },
  { id: 3, text: "Update project README", done: true }
]);
let notes = readStore("aura.notes", ["Keep project explanations clear: problem → approach → result."]);
const activities = [
  { icon: "✉", title: "Review your inbox", detail: "Set aside 15 minutes to identify important messages.", category: "work", time: "Suggested action" },
  { icon: "◎", title: "Placement preparation", detail: "Review one technical topic and practise explaining a project.", category: "work", time: "Suggested action" },
  { icon: "⌂", title: "Personal reminder", detail: "Take a short break and reset your priorities.", category: "personal", time: "Suggested action" }
];
const save = () => {
  localStorage.setItem("aura.tasks", JSON.stringify(tasks));
  localStorage.setItem("aura.notes", JSON.stringify(notes));
};
let toastTimer;
function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}
function renderTasks() {
  const open = tasks.filter(t => !t.done).length;
  $("#open-count").textContent = open;
  $("#done-count").textContent = tasks.length - open;
  $("#task-label").textContent = tasks.length + (tasks.length === 1 ? " item" : " items");
  const list = $("#task-list");
  list.replaceChildren();
  if (!tasks.length) list.innerHTML = '<p class="empty">No tasks yet. Add one small next step above.</p>';
  tasks.forEach(task => {
    const row = document.createElement("div");
    row.className = "task-item" + (task.done ? " done" : "");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox"; checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", "Mark task complete");
    checkbox.addEventListener("change", () => { task.done = checkbox.checked; save(); renderTasks(); });
    const label = document.createElement("span"); label.className = "task-text"; label.textContent = task.text;
    const remove = document.createElement("button"); remove.className = "delete"; remove.textContent = "×"; remove.setAttribute("aria-label", "Delete task");
    remove.addEventListener("click", () => { tasks = tasks.filter(t => t.id !== task.id); save(); renderTasks(); });
    row.append(checkbox, label, remove); list.append(row);
  });
}
function renderNotes() {
  $("#note-count").textContent = notes.length;
  const list = $("#note-list"); list.replaceChildren();
  if (!notes.length) list.innerHTML = '<p class="empty">Your saved notes will appear here.</p>';
  notes.forEach((note, index) => {
    const row = document.createElement("div"); row.className = "note";
    const content = document.createElement("span"); content.textContent = note;
    const remove = document.createElement("button"); remove.className = "delete"; remove.textContent = "×"; remove.setAttribute("aria-label", "Delete note");
    remove.addEventListener("click", () => { notes.splice(index, 1); save(); renderNotes(); });
    row.append(content, remove); list.append(row);
  });
}
function renderActivities() {
  const filter = $("#activity-filter").value;
  const list = $("#activity-list"); list.replaceChildren();
  activities.filter(a => filter === "all" || a.category === filter).forEach(item => {
    const row = document.createElement("div"); row.className = "activity-item";
    const icon = document.createElement("span"); icon.className = "activity-icon"; icon.textContent = item.icon;
    const body = document.createElement("div");
    const title = document.createElement("strong"); title.textContent = item.title;
    const detail = document.createElement("p"); detail.textContent = item.detail;
    const time = document.createElement("small"); time.textContent = item.time + " · sample";
    body.append(title, detail, time); row.append(icon, body); list.append(row);
  });
}
function addTask(text) {
  const clean = text.trim().slice(0, 120);
  if (!clean) return false;
  tasks.unshift({ id: Date.now(), text: clean, done: false });
  save(); renderTasks(); return true;
}
$("#task-form").addEventListener("submit", event => {
  event.preventDefault();
  if (addTask($("#task-input").value)) { $("#task-input").value = ""; toast("Task added to your list."); }
});
$("#note-form").addEventListener("submit", event => {
  event.preventDefault();
  const value = $("#note-input").value.trim();
  if (value) { notes.unshift(value.slice(0, 240)); save(); renderNotes(); $("#note-input").value = ""; toast("Note saved in this browser."); }
});
$("#activity-filter").addEventListener("change", renderActivities);
$("#command-form").addEventListener("submit", event => {
  event.preventDefault();
  const input = $("#command-input"); const command = input.value.trim();
  if (!command) return;
  const lower = command.toLowerCase();
  let response;
  if (lower.startsWith("add task:")) {
    response = addTask(command.slice(command.indexOf(":") + 1)) ? "Done — I added that task to your list." : "Please type a task after the colon.";
  } else if (lower.includes("what should i do next") || lower === "help") {
    const next = tasks.find(t => !t.done);
    response = next ? "Your next open task is: " + next.text : "Your task list is clear. Add a small next step to get started.";
  } else if (lower.includes("how many tasks")) {
    response = "You have " + tasks.filter(t => !t.done).length + " open task(s).";
  } else {
    response = "I can help with demo commands: “add task: revise SQL”, “what should I do next?”, “how many tasks?”, or “help”.";
  }
  toast(response);
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(response);
    utterance.rate = 1; window.speechSynthesis.speak(utterance);
  }
  input.value = "";
});
$("#today").textContent = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(new Date());
renderTasks(); renderNotes(); renderActivities();
