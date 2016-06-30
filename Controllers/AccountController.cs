using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AnalyticTool.Models;

namespace AnalyticTool.Controllers
{
    public class AccountController : Controller
    {
        // GET: Account
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Logout()
        {
            Session["UserId"] = null;
            Session["Username"] = null;
            return RedirectToAction("Login");
        }

        public ActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Register(UsersAccount account)
        {
           
            if (ModelState.IsValid)
            {
                using (AnalyticDbContex db = new AnalyticDbContex())
                {
                    db.userAccount.Add(account);
                    db.SaveChanges();
                    return RedirectToAction("Login");
                }
                ModelState.Clear();
            }

            return View();
        }

        public ActionResult Login()
        {
            if (Session["UserID"] == null)
            {
                return View();
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }

        [HttpPost]
        public ActionResult Login(UserAccount user)
        {
            UserRepository repo = new UserRepository();
            var usr = repo.ReadUser(user);
            if (usr != null)
            {
                Session["UserID"] = usr.ID.ToString();
                Session["Username"] = usr.Username.ToString();
                return RedirectToAction("Index", "Home");
            }
            else
            {
                ModelState.AddModelError("", "Username or Password is wrong!");
            }

            return View();
        }

    }
}