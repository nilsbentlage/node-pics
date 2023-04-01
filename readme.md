# Pure Image Compression|Conversion|Caching Server

This node server allows to serve image files and convert and resize them on the fly, when requested. All generated image-files are stored in a cache-directory so you clean it up as often as you want.

## Features

- Serve static images
- Convert and resize on the fly
- Cache generated file-formats for faster, later use
- Images will always fill the dimensions in cover mode

## API Reference

#### Get an image

```http
  GET /${filename}_${width}x${height}.${format}
```

| Parameter  | Type             | Description                                                                                   |
| :--------- | :--------------- | :-------------------------------------------------------------------------------------------- |
| `filename` | `string`         | **Required**. The path of the requested File, relative to /images, without the file extension |
| `width`    | `number`         | The new width of the requested Image                                                          |
| `height`   | `number`         | The new height of the requested Image                                                         |
| `format`   | `jpg\|png\|webp` | The (new) format (file extension) of the requested Image                                      |

## Installation

```bash
  git clone https://github.com/nilsbentlage/node-pics.git
  cd node-pics
  npm install
```

## Usage

- Put some image-files into the image-directory (you can use subfolders if you want to)
- Go to localhost:3000/[my-filename]\_[width]x[height].[format] and get your resized image
- See the .cache-directory, that's where your converted image files live

### Start the node-server

```bash
  npm start
```

### Clear the .cache-directory

```bash
  npm run clear
```
