using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(AnalyticTool.Startup))]
namespace AnalyticTool
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
