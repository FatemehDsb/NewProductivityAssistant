let usernameInput = document.querySelector("#userName");
let passwordInput = document.querySelector("#password");
let registerBtn = document.querySelector("#registerBtn");
let loginBtn = document.querySelector("#loginBtn");

let users= JSON.parse(localStorage.getItem("users")) || [];

registerBtn.addEventListener("click", ()=>{
    let username= usernameInput.value;
    let password = passwordInput.value;

    let newUser={
        username,
        password
    }
   
    users.push(newUser); 

    localStorage.setItem("users", JSON.stringify(users));
});


