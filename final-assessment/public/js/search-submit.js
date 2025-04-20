import { setCookie, getCookie, deleteCookie } from "./cookie-helper.js";

$(document).ready(function () {
    $("#search").on("submit", searchSubmitHandler);
});

async function searchSubmitHandler(event) {
    event.preventDefault();

    const location = $("#location").val().trim();
    const latitude = $("#latitude").val().trim();
    const longitude = $("#longitude").val().trim();
    const radius = $("#radius").val().trim();
    const unit = $("#unit").val().trim();
    const startDate = $("#start-date").val().trim();
    const endDate = $("#end-date").val().trim();

    if (validateSearchForm({ location, latitude, longitude, radius, unit, startDate, endDate })) {

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
}

export function validateSearchForm({ location, latitude, longitude, radius, unit, startDate, endDate }) {

    const today = new Date();
    let isValid = true;

    $(".error").text("");

    const isDateTodayOrInTheFuture = (date) => {
        const yyyy = Number(date.split('-')[0]);
        const MM = Number(date.split('-')[1]);
        const dd = Number(date.split('-')[2]);
        const givenDate = new Date(yyyy, MM-1, dd);
        return (
            givenDate.getFullYear() > today.getFullYear() ||
            (givenDate.getFullYear() === today.getFullYear() &&
                givenDate.getMonth() > today.getMonth()) ||
            (givenDate.getFullYear() === today.getFullYear() &&
                givenDate.getMonth() === today.getMonth() &&
                givenDate.getDate() >= today.getDate())
        );
    };

    if (!location && (!latitude || !longitude)) {
        $("#location-validation").text("Location is required");
        isValid = false;
    }

    if (!radius || isNaN(radius) || parseFloat(radius) <= 0) {
        $("#radius-validation").text("Radius must be a positive number");
        isValid = false;
    }

    if (!unit || (unit !== "miles" && unit !== "km")) {
        $("#unit-validation").text("Select a valid unit");
        isValid = false;
    }

    if (!startDate) {
        $("#start-date-validation").text("Start date is required");
        isValid = false;
    } else {
        const startDateObject = new Date(startDate);
        if (isNaN(startDateObject.getTime())) {
            $("#start-date-validation").text("Invalid start date format");
            isValid = false;
        } else if (!isDateTodayOrInTheFuture(startDate)) {
            $("#start-date-validation").text("Start date must be today or in the future");
            isValid = false;
        }
    }

    if (!endDate) {
        $("#end-date-validation").text("End date is required");
        isValid = false;
    } else {
        const endDateObject = new Date(endDate);
        const startDateObject = new Date(startDate);
        if (isNaN(endDateObject.getTime())) {
            $("#end-date-validation").text("Invalid end date format");
            isValid = false;
        } else if (startDate && startDateObject > endDateObject) {
            $("#end-date-validation").text("End date cannot be earlier than start date");
            isValid = false;
        } else if (!isDateTodayOrInTheFuture(endDate)) {
            $("#end-date-validation").text("End date must be today or in the future");
            isValid = false;
        }
    }

    return isValid;
}