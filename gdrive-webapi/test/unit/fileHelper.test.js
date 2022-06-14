import { describe, it, expect, jest } from '@jest/globals'
import fs from 'fs'
import FileHelper from '../../src/fileHelper';
import Routes from '../../src/routes';

describe('#FileHelper test suit', () => {
  describe('getFileStatus', () => {
    it('should return file statuses in correct format', async () => {
      const statMock = {
        dev: 16777232,
        mode: 33188,
        nlink: 1,
        uid: 501,
        gid: 20,
        rdev: 0,
        blksize: 4096,
        ino: 11642151,
        size: 27652,
        blocks: 56,
        atimeMs: 1655159404249.016,
        mtimeMs: 1655159395383.6055,
        ctimeMs: 1655159402201.8628,
        birthtimeMs: 1655159395382.2402,
        atime: "2022-06-13T22:30:04.249Z",
        mtime: "2022-06-13T22:29:55.384Z",
        ctime: "2022-06-13T22:30:02.202Z",
        birthtime: "2022-06-13T22:29:55.382Z"
      }

      const mockUser = 'anaalicefig'
      process.env.USER = mockUser
      const filename = "file.png"

      jest.spyOn(fs.promises, fs.promises.readdir.name)
        .mockResolvedValue([filename])

      jest.spyOn(fs.promises, fs.promises.stat.name)
        .mockResolvedValue(statMock)

      const result = await FileHelper.getFilesStatus("/tmp")
      const expectedResult = [
        {
          size: '27.7 kB',
          lastModified: statMock.birthtime,
          owner: mockUser,
          file: filename
        }
      ]

      expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${filename}`)
      expect(result).toMatchObject(expectedResult)
    });
  });
})
