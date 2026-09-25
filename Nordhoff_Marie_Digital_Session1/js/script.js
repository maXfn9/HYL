window.addEventListener("DOMContentLoaded", (event) => {
	let body = document.body;
	let cssObj = window.getComputedStyle(body, null);
	let borderColor = cssObj.getPropertyValue("border-color");
	let borderWidth = cssObj.getPropertyValue("border-top-width");

	window.addEventListener("keydown", function (event) {
		if (event.defaultPrevented) {
			return; // Do nothing if the event was already processed
		}
		console.log(event.key);
		switch (event.key) {
			case "w":
				console.log(borderColor);
				console.log(borderWidth);
				if (body.style.overflow != "hidden") {
					body.style.overflow = "hidden";
					body.style.setProperty("border", borderWidth + " solid transparent");
					body.style.setProperty("clip-path", "inset(0 0 0 0)");
				} else {
					body.style.overflow = "visible";
					body.style.setProperty("border", borderWidth + " solid " + borderColor);
					body.style.setProperty("clip-path", "none");
				}
				break;
			default:
				return;
		}

		// Cancel the default action to avoid it being handled twice
		event.preventDefault();
	}, true);
});