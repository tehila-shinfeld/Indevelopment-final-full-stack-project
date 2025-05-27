using Amazon.Extensions.NETCore.Setup;
using Amazon;
using Amazon.S3;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using summary.Core;
using summary.Core.IRepositories;
using summary.Core.IServices;
using summary.Data;
using summary.Data.Repositories;
using summary.Service;
using System;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

    // הוספת אפשרות לאימות עם JWT
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "אנא הכנס את ה-JWT Token בפורמט: Bearer {token}",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });

    c.OperationFilter<SwaggerFileOperationFilter>();

});//ידידינו הסווגר-----
//DI
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)),
    ServiceLifetime.Scoped
);

builder.Services.AddScoped<IMeetingService, MeetingService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IRepositoryManager, RepositoryManager>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IMeetingRepository, MeetingRepository>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddHttpClient<IFileService, FileService>();
builder.Services.AddScoped<IEmailService, EmailService>();
var configuration = builder.Configuration;


var awsAccessKey = configuration["AWS:AccessKey"];
var awsSecretKey = configuration["AWS:SecretKey"];
var bucketName = configuration["AWS:BucketName"];
var region = configuration["AWS:Region"];

// הגדרת AWS S3
builder.Services.AddDefaultAWSOptions(new AWSOptions
{
    Region = RegionEndpoint.GetBySystemName(configuration["AWS:Region"])
});
builder.Services.AddAWSService<IAmazonS3>();
builder.Services.AddAutoMapper(typeof(Mapping));

//jwt
// הוספת JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

// הוספת הרשאות מבוססות-תפקידים
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
    options.AddPolicy("User", policy => policy.RequireRole("Editor", "Admin"));
});

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 104857600; // מגביל את גודל הקובץ ל-100MB
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClientApp", policy =>
        policy.WithOrigins(
            "http://localhost:5173",
            "https://localhost:5174",
            "http://localhost:7136",
            "https://talktome-ai-client.onrender.com") // הכתובת של הקליינט שלך ברנדר
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});

var app = builder.Build();
app.UseRouting();
app.UseCors("AllowClientApp");
//Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    });
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGet("/", () => "running");
app.Run();


