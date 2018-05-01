import axios from 'axios'


const baseUrl = process.env.API_BASE || ''

const parseUrl = (url, params) => {
  params = params || {}
  const str = Object.keys(params).reduce((result, key) => {
    result += `${key}=${params[key]}&` // eslint-disable-line
    return result
  }, '')
  return `${baseUrl}/api/${url}?${str.substr(0, str.length - 1)}`
}

export const get = (url, params) => { // eslint-disable-line
  return new Promise((resolve, reject) => {
    axios.get(parseUrl(url, params))
      .then((resp) => {
        const { data } = resp
        if (data && data.success === true) {
          resolve(data)
        } else {
          reject(data)
        }
      }).catch(reject)
  })
}

export const post = (url, params, datas) => { // eslint-disable-line
  return new Promise((resolve, reject) => {
    axios.post(parseUrl(url, params), datas)
      .then((resp) => {
        const { data } = resp
        if (data && data.success === true) {
          resolve(data)
        } else {
          reject(data)
        }
      }).catch(reject)
  })
}
