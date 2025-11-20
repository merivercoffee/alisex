const express = require('express');
const router = express.Router();
const imageDownloader = require('../utils/imageDownloader');
const { protect, authorize } = require('../middleware/auth');

router.post('/download', protect, authorize('seller', 'admin'), async (req, res, next) => {
  try {
    const { url, filename, validateSize, timeout, headers } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required',
      });
    }

    const result = await imageDownloader.downloadImage(url, {
      filename,
      validateSize: validateSize !== false,
      timeout,
      headers,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/download-multiple', protect, authorize('seller', 'admin'), async (req, res, next) => {
  try {
    const { urls, validateSize, timeout, headers } = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Array of image URLs is required',
      });
    }

    const result = await imageDownloader.downloadMultipleImages(urls, {
      validateSize: validateSize !== false,
      timeout,
      headers,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/list', protect, authorize('seller', 'admin'), async (req, res, next) => {
  try {
    const images = imageDownloader.listDownloadedImages();

    res.status(200).json({
      success: true,
      count: images.length,
      data: images,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:filename', protect, authorize('seller', 'admin'), async (req, res, next) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Filename is required',
      });
    }

    const result = imageDownloader.deleteImage(filename);

    res.status(200).json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/settings', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { maxFileSizeInMB, timeoutInSeconds } = req.body;

    if (maxFileSizeInMB) {
      imageDownloader.setMaxFileSize(maxFileSizeInMB * 1024 * 1024);
    }

    if (timeoutInSeconds) {
      imageDownloader.setDownloadTimeout(timeoutInSeconds * 1000);
    }

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      settings: {
        maxFileSizeInMB: imageDownloader.maxFileSize / (1024 * 1024),
        timeoutInSeconds: imageDownloader.downloadTimeout / 1000,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
