# Image Downloader - Testing Guide

This document provides comprehensive testing procedures for the Image Downloader module.

## Setup for Testing

### Prerequisites
- Node.js and npm installed
- Running MongoDB instance
- Valid JWT tokens for testing authentication
- Dependencies installed: `npm install`

## Unit Tests

### Test 1: URL Validation

Test that the downloader properly validates URLs.

```javascript
const imageDownloader = require('./server/utils/imageDownloader');

// Valid URLs
console.log(imageDownloader.isValidUrl('https://example.com/image.jpg')); // true
console.log(imageDownloader.isValidUrl('http://example.com/image.jpg')); // true
console.log(imageDownloader.isValidUrl('https://example.com/image.png?query=1')); // true

// Invalid URLs
console.log(imageDownloader.isValidUrl('not-a-url')); // false
console.log(imageDownloader.isValidUrl('htp://example.com')); // false
console.log(imageDownloader.isValidUrl('')); // false
```

### Test 2: MIME Type Validation

Test that only valid image MIME types are accepted.

```javascript
const imageDownloader = require('./server/utils/imageDownloader');

// Valid MIME types
console.log(imageDownloader.validateMimeType('image/jpeg')); // true
console.log(imageDownloader.validateMimeType('image/png')); // true
console.log(imageDownloader.validateMimeType('image/gif')); // true
console.log(imageDownloader.validateMimeType('image/webp')); // true

// Invalid MIME types
console.log(imageDownloader.validateMimeType('text/html')); // false
console.log(imageDownloader.validateMimeType('application/json')); // false
console.log(imageDownloader.validateMimeType('application/pdf')); // false
console.log(imageDownloader.validateMimeType('video/mp4')); // false
```

### Test 3: File Extension Mapping

Test that file extensions are correctly mapped from MIME types.

```javascript
const imageDownloader = require('./server/utils/imageDownloader');

console.log(imageDownloader.getFileExtensionFromMimeType('image/jpeg')); // .jpg
console.log(imageDownloader.getFileExtensionFromMimeType('image/png')); // .png
console.log(imageDownloader.getFileExtensionFromMimeType('image/gif')); // .gif
console.log(imageDownloader.getFileExtensionFromMimeType('image/webp')); // .webp
console.log(imageDownloader.getFileExtensionFromMimeType('unknown/type')); // .jpg (default)
```

### Test 4: Configuration Methods

Test that settings can be properly configured.

```javascript
const imageDownloader = require('./server/utils/imageDownloader');

// Test max file size setting
imageDownloader.setMaxFileSize(10 * 1024 * 1024); // 10 MB
console.log(imageDownloader.maxFileSize); // 10485760

// Test timeout setting
imageDownloader.setDownloadTimeout(60000); // 60 seconds
console.log(imageDownloader.downloadTimeout); // 60000

// Reset to defaults
imageDownloader.setMaxFileSize(5 * 1024 * 1024); // 5 MB
imageDownloader.setDownloadTimeout(30000); // 30 seconds
```

## API Integration Tests

### Test Setup

Get a valid JWT token first:

```bash
# Register a new user with role 'seller'
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123",
    "role": "seller",
    "country": "US"
  }'

# Login to get JWT token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Response will contain: { "token": "eyJhbGciOiJIUzI1NiIs..." }
export TOKEN="eyJhbGciOiJIUzI1NiIs..."
```

### Test 5: Download Single Image

Test downloading a single image from a public URL.

```bash
curl -X POST http://localhost:5000/api/images/download \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://via.placeholder.com/300",
    "filename": "test-image.png"
  }'

# Expected response:
# {
#   "success": true,
#   "data": {
#     "filename": "test-image.png",
#     "filepath": "...",
#     "url": "/uploads/images/test-image.png",
#     "size": 1234,
#     "mimeType": "image/png"
#   }
# }
```

### Test 6: Download Invalid URL

Test error handling for invalid URLs.

```bash
curl -X POST http://localhost:5000/api/images/download \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "not-a-valid-url"
  }'

# Expected response (400 Bad Request):
# {
#   "success": false,
#   "message": "Failed to download image: Invalid URL format"
# }
```

### Test 7: Missing URL Parameter

Test error handling for missing required parameters.

```bash
curl -X POST http://localhost:5000/api/images/download \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'

# Expected response:
# {
#   "success": false,
#   "message": "Image URL is required"
# }
```

### Test 8: Download Multiple Images

Test batch downloading multiple images.

```bash
curl -X POST http://localhost:5000/api/images/download-multiple \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://via.placeholder.com/300",
      "https://via.placeholder.com/400",
      "https://via.placeholder.com/500"
    ]
  }'

# Expected response:
# {
#   "success": true,
#   "data": {
#     "successful": [
#       { ... },
#       { ... },
#       { ... }
#     ],
#     "failed": []
#   }
# }
```

### Test 9: Multiple Downloads with Failures

Test batch download with some failed URLs.

```bash
curl -X POST http://localhost:5000/api/images/download-multiple \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://via.placeholder.com/300",
      "https://example.com/non-existent-image.jpg",
      "not-a-url"
    ]
  }'

# Expected response will have successful and failed entries:
# {
#   "success": true,
#   "data": {
#     "successful": [ ... ],
#     "failed": [
#       { "url": "...", "error": "..." },
#       { "url": "...", "error": "..." }
#     ]
#   }
# }
```

### Test 10: List Downloaded Images

Test listing all downloaded images.

```bash
curl -X GET http://localhost:5000/api/images/list \
  -H "Authorization: Bearer $TOKEN"

# Expected response:
# {
#   "success": true,
#   "count": 3,
#   "data": [
#     {
#       "filename": "test-image.png",
#       "url": "/uploads/images/test-image.png",
#       "path": "...",
#       "size": 1234
#     }
#   ]
# }
```

### Test 11: Delete Image

Test deleting a downloaded image.

```bash
curl -X DELETE http://localhost:5000/api/images/test-image.png \
  -H "Authorization: Bearer $TOKEN"

# Expected response:
# {
#   "success": true,
#   "message": "Image test-image.png deleted successfully"
# }
```

### Test 12: Delete Non-Existent Image

Test error handling for deleting a non-existent image.

```bash
curl -X DELETE http://localhost:5000/api/images/non-existent.png \
  -H "Authorization: Bearer $TOKEN"

# Expected response:
# {
#   "success": false,
#   "message": "Image non-existent.png not found"
# }
```

### Test 13: Update Settings (Admin Only)

Test updating downloader settings as admin.

```bash
# First get admin token
# Then call the settings endpoint

curl -X PUT http://localhost:5000/api/images/settings \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "maxFileSizeInMB": 10,
    "timeoutInSeconds": 45
  }'

# Expected response:
# {
#   "success": true,
#   "message": "Settings updated successfully",
#   "settings": {
#     "maxFileSizeInMB": 10,
#     "timeoutInSeconds": 45
#   }
# }
```

### Test 14: Settings Endpoint Without Admin Role

Test that non-admin users cannot update settings.

```bash
curl -X PUT http://localhost:5000/api/images/settings \
  -H "Authorization: Bearer $SELLER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "maxFileSizeInMB": 10
  }'

# Expected response (403 Forbidden):
# {
#   "success": false,
#   "message": "User role 'seller' is not authorized to access this route"
# }
```

### Test 15: Unauthenticated Request

Test that unauthenticated requests are rejected.

```bash
curl -X GET http://localhost:5000/api/images/list

# Expected response (401 Unauthorized):
# {
#   "success": false,
#   "message": "Not authorized to access this route"
# }
```

### Test 16: Invalid Token

Test error handling for invalid JWT tokens.

```bash
curl -X GET http://localhost:5000/api/images/list \
  -H "Authorization: Bearer invalid-token"

# Expected response (401 Unauthorized):
# {
#   "success": false,
#   "message": "Not authorized to access this route"
# }
```

## Performance Tests

### Test 17: Download Large Number of Images

Test performance with multiple concurrent downloads.

```javascript
const axios = require('axios');

const token = 'your-token';
const urls = [
  'https://via.placeholder.com/300',
  'https://via.placeholder.com/400',
  'https://via.placeholder.com/500',
  // Add more URLs as needed
];

const startTime = Date.now();

axios.post('http://localhost:5000/api/images/download-multiple', { urls }, {
  headers: { 'Authorization': `Bearer ${token}` }
}).then(response => {
  const endTime = Date.now();
  console.log(`Downloaded ${response.data.data.successful.length} images in ${endTime - startTime}ms`);
}).catch(error => {
  console.error('Error:', error.response.data);
});
```

### Test 18: Memory Usage

Monitor memory usage during large file operations.

```bash
# Start the server with memory monitoring
node --max-old-space-size=512 server/index.js

# In another terminal, monitor memory:
watch -n 1 'ps aux | grep "node server/index.js" | grep -v grep'
```

## Security Tests

### Test 19: Path Traversal Protection

Test that path traversal attacks are prevented.

```bash
curl -X DELETE http://localhost:5000/api/images/../../../etc/passwd \
  -H "Authorization: Bearer $TOKEN"

# Expected response: Should fail safely without exposing system files
```

### Test 20: File Type Validation

Test that non-image files are rejected.

```bash
# Try to create a test.txt file and upload it
# This would require modifying the test setup

# The downloader should reject it because it's not an image MIME type
```

## Edge Cases

### Test 21: Empty URLs Array

Test handling of empty URLs array.

```bash
curl -X POST http://localhost:5000/api/images/download-multiple \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "urls": [] }'

# Expected response (400 Bad Request):
# {
#   "success": false,
#   "message": "Array of image URLs is required"
# }
```

### Test 22: Timeout Handling

Test that downloads timeout appropriately.

```bash
# Create a slow server endpoint that takes longer than timeout
# Configure a short timeout
curl -X POST http://localhost:5000/api/images/download \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "http://slow-server.example.com/image.jpg",
    "timeout": 100
  }'

# Should timeout and return error
```

## Cleanup

After running tests, verify that:
1. Images are properly stored in `server/uploads/images/`
2. Unused test images can be deleted
3. Database is in clean state

```bash
# View downloaded images
ls -la server/uploads/images/

# Clean up test images
rm server/uploads/images/test-*

# Verify directory is clean
ls -la server/uploads/images/
```

## Known Limitations

1. **File Size**: Maximum file size is 5 MB by default (configurable by admin)
2. **MIME Types**: Only image formats are accepted (JPEG, PNG, GIF, WebP)
3. **Timeout**: Default timeout is 30 seconds (configurable)
4. **Concurrent Downloads**: Limited by system resources and Node.js event loop
5. **Storage**: No automatic cleanup of old images

## Troubleshooting

If tests fail, check:
1. MongoDB is running and connected
2. Server is running on correct port (5000)
3. JWT token is valid and not expired
4. User has correct role (seller or admin)
5. Network connectivity to image URLs
6. Sufficient disk space for uploads
7. File permissions in uploads directory

## Summary

This testing guide covers:
- ✓ URL validation
- ✓ MIME type validation
- ✓ Configuration management
- ✓ Single and batch downloads
- ✓ Authentication and authorization
- ✓ Error handling
- ✓ Security features
- ✓ Edge cases
- ✓ Performance considerations
