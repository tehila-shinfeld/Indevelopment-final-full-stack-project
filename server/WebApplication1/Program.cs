using Amazon.S3;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using summary.Core;
using summary.Core.IRepositories;
using summary.Core.IServices;
using summary.Data;
using summary.Data.Repositories;
using summary.Service;
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
builder.Services.AddDbContext<DataContext>();
builder.Services.AddScoped<IMeetingService, MeetingService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IRepositoryManager, RepositoryManager>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IMeetingRepository, MeetingRepository>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();

// הגדרת AWS S3
builder.Services.AddAWSService<IAmazonS3>();
// רישום ה-Services & Repositories
builder.Services.AddScoped<IFileService, FileService>();

builder.Services.AddAutoMapper(typeof(Mapping));
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = builder.Configuration["JWT:Issuer"],
            ValidAudience = builder.Configuration["JWT:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]))
        };
    });

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 104857600; // מגביל את גודל הקובץ ל-100MB
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost",
        policy => policy.WithOrigins("http://localhost:5173", "https://localhost:5173", "http://localhost:5238") // כתובת הלקוח שלך
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});
var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: true)
    .Build();

var awsAccessKey = configuration["AWS:AccessKey"];
var awsSecretKey = configuration["AWS:SecretKey"];
var bucketName = configuration["AWS:BucketName"];
var region = configuration["AWS:Region"];
var app = builder.Build();
app.UseCors("AllowLocalhost");

// Configure the HTTP request pipeline.
if (true)
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

app.Run();

#region first versiom
//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.AspNetCore.Http.Features;
//using Microsoft.IdentityModel.Tokens;
//using summary.Core;
//using summary.Core.IRepositories;
//using summary.Core.IServices;
//using summary.Data;
//using summary.Data.Repositories;
//using summary.Service;
//using System.Text;

//var builder = WebApplication.CreateBuilder(args);

//builder.Services.AddControllers();

//// DI
//builder.Services.AddDbContext<DataContext>();
//builder.Services.AddScoped<IMeetingService, MeetingService>();
//builder.Services.AddScoped<IUserService, UserService>();
//builder.Services.AddScoped<IAuthService, AuthService>();
//builder.Services.AddScoped<IRepositoryManager, RepositoryManager>();
//builder.Services.AddScoped<IUserRepository, UserRepository>();
//builder.Services.AddScoped<IMeetingRepository, MeetingRepository>();
//builder.Services.AddScoped<IAuthRepository, AuthRepository>();

//builder.Services.AddAutoMapper(typeof(Mapping));

//builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//    .AddJwtBearer(options =>
//    {
//        options.TokenValidationParameters = new TokenValidationParameters
//        {
//            ValidateIssuer = true,
//            ValidateAudience = true,
//            ValidateLifetime = true,
//            ValidIssuer = builder.Configuration["JWT:Issuer"],
//            ValidAudience = builder.Configuration["JWT:Audience"],
//            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]))
//        };
//    });

//builder.Services.Configure<FormOptions>(options =>
//{
//    options.MultipartBodyLengthLimit = 104857600; // מגביל את גודל הקובץ ל-100MB
//});

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowLocalhost",
//        policy => policy.WithOrigins("http://localhost:5173") // כתובת הלקוח שלך
//                        .AllowAnyMethod()
//                        .AllowAnyHeader());
//});

//var app = builder.Build();
//app.UseCors("AllowLocalhost");

//app.UseHttpsRedirection();
//app.UseAuthentication();
//app.UseAuthorization();

//app.MapControllers();
//app.Run();


#endregion