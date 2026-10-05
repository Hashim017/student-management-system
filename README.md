<div align="center">

# 🎓 Student Management System

**A full-stack app to add, view, update and delete student records.**

![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-512BD4?logo=dotnet&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?logo=csharp&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?logo=microsoftsqlserver&logoColor=white)

</div>

## 📑 Table of Contents

- [About](#-about)
- [Features](#-features)
- [API Reference](#-api-reference)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Author](#-author)

## 📖 About

A clean system to manage student records, backed by a REST API. It was built as Task 2 of the Auspify internship. The database comes with 24 sample students so you can test it right away.

## 🚀 Features

| Feature | Description |
|---|---|
| Add students | Create a new student record |
| View students | See the full list or one student |
| Update students | Edit any student detail |
| Delete students | Remove a record |
| REST API | Every action is available as an endpoint |
| Sample data | 24 seeded students |

## 🔌 API Reference

| Method | Endpoint | Action |
|---|---|---|
| GET | `/api/students` | Get all students |
| GET | `/api/students/{id}` | Get one student |
| POST | `/api/students` | Add a student |
| PUT | `/api/students/{id}` | Update a student |
| DELETE | `/api/students/{id}` | Delete a student |

## 🖼 Screenshots

### Dashboard

#### Dashboard - Light
<img src="docs/screenshots/dashboard-light.PNG" alt="Dashboard Light" width="600">

#### Dashboard - Dark
<img src="docs/screenshots/dashboard-dark.png" alt="Dashboard Dark" width="600">

#### Dashboard - Additional View
<img src="docs/screenshots/dashboard2-light.PNG" alt="Dashboard 2 Light" width="600">


### Student Management

#### Students Data
<img src="docs/screenshots/students-data.png" alt="Students Data" width="600">

#### Student Details
<img src="docs/screenshots/student-details-card.png" alt="Student Details" width="600">

#### Update Student - Light
<img src="docs/screenshots/update-student-card-light.PNG" alt="Update Student Light" width="600">

#### Update Student - Dark
<img src="docs/screenshots/update-student-card-dark.png" alt="Update Student Dark" width="600">

#### Delete Student
<img src="docs/screenshots/delete-popup.png" alt="Delete Student" width="600">


## Responsive Design

The application is fully responsive and optimized for desktop and mobile devices.

### Mobile Dashboard

<img src="docs/screenshots/dashboard-mobile.PNG" alt="Dashboard Mobile" width="300">


### Mobile Student Management

<img src="docs/screenshots/students-data-mobile.PNG" alt="Students Data Mobile" width="300">

<img src="docs/screenshots/student-details-card-mobile.PNG" alt="Student Details Mobile" width="300">

<img src="docs/screenshots/update-student-card-mobile.PNG" alt="Update Student Mobile" width="300">

## ⚙️ Getting Started

**You need:** .NET SDK 9 and SQL Server LocalDB.

```bash
git clone https://github.com/Hashim017/student-management-system.git
cd student-management-system
dotnet restore
dotnet run
```

Open the URL shown in the terminal.

## 👤 Author

**Muhammad Hashim** - [GitHub](https://github.com/Hashim017)