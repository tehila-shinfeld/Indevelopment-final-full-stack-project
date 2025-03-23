using Microsoft.AspNetCore.Mvc;
using summary.Core.DTOs;
using System.Threading.Tasks;
using summary.Core.IServices;
using summary.Core;

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
        var response = await _fileService.GeneratePresignedUrlAsync(request.FileName);
        return Ok(response);
    }


    [HttpGet("{fileId}")]
    public async Task<IActionResult> GetFileById(int fileId)
    {
        var fileDetails = await _fileService.GetFileByIdAsync(fileId);
        return fileDetails != null ? Ok(fileDetails) : NotFound();
    }


    [HttpDelete("{fileId}")]
    public async Task<IActionResult> DeleteFile(int fileId)
    {
        var success = await _fileService.DeleteFileAsync(fileId);
        return success ? Ok(new { success = true }) : NotFound();
    }

    [HttpPost("summarize")]
    public async Task<IActionResult> SummarizeFile([FromBody] string url)
    {
        try
        {
            var summary = await _fileService.GetSummaryFromAIAsync(url);
            return Ok(new { summary });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost("save-summary")]
    public async Task<IActionResult> SaveSummary([FromBody] FileSummaryDto summary)
    {
        Console.WriteLine("loglog");

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

}




