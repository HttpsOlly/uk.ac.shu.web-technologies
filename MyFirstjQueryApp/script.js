$(document).ready(function() {
    var $container = $("#main-content");
    if ($container.length > 0) {
        var $divs = $container.children();
        $divs.each(function(index) {
            if (index < 3) {
                $(this).addClass(index % 2 === 0 ? "left-article" : "right-article");
            }
        });
    }
});

function toggleBurgerIcon() {
    let $menu = $("navigation-bar");
    let $icon = $(".burger-icon");

    $menu.toggleClass("show")
    $icon.toggleClass("open")
}

function validateForm() {
    const $submitButton = $("button");
    
    $submitButton.removeAttr("style");

    let isValidParameter = true;

    ["name", "date", "email", "interest"].forEach(id => {
        let $input = $(`#${id}`);
        let value = $input.val().trim();
        let $validate = $(`#${id}-validation`);

        if (value === "") {
            $validate.text(`Error: The ${id} is a mandatory field!`);
            isValidParameter = false;
        }
    });
        return isValidParameter ? true : false;
}

$(document).ready(function() {
    $("input").each(function() {
        const $input = $(this);
        const $label = $(`label[for="${$input.attr("id")}]"`);

        $input.on("mouseenter", function() {
            if ($label.length) {
                $label.css("color", "crimson");
            }
        });

        $input.on("mouseleave", function() {
            if ($label.length) {
                $label.css("color", "");
            }
        });
    });
});

$(document).ready(function() {
    $("#get-duck-button").on("click", async function() {
        const $imageContainer = $("#duck-image-container");
        const proxyUrl = "https://cors-anywhere.herokuapp.com/";
        const apiUrl = "https://random-d.uk/api/random";
        const demoServer = "https://cors-anywhere.herokuapp.com/corsdemo";

        try {
            const response = await fetch(`${proxyUrl}${apiUrl}`);
            const json = await response.json();
        
            const $img = $("<img>").attr({
            src: json.url,
            alt: "This is a random image of a duck",
            style: "max-width: 100%" });

            $imageContainer.empty()
            $imageContainer.append($img);
        } catch (error) {
            console.error(`Error fetching API - Olly, reminder to self to go here ${demoServer} and request temporary access to demo server! \n Regardless:`, error);
        }
    })
});
