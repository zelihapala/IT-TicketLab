// Checks if the JavaScript file is connected.
console.log("TicketLab JavaScript is working.");
// Gets the ticket elements from the HTML.
const ticketSelect = document.getElementById("ticket-select");
const ticketTitle = document.getElementById("ticket-title");
const ticketPriority = document.getElementById("ticket-priority");
const customerName = document.getElementById("customer-name");
const ticketDescription = document.getElementById("ticket-description");

// Gets the timer, question counter and call buttons.
const timer = document.getElementById("timer");
const questionsLeft = document.getElementById("questions-left");
const startCall = document.getElementById("start-call");
const endCall = document.getElementById("end-call");

// Gets the chat area, message input and send button.
const chatArea = document.getElementById("chat-area");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

// Gets the fields used to write the internal note.
const summary = document.getElementById("summary");
const troubleshooting = document.getElementById("troubleshooting");
const rootCause = document.getElementById("root-cause");
const resolution = document.getElementById("resolution");

// Stores the starting time and number of questions.
let timeLeft = 480;
let questions = 7;
let timerInterval;
let callActive = false;
let selectedTicket = "account";

// Stores the information for each practice ticket.
const tickets = {
	account: {
		title: "Locked out of account",
		priority: "Medium Priority",
		customer: "Raised by Hannah, Sales Assistant",
		description: [
			"Hannah cannot sign in to her work laptop.",
			"She says her account is locked.",
			"She has a client call at 11am.",
		],
		message:
			"Hiya, thanks for picking up. I can't get into my laptop and I've got a client call soon.",
	},

	printer: {
		title: "Printer not working",
		priority: "Low Priority",
		customer: "Raised by James, Finance Assistant",
		description: [
			"James cannot print documents.",
			"His colleagues can use the same printer.",
			"He needs to print a report.",
		],
		message: "Hi, I'm trying to print a report, but nothing is coming out.",
	},

	wifi: {
		title: "Wi-Fi connection issue",
		priority: "Medium Priority",
		customer: "Raised by Sarah, Office Administrator",
		description: [
			"Sarah cannot connect to the office Wi-Fi.",
			"Other employees can connect.",
			"She needs internet access to work.",
		],
		message: "Hello, my laptop won't connect to the office Wi-Fi.",
	},

	vpn: {
		title: "VPN connection issue",
		priority: "High Priority",
		customer: "Raised by David, Remote Worker",
		description: [
			"David is working from home.",
			"He cannot connect to the company VPN.",
			"He cannot access company resources.",
		],
		message: "Hi, I'm working from home and my VPN isn't connecting.",
	},
};

// Adds a message to the chat area.
function addMessage(message, className) {
	const newMessage = document.createElement("p");

	newMessage.textContent = message;
	newMessage.className = className;

	chatArea.appendChild(newMessage);
	chatArea.scrollTop = chatArea.scrollHeight;
}

// Shows the remaining time in minutes and seconds.
function updateTimer() {
	let minutes = Math.floor(timeLeft / 60);
	let seconds = timeLeft % 60;

	if (minutes < 10) {
		minutes = "0" + minutes;
	}

	if (seconds < 10) {
		seconds = "0" + seconds;
	}

	timer.textContent = minutes + ":" + seconds;
}

// Resets the timer and question counter.
function resetCall() {
	clearInterval(timerInterval);

	timeLeft = 480;
	questions = 7;
	callActive = false;

	updateTimer();
	questionsLeft.textContent = questions;

	startCall.disabled = false;
	endCall.disabled = true;
	sendButton.disabled = true;
	messageInput.disabled = true;
	ticketSelect.disabled = false;
}

// Clears the fields before loading another ticket.
function clearNotes() {
	summary.value = "";
	troubleshooting.value = "";
	rootCause.value = "";
	resolution.value = "";
}

// Loads the details of the selected ticket.
function loadTicket() {
	const ticket = tickets[selectedTicket];

	resetCall();
	clearNotes();

	ticketTitle.textContent = ticket.title;
	ticketPriority.textContent = ticket.priority;
	customerName.textContent = ticket.customer;

	ticketDescription.innerHTML = "";

	// Adds each description item to the list.
	for (let item of ticket.description) {
		const listItem = document.createElement("li");
		listItem.textContent = item;
		ticketDescription.appendChild(listItem);
	}

	// Clears the old conversation and shows the new message.
	chatArea.innerHTML = "";
	addMessage(ticket.message, "customer-message");

	messageInput.value = "";
}

// Changes the ticket when the user selects another option.
ticketSelect.addEventListener("change", function () {
	if (ticketSelect.value !== "") {
		selectedTicket = ticketSelect.value;
		loadTicket();
	} else {
		ticketSelect.value = selectedTicket;
	}
});

// Starts the call and runs the timer every second.
startCall.addEventListener("click", function () {
	callActive = true;

	startCall.disabled = true;
	endCall.disabled = false;
	sendButton.disabled = false;
	messageInput.disabled = false;
	ticketSelect.disabled = true;

	addMessage("Call started.", "system-message");

	messageInput.focus();

	timerInterval = setInterval(function () {
		timeLeft = timeLeft - 1;

		updateTimer();

		if (timeLeft === 0) {
			finishCall("Time is up.");
		}
	}, 1000);
});

// Ends the call and stops the timer.
function finishCall(message) {
	clearInterval(timerInterval);

	callActive = false;

	startCall.disabled = true;
	endCall.disabled = true;
	sendButton.disabled = true;
	messageInput.disabled = true;
	ticketSelect.disabled = false;

	addMessage(message, "system-message");
}

// Ends the call when the user clicks I'm Done.
endCall.addEventListener("click", function () {
	finishCall("You ended the call.");
});

// Returns a simple customer response based on the question.
function getCustomerResponse(question) {
	question = question.toLowerCase();

	if (selectedTicket === "account") {
		if (question.includes("password")) {
			return "I changed my password yesterday.";
		}

		if (question.includes("phone")) {
			return "My work email is also connected to my phone.";
		}

		if (question.includes("error")) {
			return "It says my account is locked.";
		}

		if (question.includes("when")) {
			return "It started this morning.";
		}
	}

	if (selectedTicket === "printer") {
		if (question.includes("colleague") || question.includes("other")) {
			return "My colleagues can print without any problems.";
		}

		if (question.includes("error")) {
			return "The printer shows as offline on my laptop.";
		}

		if (question.includes("restart")) {
			return "I restarted my laptop, but it didn't help.";
		}
	}

	if (selectedTicket === "wifi") {
		if (question.includes("other") || question.includes("colleague")) {
			return "Everyone else can connect to the Wi-Fi.";
		}

		if (question.includes("password")) {
			return "I'm using the same password as before.";
		}

		if (question.includes("error")) {
			return "It says unable to connect to this network.";
		}
	}

	if (selectedTicket === "vpn") {
		if (question.includes("internet")) {
			return "My home internet is working normally.";
		}

		if (question.includes("error")) {
			return "The VPN shows an authentication error.";
		}

		if (question.includes("password")) {
			return "I recently changed my work password.";
		}
	}

	// Gives a default response if no keyword is found.
	return "I'm not sure. Could you ask me something else?";
}

// Sends the user's message and reduces the question counter.
function sendMessage() {
	const message = messageInput.value.trim();

	if (callActive === false || message === "" || questions === 0) {
		return;
	}

	addMessage(message, "agent-message");

	messageInput.value = "";

	questions = questions - 1;
	questionsLeft.textContent = questions;

	// Gets and displays the customer's response.
	const reply = getCustomerResponse(message);
	addMessage(reply, "customer-message");

	// Ends the call when there are no questions left.
	if (questions === 0) {
		finishCall("You have no questions left.");
	}
}

// Sends a message when the Send button is clicked.
sendButton.addEventListener("click", function () {
	sendMessage();
});

// Allows the user to send a message with the Enter key.
messageInput.addEventListener("keydown", function (event) {
	if (event.key === "Enter") {
		sendMessage();
	}
});

// Loads the first ticket when the application opens.
ticketSelect.value = selectedTicket;
loadTicket();
