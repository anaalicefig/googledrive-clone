import fs from 'fs/promises'
import prettyBytes from 'pretty-bytes'

export default class FileHelper {
  static async getFilesStatus(downloadsFolder) {
    const currentFiles = await fs.readdir(downloadsFolder)
    const statuses = await Promise.all(
      currentFiles.map(file => fs.stat(`${downloadsFolder}/${file}`))
    )

    const fileStatuses = []

    for (const fileIndex in currentFiles) {
      const { birthtime, size } = statuses[fileIndex]
      fileStatuses.push({
        lastModified: birthtime,
        size: prettyBytes(size),
        file: currentFiles[fileIndex],
        owner: process.env.USER
      })
    }

    return fileStatuses
  }
}