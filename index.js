const { app, Tray, Menu, BrowserWindow, nativeImage, globalShortcut, ipcMain} = require('electron')

const settings = require('electron-settings')
const path = require('path')
const axios = require('axios')

let tray = null
let isQuiting = false
let configWindow = null
let prevNumber = null

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
          height: 800,
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
    const FULL_URL = `https://api.coingecko.com/api/v3/simple/price?ids=${(await settings.get('tokenName'))}&vs_currencies=${(await settings.get('fiatCurr'))}&precision=${(await settings.get('precisionDec'))}`    
    const res = await axios.get(FULL_URL)
    const currentNumber = `${res.data[await settings.get('tokenName')][await settings.get('fiatCurr')]}`
    let labelName = await settings.get('labelName')

  let title = null
  if (prevNumber != null && currentNumber > prevNumber) {
    title = `${labelName} ${currentNumber} \u2191`
  } else if (currentNumber < prevNumber) {
    title = `${labelName} ${currentNumber} \u2193`
  } else {
    title = `${labelName} ${currentNumber}`
  }

  tray.setTitle(title)
  prevNumber = currentNumber
    // tray.setTitle(`${res.data[await settings.get('tokenName')][await settings.get('fiatCurr')]}`)
  } catch (error) {
    console.error(error)
    tray.setTitle('Crypto Tracker')
  }
}
app.whenReady().then(async () => {

  openConfig()

  app.on('before-quit', () => {
      isQuiting = true
  })

  ipcMain.handle('config:save', saveConfig)
  ipcMain.handle('config:load', loadConfig)
  ipcMain.handle('config:exit', exitConfig)

  app.setAppUserModelId('Crypto Tracker')

  const contextMenu = Menu.buildFromTemplate([
      {
          label: 'Settings',
          type: 'normal',
          click: openConfig
      },
      {
          label: 'Quit',
          type: 'normal',
          click: exitApp
      }
  ])

  let icon = null
  
  if (process.platform === 'darwin') {
      icon = nativeImage.createFromPath('assets/trayMacTemplate.png')
      tray = new Tray(icon)
      app.dock.hide()
      tray.setTitle('Crypto Tracker')
  }
  else {
      icon = nativeImage.createFromPath('assets/trayWin.png')
      tray = new Tray(icon)
      tray.setTitle('Crypto Tracker')
  }

  tray.setContextMenu(contextMenu)
  tray.setToolTip('Crypto Tracker')  
  tray.setTitle('Crypto Tracker')

  // Set the initial tray title
  updateTrayTitle()

  // Update the tray title every 5 seconds
  setInterval(updateTrayTitle, 6500)

});