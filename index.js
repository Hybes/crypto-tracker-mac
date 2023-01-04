const { app, Tray, Menu, BrowserWindow, nativeImage, globalShortcut, ipcMain} = require('electron')

const settings = require('electron-settings')
const path = require('path')
const axios = require('axios')

let tray = null
let isQuiting = false
let configWindow = null

const loadConfig = async () => {
  return await settings.get()
}
const saveConfig = async (_, config) => {
  await settings.set(config)
}
const exitConfig = async () => {
  if (configWindow)
      configWindow.close()
}
const openConfig = () => {
  if (!configWindow) {
      configWindow = new BrowserWindow({
          width: 700,
          height: 340,
          autoHideMenuBar: true,
          title: 'Configuration',
          webPreferences: {
              preload: path.join(__dirname, 'scripts/config.preload.js'),
              sandbox: false
          },
          icon: nativeImage.createFromPath('assets/trayWin.png')
      })
      
      configWindow.on('close', (event) => {
          if (!isQuiting) {
              event.preventDefault()
              configWindow.hide()
          }
      })

      configWindow.loadFile('views/config.html')
      
      // globalShortcut.register('CmdOrCtrl+D', () =>
      //     configWindow.webContents.openDevTools()
      // )
  }
  else {
      configWindow.show()
  }
}
const exitApp = () => {
  app.quit()
}
const updateTrayTitle = async () => {
  try {
    const options = {
      headers: {
        'accept': 'application/json'
      }
    }
    const FULL_URL = `https://public-api.birdeye.so/public/price?address=${(await settings.get('tokenAddr'))}`    
    const res = await axios.get(FULL_URL)
    tray.setTitle(`${res.data.data.value}`)
  } catch (error) {
    console.error(error)
    tray.setTitle('SOL Crypto Tracker')
  }
}
app.whenReady().then(async () => {

  app.on('before-quit', () => {
      isQuiting = true
  })

  ipcMain.handle('config:save', saveConfig)
  ipcMain.handle('config:load', loadConfig)
  ipcMain.handle('config:exit', exitConfig)

  app.setAppUserModelId('SOL Crypto Tracker')

  const contextMenu = Menu.buildFromTemplate([
      {
          label: 'Settings',
          type: 'normal',
          click: openConfig
      },
      {
          label: 'Exit',
          type: 'normal',
          click: exitApp
      }
  ])

  let icon = null
  
  if (process.platform === 'darwin') {
      icon = nativeImage.createFromPath('assets/trayMacTemplate.png')
      tray = new Tray(icon)
      app.dock.hide()
      tray.setTitle('SOL Crypto Tracker')
  }
  else {
      icon = nativeImage.createFromPath('assets/trayWin.png')
      tray = new Tray(icon)
      tray.setTitle('SOL Crypto Tracker')
  }

  tray.setContextMenu(contextMenu)
  tray.setToolTip('SOL Crypto Tracker')  
  tray.setTitle('SOL Crypto Tracker')

  // Set the initial tray title
  updateTrayTitle()

  // Update the tray title every X seconds
  setInterval(updateTrayTitle, 5000)

});