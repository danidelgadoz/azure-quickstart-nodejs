require('dotenv').config();
const { QueueClient } = require('@azure/storage-queue');

const createQueue = async (queueName) => {
    // Create a unique name for the queue
    console.log("\nCreating queue...");
    console.log("\t", queueName);

    // Instantiate a QueueClient which will be used to create and manipulate a queue
    const queueClient = new QueueClient(process.env.AZURE_STORAGE_CONNECTION_STRING, queueName);

    // Create the queue
    const createQueueResponse = await queueClient.create();
    console.log("Queue created, requestId:", createQueueResponse.requestId);
}

const addMessageToQueue = async (queueName, message) => {
    const queueClient = new QueueClient(process.env.AZURE_STORAGE_CONNECTION_STRING, queueName);
    
    console.log("\nAdding messages to the queue...");
    return await queueClient.sendMessage(message);
}

const peekAtMessagesInAQueue = async (queueName) => {
    const queueClient = new QueueClient(process.env.AZURE_STORAGE_CONNECTION_STRING, queueName);
    console.log("\nPeek at the messages in the queue...");

    // Peek at messages in the queue
    const peekedMessages = await queueClient.peekMessages({ numberOfMessages : 5 });

    for (i = 0; i < peekedMessages.peekedMessageItems.length; i++) {
        // Display the peeked message
        console.log("\t", peekedMessages.peekedMessageItems[i].messageText);
    }
}

const updateAMessageInAQueue = async (queueName, sendMessageResponse, message) => {
    const queueClient = new QueueClient(process.env.AZURE_STORAGE_CONNECTION_STRING, queueName);

    // Update a message using the response saved when calling sendMessage earlier
    return updateMessageResponse = await queueClient.updateMessage(
        sendMessageResponse.messageId,
        sendMessageResponse.popReceipt,
        message
    );
}

const receiveMessagesFromAQueue = async (queueName) => {
    const queueClient = new QueueClient(process.env.AZURE_STORAGE_CONNECTION_STRING, queueName);

    console.log("\nReceiving messages from the queue...");

    // Get messages from the queue
    return await queueClient.receiveMessages({ numberOfMessages : 5 });
}

const deleteMessagesFromAQueue = async (queueName, receivedMessagesResponse) => {
    const queueClient = new QueueClient(process.env.AZURE_STORAGE_CONNECTION_STRING, queueName);

    // 'Process' and delete messages from the queue
    for (i = 0; i < receivedMessagesResponse.receivedMessageItems.length; i++) {
        receivedMessage = receivedMessagesResponse.receivedMessageItems[i];

        // 'Process' the message
        console.log("\tProcessing:", receivedMessage.messageText);

        // Delete the message
        const deleteMessageResponse = await queueClient.deleteMessage(
            receivedMessage.messageId,
            receivedMessage.popReceipt
        );
        console.log("\tMessage deleted, requestId:", deleteMessageResponse.requestId);
    }
}

const deleteAQueue = async (queueName) => {
    const queueClient = new QueueClient(process.env.AZURE_STORAGE_CONNECTION_STRING, queueName);

    // Delete the queue
    console.log("\nDeleting queue...");
    const deleteQueueResponse = await queueClient.delete();
    console.log("Queue deleted, requestId:", deleteQueueResponse.requestId);
}

module.exports = {
    createQueue,
    addMessageToQueue,
    peekAtMessagesInAQueue,
    updateAMessageInAQueue,
    receiveMessagesFromAQueue,
    deleteMessagesFromAQueue,
    deleteAQueue
};
