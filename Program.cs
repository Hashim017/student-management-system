using Microsoft.EntityFrameworkCore;
using StudentManagement.Data;
using StudentManagement.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    if (!db.Students.Any())
    {
        db.Students.AddRange(
    new Student { FullName = "Ali Raza", RollNumber = "2022-CS-001", Email = "ali.raza@example.com", Phone = "0300-1000001", Department = "Computer Science", DateOfBirth = new DateTime(2003, 3, 14), EnrollmentDate = new DateTime(2022, 9, 1), Address = "Model Town, Lahore" },
    new Student { FullName = "Sara Khan", RollNumber = "2022-SE-002", Email = "sara.khan@example.com", Phone = "0300-1000002", Department = "Software Engineering", DateOfBirth = new DateTime(2002, 7, 21), EnrollmentDate = new DateTime(2022, 9, 1), Address = "Johar Town, Lahore" },
    new Student { FullName = "Ahmed Hassan", RollNumber = "2023-IT-003", Email = "ahmed.hassan@example.com", Phone = "0300-1000003", Department = "Information Technology", DateOfBirth = new DateTime(2004, 1, 9), EnrollmentDate = new DateTime(2023, 9, 1), Address = "Gulberg, Lahore" },
    new Student { FullName = "Fatima Noor", RollNumber = "2021-DS-004", Email = "fatima.noor@example.com", Phone = "0300-1000004", Department = "Data Science", DateOfBirth = new DateTime(2001, 11, 30), EnrollmentDate = new DateTime(2021, 9, 1), Address = "DHA, Lahore" },
    new Student { FullName = "Usman Tariq", RollNumber = "2022-CS-005", Email = "usman.tariq@example.com", Phone = "0300-1000005", Department = "Computer Science", DateOfBirth = new DateTime(2003, 5, 2), EnrollmentDate = new DateTime(2022, 9, 1), Address = "Satellite Town, Gujranwala" },
    new Student { FullName = "Ayesha Malik", RollNumber = "2020-EE-006", Email = "ayesha.malik@example.com", Phone = "0300-1000006", Department = "Electrical Engineering", DateOfBirth = new DateTime(2000, 8, 17), EnrollmentDate = new DateTime(2020, 9, 1), Address = "Faisal Town, Lahore" },
    new Student { FullName = "Hamza Sheikh", RollNumber = "2021-ME-007", Email = "hamza.sheikh@example.com", Phone = "0300-1000007", Department = "Mechanical Engineering", DateOfBirth = new DateTime(2001, 2, 25), EnrollmentDate = new DateTime(2021, 9, 1), Address = "Wapda Town, Lahore" },
    new Student { FullName = "Zainab Iqbal", RollNumber = "2023-SE-008", Email = "zainab.iqbal@example.com", Phone = "0300-1000008", Department = "Software Engineering", DateOfBirth = new DateTime(2004, 6, 12), EnrollmentDate = new DateTime(2023, 9, 1), Address = "Bahria Town, Lahore" },
    new Student { FullName = "Bilal Ahmad", RollNumber = "2022-IT-009", Email = "bilal.ahmad@example.com", Phone = "0300-1000009", Department = "Information Technology", DateOfBirth = new DateTime(2002, 12, 5), EnrollmentDate = new DateTime(2022, 9, 1), Address = "Cantt, Lahore" },
    new Student { FullName = "Hira Aslam", RollNumber = "2023-DS-010", Email = "hira.aslam@example.com", Phone = "0300-1000010", Department = "Data Science", DateOfBirth = new DateTime(2004, 4, 18), EnrollmentDate = new DateTime(2023, 9, 1), Address = "Garden Town, Lahore" },
    new Student { FullName = "Danish Javed", RollNumber = "2020-CS-011", Email = "danish.javed@example.com", Phone = "0300-1000011", Department = "Computer Science", DateOfBirth = new DateTime(2000, 9, 3), EnrollmentDate = new DateTime(2020, 9, 1), Address = "Rahwali, Gujranwala" },
    new Student { FullName = "Maryam Siddiqui", RollNumber = "2021-CE-012", Email = "maryam.siddiqui@example.com", Phone = "0300-1000012", Department = "Civil Engineering", DateOfBirth = new DateTime(2001, 10, 22), EnrollmentDate = new DateTime(2021, 9, 1), Address = "Samanabad, Lahore" },
    new Student { FullName = "Faisal Mehmood", RollNumber = "2020-EE-013", Email = "faisal.mehmood@example.com", Phone = "0300-1000013", Department = "Electrical Engineering", DateOfBirth = new DateTime(2000, 1, 28), EnrollmentDate = new DateTime(2020, 9, 1), Address = "Ichhra, Lahore" },
    new Student { FullName = "Noor Fatima", RollNumber = "2022-BA-014", Email = "noor.fatima@example.com", Phone = "0300-1000014", Department = "Business Administration", DateOfBirth = new DateTime(2003, 7, 7), EnrollmentDate = new DateTime(2022, 9, 1), Address = "Allama Iqbal Town, Lahore" },
    new Student { FullName = "Talha Butt", RollNumber = "2022-SE-015", Email = "talha.butt@example.com", Phone = "0300-1000015", Department = "Software Engineering", DateOfBirth = new DateTime(2002, 5, 19), EnrollmentDate = new DateTime(2022, 9, 1), Address = "Gakhar Mandi, Gujranwala" },
    new Student { FullName = "Iqra Yousaf", RollNumber = "2023-CS-016", Email = "iqra.yousaf@example.com", Phone = "0300-1000016", Department = "Computer Science", DateOfBirth = new DateTime(2004, 3, 1), EnrollmentDate = new DateTime(2023, 9, 1), Address = "Township, Lahore" },
    new Student { FullName = "Rizwan Ali", RollNumber = "2019-IT-017", Email = "rizwan.ali@example.com", Phone = "0300-1000017", Department = "Information Technology", DateOfBirth = new DateTime(1999, 11, 11), EnrollmentDate = new DateTime(2019, 9, 1), Address = "Mughalpura, Lahore" },
    new Student { FullName = "Sana Rauf", RollNumber = "2021-DS-018", Email = "sana.rauf@example.com", Phone = "0300-1000018", Department = "Data Science", DateOfBirth = new DateTime(2001, 6, 26), EnrollmentDate = new DateTime(2021, 9, 1), Address = "Shadman, Lahore" },
    new Student { FullName = "Kamran Akbar", RollNumber = "2020-ME-019", Email = "kamran.akbar@example.com", Phone = "0300-1000019", Department = "Mechanical Engineering", DateOfBirth = new DateTime(2000, 4, 8), EnrollmentDate = new DateTime(2020, 9, 1), Address = "Sialkot Road, Gujranwala" },
    new Student { FullName = "Laiba Zahid", RollNumber = "2023-BA-020", Email = "laiba.zahid@example.com", Phone = "0300-1000020", Department = "Business Administration", DateOfBirth = new DateTime(2004, 8, 15), EnrollmentDate = new DateTime(2023, 9, 1), Address = "Qila Didar Singh, Gujranwala" },
    new Student { FullName = "Shahid Nawaz", RollNumber = "2019-CE-021", Email = "shahid.nawaz@example.com", Phone = "0300-1000021", Department = "Civil Engineering", DateOfBirth = new DateTime(1999, 12, 20), EnrollmentDate = new DateTime(2019, 9, 1), Address = "Raiwind Road, Lahore" },
    new Student { FullName = "Mehwish Anwar", RollNumber = "2022-SE-022", Email = "mehwish.anwar@example.com", Phone = "0300-1000022", Department = "Software Engineering", DateOfBirth = new DateTime(2003, 2, 10), EnrollmentDate = new DateTime(2022, 9, 1), Address = "Defence Road, Lahore" },
    new Student { FullName = "Adnan Qureshi", RollNumber = "2021-CS-023", Email = "adnan.qureshi@example.com", Phone = "0300-1000023", Department = "Computer Science", DateOfBirth = new DateTime(2001, 9, 29), EnrollmentDate = new DateTime(2021, 9, 1), Address = "Peoples Colony, Gujranwala" },
    new Student { FullName = "Rabia Hussain", RollNumber = "2023-IT-024", Email = "rabia.hussain@example.com", Phone = "0300-1000024", Department = "Information Technology", DateOfBirth = new DateTime(2004, 10, 4), EnrollmentDate = new DateTime(2023, 9, 1), Address = "Kot Lakhpat, Lahore" }
);
        db.SaveChanges();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.Run();
