const BlobService =  require('./storage-account/blobService');

(async () => {
    const containerName = 'quickstart666';
    await BlobService.createContainer(containerName);
    await BlobService.uploadBlob(containerName);
    await BlobService.listBlobs(containerName);
    await BlobService.downloadBlobs(containerName);
    await BlobService.deleteContainer(containerName);
    console.log('Done');
})()
