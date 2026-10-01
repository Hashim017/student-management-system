# Student Management System

A full-stack web app to add, view, update and delete student records.
Built for Auspify Internship Task 2.

## Features

- Add a new student
- View all students
- Update student details
- Delete a student
- Form validation
- REST API for all student actions
- Responsive layout

## Tech Stack

- ASP.NET Core
- C#
- SQL Server
- Entity Framework Core
- HTML, CSS, JavaScript

## API Endpoints

| Method | Endpoint | What it does |
|--------|----------|--------------|
| GET | /api/students | Get all students |
| GET | /api/students/{id} | Get one student |
| POST | /api/students | Add a student |
| PUT | /api/students/{id} | Update a student |
| DELETE | /api/students/{id} | Delete a student |

## How to Run

1. Clone the repo:
   `git clone https://github.com/Hashim017/student-management-system.git`
2. Open the `.sln` file in Visual Studio.
3. In `appsettings.json`, set your SQL Server connection string.
4. Open Package Manager Console and run `Update-Database`.
5. Press Ctrl+F5.

## Screenshots

Add screenshots here.

## Author

Muhammad Hashim
GitHub: [Hashim017](https://github.com/Hashim017)
