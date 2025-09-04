// all global variables declarations
let allUserInfo = [];
let regForm = document.querySelector(".reg-form");
let loginForm = document.querySelector(".login-form");
let allInput = regForm.querySelectorAll("input");
let allloginInput = loginForm.querySelectorAll("input");
let regBtn = regForm.querySelector("button");
let loginBtn = loginForm.querySelector("button");


// getting data from localstorage
if (localStorage.getItem("allUserInfo") != null) {
    allUserInfo = JSON.parse(localStorage.getItem("allUserInfo"))
}

//registration coding
regForm.onsubmit = (e) => {
    e.preventDefault()
    let checkEmail = allUserInfo.find((data) => {
        return data.email == allInput[4].value
    })
    if (checkEmail == undefined) {
        let data = {};
        for (let el of allInput) {
            let key = el.name;
            data[key] = el.value
        }
        regBtn.innerText = "Proccessing..."
        setTimeout(() => {
            regBtn.innerText = "Register"
            allUserInfo.push(data);
            localStorage.setItem("allUserInfo", JSON.stringify(allUserInfo))
            swal("Good Job !", 'Registration success !', 'success');
        }, 2000)
    }
    else {
        swal("Failed !", 'Email alredy registerd !', 'warning');
    }
}


// login coding
loginForm.onsubmit = (e) => {
    e.preventDefault();
    if (allloginInput[0].value != "") {
        if (allloginInput[1].value != "") {
            // check email in your database 
            let checkEmail = allUserInfo.find((data) => {
                return data.email == allloginInput[0].value
            });
            if (checkEmail != undefined) {
                //password match
                if (checkEmail.password == allloginInput[1].value) {
                    loginBtn.innerText = "Please wait..."
                    setTimeout(() => {
                        loginBtn.innerText = "Login"
                        window.location = "Profile/profile.html";
                        checkEmail.password = null;
                        sessionStorage.setItem("__au__", JSON.stringify(checkEmail));
                    }, 2000)
                }
                else {
                    swal("Warning", "Wrong Password !", 'warning')
                }
            }
            else {
                swal("Warning", "Wrong Email !", 'warning')
            }


        }
        else {
            swal("Warning", "Password is empty !", 'warning')
        }
    }
    else {
        swal("Warning", "Email is empty !", 'warning')
    }


    
}


