"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageRequest = void 0;
var ImageRequest = /** @class */ (function () {
    function ImageRequest(filename) {
        var picsRegex = /(\w*)((?:_)((\d{1,4})x(\d{1,4})))?\.([a-z]{1,4})/;
        console.log(filename + JSON.stringify(filename.match(picsRegex)));
    }
    return ImageRequest;
}());
exports.ImageRequest = ImageRequest;
new ImageRequest('test_300x300.jpg');
new ImageRequest('test23123.jpg');
