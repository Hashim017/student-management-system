using System.ComponentModel.DataAnnotations;

namespace StudentManagement.Models;

public class Student
{
    public int Id { get; set; }

    [Required, StringLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required, StringLength(30)]
    public string RollNumber { get; set; } = string.Empty;

    [Required, EmailAddress, StringLength(150)]
    public string Email { get; set; } = string.Empty;

    [StringLength(20)]
    public string? Phone { get; set; }

    [Required, StringLength(100)]
    public string Department { get; set; } = string.Empty;

    public DateTime DateOfBirth { get; set; }

    public DateTime EnrollmentDate { get; set; } = DateTime.Today;

    [StringLength(250)]
    public string? Address { get; set; }
}