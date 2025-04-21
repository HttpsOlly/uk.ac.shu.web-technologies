const apiKey = `seGC2QvkL8a5YJySDdh7v97P7aEjoWiJ`;
const endpoint = `https://app.ticketmaster.com/discovery/v2/events`;

const params = new URLSearchParams(window.location.search);

const city = params.get("location");
const lat = params.get("latitude");
const long = params.get("longitude");
const startDate = params.get("start-date-time");
const endDate = params.get("end-date-time");
const radius = params.get("radius");
const unit = params.get("unit");

console.log(`Coordinates ${lat}, ${long}`);

$(document).ready(function () {
    fetchEvents(0);
    initializeMap(lat, long, radius, unit);
});

function fetchEvents(pageNumber) {
    console.log(`Fetching events for page: ${pageNumber}`);

    const url = `${endpoint}?apikey=${apiKey}&geoPoint=${lat},${long}&radius=${radius}&unit=${unit}&startDateTime=${startDate}&endDateTime=${endDate}&page=${pageNumber}&size=200`;
    console.log(url);

    $.get(url).done(handleData).fail(function (error) {
        console.error(`Error with the fetch method! ${error}`);
    });
}

// Inspiration from https://stackoverflow.com/questions/2477452/%C3%A2%E2%82%AC-showing-on-page-instead-of
// Inspiration from https://gist.github.com/tushortz/9fbde5d023c0a0204333267840b592f9
// On a few occurrences, the data received included characters such as " â€™S ".
// Data therefore had to be cleaned and amended to `"` instead.
// The examples below are ones that I have seen from my testing, and is therefore not an exhaustive list of erroneous characters.

function replaceCharacters(text) {
    return text
        .replace(/â\x80\x9D/g, `"`)
        .replace(/â\x80\x99/g, `'`)
        .replace(/Â\x80\x98/g, `'`);
}

$("#see-more-button").on("click", function () {
    fetchEvents(currentPage);
    currentPage++;
});

function updateInfiniteScrolling(page) {
    const seeMoreButton = $("#see-more-button");

    if (page.number < page.totalPages - 1) {
        seeMoreButton.show();
    } else {
        seeMoreButton.hide();
    }
}

function checkDataResponseOK(response) {
    return response.ok ? response.json() : (function () {
        throw new Error(`Response not received!! Error ${response.status}`);
    })();
}

function handleData(data) {
    console.log(data);

    window.totalElements = data.page.totalElements;

    const events = data._embedded?.events.map(event => {
        event.name = replaceCharacters(event.name);

        if (event.priceRanges.length === 0 || !event.priceRanges) {
            event.price = (Math.random() * (99.99 - 10) + 10).toFixed(2);
        }

        return event;
    }) || [];

    window.events = window.events || [];
    for (let i = 0; i < events.length; i++) {
        window.events.push(events[i]);
    }

    window.filteredevents = [...window.events];

    displayEvents(events);
    updateInfiniteScrolling(data.page);
}

function initializeMap(lat, lon, radius, unit) {

    const miles_convert = 1609.32;
    const km_convert = 1000;
    
    const radiusInMetres = (unit === "miles") ? radius * miles_convert : radius * km_convert;
    
    const map = leaflet.map("map").setView([lat, lon], 40);

    leaflet.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
        maxZoom: 6,
        attribution: `Copyright of OpenStreetMap`,
    }).addTo(map);
    
    const marker = leaflet.marker([lat, lon]).addTo(map);
    
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    fetch(nominatimUrl)
        .then((response) => response.json())
        .then((data) => {
            const locationName = `${data.address.village || data.address.town || data.address.city || data.address.state || data.address.country || "Unknown Location"}`;
    
            marker.bindPopup(`${locationName}`).openPopup();
        })
        .catch((error) => {
            console.error("Error with Nominatim:", error);
            marker.bindPopup("Location data could not be retrieved").openPopup();
        });
    
    leaflet.circle([lat, lon], {
        color: "crimson",
        fillColor: "crimson",
        fillOpacity: 0.1,
        radius: radiusInMetres,
    }).addTo(map);    
}