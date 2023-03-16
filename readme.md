# Pure Image Compression|Conversion|Caching Server

This node server allows to serve image files and resize them on the fly when requested. To fetch an image in a certain resolution and format just add ```_[width]x[height]``` to the requested filename and add the file extension you need.

## Features

- Serve static images
- Convert and resize on the fly
- Cache generated file-formats for faster, later use

## API Reference

#### Get an image

```http
  GET /img/${filename}_${width}x${height}.${format}
```

| Parameter  | Type             | Description                                                                                   |
| :--------- | :--------------- | :-------------------------------------------------------------------------------------------- |
| `filename` | `string`         | **Required**. The path of the requested File, relative to /images, without the file extension |
| `width`    | `number`         | The new width of the requested Image                                                          |
| `height`   | `number`         | The new height of the requested Image                                                         |
| `format`   | `jpg\|png\|webp` | The (new) format (file extension) of the requested Image (WIP)                                |

## Installation

```bash
  git clone url
  cd node-pics
  npm install
```
