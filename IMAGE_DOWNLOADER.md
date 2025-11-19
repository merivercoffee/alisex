# Image Downloader Module

A robust and efficient image downloader utility for the GlobalShop e-commerce platform. Designed to securely download, validate, and manage product images from external URLs.

## Features

- **Secure Image Download**: Download images from URLs with validation
- **Multiple Simultaneous Downloads**: Batch download multiple images at once
- **File Validation**: 
  - MIME type validation (JPEG, PNG, GIF, WebP)
  - File size constraints
  - URL format validation
- **Image Management**: List, delete, and manage downloaded images
- **Configurable Settings**: Adjust timeouts and file size limits
- **Error Handling**: Comprehensive error handling and user-friendly messages
- **Role-based Access**: Integration with auth middleware for seller/admin roles

## Installation

The image downloader is automatically included in the project. Dependencies are listed in `package.json`:

```bash
npm install
```

Required dependencies:
- `axios` - HTTP client for downloading images
- `uuid` - Generate unique filenames
- `express` - Web framework

## Configuration

### Environment Variables

Add these optional variables to your `.env` file:

```
# Image Downloader Settings (optional - have defaults)
IMAGE_MAX_FILE_SIZE=5242880  # 5MB in bytes
IMAGE_DOWNLOAD_TIMEOUT=30000  # 30 seconds in milliseconds
IMAGE_UPLOAD_DIR=/uploads/images
```

### Default Settings

- **Max File Size**: 5 MB
- **Download Timeout**: 30 seconds
- **Allowed MIME Types**: image/jpeg, image/png, image/gif, image/webp
- **Upload Directory**: `server/uploads/images`

## API Endpoints

### 1. Download Single Image

**Endpoint:** `POST /api/images/download`

**Authentication:** Required (Seller or Admin)

**Request Body:**
```json
{
  "url": "https://example.com/product-image.jpg",
  "filename": "optional-custom-filename.jpg",
  "validateSize": true,
  "timeout": 30000,
  "headers": {}
}
```

**Parameters:**
- `url` (required): The URL of the image to download
- `filename` (optional): Custom filename for the saved image. If not provided, a UUID will be generated
- `validateSize` (optional, default: true): Validate file size before and after download
- `timeout` (optional, default: 30000): Request timeout in milliseconds
- `headers` (optional): Additional headers to send with the request

**Response:**
```json
{
  "success": true,
  "data": {
    "filename": "550e8400-e29b-41d4-a716-446655440000.jpg",
    "filepath": "/home/project/server/uploads/images/550e8400-e29b-41d4-a716-446655440000.jpg",
    "url": "/uploads/images/550e8400-e29b-41d4-a716-446655440000.jpg",
    "size": 125432,
    "mimeType": "image/jpeg"
  }
}
```

### 2. Download Multiple Images

**Endpoint:** `POST /api/images/download-multiple`

**Authentication:** Required (Seller or Admin)

**Request Body:**
```json
{
  "urls": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.png",
    "https://example.com/image3.jpg"
  ],
  "validateSize": true,
  "timeout": 30000,
  "headers": {}
}
```

**Parameters:**
- `urls` (required): Array of image URLs to download
- `validateSize` (optional, default: true): Validate file sizes
- `timeout` (optional): Request timeout in milliseconds
- `headers` (optional): Additional headers for requests

**Response:**
```json
{
  "success": true,
  "data": {
    "successful": [
      {
        "filename": "550e8400-e29b-41d4-a716-446655440000.jpg",
        "filepath": "/home/project/server/uploads/images/550e8400-e29b-41d4-a716-446655440000.jpg",
        "url": "/uploads/images/550e8400-e29b-41d4-a716-446655440000.jpg",
        "size": 125432,
        "mimeType": "image/jpeg"
      }
    ],
    "failed": [
      {
        "url": "https://example.com/invalid-image.jpg",
        "error": "Invalid image type: application/json. Allowed types: image/jpeg, image/png, image/gif, image/webp"
      }
    ]
  }
}
```

### 3. List Downloaded Images

**Endpoint:** `GET /api/images/list`

**Authentication:** Required (Seller or Admin)

**Query Parameters:** None

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "filename": "550e8400-e29b-41d4-a716-446655440000.jpg",
      "url": "/uploads/images/550e8400-e29b-41d4-a716-446655440000.jpg",
      "path": "/home/project/server/uploads/images/550e8400-e29b-41d4-a716-446655440000.jpg",
      "size": 125432
    }
  ]
}
```

### 4. Delete Image

**Endpoint:** `DELETE /api/images/:filename`

**Authentication:** Required (Seller or Admin)

**URL Parameters:**
- `filename`: The filename of the image to delete

**Response:**
```json
{
  "success": true,
  "message": "Image 550e8400-e29b-41d4-a716-446655440000.jpg deleted successfully"
}
```

### 5. Update Settings

**Endpoint:** `PUT /api/images/settings`

**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "maxFileSizeInMB": 10,
  "timeoutInSeconds": 45
}
```

**Parameters:**
- `maxFileSizeInMB` (optional): Maximum file size in megabytes
- `timeoutInSeconds` (optional): Download timeout in seconds

**Response:**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "settings": {
    "maxFileSizeInMB": 10,
    "timeoutInSeconds": 45
  }
}
```

## Usage Examples

### JavaScript/Node.js Client

```javascript
const axios = require('axios');

const token = 'your-jwt-token';
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Download single image
async function downloadImage() {
  try {
    const response = await apiClient.post('/images/download', {
      url: 'https://example.com/product.jpg',
      filename: 'my-product-image.jpg'
    });
    console.log('Download successful:', response.data);
  } catch (error) {
    console.error('Download failed:', error.response.data);
  }
}

// Download multiple images
async function downloadMultiple() {
  try {
    const response = await apiClient.post('/images/download-multiple', {
      urls: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg'
      ]
    });
    console.log('Downloads completed:', response.data);
  } catch (error) {
    console.error('Download batch failed:', error.response.data);
  }
}

// List images
async function listImages() {
  try {
    const response = await apiClient.get('/images/list');
    console.log('Downloaded images:', response.data.data);
  } catch (error) {
    console.error('List failed:', error.response.data);
  }
}

// Delete image
async function deleteImage(filename) {
  try {
    const response = await apiClient.delete(`/images/${filename}`);
    console.log('Delete result:', response.data);
  } catch (error) {
    console.error('Delete failed:', error.response.data);
  }
}
```

### cURL Examples

```bash
# Download single image
curl -X POST http://localhost:5000/api/images/download \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/image.jpg",
    "filename": "my-image.jpg"
  }'

# Download multiple images
curl -X POST http://localhost:5000/api/images/download-multiple \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ]
  }'

# List downloaded images
curl -X GET http://localhost:5000/api/images/list \
  -H "Authorization: Bearer YOUR_TOKEN"

# Delete image
curl -X DELETE http://localhost:5000/api/images/550e8400-e29b-41d4-a716-446655440000.jpg \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update settings (admin only)
curl -X PUT http://localhost:5000/api/images/settings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "maxFileSizeInMB": 10,
    "timeoutInSeconds": 45
  }'
```

## Security Considerations

1. **Authentication**: All endpoints require valid JWT authentication
2. **Authorization**: Only sellers and admins can download/manage images
3. **File Validation**: 
   - MIME type checking prevents non-image files
   - File size limits prevent storage exhaustion
   - URL validation prevents malformed requests
4. **Path Traversal Prevention**: Filenames are validated to prevent directory traversal attacks
5. **User-Agent Spoofing**: Custom user agent is set for better compatibility with CDNs

## Error Handling

The module provides comprehensive error messages:

```json
{
  "success": false,
  "message": "Failed to download image: Invalid URL format"
}
```

Common errors:
- **Invalid URL format** - URL is malformed
- **Invalid image type** - File is not an accepted image format
- **File size exceeds maximum** - Downloaded file is too large
- **Failed to download image** - Network or server error
- **Invalid file path** - Path traversal attempt detected
- **Image file not found** - Image doesn't exist

## File Structure

```
server/
├── utils/
│   └── imageDownloader.js      # Core image downloader module
├── routes/
│   └── images.js               # API routes for image operations
└── uploads/
    └── images/                 # Directory where images are stored
```

## Performance Tips

1. **Batch Operations**: Use `download-multiple` endpoint for downloading many images at once
2. **Custom Timeouts**: Increase timeout for slow connections
3. **File Size Limits**: Adjust based on your storage capacity
4. **Cleanup**: Regularly delete unused images with the delete endpoint

## Troubleshooting

### Images Not Downloading

1. Check network connectivity
2. Verify the source URL is accessible
3. Ensure the URL points to a valid image file
4. Check file size doesn't exceed limit
5. Verify JWT token is valid and user has appropriate role

### Permission Denied Errors

1. Ensure user is authenticated (has valid JWT token)
2. Verify user role is 'seller' or 'admin'
3. Admin-only endpoints require 'admin' role

### Image Not Found Errors

1. Check the exact filename
2. Verify image wasn't already deleted
3. List available images with the list endpoint

## License

MIT License

## Support

For issues or feature requests, please contact: support@globalshop.com
