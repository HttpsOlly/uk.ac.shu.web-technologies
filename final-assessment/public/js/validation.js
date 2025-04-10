function validateForm() {
    const today = new Date();
    let isValid = true;

    $(".error").text("");

    const location = $("#location").val().trim();
    const latitude = $("#latitude").val().trim();
    const longitude = $("#longitude").val().trim();
    const radius = $("#radius").val().trim();
    const unit = $("#unit").val().trim();
    const startDate = $("#start-date").val().trim();
    const endDate = $("#end-date").val().trim();

    const isDateTodayOrInTheFuture = (date) => {
        const givenDate = new Date(date);
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