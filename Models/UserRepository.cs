using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AnalyticTool.Models
{
    public class UserRepository
    {
        private AnalyticDbContex entity = new AnalyticDbContex();

        public UserAccount ReadUser(UserAccount account)
        {
            var user = entity.userAccount.Select(x => new UserAccount { Name = x.Name, Username = x.Username, ID = x.ID, Email = x.Email, UserPassword = x.UserPassword, ConfirmPassword = x.ConfirmPassword }).Where(x => x.Username == account.Username && x.UserPassword == account.UserPassword);
            return user.FirstOrDefault();
        }
    }
}