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
    [HttpGet("test")]
    public async Task<IActionResult> test()
    {
        var response = "vjnm,nk";
        return Ok(response);
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
    //[HttpPost("upload")]
    //public async Task<IActionResult> UploadFile([FromBody] FileUploadRequestDto request)
    //{
    //    var response = await _fileService.GeneratePresignedUrlAsync(request.FileName);
    //    return Ok(response);
    //}

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
}

