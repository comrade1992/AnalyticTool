using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;

namespace AnalyticTool.Models
{
    public class AnalyticDbContex : DbContext
    {
        public AnalyticDbContex()
            : base("name=analytic_dbEntities")
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
        public DbSet<UsersAccount> userAccount { get; set; }
    }
}