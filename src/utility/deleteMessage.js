async function deleteMessage(message) {
    try {
        await message.delete();
    } catch (error) {
        console.log("Error deleting message: " + error);
    }
}

module.exports = deleteMessage;
