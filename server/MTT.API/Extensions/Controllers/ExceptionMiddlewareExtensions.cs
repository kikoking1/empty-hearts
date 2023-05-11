using System.Net;
using Microsoft.AspNetCore.Diagnostics;

namespace MTT.API.Extensions.Controllers;

public static class ExceptionMiddlewareExtensions
{
    public static void ConfigureExceptionHandler(this IApplicationBuilder app)
    {
        app.UseExceptionHandler(appError =>
        {
            appError.Run(async context =>
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                WriteExceptionToLog(context.Features.Get<IExceptionHandlerFeature>()?.Error);
            });
        });
    }
    
    private static void WriteExceptionToLog(Exception? ex)
    {
        if (ex == null) return;

        using var sr = File.AppendText("webapi-exceptions-log.txt");
        sr.WriteLine( $"[{DateTime.Now}] {ex.Message} {Environment.NewLine} {ex.StackTrace} {ex.InnerException} {Environment.NewLine}");
        sr.Flush();
    }
}