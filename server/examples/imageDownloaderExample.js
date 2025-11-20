const imageDownloader = require('../utils/imageDownloader');

async function demonstrateImageDownloader() {
  console.log('=== Image Downloader Examples ===\n');

  const exampleImageUrl = 'https://via.placeholder.com/300';
  const exampleImageUrls = [
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/400',
    'https://via.placeholder.com/500',
  ];

  try {
    console.log('1. Download single image:');
    const singleResult = await imageDownloader.downloadImage(exampleImageUrl, {
      filename: 'example-image.png',
    });
    console.log('   Success:', singleResult);
    console.log();

    console.log('2. Download multiple images:');
    const multipleResult = await imageDownloader.downloadMultipleImages(exampleImageUrls, {
      validateSize: true,
    });
    console.log('   Successful downloads:', multipleResult.successful.length);
    console.log('   Failed downloads:', multipleResult.failed.length);
    console.log();

    console.log('3. List downloaded images:');
    const imageList = imageDownloader.listDownloadedImages();
    console.log('   Total images:', imageList.length);
    imageList.forEach((img) => {
      console.log(`   - ${img.filename} (${img.size} bytes)`);
    });
    console.log();

    console.log('4. Get image path:');
    if (imageList.length > 0) {
      const imagePath = imageDownloader.getImagePath(imageList[0].filename);
      console.log('   Path:', imagePath);
    }
    console.log();

    console.log('5. Validate URL:');
    const validUrl = 'https://example.com/image.jpg';
    const invalidUrl = 'not-a-url';
    console.log(`   Valid URL: ${imageDownloader.isValidUrl(validUrl)}`);
    console.log(`   Invalid URL: ${imageDownloader.isValidUrl(invalidUrl)}`);
    console.log();

    console.log('6. Configure settings:');
    imageDownloader.setMaxFileSize(10 * 1024 * 1024);
    imageDownloader.setDownloadTimeout(60000);
    console.log('   Max file size: 10 MB');
    console.log('   Timeout: 60 seconds');
    console.log();

    console.log('7. Delete image:');
    if (imageList.length > 0) {
      const deleteResult = imageDownloader.deleteImage(imageList[0].filename);
      console.log('   Result:', deleteResult.message);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

if (require.main === module) {
  demonstrateImageDownloader();
}

module.exports = demonstrateImageDownloader;
