import { setCookie, getCookie, deleteCookie } from "./cookie-helper.js";

$(document).ready(function () {
    $("#search").on("submit", searchSubmitHandler);
});

async function searchSubmitHandler(event) {
    event.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
        return;
    }

    const location = $("#location").val();
    const radius = $("#radius").val();
    const unit = $("#unit").val();
    const startDate = $("#start-date").val();
    const endDate = $("#end-date").val();

    $("#start-date-time").val(`${startDate}T00:00:00Z`);
    $("#end-date-time").val(`${endDate}T23:59:59Z`);

    if ($("#accept-cookies").is(":checked")) {
        setCookie("accepted", "true");
        setCookie("location", location);
        setCookie("radius", radius);
        setCookie("unit", unit);
        console.log(getCookie('accepted'))
    } else {
        deleteCookie("accepted")
    }

    document.getElementById("search").submit();
}