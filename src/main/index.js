'use strict'

import { app, BrowserWindow, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import logger from 'electron-log'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
      defaultEncoding: 'UTF-8'
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

autoUpdater.channel = 'latest'
autoUpdater.allowDowngrade = false

autoUpdater.logger = logger
autoUpdater.logger.transports.file.level = 'silly'
autoUpdater.logger.transports.file.appName = 'private repo'
autoUpdater.autoDownload = true

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    message: 'update Downloaded !!'
  })
})

autoUpdater.on('checking-for-update', () => {
  dialog.showMessageBox({
    message: 'CHECKING FOR UPDATES !!'
  })
})

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    message: ' update-available !!'
  })
})

autoUpdater.on('error', (error) => {
  autoUpdater.logger.debug(error)
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
