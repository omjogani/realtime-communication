// Go Server URL
const URL = "ws://localhost:3550/";

// enum for communication types
const CommunicationType = {
    NoPersistent: "no-persistent",
    PersistentFirst: "persistent-first",
    PersistentLater: "persistent-letter"
};


function handleCommunicationType(communicationType) {
    // make dropdown hidden
    const dropdown = document.querySelector("#cTypeDropdown");
    dropdown.classList.add("hidden");
    
    // make chat visible
    const chat = document.getElementById("chat");
    chat.classList.remove("hidden");

    console.log( `${__dirname}/dev.env`);
    
    // grab persistent value
    if (communicationType === CommunicationType.NoPersistent){
        const webSocket = new WebSocket(URL + communicationType);
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

    }
}