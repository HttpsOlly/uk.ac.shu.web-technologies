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
    
    document.getElementById("name-validation").textContent = "";
    document.getElementById("date-validation").textContent = "";
    document.getElementById("email-validation").textContent = "";

    let isValidParameter = true;

    ["name", "date", "email"].forEach(id => {
        const value = document.getElementById(id).value.trim();
        if (value === "") {
            document.getElementById(`${id}-validation`).textContent = `Error: The ${id} is a mandatory field!`;
            isValidParameter = false;
        }
    });

    return isValidParameter ? true : false;

}