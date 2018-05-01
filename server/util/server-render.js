const serialize = require('serialize-javascript')
const ejs = require('ejs')
const bootstrapper = require('react-async-bootstrapper')
const ReactDomServer = require('react-dom/server')
const Helmet = require('react-helmet').default

const SheetsRegistry = require('react-jss').SheetsRegistry
// const create = require('jss').create
// const preset = require('jss-preset-default').default
const createMuiTheme = require('material-ui/styles').createMuiTheme
const createGenerateClassName = require('material-ui/styles').createGenerateClassName
const colors = require('material-ui/colors')


const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  }, {})
}

module.exports = (bundle, template, req, res) => {
  const createStoreMap = bundle.createStoreMap
  const createApp = bundle.default
  const routerContext = {}
  const stores = createStoreMap()
  const user = req.session.user
  if (user) {
    stores.appState.user.isLogin = true
    stores.appState.user.info = user
  }
  const sheetsRegistry = new SheetsRegistry()
  const theme = createMuiTheme({
    palette: {
      primary: colors.blue,
      secondary: colors.pink,
      type: 'light'
    }
  })
  const generateClassName = createGenerateClassName()
  const app = createApp(stores, routerContext, sheetsRegistry, generateClassName, theme, req.url)
  return new Promise((resolve, reject) => {
    bootstrapper(app).then(() => {
      if (routerContext.url) {
        res.status(302).setHeader('Location', routerContext.url)
        res.end()
        return
      }
      const helmet = Helmet.rewind()
      const state = getStoreState(stores)
      const content = ReactDomServer.renderToString(app)
      const html = ejs.render(template, {
        appString: content,
        initialState: serialize(state),
        title: helmet.title.toString(),
        meta: helmet.meta.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString(),
        materialCss: sheetsRegistry.toString()
      })
      res.send(html)
      resolve()
    }).catch(reject)
  })
  // return new Promise((resolve, reject) => {
  //  const createStoreMap = bundle.createStoreMap
  //  const createApp = bundle.default
  //  const routerContext = {}
  //  const stores = createStoreMap()
  //  const sheetsRegistry = new SheetsRegistry()
  //  // const jss = create(preset())
  //  // jss.options.createGenerateClassName = createGenerateClassName
  //  const generateClassName = createGenerateClassName()
  //  const theme = createMuiTheme({
  //    palette: {
  //      primary: colors.pink,
  //      accent: colors.lightBlue,
  //      type: 'light'
  //    },
  //  })
  //  const app = createApp(stores, routerContext, sheetsRegistry, generateClassName, theme, req.url)
  //
  //  bootstrapper(app).then(() => {
  //    if (routerContext.url) {
  //      res.status(302).setHeader('Location', routerContext.url)
  //      res.end()
  //      return
  //    }
  //    const helmet = Helmet.rewind()
  //
  //    const state = getStoreState(stores)
  //    const content = ReactDomServer.renderToString(app)
  //
  //    const html = ejs.render(template, {
  //      appString: content,
  //      initialState: serialize(state),
  //      meta: helmet.meta.toString(),
  //      title: helmet.title.toString(),
  //      style: helmet.style.toString(),
  //      link: helmet.link.toString(),
  //      materialCss: sheetsRegistry.toString()
  //    })
  //    res.send(html)
  //    resolve()
  //  }).catch(reject)
  // })
}
