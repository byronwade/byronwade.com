export async function checkConsoleOutput(page) {
	const consoleOutput = {
		errors: [],
		warnings: [],
		info: [],
		log: [],
		other: [],
		// dir: [] // Uncomment this if you have a 'dir' array in consoleOutput
	};

	function handleConsole(msg) {
		const type = msg.type();
		const text = msg.text();
		const location = msg.location();
		const messageData = { text, location };

		// Categorize 'error' messages based on text content as well
		if (text.toLowerCase().includes("error")) {
			consoleOutput.errors.push(messageData);
		} else {
			switch (type) {
				case "error":
					consoleOutput.errors.push(messageData);
					break;
				case "warning":
					consoleOutput.warnings.push(messageData);
					break;
				case "info":
					consoleOutput.info.push(messageData);
					break;
				case "log":
					consoleOutput.log.push(messageData);
					break;
				case "debug":
					consoleOutput.log.push(messageData); // or consoleOutput.info.push(messageData);
					break;
				case "dir":
				case "dirxml":
					consoleOutput.dir.push(messageData); // Assuming you've added a 'dir' array to consoleOutput
					break;
				default:
					consoleOutput.other.push(messageData);
					break;
			}
		}
	}

	function handleRequestFailed(request) {
		const messageData = {
			text: `Request failed: ${request.url()} (${request.failure().errorText})`,
			location: { url: page.url() },
		};
		consoleOutput.errors.push(messageData);
	}

	function handleResponse(response) {
		if (!response.ok()) {
			const messageData = {
				text: `Response error: ${response.url()} (status: ${response.status()})`,
				location: { url: page.url() },
			};
			consoleOutput.errors.push(messageData);
		}
	}

	page.on("console", handleConsole);
	page.on("requestfailed", handleRequestFailed);
	page.on("response", handleResponse);

	try {
		await page.waitForTimeout(1000); // Reduced timeout to 1 second
	} catch (error) {
		console.error("Error checking console output:", error);
	} finally {
		page.off("console", handleConsole);
		page.off("requestfailed", handleRequestFailed);
		page.off("response", handleResponse);
	}

	return consoleOutput;
}
