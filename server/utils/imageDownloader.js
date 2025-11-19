const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class ImageDownloader {
  constructor() {
    this.downloadDir = path.join(__dirname, '../uploads/images');
    this.maxFileSize = 5 * 1024 * 1024;
    this.allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    this.downloadTimeout = 30000;
    this.ensureDownloadDir();
  }

  ensureDownloadDir() {
    if (!fs.existsSync(this.downloadDir)) {
      fs.mkdirSync(this.downloadDir, { recursive: true });
    }
  }

  getFileExtensionFromMimeType(mimeType) {
    const mimeToExt = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
    };
    return mimeToExt[mimeType] || '.jpg';
  }

  validateMimeType(mimeType) {
    return this.allowedMimeTypes.includes(mimeType);
  }

  async downloadImage(imageUrl, options = {}) {
    const {
      filename = null,
      validateSize = true,
      timeout = this.downloadTimeout,
      headers = {},
    } = options;

    try {
      if (!this.isValidUrl(imageUrl)) {
        throw new Error('Invalid URL format');
      }

      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ...headers,
        },
        maxRedirects: 5,
      });

      const contentType = response.headers['content-type'];
      if (!this.validateMimeType(contentType)) {
        throw new Error(`Invalid image type: ${contentType}. Allowed types: ${this.allowedMimeTypes.join(', ')}`);
      }

      const contentLength = response.headers['content-length'];
      if (validateSize && contentLength && parseInt(contentLength) > this.maxFileSize) {
        throw new Error(`File size ${contentLength} exceeds maximum allowed size of ${this.maxFileSize} bytes`);
      }

      if (validateSize && response.data.length > this.maxFileSize) {
        throw new Error(`Downloaded file size exceeds maximum allowed size of ${this.maxFileSize} bytes`);
      }

      const ext = this.getFileExtensionFromMimeType(contentType);
      const savedFilename = filename || `${uuidv4()}${ext}`;
      const filepath = path.join(this.downloadDir, savedFilename);

      fs.writeFileSync(filepath, response.data);

      return {
        success: true,
        filename: savedFilename,
        filepath,
        url: `/uploads/images/${savedFilename}`,
        size: response.data.length,
        mimeType: contentType,
      };
    } catch (error) {
      throw new Error(`Failed to download image: ${error.message}`);
    }
  }

  async downloadMultipleImages(imageUrls, options = {}) {
    const results = {
      successful: [],
      failed: [],
    };

    for (const imageUrl of imageUrls) {
      try {
        const result = await this.downloadImage(imageUrl, options);
        results.successful.push(result);
      } catch (error) {
        results.failed.push({
          url: imageUrl,
          error: error.message,
        });
      }
    }

    return results;
  }

  isValidUrl(urlString) {
    try {
      new URL(urlString);
      return true;
    } catch (error) {
      return false;
    }
  }

  deleteImage(filename) {
    try {
      const filepath = path.join(this.downloadDir, filename);
      
      if (!filepath.startsWith(this.downloadDir)) {
        throw new Error('Invalid file path');
      }

      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        return {
          success: true,
          message: `Image ${filename} deleted successfully`,
        };
      }

      return {
        success: false,
        message: `Image ${filename} not found`,
      };
    } catch (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }

  getImagePath(filename) {
    try {
      const filepath = path.join(this.downloadDir, filename);
      
      if (!filepath.startsWith(this.downloadDir)) {
        throw new Error('Invalid file path');
      }

      if (!fs.existsSync(filepath)) {
        throw new Error('Image file not found');
      }

      return filepath;
    } catch (error) {
      throw new Error(`Failed to get image path: ${error.message}`);
    }
  }

  listDownloadedImages() {
    try {
      const files = fs.readdirSync(this.downloadDir);
      const imageFiles = files.filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      });

      return imageFiles.map((file) => ({
        filename: file,
        url: `/uploads/images/${file}`,
        path: path.join(this.downloadDir, file),
        size: fs.statSync(path.join(this.downloadDir, file)).size,
      }));
    } catch (error) {
      throw new Error(`Failed to list images: ${error.message}`);
    }
  }

  setMaxFileSize(bytes) {
    this.maxFileSize = bytes;
  }

  setDownloadTimeout(milliseconds) {
    this.downloadTimeout = milliseconds;
  }
}

module.exports = new ImageDownloader();
