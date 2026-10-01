using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentManagement.Data;
using StudentManagement.Models;

namespace StudentManagement.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly AppDbContext _db;

    public StudentsController(AppDbContext db) => _db = db;

    // GET api/students?search=ali&department=CS&sortBy=name&page=1&pageSize=10
    [HttpGet]
    public async Task<ActionResult<PagedResult<Student>>> GetAll(
        string? search, string? department,
        string sortBy = "name", int page = 1, int pageSize = 10)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 50);

        var query = _db.Students.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim();
            query = query.Where(x => x.FullName.Contains(s)
                || x.RollNumber.Contains(s)
                || x.Email.Contains(s));
        }

        if (!string.IsNullOrWhiteSpace(department))
            query = query.Where(x => x.Department == department);

        query = sortBy switch
        {
            "roll" => query.OrderBy(x => x.RollNumber),
            "newest" => query.OrderByDescending(x => x.EnrollmentDate),
            _ => query.OrderBy(x => x.FullName)
        };

        var total = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PagedResult<Student>
        {
            Items = items,
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        };
    }

    // GET api/students/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Student>> GetById(int id)
    {
        var student = await _db.Students.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return student is null ? NotFound(new { message = "Student not found." }) : student;
    }

    // GET api/students/departments
    [HttpGet("departments")]
    public async Task<ActionResult<List<string>>> GetDepartments() =>
        await _db.Students.Select(x => x.Department).Distinct().OrderBy(x => x).ToListAsync();

    // GET api/students/stats
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var monthStart = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1);

        var total = await _db.Students.CountAsync();
        var newThisMonth = await _db.Students.CountAsync(x => x.EnrollmentDate >= monthStart);
        var byDepartment = await _db.Students
            .GroupBy(x => x.Department)
            .Select(g => new { department = g.Key, count = g.Count() })
            .OrderByDescending(x => x.count)
            .ToListAsync();

        return Ok(new
        {
            total,
            newThisMonth,
            departmentCount = byDepartment.Count,
            byDepartment
        });
    }

    // POST api/students
    [HttpPost]
    public async Task<ActionResult<Student>> Create(Student student)
    {
        student.Id = 0;

        var duplicate = await FindDuplicate(student);
        if (duplicate is not null) return Conflict(new { message = duplicate });

        _db.Students.Add(student);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = student.Id }, student);
    }

    // PUT api/students/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, Student input)
    {
        if (id != input.Id)
            return BadRequest(new { message = "Id in the URL and body must match." });

        var student = await _db.Students.FindAsync(id);
        if (student is null) return NotFound(new { message = "Student not found." });

        var duplicate = await FindDuplicate(input);
        if (duplicate is not null) return Conflict(new { message = duplicate });

        student.FullName = input.FullName;
        student.RollNumber = input.RollNumber;
        student.Email = input.Email;
        student.Phone = input.Phone;
        student.Department = input.Department;
        student.DateOfBirth = input.DateOfBirth;
        student.EnrollmentDate = input.EnrollmentDate;
        student.Address = input.Address;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE api/students/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var student = await _db.Students.FindAsync(id);
        if (student is null) return NotFound(new { message = "Student not found." });

        _db.Students.Remove(student);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // Returns an error message if roll number or email is already used by another student
    private async Task<string?> FindDuplicate(Student s)
    {
        if (await _db.Students.AnyAsync(x => x.Id != s.Id && x.RollNumber == s.RollNumber))
            return "This roll number already exists.";

        if (await _db.Students.AnyAsync(x => x.Id != s.Id && x.Email == s.Email))
            return "This email already exists.";

        return null;
    }
}