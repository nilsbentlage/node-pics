# Pure Image Compression|Conversion|Caching Server

A high-performance Node.js image processing server that dynamically resizes, converts, and serves images on-demand. Built with Sharp.js for lightning-fast image transformations and intelligent caching to minimize processing overhead. Perfect for modern web applications that need responsive images without the complexity of pre-generating multiple sizes.

---

## Features

- Serve static images
- Convert and resize on the fly
- Cache generated file-formats for faster, later use
- Images will always fill the dimensions in cover mode (default)

## Usage

- Put some image-files into the mounted image-directory (you can use subfolders if you want to)
- Go to [YOUR_HOST]:[YOUR_PORT]/[my-filename]\_[width]x[height].[format] and get your resized image
- See the mounted (optional) .cache-directory, that's where your cached image files live

## Testing

- There is an example image (cat.jpg) in the images-directory
- Request the cat.jpg in different sizes and file-formats to see the results
- Check the /health-endpoint to see some stats, like a growing cache-size

---

## API Reference

### Get an image

```http
  GET /[filename]_[width]x[height].[format]?mode=[fillMode]
```

| Parameter  | Type                                    | Description                                                                                   |
| :--------- | :-------------------------------------- | :-------------------------------------------------------------------------------------------- |
| `filename` | `string`                                | **Required**. The path of the requested File, relative to /images, without the file extension |
| `width`    | `number`                                | The new width of the requested Image                                                          |
| `height`   | `number`                                | The new height of the requested Image                                                         |
| `format`   | `jpg\|png\|webp`                        | The (new) format (file extension) of the requested Image                                      |
| `mode`     | `cover\|contain\|fill\|inside\|outside` | **Optional**. How the image should be resized to fit the dimensions (default: cover)          |

### Clear the cache

```http
  DELETE /clear
```

**Headers:**
| Header | Value | Description |
| :-------- | :------- | :----------------------------------------- |
| `Authorization` | `Bearer <token>` | **Required**. Bearer token to authenticate cache clearing |

**Example:**

```bash
curl -X DELETE -H "Authorization: Bearer your-secret-token" http://localhost:3000/clear
```

### Health Check

```http
  GET /health
```

Returns a JSON object with the following properties:

| Property       | Type     | Description                                          |
| :------------- | :------- | :--------------------------------------------------- |
| `status`       | `string` | The status of the service ("healthy" or "unhealthy") |
| `timestamp`    | `string` | The timestamp of the response                        |
| `uptime`       | `number` | The uptime of the service in seconds                 |
| `filesInCache` | `number` | The number of files in the cache                     |
| `cacheSize`    | `string` | The readable size of the cache                       |

### Help & Documentation

```http
  GET /
```

Returns this README as a formatted HTML page. Perfect for quick reference when the service is running!

---

## Installation

### Setup

```bash
# Clone the repository
git clone https://github.com/nilsbentlage/node-pics.git
cd node-pics

# Configure environment variables
cp .env.example .env
# Edit .env with your preferred settings

# Build the Docker image
docker build -t node-pics .
```

### Run the container

**Basic usage (ephemeral cache):**

```bash
docker run -d -p 3000:3000 --name node-pics \
  --volume ./images:/app/images \
  node-pics
```

**With persistent cache:**

```bash
docker run -d -p 3000:3000 --name node-pics \
  --volume ./images:/app/images \
  --volume ./cache:/app/.cache \
  node-pics
```

**Production example with environment variables:**

```bash
docker run -d -p 3000:3000 --name node-pics \
  --volume ./images:/app/images \
  --volume ./cache:/app/.cache \
  --env-file .env \
  node-pics
```

**Using Docker Compose (recommended):**

```bash
# Copy and configure environment variables
cp .env.example .env
# Edit .env file with your settings
docker-compose up -d
```

---

## Clear the cache

**Via API (recommended):**

```bash
curl -X DELETE -H "Authorization: Bearer your-secret-token" http://localhost:3000/clear
```

**Via Docker exec:**

```bash
docker exec node-pics npm run clear
```