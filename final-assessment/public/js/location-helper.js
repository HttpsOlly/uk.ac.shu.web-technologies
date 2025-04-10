import { getCookie } from "./cookie-helper.js";

$(document).ready(function () {
  getStoredUserPreferences();
  getLocationFromBrowser();
  $("#location").on("blur", locationBlurHandler);
});

const CURRENT_LOCATION_STR = "Current Location";

function getStoredUserPreferences() {
  const accepted = getCookie("accepted");
  if (accepted) {
    $("#accept-cookies").prop("checked", true);
    const radius = getCookie("radius");
    const unit = getCookie("unit");
    if (radius) $("#radius").val(radius);
    if (unit) $("#unit").val(unit);
  }
}

function updateLatitudeAndLongitude({ latitude, longitude }) {
  $("#latitude").val(latitude);
  $("#longitude").val(longitude);
}

function getLocationFromBrowser() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        updateLatitudeAndLongitude({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        $("#location").val(CURRENT_LOCATION_STR);
      },
      (error) => {
        console.error("Geolocation rejected...", error.message);
      }
    );
  } else {
    console.error("Browser geolocation is unsupported");
  }
}

async function locationBlurHandler() {
  const locationName = $("#location").val();
  if (locationName !== CURRENT_LOCATION_STR) {
    await getLocationFromPlaceName(locationName);
  }
}

function getLocationFromPlaceName(locationName) {
  const apiUrl = `https://nominatim.openstreetmap.org/search?q=${locationName}&format=json`;

  return $.get(apiUrl)
    .done(function (data) {
      if (data && data.length > 0) {
        const latitude = data[0].lat;
        const longitude = data[0].lon;
        updateLatitudeAndLongitude({ latitude, longitude });
        console.log(`Coordinates for "${locationName}": Latitude = ${latitude}, Longitude = ${longitude}`);
      } else {
        console.error(
          `No results found for the location name - perhaps a spelling error?`
        );
        alert(
          `No places found with the input ${locationName} - please try re-entering your city`
        );
      }
    })
    .fail(function (error) {
      console.error("Error fetching geolocation data:", error);
      alert("An error occurred while fetching location data.");
    });
}