const form = document.getElementById("form");
const name = document.getElementById("name");
const password = document.getElementById("password");


form.addEventListener("submit", (e) => {
  e.preventDefault();
  const defaultName = document.getElementById("defaultName");
  const defaultPassword = document.getElementById("defaultPassword");
  
  defaultName.innerHTML = "Default: admin";
  defaultPassword.innerHTML = "Default: admin123";
  const newname = name.value;
  const newPassword = password.value;
  inputValidation(newname,newPassword)
});


const inputValidation = (newname, newPassword)=>{
  if (newname != "admin") {
    defaultName.innerHTML = "User name is incorrect";
    return;
  } else if (newPassword != "admin123") {
    defaultPassword.innerHTML = "Password is wrong";
    return;
  } else {
    window.location.assign("./issue.html");
    name.value = "";
    password.value = "";
  }
}
