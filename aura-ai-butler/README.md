# AURA — AI Personal Butler (Prototype)

A responsive browser-based prototype for a personal productivity assistant. AURA brings together a task list, notification-style activity feed, quick notes, and a command panel in one dashboard.

## Features
- Add, complete, and delete tasks
- Create quick notes
- Search and filter sample activity notifications
- Command panel with safe demo actions
- Browser speech synthesis for spoken responses when supported
- Responsive layout and local browser storage

## Run locally
No build tools required. Open `index.html` in a modern browser, or use VS Code Live Server.

## Important scope note
This version is a front-end prototype. It uses sample activity data and local browser storage; it does not connect to Gmail, LinkedIn, Instagram, WhatsApp, phone calls, or private notifications. It does not send messages or perform actions on external accounts.

## Tech stack
HTML5, CSS3, vanilla JavaScript, Web Speech API (optional)

## Future improvements
- Add a Python/FastAPI backend and authenticated database
- Integrate official APIs with explicit user authorization
- Add intent classification, summarization, and recommendation evaluation
- Add audit logs and confirmation before any external action
