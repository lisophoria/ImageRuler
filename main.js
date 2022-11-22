const { app, BrowserWindow, dialog } = require('electron')
const path = require("path");
const {ipcMain} = require('electron');
const fs = require("fs");

const args = process.argv.slice(1),
  serve = args.some(value => value === '--serve');

const createWindow = () => {
  // Create the browser window
  const window = new BrowserWindow({
    autoHideMenuBar: true,
    width: 1000,
    height: 600,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js')
    },
    resizable: false,
  })

  // If run with --serve, loads live browser app, else built app
  if (serve) {
    window.loadURL('http://localhost:4200')
  } else {
    window.loadURL(`file://${__dirname}/dist/image-ruler/index.html`)
  }

  // Uncomment below to open the DevTools
  // window.webContents.openDevTools()

}

// Create window on electron init
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // Common macOS bugfix when it creates a new window on tray icon click
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// Opens openDialog on 'getImage' message, returns base64 image
ipcMain.handle('getImage', async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{name: "Images", extensions: ["png"]}]
  })
  return(fs.readFileSync(result.filePaths[0], {encoding: 'base64'}));
})


