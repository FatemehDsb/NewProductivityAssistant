let usernameInput = document.querySelector("#userName");
let passwordInput = document.querySelector("#password");
let registerBtn = document.querySelector("#registerBtn");
let loginBtn = document.querySelector("#loginBtn");

let registeredUsers= JSON.parse(localStorage.getItem("users")) || [];

registerBtn.addEventListener("click", ()=>{
    let newUsername= usernameInput.value;
    let newPassword = passwordInput.value;

    let newUser={
        newUsername,
        newPassword
    }
   
    registeredUsers.push(newUser); 

    localStorage.setItem("users", JSON.stringify(registeredUsers));
});

//localStorage.clear();

loginBtn.addEventListener("click", () => {
    let userName = usernameInput.value;
    let password = passwordInput.value;

    let user = registeredUsers.find(
        (user) => user.newUsername === userName && user.newPassword === password 
    );

    if(user){
        console.log('success');
    } else {
        console.log('fail');
    }

})


