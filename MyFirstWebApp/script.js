// script.js

document.addEventListener("DOMContentLoaded", () => {
    var container = document.getElementById("main-content");
    if (container) {
        var divs = container.children;
        for (var i = 0; i < divs.length; i++) {
            divs[i].classList.add(i % 2 === 0 ? 'left-article' : 'right-article');
        }
    }
});

function toggleBurgerIcon() {
    let menu = document.getElementById("navigation-bar");
    let icon = document.querySelector(".burger-icon");
    
    menu.classList.contains("show") ? menu.classList.remove("show") : menu.classList.add("show");
    icon.classList.contains("open") ? icon.classList.remove("open") : icon.classList.add("open");
}