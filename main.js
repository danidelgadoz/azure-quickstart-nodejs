const BlobService =  require('./storage-account/blobService');
const QueueService =  require('./storage-account/queueService');

// (async () => {
//     const containerName = 'quickstart666';
//     await BlobService.createContainer(containerName);
//     await BlobService.uploadBlob(containerName);
//     await BlobService.listBlobs(containerName);
//     await BlobService.downloadBlobs(containerName);
//     await BlobService.deleteContainer(containerName);
//     console.log('Done');
// })()

(async () => {
    const queueName = 'quickstart';

    // Create a queue
    await QueueService.createQueue(queueName);

    // Send several messages to the queue
    await QueueService.addMessageToQueue(queueName, "First message");
    await QueueService.addMessageToQueue(queueName, "Second message");
    const sendMessageResponse = await QueueService.addMessageToQueue(queueName, "Third message");
    console.log("\nThird message added, requestId:", sendMessageResponse.requestId);
    
    // Peek at messages in a queue
    await QueueService.peekAtMessagesInAQueue(queueName);
    
    // Update a message in a queue
    console.log("\nUpdating the third message in the queue...");
    const updateMessageResponse = await QueueService.updateAMessageInAQueue(queueName, sendMessageResponse, "Third message has been updated");
    console.log("Message updated, requestId:", updateMessageResponse.requestId);
    
    // Receive messages from a queue
    const receivedMessagesResponse = await QueueService.receiveMessagesFromAQueue(queueName);
    console.log("Messages received, requestId:", receivedMessagesResponse.requestId);

    // Delete messages from a queue
    await QueueService.deleteMessagesFromAQueue(queueName, receivedMessagesResponse);
    
    // Delete a queue
    await QueueService.deleteAQueue(queueName);


    console.log('\nDone');
})()
