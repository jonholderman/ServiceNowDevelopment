// ==UserScript==
// @name        ServiceNow Customization
// @namespace   Violentmonkey Scripts
// @match       https://*.service-now.com/*
// @grant       none
// @version     1.0
// @author      Jon Holderman
// @description 1/17/2020, 9:22:33 PM
// ==/UserScript==

(function () {

    // Create ServiceNow Objects
    var serviceNowInstances = [
        { name: 'gprod', hexColor: "#FF2900", updateSetWidth: null },
        { name: 'gtest', hexColor: "#CC7200", updateSetWidth: 400 },
        { name: 'gdev', hexColor: "#FFCC00", updateSetWidth: 400 },
        { name: 'gsndbox', hexColor: "#009900", updateSetWidth: 400 }
    ];

    // Returns the Instance Name of the ServiceNow URL
    function getServiceNowPrefix() {

        return location.host.replace('.service-now.com', '');

    }

    // Converts Hex Colors to RGB and Appends Alpha Value
    function hexToRGBA(hex, alpha) {

        // Remove '#' Character if Prefixed
        hex.replace('#', '');

        // Initalize RGB Values
        var r = 0, g = 0, b = 0;

        // Hex Values can either be 3 or 6 Digits
        // Prefix Each RGB Value with '0x' to Convert them to Hex

        // If 3 digits concatenate the same value twice for each channel
        if (hex.length == 4) {

            r = "0x" + hex[1] + hex[1];
            g = "0x" + hex[2] + hex[2];
            b = "0x" + hex[3] + hex[3];

            // 6 digits concatenate the first two for red, next two for green, and last two for blue
        } else if (hex.length == 7) {

            r = "0x" + hex[1] + hex[2];
            g = "0x" + hex[3] + hex[4];
            b = "0x" + hex[5] + hex[6];

        }

        // Prepend the variables with + to convert them from strings back to numbers
        return "rgba(" + +r + "," + +g + "," + +b + "," + alpha + ")";

    }

    function updateFavicon(color) {

        if (color === undefined || color === "") {
            return true;
        }

        // Get Link Element for the Favicon
        var link = document.querySelector("link[rel~='icon']");

        // Create a New Link Element and Append it to the Head of the Document
        if (!link) {
            link = document.createElement("link");
            link.setAttribute("rel", "shortcut icon");
            document.head.appendChild(link);
        }

        // Store the URL of the Favicon
        var faviconUrl = link.href || window.location.origin + "/favicon.ico";

        // Create a New Canvas Element
        var canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        var context = canvas.getContext("2d");

        // Create a New Img Element
        // This is a Good Proxy Between URLs and Canvas Elements
        var img = document.createElement("img");

        img.onload = function (ev) {

            if (myFavicon) {

                // Convert the Image to a Data URL
                link.href = myFavicon;
                link.type = "image/x-icon";

            } else {

                // Create the Inital Image
                context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
                // Sets the Canvas Composite Mode to Source-in.
                context.globalCompositeOperation = "source-in";

                // Fills the Rectangle with the Color Choosen
                context.fillStyle = color;

                // Draws a 256 x 256 rectangle
                context.fillRect(0, 0, 256, 256);

                // Convert the Image to a Data URL
                link.type = "image/x-icon";
                // Store a Cache of the Icon in Local Storage
                localStorage["myFavicon"] = canvas.toDataURL();
                link.href = myFavicon;

            }

        };

        img.src = faviconUrl;

    }

    var snInstance = serviceNowInstances.find(obj => {
        return obj.name === getServiceNowPrefix();
    });

    if (snInstance !== "undefined") {

        // Create a Variable of the first Element with a Class of 'navpage-layout'
        if (window.top.document.getElementsByClassName("navpage-layout")[0]) {

            var outerBorderElement = window.top.document.getElementsByClassName("navpage-layout")[0];

        } else {

            var outerBorderElement = document.getElementsByTagName("BODY")[0];

        }

        // Add Border to Page
        outerBorderElement.style.borderTop = '3px solid ' + hexToRGBA(snInstance.hexColor, 1);

        // Grab Cached Favicon
        var myFavicon = localStorage["myFavicon"];
      
        // Change FavIcon Color
        updateFavicon(snInstance.hexColor);

        window.addEventListener('load', function() {

          // Change The Outer Element UpdateSet Width
          var outerUpdateSetElement = window.top.document.getElementsByClassName("concourse-update-set-picker")[0];
          outerUpdateSetElement.style.width = (snInstance.updateSetWidth + 50) + 'px';

          // Change the Inner Element UpdateSet Width
          var updateSetElement = window.top.document.getElementById("update_set_picker_select");
          updateSetElement.style.width = snInstance.updateSetWidth + 'px';

        }, false);
      
    }

})();
