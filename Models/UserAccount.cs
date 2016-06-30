using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace AnalyticTool.Models
{
    public class UserAccount
    {
        [Key]
        public int ID { get; set; }

        [Required(ErrorMessage ="Username is required!")]
        public string Username { get; set; }

        [Required(ErrorMessage ="Email is required!")]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required(ErrorMessage ="Name is required!")]
        public string Name { get; set; }

        [Required(ErrorMessage ="Password is required!")]
        [DataType(DataType.Password)]       
        public string UserPassword { get; set; }

        [Compare("UserPassword", ErrorMessage = "Password is required!")]
        [DataType(DataType.Password)]
        public string ConfirmPassword { get; set; }
    }
}