# Image Downloader - Quick Start Guide

## Overview

The Image Downloader is a secure, role-based image management system for the GlobalShop e-commerce platform. It allows sellers and admins to download product images from URLs, validate them, and manage them efficiently.

## Files Added

```
server/
├── utils/
│   └── imageDownloader.js          # Core image downloader class
├── routes/
│   └── images.js                   # API route handlers
└── examples/
    └── imageDownloaderExample.js   # Usage examples

Documentation/
├── IMAGE_DOWNLOADER.md             # Full API documentation
├── IMAGE_DOWNLOADER_TESTS.md       # Comprehensive testing guide
└── QUICKSTART_IMAGE_DOWNLOADER.md  # This file
```

## Key Features

✓ **Download single or multiple images** from external URLs
✓ **Automatic validation** - MIME types, file sizes, URL formats
✓ **Role-based access** - Sellers and admins only
✓ **Secure storage** - Images saved with UUID filenames
✓ **Image management** - List, delete, and configure settings
✓ **Error handling** - Comprehensive error messages
✓ **Configurable** - Adjust file size limits and timeouts

## Installation

1. **Install dependencies** (uuid already added to package.json):
```bash
npm install
```

2. **Server is automatically configured** - The image routes are already integrated into `server/index.js`

3. **Upload directory will be created automatically** at `server/uploads/images/`

## Basic Usage

### 1. Download an Image

```bash
TOKEN="your-jwt-token"

curl -X POST http://localhost:5000/api/images/download \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/product-image.jpg"
  }'
```

### 2. Download Multiple Images

```bash
curl -X POST http://localhost:5000/api/images/download-multiple \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ]
  }'
```

### 3. List Downloaded Images

```bash
curl -X GET http://localhost:5000/api/images/list \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Delete an Image

```bash
curl -X DELETE http://localhost:5000/api/images/filename.jpg \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Update Settings (Admin Only)

```bash
ADMIN_TOKEN="admin-jwt-token"

curl -X PUT http://localhost:5000/api/images/settings \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "maxFileSizeInMB": 10,
    "timeoutInSeconds": 45
  }'
```

## JavaScript Client Example

```javascript
const axios = require('axios');

const client = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Authorization': `Bearer ${TOKEN}`
  }
});

// Download image
async function downloadImage(url) {
  try {
    const response = await client.post('/images/download', { url });
    console.log('Download successful:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error:', error.response.data.message);
  }
}

// List images
async function listImages() {
  try {
    const response = await client.get('/images/list');
    console.log('Downloaded images:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.error('Error:', error.response.data.message);
  }
}

// Delete image
async function deleteImage(filename) {
  try {
    const response = await client.delete(`/images/${filename}`);
    console.log(response.data.message);
  } catch (error) {
    console.error('Error:', error.response.data.message);
  }
}
```

## Requirements & Validation

### Supported Image Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### Default Limits
- **Max File Size**: 5 MB (configurable by admin)
- **Download Timeout**: 30 seconds (configurable)
- **Supported MIME Types**: image/jpeg, image/png, image/gif, image/webp

### Access Control
| Endpoint | Seller | Admin |
|----------|--------|-------|
| POST /download | ✓ | ✓ |
| POST /download-multiple | ✓ | ✓ |
| GET /list | ✓ | ✓ |
| DELETE /:filename | ✓ | ✓ |
| PUT /settings | ✗ | ✓ |

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "filename": "550e8400-e29b-41d4-a716-446655440000.jpg",
    "filepath": "/path/to/file",
    "url": "/uploads/images/550e8400-e29b-41d4-a716-446655440000.jpg",
    "size": 125432,
    "mimeType": "image/jpeg"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Failed to download image: Invalid URL format"
}
```

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Not authorized to access this route" | Missing/invalid JWT token | Check token is valid and not expired |
| "User role is not authorized" | User is not seller/admin | Use appropriate user account |
| "Invalid URL format" | Malformed URL | Provide valid URL starting with http:// or https:// |
| "Invalid image type" | File is not an image | Ensure URL points to valid image (JPEG, PNG, GIF, WebP) |
| "File size exceeds maximum" | Image too large | File must be under 5MB or adjust limit |
| "Image URL is required" | Missing url parameter | Include "url" in request body |

## Integration with Product Creation

When creating products, you can use downloaded images:

```javascript
// 1. Download images first
const images = await downloadImages(imageUrls);

// 2. Create product with downloaded image URLs
const product = await axios.post('/api/products', {
  name: 'Product Name',
  description: 'Description',
  price: 99.99,
  images: images.map(img => img.url), // Use /uploads/images/... URLs
  category: 'Electronics',
  stock: 100
});
```

## File Structure in Uploads

Downloaded images are stored with UUID filenames:

```
server/uploads/images/
├── 550e8400-e29b-41d4-a716-446655440000.jpg
├── 6ba7b810-9dad-11d1-80b4-00c04fd430c8.png
└── 6ba7b811-9dad-11d1-80b4-00c04fd430c8.gif
```

These can be accessed via URLs like:
```
http://localhost:5000/uploads/images/550e8400-e29b-41d4-a716-446655440000.jpg
```

## Troubleshooting

### Images not downloading?
1. Verify JWT token is valid
2. Check user has 'seller' or 'admin' role
3. Ensure URL is publicly accessible
4. Check network connectivity
5. Verify source image is valid format

### Permission denied?
1. Ensure 'Authorization: Bearer <token>' header is included
2. Verify user role is seller or admin (for settings: admin only)
3. Check token hasn't expired

### Cannot delete image?
1. Verify exact filename (case-sensitive)
2. Check image exists: use GET /list first
3. Ensure proper authorization

## Next Steps

1. **Read the full documentation**: See `IMAGE_DOWNLOADER.md`
2. **Run tests**: See `IMAGE_DOWNLOADER_TESTS.md`
3. **Try examples**: See `server/examples/imageDownloaderExample.js`
4. **Integrate with your app**: Use the JavaScript client examples above

## Support & Documentation

- **Full API Reference**: `IMAGE_DOWNLOADER.md`
- **Test Cases**: `IMAGE_DOWNLOADER_TESTS.md`
- **Code Examples**: `server/examples/imageDownloaderExample.js`
- **Contact**: support@globalshop.com

---

Happy image downloading! 🎉
