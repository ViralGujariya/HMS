// all global variable declaration
let userInfo;
let user;
let allBData = [];
let allInHData = [];
let allArchiveData = [];
let allCashData = [];
let allCashArchData = [];
let navBrand = document.querySelector(".navbar-brand");
let navb = document.querySelector(".nav-brand")
let LogoutBtn = document.querySelector('.logout-btn');
let bookingForm = document.querySelector(".booking-form");
let allBInput = bookingForm.querySelectorAll("input");
let bTextarea = bookingForm.querySelector("textarea");
let inHouseForm = document.querySelector(".inhouse-form");
let allInHInput = inHouseForm.querySelectorAll("input");
let InHTextarea = inHouseForm.querySelector("textarea");
let modalCBtn = document.querySelectorAll(".btn-close");
let bListTBody = document.querySelector(".booking-list");
let inHListTBody = document.querySelector(".inhouse-list");
let ArchListTBody = document.querySelector(".archive-list");
let bRegBtn = document.querySelector(".b-register-btn");
let inHRegBtn = document.querySelector(".in-house-reg-btn");
let searchEl = document.querySelector(".search-input");
let allTabBtn = document.querySelectorAll(".tab-btn");
let CashierBtn = document.querySelector(".cashier-tab");
let CashierTab = document.querySelector("#cashier");
let bookingTab = document.querySelector("#booking");
let CashierForm = document.querySelector(".cashier-form");
let allCInput = CashierForm.querySelectorAll("input");
let cashBtn = document.querySelector(".cash-btn");
let cashierTbody = document.querySelector(".cashier-list");
let cashTotal = document.querySelector(".total");
let closeCashierBtn = document.querySelector(".close-cashier-btn");
let allPrintBtn = document.querySelectorAll(".print-btn");
let alltotalBtn = document.querySelectorAll(".total-btn");
let showBRoomsEl = document.querySelector(".show-booking-rooms");
let showHRoomsEl = document.querySelector(".show-inhouse-rooms");
let allCashArcTBody = document.querySelector(".cashier-arch-list");
let archTotal = document.querySelector(".arch-total");
let archPrintBtn = document.querySelector(".arch-print-btn");
let cashierTabPan = document.querySelector(".cashier-tab-pan");
// check user login or not
if (sessionStorage.getItem("__au__") == null) {
    window.location = "../index.html";
}
userInfo = JSON.parse(sessionStorage.getItem("__au__"));
navBrand.innerHTML = userInfo.hotelname
navb.innerHTML = userInfo.Fullname
user = userInfo.email.split("@")[0];

// checking hotel rooms

const checkRooms = (element) => {

    if (Number(userInfo.totalRoom) < Number(element.value)) {
        swal("Warning", `Total ${userInfo.totalRoom} rooms is available in the hotel`, 'warning');
        element.value = userInfo.totalRoom;
    }
}

allInHInput[2].oninput = (e) => {
    checkRooms(e.target);
}
allBInput[2].oninput = (e) => {
    checkRooms(e.target);
}


//geting data from storage
const fetchData = (key) => {
    if (localStorage.getItem(key) != null) {
        const data = JSON.parse(localStorage.getItem(key));
        return data;
    }
    else {
        return [];
    }
}

allBData = fetchData(user + "_allBData");
allInHData = fetchData(user + "_allInHData");
allArchiveData = fetchData(user + "_allArchiveData");
allCashData = fetchData(user + "_allCashData");
allCashArchData = fetchData(user + "_allCashArchData");


//formate date function
const formateDate = (data, isTime) => {
    const date = new Date(data);
    let yy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();
    let time = date.toLocaleTimeString()
    dd = dd < 10 ? "0" + dd : dd
    mm = mm < 10 ? "0" + mm : mm
    return `${dd}-${mm}-${yy} ${isTime ? time : ''}`
}


//registration coding 
const registrationFunc = (textarea = null, inputs, array, key) => {
    let data = {
        notice: textarea && textarea.value,
        inHouse: false,
        createdAt: new Date()
    }
    for (let el of inputs) {
        let key = el.name;
        let value = el.value;
        data[key] = value
    }
    array.unshift(data);
    localStorage.setItem(key, JSON.stringify(array))
    swal("Good Job !", "Booking success", 'success');
}

// show  data
const ShowData = (element, array, key) => {
    let tmp = key.split("_")[1];
    element.innerHTML = '';
    array.forEach((item, index) => {
        element.innerHTML += `
        <tr>
                <td class=" no-print text-nowrap">${index + 1}</td>
                <td class="text-nowrap">${item.location}</td>
                <td class="text-nowrap">${item.roomNo}</td>
                <td class="text-nowrap">${item.fullname}</td>
                <td class="text-nowrap">${formateDate(item.CheckInDate)}</td>
                <td class="text-nowrap">${formateDate(item.CheckOutDate)}</td>
                <td class="text-nowrap">${item.totalPerson}</td>
                <td class="text-nowrap">${item.mobile}</td>
                <td class="text-nowrap">${item.price}</td>
                <td class="text-nowrap">${item.notice}</td>
                <td class="no-print text-nowrap">${formateDate(item.createdAt, true)}</td>
                <td class="no-print text-nowrap">
                    <button class="${tmp == 'allArchiveData' && 'd-none'} btn edit-btn p-0 px-2 text-white btn-primary">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button class="btn ckeckin-btn p-0 px-2 text-white btn-info">
                        <i class="fa fa-check"></i>
                    </button>
                    <button class="btn del-btn p-0 px-2 text-white btn-danger">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
        </tr>
        `
    });
    deleteDataFunc(element, array, key);
    updateDataFunc(element, array, key);
    checkInAndChechOut(element, array, key);

}

//print coding
for (let btn of allPrintBtn) {
    btn.onclick = () => {
        window.print();
    }
}
archPrintBtn.onclick = () => {
    cashierTabPan.classList.add('d-none');
    window.print();
}
modalCBtn[3].onclick = () => {
    cashierTabPan.classList.remove('d-none');
}

//  delete coding
const deleteDataFunc = (element, array, key) => {
    let allDelBtn = element.querySelectorAll(".del-btn");
    allDelBtn.forEach((btn, index) => {
        btn.onclick = () => {
            swal({
                title: "Are you sure?",
                text: "Once deleted, you will not be able to recover this imaginary file!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        array.splice(index, 1);
                        localStorage.setItem(key, JSON.stringify(array));
                        ShowData(element, array, key);
                        swal("Poof! Your imaginary file has been deleted!", {
                            icon: "success",
                        });
                    } else {
                        swal("Your imaginary file is safe!");
                    }
                });

        };
    });
}
// update coding
const updateDataFunc = (element, array, key) => {
    let allEditBtn = element.querySelectorAll(".edit-btn");
    allEditBtn.forEach((btn, index) => {
        btn.onclick = () => {
            bRegBtn.click();
            let tmp = key.split("_")[1];
            tmp == 'allBData' ? bRegBtn.click() : inHRegBtn.click()
            let allBtn = tmp == 'allBData'
                ? bookingForm.querySelectorAll("button")
                : inHouseForm.querySelectorAll("button")

            let allInput = tmp == 'allBData'
                ? bookingForm.querySelectorAll("input")
                : inHouseForm.querySelectorAll("input")

            let textarea = tmp == 'allBData'
                ? bookingForm.querySelector("textarea")
                : inHouseForm.querySelector("textarea")

            allBtn[0].classList.add("d-none");
            allBtn[1].classList.remove("d-none");
            let obj = array[index];
            allInput[0].value = obj.fullname;
            allInput[1].value = obj.location;
            allInput[2].value = obj.roomNo;
            allInput[3].value = obj.totalPerson;
            allInput[4].value = obj.CheckInDate;
            allInput[5].value = obj.CheckOutDate;
            allInput[6].value = obj.price;
            allInput[7].value = obj.mobile;
            textarea.value = obj.notice;
            allBtn[1].onclick = () => {
                let formData = {
                    notice: textarea.value,
                    createdAt: new Date(),
                }
                for (let el of allInput) {
                    let key = el.name;
                    let value = el.value;
                    formData[key] = value
                }
                array[index] = formData;
                allBtn[0].classList.remove("d-none");
                allBtn[1].classList.add("d-none");
                tmp == "allBData"
                    ? bookingForm.reset('')
                    : inHouseForm.reset('');


                tmp == "allBData"
                    ? modalCBtn[0].click()
                    : modalCBtn[1].click();

                localStorage.setItem(key, JSON.stringify(array));
                ShowData(element, array, key);
            }
        }

    });
}

//chechin and checkout coding
const checkInAndChechOut = (element, array, key) => {
    let allChechBtn = element.querySelectorAll(".ckeckin-btn");
    allChechBtn.forEach((btn, index) => {
        btn.onclick = () => {
            let tmp = key.split("_")[1];
            let data = array[index];
            array.splice(index, 1);
            localStorage.setItem(key, JSON.stringify(array));
            if (tmp == "allBData") {
                allInHData.unshift(data);
                localStorage.setItem(user + "_allInHData", JSON.stringify(allInHData));
                ShowData(element, array, key);
                showBookingRooms();
                showTotal();
                showInhouseRooms();
            }
            else if (tmp == "allArchiveData") {
                allBData.unshift(data);
                localStorage.setItem(user + "_allBData", JSON.stringify(allBData));
                ShowData(element, array, key);
                showBookingRooms();
                showTotal();
                showInhouseRooms();
            }
            else {
                allArchiveData.unshift(data);
                localStorage.setItem(user + "_allArchiveData", JSON.stringify(allArchiveData));
                ShowData(element, array, key);
                showBookingRooms();
                showTotal();
                showInhouseRooms();
            }

        }
    });

}

//show bookinh rooms
const showBookingRooms = () => {
    showBRoomsEl.innerHTML = '';
    allBData.forEach((item, index) => {
        showBRoomsEl.innerHTML += `
        <div class="card text-center px-0 col-md-2">
        <div class="bg-danger text-white fw-bold card-header ">
            ${item.roomNo}
        </div>
        <div class="bg-primary text-white fw-bold card-body">
            <p>${formateDate(item.CheckInDate)}</p>
            <p>To</p>
            <p>${formateDate(item.CheckOutDate)}</p>
        </div>
    </div>
        `;
    })

}
showBookingRooms();

//show inhouse rooms
const showInhouseRooms = () => {
    showHRoomsEl.innerHTML = '';
    allInHData.forEach((item, index) => {
        showHRoomsEl.innerHTML += `
        <div class="card text-center px-0 col-md-2">
        <div class="bg-danger text-white fw-bold card-header ">
            ${item.roomNo}
        </div>
        <div class="card-body">
         <img src="${item.inHouse ? '../Image/user-img.png' : '../Image/lock-img.png'}" class="w-100" alt="">
    </div>
    <div class="card-footer">
        <button class="in-btn action-btn btn text-white">
            In
        </button>
        <button class="out-btn action-btn btn text-white">
            Out
        </button>
    </div>
    </div>
        `;
    });
    //in coding
    let allInBtn = showHRoomsEl.querySelectorAll(".in-btn");
    allInBtn.forEach((btn, index) => {
        btn.onclick = () => {
            let data = allInHData[index];
            data.inHouse = true;
            allInHData[index] = data;
            localStorage.setItem(user += "_allInHData", JSON.stringify(allInHData))
            showInhouseRooms();
        }
    })
    //out coding
    let allOutBtn = showHRoomsEl.querySelectorAll(".out-btn");
    allOutBtn.forEach((btn, index) => {
        btn.onclick = () => {
            let data = allInHData[index];
            data.inHouse = false;
            allInHData[index] = data;
            localStorage.setItem(user += "_allInHData", JSON.stringify(allInHData))
            showInhouseRooms();
        }
    })

}
showInhouseRooms();

//show totals coding
const showTotal = () => {
    alltotalBtn[0].innerText = "Total Booking = " + allBData.length;
    alltotalBtn[1].innerText = "Total InHouse = " + allInHData.length;
    alltotalBtn[2].innerText = "Total Archive = " + allArchiveData.length;

}
showTotal();


//Logout coding
LogoutBtn.onclick = () => {
    LogoutBtn.innerHTML = "Please wait...";
    setTimeout(() => {
        LogoutBtn.innerHTML = "Logout";
        sessionStorage.removeItem("__au__");
        window.location = "../index.html";
    }, 3000)
}

// start Booking store coding
bookingForm.onsubmit = (e) => {
    e.preventDefault();
    registrationFunc(bTextarea, allBInput, allBData, user + "_allBData");
    bookingForm.reset('');
    modalCBtn[0].click();
    ShowData(bListTBody, allBData, user + "_allBData");
    showTotal();
    showBookingRooms();
}

// start cashier store coding
CashierForm.onsubmit = (e) => {
    e.preventDefault();
    registrationFunc(null, allCInput, allCashData, user + "_allCashData");
    CashierForm.reset('');
    modalCBtn[2].click();
    showTotal();
    showCashierFunc();
}
// start In House booking coding
inHouseForm.onsubmit = (e) => {
    e.preventDefault();
    registrationFunc(InHTextarea, allInHInput, allInHData, user + "_allInHData");
    inHouseForm.reset('');
    modalCBtn[1].click();
    ShowData(inHListTBody, allInHData, user + "_allInHData");
    showTotal();
    showInhouseRooms();
}


// search coding
searchEl.oninput = () => {
    searchFunc()
}
const searchFunc = () => {
    let value = searchEl.value.toLowerCase();
    let tabEl = document.querySelector(".tab-content .search-pane.active");
    let tr = tabEl.querySelectorAll("tbody tr");
    for (let el of tr) {
        let tds = el.querySelectorAll("TD");
        if (tds.length < 6) continue;
        let sr = tds[0].innerText;
        let location = tds[1].innerText;
        let roomNo = tds[2].innerText;
        let fullname = tds[3].innerText;
        let mobile = tds[7].innerText;
        let price = tds[8].innerText;
        if (sr.indexOf(value) != -1) {
            el.classList.remove('d-none');
        }
        else if (location.toLowerCase().indexOf(value) != -1) {
            el.classList.remove('d-none');
        }
        else if (roomNo.toLowerCase().indexOf(value) != -1) {
            el.classList.remove('d-none');
        }
        else if (fullname.toLowerCase().indexOf(value) != -1) {
            el.classList.remove('d-none');
        }
        else if (mobile.toLowerCase().indexOf(value) != -1) {
            el.classList.remove('d-none');
        }
        else if (price.toLowerCase().indexOf(value) != -1) {
            el.classList.remove('d-none');
        }
        else {
            el.classList.add('d-none');

        }



    }
}



// refresh ui data coding
for (let btn of allTabBtn) {
    btn.onclick = () => {
        ShowData(bListTBody, allBData, user + "_allBData");
        ShowData(inHListTBody, allInHData, user + "_allInHData");
        ShowData(ArchListTBody, allArchiveData, user + "_allArchiveData");
    }
}

ShowData(bListTBody, allBData, user + "_allBData");
ShowData(inHListTBody, allInHData, user + "_allInHData");
ShowData(ArchListTBody, allArchiveData, user + "_allArchiveData");


//Cashier coding
const showCashierFunc = () => {
    let totalAmount = 0;
    cashierTbody.innerHTML = '';
    allCashData.forEach((item, index) => {
        totalAmount += +item.amount
        cashierTbody.innerHTML += `
        <tr>
                 <td>${index + 1}</td>
                <td>${item.roomNo}</td>
                <td>${item.cashierName}</td>
                <td>${formateDate(item.createdAt, true)}</td>
                <td>${item.amount}</td>
        </tr>
        `
    });
    cashTotal.innerHTML = "<i class='fa fa-rupee'></i> " + totalAmount;
}
showCashierFunc();

// All archive Cashier coding
const showCashArchFunc = () => {
    let totalAmount = 0;
    allCashArcTBody.innerHTML = '';
    allCashArchData.forEach((item, index) => {
        totalAmount += +item.total
        allCashArcTBody.innerHTML += `
        <tr>
                 <td>${index + 1}</td>
                <td>${item.cashierName}</td>
                <td>${formateDate(item.createdAt, true)}</td>
                <td>${item.total}</td>
        </tr>
        `
    });
    archTotal.innerHTML = "<i class='fa fa-rupee'></i> " + totalAmount;
}
showCashArchFunc();



cashBtn.onclick = () => {
    allCInput[2].value = sessionStorage.getItem("c_name");
}
CashierBtn.onclick = () => {
    if (sessionStorage.getItem("c_name") == null) {
        let name = window.prompt("Enter your name !")
        if (name) {
            sessionStorage.setItem("c_name", name);
        }
        else {
            allTabBtn[0].classList.add("active");
            bookingTab.classList.add("active");
            CashierBtn.classList.remove("active");
            CashierTab.classList.remove("active");
        }
    }
    else {
        allCInput[2].value = sessionStorage.getItem("c_name");
    }

}

// close cashier coding
closeCashierBtn.onclick = () => {
    if (allCashData.length > 0) {
        let data = {
            cashierName: sessionStorage.getItem("c_name"),
            total: cashTotal.innerText,
            createdAt: new Date()
        }
        allCashArchData.push(data);
        allCashData = [];
        localStorage.removeItem(user + "_allCashData");
        localStorage.setItem(user + "_allCashArchData", JSON.stringify(allCashArchData));
        sessionStorage.removeItem("c_name");
        showCashierFunc();

    }
    else {
        swal('Warning', "There is no cash to close", 'warning');
    }
}
