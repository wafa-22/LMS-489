University Library Pro — Frontend Prototype

This prototype implements a frontend-only library management system using localStorage for data persistence. It covers core functional requirements for a small library: user management (registration, login), book management, borrowing/return, reservations, notifications, basic reports, and more — all in-browser.

How to run

1. Start a simple web server from the project folder (Windows PowerShell):

```powershell
cd "C:\Users\ADMIN\Desktop\8888\university_library_pro"
python -m http.server 8000
```

2. Open http://localhost:8000 in your browser.

Demo credentials

- User:
  - Email: user@example.com
  - Password: user123
  - Role: User
- Admin:
  - Email: admin@example.com
  - Password: admin123
  - Role: Administrator
- Staff:
  - Email: staff@example.com
  - Password: staff123
  - Role: Librarian/Staff

Key features implemented (frontend, localStorage):

- Register new users (via the signup modal) — stores users in localStorage
- Login & session management (localStorage) — protects admin/user pages
- Edit user profile & update password
- Add, edit, delete books (admin)
- Book details page with Issue, Reserve, Return, Renew and Force Return (admin)
- Borrowing rules and limits per user type (member, staff) configured in settings stored in localStorage
- Borrowing & returning with due dates and fines calculation
- Reservation queue with FIFO processing and notification on availability
- Search books by title, author, isbn, category
- Admin dashboard: dynamic cards, reservations table, fines summary
- Notifications in-app (toast messages) and reminders for upcoming/overdue items
- Local reporting via `generateReport` and dynamic admin view

Prototype notes and limitations

- This is a frontend prototype using localStorage. No real backend, so data is not shared between browsers/devices.
- For production, you'll need a server-side API, a database, authentication, and a notification/email service.
- The prototype uses images in `/images` — confirm you have `book1.jpg`-`book10.jpg` in that folder.
- The prototype stores passwords in localStorage plaintext (for demo only). Do not use this mechanism for real accounts.

Next steps to convert to full-stack

- Implement a REST API + database to store users/books/borrowings/reservations
- Add secure authentication (JWT or session cookies)
- Add an email or SMS service for notifications and reminders
- Implement backups and audit logs
- Add RBAC on the server side and a proper admin UI

If you'd like, I can scaffold a Node/Express + SQLite backend and wire it to this frontend next. Let me know your preferred stack (Node/Express, Python/Flask, Firebase).