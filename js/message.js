function getLimitMessage(limit) {
    if (limit < 0.3) return "❄️";
    if (limit < 0.5) return "🔥";
    if (limit < 0.8) return "🔥🔥";
    return "🔥🔥🔥";
}

function getTnumberMessage(tnumber) {
    const messages = {
        3: "💛",
        4: "💚",
        5: "💜",
        6: "💔",
        7: "❤️‍🩹",
        8: "♥️",
        9: "💖",
        10: "💖"
    };
    return messages[tnumber] || "Explore the unknown.";
}

function generateMessage(tnumber, limit) {
    let tMessage = getTnumberMessage(tnumber);
    let lMessage = getLimitMessage(limit);
    
    //return `${tMessage} ${lMessage}`;
    return `${lMessage}`;
}


