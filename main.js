const { app, BrowserWindow } = require('electron')

const args = process.argv.slice(1),
  serve = args.some(value => value === '--serve');

const createWindow = () => {
  // Create the browser window
  const window = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
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
  window.webContents.openDevTools()
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
