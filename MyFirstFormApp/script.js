document.addEventListener("DOMContentLoaded", () => {
    var container = document.getElementById("main-content");
    if (container) {
        var divs = container.children;
        for (var i = 0; i < 3 && i < divs.length; i++) {
            divs[i].classList.add(i % 2 === 0 ? "left-article" : "right-article");
        }
    }
});

function toggleBurgerIcon() {
    let menu = document.getElementById("navigation-bar");
    let icon = document.querySelector(".burger-icon");

    menu.classList.contains("show") ? menu.classList.remove("show") : menu.classList.add("show");
    icon.classList.contains("open") ? icon.classList.remove("open") : icon.classList.add("open");
}

function validateForm() {
    const submitButton = document.querySelector("button");
    
    const name = document.getElementById("name");
    const date = document.getElementById("date");
    const email = document.getElementById("email");
    
    submitButton.style = "";
    
    document.getElementById("nameValidation").textContent = "";
    document.getElementById("dateValidation").textContent = "";
    document.getElementById("emailValidation").textContent = "";

    let isValidParameter = true;

    if (name.value.trim() === "") {
        document.getElementById("nameValidation").textContent = "Error: Name is required!";
        isValidParameter = false;
    }

    if (date.value.trim() === "") {
        document.getElementById("dateValidation").textContent = "Error: Date is required!";
        isValidParameter = false;
    }

    if (email.value.trim() === "") {
        document.getElementById("emailValidation").textContent = "Error: Email is required!";
        isValidParameter = false;
    }

    if (!isValidParameter) {
        console.log("Incomplete form - submission halted");
        return false;
    }
}