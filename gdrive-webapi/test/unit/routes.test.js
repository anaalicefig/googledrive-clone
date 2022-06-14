import { describe, it, expect, jest } from '@jest/globals'
import Routes from '../../src/routes';

describe('#Routes test suit', () => {
  const defaultParams = {
    request: {
      headers: {
        'Content-Type':'multpart/form-data'
      },
      method: '',
      body: {}
    },
    response: {
      setHeader: jest.fn(),
      writeHead: jest.fn(),
      end: jest.fn()
    },
    values: () => Object.values(defaultParams)
  }

  describe('#setSocketInstance', () => {
    it('should store io instance', () => {
      const routes = new Routes()

      const ioObj = {
        to: (id) => ioObj,
        emit: (event, message) => {}
      }

      routes.setSocketInstance(ioObj)
      expect(routes.io).toStrictEqual(ioObj)
    })
  });

  describe('#Handler', () => {
    it('should choose default route when given route is non-existent', async () => {
      const routes = new Routes()
      const params = {
        ...defaultParams
      }

      params.request.method = 'none'
      await routes.handler(...params.values())
      expect(params.response.end).toHaveBeenCalledWith('ok')
    })
    it('should set any request with CORS enabled', async () => {
      const routes = new Routes()
      const params = {
        ...defaultParams
      }

      params.request.method = 'none'
      await routes.handler(...params.values())
      expect(params.response.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*')
    })
    it('should return options route when method is OPTIONS', async () => {
      const routes = new Routes()
      const params = {
        ...defaultParams
      }

      params.request.method = 'options'
      await routes.handler(...params.values())
      expect(params.response.writeHead).toHaveBeenCalledWith(204)
      expect(params.response.end).toHaveBeenCalled()
    })
    it('should return get route when method is GET', async () => {
      const routes = new Routes()
      const params = {
        ...defaultParams
      }

      params.request.method = 'GET'
      jest.spyOn(routes, routes.get.name).mockResolvedValue()

      await routes.handler(...params.values())
      expect(routes.get).toHaveBeenCalled()
    })
    it('should return post route when method is POST', async () => {
      const routes = new Routes()
      const params = {
        ...defaultParams
      }

      params.request.method = 'POST'
      jest.spyOn(routes, routes.post.name).mockResolvedValue()

      await routes.handler(...params.values())
      expect(routes.post).toHaveBeenCalled()
    })
  });

  describe('#get', () => {
    it('should list all files downloaded', async () => {
      const routes = new Routes()
      const params = {...defaultParams}
      const fileStatusesMock = [
        {
          size: '27.7 kB',
          lastModified: "2022-06-13T22:29:55.382Z",
          owner: 'anaalicefig',
          file: 'file.txt'
        }
      ]

      jest.spyOn(routes.fileHelper, routes.fileHelper.getFilesStatus.name)
        .mockResolvedValue(fileStatusesMock)

      params.request.method = 'GET'
      await routes.handler(...params.values())

      expect(params.response.writeHead).toBeCalledWith(200)
      expect(params.response.end).toBeCalledWith(JSON.stringify(fileStatusesMock))

    })
  });
})
