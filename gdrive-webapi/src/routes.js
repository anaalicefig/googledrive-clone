import FileHelper from './fileHelper';
import { logger } from './logger.js'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DEFAULT_DOWNLOADS_FOLDER = resolve(__dirname, '../', 'downloads')

export default class Routes {
  io

  constructor(downloadsFolder = DEFAULT_DOWNLOADS_FOLDER) {
    this.downloadsFolder = downloadsFolder
    this.fileHelper = FileHelper
  }

  setSocketInstance(io) {
    this.io = io
  }

  async defaultRoute(request, response) {
    response.end('ok')
  }

  async options(request, response) {
    response.writeHead(204)
    response.end('ok')
  }

  async get(request, response) {
    const files = await this.fileHelper.getFilesStatus(this.downloadsFolder)

    response.writeHead(200)
    response.end(JSON.stringify(files))
  }

  async post(request, response) {
    logger.info('post')
    response.end()
  }

  handler(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*')
    const chosen = this[request.method.toLowerCase()] || this.defaultRoute

    return chosen.apply(this, [request, response])
  }
}