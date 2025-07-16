using Microsoft.AspNetCore.Mvc;
using summary.Core.DTOs;
using System.Threading.Tasks;
using summary.Core.IServices;
using summary.Core;
using Microsoft.EntityFrameworkCore;
using summary.Service;
using Azure.Core;
[ApiController]
[Route("api/files")]
public class FilesController : ControllerBase
{
    private readonly IFileService _fileService;

    public FilesController(IFileService fileService)
    {
        _fileService = fileService;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadFile([FromBody] FileUploadRequestDto request)
    {
        if (request == null || string.IsNullOrEmpty(request.FileName))
        {
            return BadRequest("Invalid request data");
        }

        Console.WriteLine($"📂 קובץ מבוקש: {request.FileName}");
        var response = await _fileService.GeneratePresignedUrlAsync(request.FileName,request.FileType,request.Date);
        return Ok(response);
    }

    [HttpPost("save-summary")]
    public async Task<IActionResult> SaveSummary([FromBody] FileSummaryDto summary)
    {
        var saved = await _fileService.SaveFileSummaryAsync(summary);

        if (saved)
        {
            return Ok(new { success = true });
        }
        else
        {
            return BadRequest("שגיאה בשמירת הסיכום");
        }
    }

    [HttpPost("summarize")]
    public async Task<IActionResult> Post([FromBody] SummarizeRequest request)
    {
        //if (string.IsNullOrWhiteSpace(request.Text))
        //    return BadRequest("Missing text");

        //var summary = await _fileService.GetSummaryFromAIAsync(request.Text);
        //return Ok(new { summary });
        return Ok(new { V = "ד' יז כול יכול" });
    }

    [HttpPost("assign-file-to-customers")]
    public async Task<IActionResult> AssignFileToCustomers([FromBody] AssignFileRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.FileUrl) || request.UserIds == null)
        {
            return BadRequest("Invalid file URL or customer IDs.");
        }

        var success = await _fileService.AssignFileToCustomersAsync(request.FileUrl, request.UserIds);

        if (!success)
        {
            return NotFound("File or customers not found.");
        }

        return Ok("File assigned successfully.");
    }

    [HttpGet("get-user-meetings/{userId}")]
    public async Task<IActionResult> GetUserMeetings(int userId)
    {
        var meetings = await _fileService.GetUserMeetingsAsync(userId);
        if (meetings == null)
        {
            return NotFound("User not found or has no meetings.");
        }
        return Ok(meetings);
    }

}




