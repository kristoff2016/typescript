import * as gm from 'gm';
import { Context } from 'koa';
import { extension } from 'mime-types';
import * as path from 'path';
import { Controller, Ctx, Post, UploadedFile } from 'routing-controllers';
import * as uuid from 'uuid/v4';

const multer = require('koa-multer');

const supportedFileTypes = [ 'image/jpeg', 'image/png', 'image/gif' ];
function UnsupportedFileTypeError(message: any) {
  message.name = 'UnsupportedFileTypeError';
  message.message = message || 'Unsupported file type';
  message.code = 'UNSUPPORTED_FILE_TYPE';
  message.stack = new Error().stack;
}
UnsupportedFileTypeError.prototype = Object.create(Error.prototype);
UnsupportedFileTypeError.prototype.constructor = UnsupportedFileTypeError;

export const fileUploadOptions = {
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => cb(null, './public/images'),
    filename: (req: any, file: any, cb: any) => cb(null, `${uuid().replace(/-/g, '')}.${extension(file.mimetype)}`)
  }),
  fileFilter: (req: any, file: any, cb: any, error: any) =>
    supportedFileTypes.join(file.mimetype) ? cb(null, true) : cb(UnsupportedFileTypeError(error)),
  limits: {
    fieldNameSize: 255,
    fileSize: 1024 * 1024 * 2
  }
};

@Controller('/uploads')
export class UploadController {
  @Post('/image')
  async upload(
    @Ctx() ctx: Context,
    @UploadedFile('file', { options: fileUploadOptions })
    file: any
  ) {
    console.log(file);
    const photoSize = {
      SMALL: {
        WIDTH: 340,
        HEIGHT: 159
      },
      MEDIUM: {
        WIDTH: 512,
        HEIGHT: 240
      },
      LARGE: {
        WIDTH: 1024,
        HEIGHT: 480
      }
    };
    const imageFolder = path.dirname(file.path);
    const large = path.join(imageFolder, `${uuid()}_large.png`),
      medium = path.join(imageFolder, `${uuid()}_medium.png`),
      small = path.join(imageFolder, `${uuid()}_small.png`);
    await Promise.all([
      gm(file.path)
        .resize(photoSize.SMALL.WIDTH, photoSize.SMALL.HEIGHT)
        .quality(90)
        .write(small, function(write, err) {
          // if (!err) return (small = file.path.replace('.', '_s.'));
          return;
        }),
      gm(file.path)
        .resize(photoSize.MEDIUM.WIDTH, photoSize.MEDIUM.HEIGHT)
        .quality(90)
        .write(medium, function(write, err) {
          // if (!err) return (medium = file.path.replace('.', '_m.'));
          return;
        }),
      gm(file.path)
        .resize(photoSize.LARGE.WIDTH, photoSize.LARGE.HEIGHT)
        .quality(90)
        .write(large, function(write, err) {
          // if (!err) return (large = file.path.replace('.', '_l.'));
          return;
        })
    ]);
    // fs.unlinkSync(file.path);
    return {
      mimetype: file.mimetype,
      path: {
        large,
        medium,
        small
      }
    };
  }
}
