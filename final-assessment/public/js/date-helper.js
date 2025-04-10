$(document).ready(function() {

    const { startDate, endDate } = getDefaultStartAndEndDates();

    $("#start-date").val(startDate);
    $("#end-date").val(endDate);
});

export function getDefaultStartAndEndDates() {
    const today = new Date();
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);


    return {
        // YYYY-MM-DD
        startDate: today.toISOString().split('T')[0], 
        endDate: sevenDaysFromNow.toISOString().split('T')[0]
    };
}