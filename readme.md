# Pure Image Compression|Conversion|Caching Server

This node server allows to serve image files and convert and resize them on the fly, when requested. All generated image-files are stored in a cache-directory so you clean it up as often as you want.

## Features

- Serve static images
- Convert and resize on the fly
- Cache generated file-formats for faster, later use
- Images will always fill the dimensions in cover mode

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

### Clear the cache

**Via API (recommended):**

```bash
curl -X DELETE -H "Authorization: Bearer your-secret-token" http://localhost:3000/clearCache
```

**Via Docker exec:**

```bash
docker exec node-pics npm run clear
```

## Usage

- Put some image-files into the image-directory (you can use subfolders if you want to)
- Go to [YOUR_HOST]:[YOUR_PORT]/[my-filename]\_[width]x[height].[format] and get your resized image
- See the .cache-directory, that's where your cached image files live

### Start the node-server

```bash
  npm start
```

### Clear the .cache-directory

```bash
  npm run clear
```

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
  DELETE /clearCache
```

**Headers:**
| Header | Value | Description |
| :-------- | :------- | :----------------------------------------- |
| `Authorization` | `Bearer <token>` | **Required**. Bearer token to authenticate cache clearing |

**Example:**

```bash
curl -X DELETE -H "Authorization: Bearer your-secret-token" http://localhost:3000/clearCache
```

### Health Check

```http
  GET /health
```
