using summary.Api;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace summary.Service
{
    public interface IEmailService
    {
        Task SendEmailWithAttachmentAsync(EmailWithAttachmentRequest request);
    }
}
