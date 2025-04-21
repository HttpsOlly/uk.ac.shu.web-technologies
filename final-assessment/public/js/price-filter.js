$(document).ready(function () {

    $("#filter-toggle").on("click", function () {
        $("#filter-section").toggleClass("d-none");
        $("#sort-section").addClass("d-none");
    });

    $("#sort-toggle").on("click", function () {
        $("#sort-section").toggleClass("d-none");
        $("#filter-section").addClass("d-none");
    });

    $("#apply-sort").on("click", function () {
        const sortMethod = $("#sort-by").val();
        
        if (sortMethod) {
            const sortedEvents = sortEvents(window.filteredevents, sortMethod);
            console.log("Sorted events:", sortedEvents);
            displayEvents(sortedEvents);
        } else {
            console.log("No sorting method selected.");
        }
    });

    startFiltering();
});

function startFiltering() {
    if (Array.isArray(window.events) && window.events.length > 0) {
        const uniqueGenres = getUniqueGenres(window.events);
        populateGenreFilter(uniqueGenres);

        const { minPrice, maxPrice } = getEventPriceRange(window.events);
        window.filteredevents = [...window.events];

        $("#min-price").attr("min", minPrice).attr("max", maxPrice).val(minPrice);
        $("#max-price").attr("min", minPrice).attr("max", maxPrice).val(maxPrice);

        $("#apply-filter").on("click", function () {
            const min = parseFloat($("#min-price").val());
            const max = parseFloat($("#max-price").val());
            const selectedGenre = $("#genre-filter").val();

            if (min > max) {
                alert(`Maximum price is higher than minimum price!`);
                return;
            }

            window.filteredevents = filterEvents(window.events, min, max, selectedGenre);
            displayEvents(window.filteredevents);
        });

        displayEvents(window.filteredevents);
    } else {
        setTimeout(startFiltering, 50);
    }
}

function getEventPriceRange(events) {
    const validEvents = events.filter(event => event.priceRanges?.[1]);
    if (validEvents.length === 0) {
        return { minPrice: 0, maxPrice: 5000 };
    }
    let minPrice = validEvents[0].priceRanges[1].min;
    let maxPrice = validEvents[0].priceRanges[1].max;
    validEvents.forEach(event => {
        const min = event.priceRanges[1].min;
        const max = event.priceRanges[1].max;
        if (min < minPrice) minPrice = min;
        if (max > maxPrice) maxPrice = max;
    });
    return { minPrice, maxPrice };
}

function getUniqueGenres(events) {
    const genres = events.map(event => event.classifications?.[0]?.segment?.name).filter(Boolean);
    return [...new Set(genres)];
}

function populateGenreFilter(genres) {
    const genreFilter = $("#genre-filter");
    genreFilter.empty();
    genreFilter.append('<option value="">All</option>');
    genres.forEach(genre => {
        genreFilter.append(`<option value="${genre}">${genre}</option>`);
    });
}

function filterEvents(events, minPrice, maxPrice, selectedGenre) {
    const filteredEvents = [...events];
    return filteredEvents.filter(event => {
        const genre = event.classifications?.[0]?.segment?.name;
        return selectedGenre == "" || genre === selectedGenre;
    }).filter(event => {
        const hasPrice = event.priceRanges;
        if (!hasPrice) return true;

        const priceRange = event.priceRanges?.[1];
        const hasValidPrice = priceRange?.min && priceRange?.max;
        if (!hasValidPrice) return true;

        return priceRange.max >= minPrice && priceRange.min <= maxPrice;
    });
}

function generateEventPane(event, venue) {
    const eventPane = $("<div>").addClass("event-container");

    const eventDetails = $("<div>").addClass("event-details");
    
    appendIfValid(eventDetails, generateEventName(getValidProperty(event.name)));

    appendIfValid(eventDetails, generateEventDate(getValidProperty(event.dates?.start?.localDate)));
    
    appendIfValid(eventDetails, generateEventTime(getValidProperty(event.dates?.start?.localTime)));
    
    appendIfValid(eventDetails, generateEventPrice(getValidProperty(event.priceRanges)));

    if (event.classifications?.[0]?.segment?.name && event.classifications?.[0]?.genre?.name) {
        const eventType = generateEventType(
            getValidProperty(event.classifications[0].segment.name),
            getValidProperty(event.classifications[0].genre.name)
        );
        appendIfValid(eventDetails, eventType);
    }
    appendIfValid(eventPane, eventDetails);

    const venueElement = generateVenueName(
        getValidProperty(venue.name),
        getValidProperty(venue.city.name),
        getValidProperty(event.distance)
    );
    appendIfValid(eventPane, venueElement);

    const eventImageContainer = $("<div>").addClass("event-image-container");
    
    appendIfValid(eventImageContainer, generateImg(getValidProperty(event.name), getValidProperty(event.images)));
    appendIfValid(eventImageContainer, generateActionButton(getValidProperty(event.url), getValidProperty(event.priceRanges)));
    eventPane.append(eventImageContainer);

    const moreInfoContainer = $("<div>").addClass("more-info-container");
    
    appendIfValid(moreInfoContainer, generateMoreInfoButton(getValidProperty(event.pleaseNote)));
    eventPane.append(moreInfoContainer);

    return eventPane;
}

window.displayEvents = function (events) {
    const eventsContainer = $("#events-container");
    eventsContainer.empty();
    events.forEach(event => {
        const venue = event._embedded.venues[0];
        const singleEvent = generateEventPane(event, venue);
        eventsContainer.append(singleEvent);
    });

    const loadedCount = window.events?.length;
    const totalElements = window.totalElements;
    const messageContainer = $("#results-container");

    if (messageContainer.length) {
        messageContainer.text(`${loadedCount} out of ${totalElements} events loaded`);
    } else {
        console.error("results-container is null");
    }
}

// Helpers
function getValidProperty(data) {
    return data !== undefined && data !== null && data !== "" && data !== "Undefined" ? data : null;
}

function appendIfValid(parent, child) {
    if (child) parent.append(child);
}

function generateEventName(name) {
    return $("<h2>").text(name);
}

function generateEventDate(date) {
    const [yyyy, mm, dd] = date.split("-");
    const monthNames = {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December"
    };
    return $("<p>").text(`Date: ${dd} ${monthNames[mm]} ${yyyy}`);
}

function generateEventTime(time) {
    if (time) {
        try {
            const [hour, min] = time.split(":");
            return $("<p>").text(`Time: ${hour}:${min}`);
        } catch (error) {
            return $("<p>").text("Invalid time format");
        }
    }
    return $("<p>").text("");
}

function generateEventPrice(prices) {
    if (!prices || prices.length === 0) return;

    const standardPrice = prices.find(price => price.type === "standard");
    if (!standardPrice) return;

    const formatPrice = price => (price % 1 === 0 ? price.toFixed(0) : price.toFixed(2));


    let minPrice = Number(standardPrice.min);
    let maxPrice = Number(standardPrice.max);

    if (minPrice > 0 && maxPrice > 0) {
        minPrice = formatPrice(minPrice);
        maxPrice = formatPrice(maxPrice);
        return $("<p>").text(minPrice === maxPrice ? `Price: £${minPrice}` : `Prices: £${minPrice} - £${maxPrice}`);
    }

    if (minPrice > 0) return $("<p>").text(`Price: £${formatPrice(minPrice)}`);
    if (maxPrice > 0) return $("<p>").text(`Price: £${formatPrice(maxPrice)}`);
}

function generateActionButton(url, prices) {
    const actionButton = $("<a>").addClass("action-button").attr("href", url);
    actionButton.text(prices && prices.length > 0 && (typeof prices[0].min !== "undefined" || typeof prices[0].max !== "undefined") ? "Buy Now" : "See Prices");
    return actionButton;
}

function generateEventType(segment, genre) {
    if (!getValidProperty(segment) || !getValidProperty(genre)) {
        return null;
    }
    return $("<p>").text(`Event Type: ${segment} - ${genre}`);
}

function generateVenueName(name, city, distance) {
    return $("<p>").html(`Venue: ${name.trim()}, ${city}<br>${Math.floor(distance)} miles away`);
}

function generateImg(eventName, imgObject) {
    // Will always gather an img of 300px or wider with 16:9 ratio
    for (const img of imgObject) {
        const res_width = 16;
        const res_height = 9;

        if (img.ratio === `${res_width}_${res_height}` && img.width > 300) {
            const width = 300;
            const height = Math.ceil((width * res_height) / res_width);
            return $("<img>").attr("src", img.url).attr("width", width).attr("height", height).attr("alt", `Image of ${eventName} event`).attr("title", `Image of ${eventName} event`);
        }
    }
    return null;
}

function generateMoreInfoButton(note) {
    if (note) {
        const moreInfoButton = createMoreInfoButton();
        const moreInfoContent = createContent(note);

        moreInfoButton.on("click", () => changeVisibility(moreInfoContent, moreInfoButton.find(".arrow")));
        return collectElements("div", "more-info-container", moreInfoButton, moreInfoContent);
    }
    return null;
}

function createMoreInfoButton() {
    return $("<button>").addClass("more-info-button").html(`<span class="arrow">&#x25BC;</span> <span>More Info</span>`);
}

function createContent(note) {
    const content = $("<div>").addClass("more-info-content").hide();
    const paragraph = $("<p>").text(`Please Note: ${note}`);
    content.append(paragraph);
    return content;
}

function changeVisibility(content, arrow) {
    const isHidden = content.css("display") === "none";
    content.css("display", isHidden ? "block" : "none");

    if (arrow.length) {
        arrow.text(isHidden ? `\u25B2` : `\u25BC`);
    }
}

function collectElements(tag, className, ...children) {
    const wrapper = $(`<${tag}>`).addClass(className);
    wrapper.append(children);
    return wrapper;
}

function sortEvents(events, sortMethod) {
    return [...events].sort((a, b) => {
        const getPrice = (priceRanges) => {
            const priceRange = getStandardPriceRange(priceRanges);
            if (!priceRange) return null;
            return priceRange.min > 0 ? priceRange.min : priceRange.max;
        };

        const priceA = getPrice(a.priceRanges);
        const priceB = getPrice(b.priceRanges);

        if (priceA === null) return 1;
        if (priceB === null) return -1;

        return sortMethod === "price-low-to-high" ? priceA - priceB : priceB - priceA;
    });
}

function getStandardPriceRange(priceRanges) {
    if (!Array.isArray(priceRanges) || priceRanges.length === 0) {
        return null;
    }

    for (const range of priceRanges) {
        if (range.type === "standard") {
            return range;
        }
    }
    return null;
}