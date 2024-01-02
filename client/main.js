// Go Server URL
const URL = "ws://localhost:3550/";

// enum for communication types
const CommunicationType = {
    NoPersistent: "no-persistent",
    PersistentFirst: "persistent-first",
    PersistentLater: "persistent-letter"
};

let webSocket;
let username;

function handleCommunicationType(communicationType) {
    username = document.getElementById("name").value;
    if (username == ""){
        username = "ABC";
    }
    
    // setting current user details
    const myName = document.getElementById("myName");
    myName.innerHTML = username;
    const myProfilePicture = document.getElementById("myProfilePicture");
    myProfilePicture.src = "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-person-icon.png";

    // make dropdown hidden
    const dropdown = document.querySelector("#cTypeDropdown");
    dropdown.classList.add("hidden");
    
    // make chat visible
    const chat = document.getElementById("chat");
    chat.classList.remove("hidden");


    
    
    // grab persistent value
    if (communicationType === CommunicationType.NoPersistent){
        console.log(URL+communicationType);
        webSocket = new WebSocket(URL + communicationType);
        webSocket.onerror = function () {
            alert("Error While Connecting Socket");
        }
        handleNoPersistent(webSocket);
    } else if (communicationType === CommunicationType.PersistentFirst) {
        persistentType = CommunicationType.PersistentFirst;
    } else {
        persistentType = CommunicationType.PersistentLater
    }
}

function handleNoPersistent(webSocket) {
    webSocket.onmessage = function(event) {
        data = JSON.parse(event.data);
        const chatList = document.getElementById("chatList");
        const now = new Date(Date.now());
        const formattedTime = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
        const message =  data.Message + " · " + formattedTime;
        const newUser = addNewChatInGUI(data.Username, "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-person-icon.png", message);
        chatList.appendChild(newUser);
    }
}

function handleSendMessage() {
    const textField = document.getElementById("message");
    const payload = {
        "Username": username,
        "Message": textField.value,
    };
    textField.value = "";
    webSocket.send(JSON.stringify(payload));
}

function addNewChatInGUI(name, avatarSrc, message) {
    const userButton = document.createElement("button");
    userButton.classList.add("w-full", "text-left", "py-2", "focus:outline-none", "focus-visible:bg-indigo-50");

    const userContent = document.createElement("div");
    userContent.classList.add("flex", "items-center");

    const avatarImg = document.createElement("img");
    avatarImg.classList.add("rounded-full", "items-start", "flex-shrink-0", "mr-3");
    avatarImg.src = avatarSrc;
    avatarImg.width = 32;
    avatarImg.height = 32;
    avatarImg.alt = name;

    const userInfo = document.createElement("div");

    const userName = document.createElement("h4");
    userName.classList.add("text-sm", "font-semibold", "text-gray-900");
    userName.textContent = name;

    const userMessage = document.createElement("div");
    userMessage.classList.add("text-[13px]");
    userMessage.textContent = message;

    userInfo.appendChild(userName);
    userInfo.appendChild(userMessage);

    userContent.appendChild(avatarImg);
    userContent.appendChild(userInfo);

    userButton.appendChild(userContent);

    return userButton;
}