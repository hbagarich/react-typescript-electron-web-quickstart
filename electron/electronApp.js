const electron = require('electron')
const fs = require('fs');
const path = require('path');
const os = require('os');
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

var settingsFolder = 'C:\\ProgramData\\SPDocKit\\EventCollection\\Viewer\\';
var settingsFilePath = settingsFolder + 'settings.json';
var applicationSettings = {
  collectionAgentURL: ""
};

const { shell, dialog } = require('electron')

function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (directoryExists(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function directoryExists(path) {
  try {
    return fs.statSync(path).isDirectory();
  }
  catch (err) {
    return false;
  }
}


function storeGlobalSettings(newSettings) {
  try {
    console.log("saving new settings");
    console.log(newSettings);
    applicationSettings = newSettings;
    var data = JSON.stringify(applicationSettings, null, 2);
    ensureDirectoryExistence(settingsFilePath);
    fs.writeFileSync(settingsFilePath, data);
  }
  catch (e) {
    console.log(e);
  }
}

var ipcMain = require('electron').ipcMain;
ipcMain.on('storeSettings', function (event, newSettings) {
  console.log("storing...");
  console.log(arguments);
  storeGlobalSettings(newSettings);
});

ipcMain.on('open-external-url', function (event, data) {
  shell.openExternal(data);
})
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  let consoleArgs = process.argv.slice(0);
  let reset = consoleArgs.filter(x => x == '--reset').length > 0;
  if (!reset) {
    try {
      var path = settingsFilePath;
      //fs.openSync(path, 'r+'); //throws error if file doesn't exist    
      var data = fs.readFileSync(path); //file exists, get the contents    
      applicationSettings = JSON.parse(data);
    }
    catch (e) {
      //ignore, does not exist or no permissions
      //console.log(e);
    }
  }
  global.applicationSettings = applicationSettings;
  global.appVersion = app.getVersion();
  global.hostName = os.hostname();


  global.diagnosticsEnabled = consoleArgs.filter(x => x == '--diagnostics').length > 0;
  let initialAppRoute = '';
  let indexOfSelectedTabParam = consoleArgs.indexOf('--SelectedTab');
  if (indexOfSelectedTabParam != -1 && consoleArgs[indexOfSelectedTabParam + 1]) {
    initialAppRoute = consoleArgs[indexOfSelectedTabParam + 1];
  }

  global.initialAppRoute = initialAppRoute;
  // Create the browser window.
  mainWindow = new BrowserWindow(
    {
      width: 1366,
      height: 768,
      minWidth: 1024,
      minHeight: 768,
      // "title-bar-style": 'hidden',
      // fullscreen: 'true',   
      frame: false,
      show: false
    });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  mainWindow.setMenu(null);
  const ses = mainWindow.webContents.session;
  ses.allowNTLMCredentialsForDomains('*')

  // Open the DevTools.
  if (global.diagnosticsEnabled) {
    mainWindow.webContents.openDevTools();
  }


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.once('ready-to-show', function () {
    mainWindow.show();
  })

  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {

    var selectedSavePath = dialog.showSaveDialog({
      filters: [
        { name: 'Excel Files', extensions: ['xlsx'] }
      ]
    });
    if (selectedSavePath) {
      item.setSavePath(selectedSavePath);
    } else {
      item.cancel();
    }

    try {

      item.on('done', (event, state) => {
        try {
          if (state != 'cancelled') {
            var savePath = item.getSavePath();
            shell.openItem(savePath);
          }
        }
        catch (e) {
          console.log(e);
        }
        console.log("done with download");
      })
    }
    catch (e) {
      console.log(e);
      //nije lijepo, ali desi se error na cancle
    }
  });

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

var shouldQuit = app.makeSingleInstance(function (commandLine, workingDirectory) {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

if (shouldQuit) {
  app.quit();
  return;
}
