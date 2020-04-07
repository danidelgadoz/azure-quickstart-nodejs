require('dotenv').config();
const { BlobServiceClient } = require('@azure/storage-blob');

const createContainer = async (containerName) => {
    // Create the BlobServiceClient object which will be used to create a container client
    const blobServiceClient = await BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);

    console.log('\nCreating container...');
    console.log('\t', containerName);

    // Get a reference to a container
    const containerClient = await blobServiceClient.getContainerClient(containerName);

    // Create the container
    const createContainerResponse = await containerClient.create();
    console.log("Container was created successfully. requestId: ", createContainerResponse.requestId);
}

const uploadBlob = async (containerName) => {
    const blobServiceClient = await BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = await blobServiceClient.getContainerClient(containerName);

    // Create a unique name for the blob
    const blobName = 'quickstart' + '.txt';

    // Get a block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    console.log('\nUploading to Azure storage as blob:\n\t', blobName);

    // Upload data to the blob
    const data = 'Hello, World!';
    const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
    console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);
}

const listBlobs = async (containerName) => {
    const blobServiceClient = await BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = await blobServiceClient.getContainerClient(containerName);
    console.log('\nListing blobs...');

    // List the blob(s) in the container.
    for await (const blob of containerClient.listBlobsFlat()) {
        console.log('\t', blob.name);
    }
}

const downloadBlobs = async (containerName) => {
    const blobServiceClient = await BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = await blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient('quickstart.txt');

    // Get blob content from position 0 to the end
    // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    console.log('\nDownloaded blob content...');
    console.log('\t', await streamToString(downloadBlockBlobResponse.readableStreamBody));
}

const deleteContainer = async (containerName) => {
    const blobServiceClient = await BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = await blobServiceClient.getContainerClient(containerName);

    console.log('\nDeleting container...');

    // Delete container
    const deleteContainerResponse = await containerClient.delete();
    console.log("Container was deleted successfully. requestId: ", deleteContainerResponse.requestId);
}

// A helper function used to read a Node.js readable stream into a string
async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on("data", (data) => {
        chunks.push(data.toString());
      });
      readableStream.on("end", () => {
        resolve(chunks.join(""));
      });
      readableStream.on("error", reject);
    });
}

module.exports = {
    createContainer,
    uploadBlob,
    listBlobs,
    downloadBlobs,
    deleteContainer
};
