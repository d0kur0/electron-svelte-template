const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const isDevelopment = process.env.NODE_ENV === "development";

// Enable auto reload in development mode
if (isDevelopment) {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "../node_modules", ".bin", "electron"),
    awaitWriteFinish: true,
  });
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

// Register IPC Handlers
const IPCHandlers = require("./ipcHandlers/ipcHandlersMap");
IPCHandlers.forEach(handler => ipcMain.handle(handler.name, handler.callback));

const createWindow = () => {
  const width = isDevelopment ? 1600 : 1600;
  const height = 1000;

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width,
    height,
    //icon: path.join(__dirname, "../public/favicon.ico"),
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const openAuth = () => {
    const options = {
      clientID: 7532331, // your vk app id, required
      display: "page", // page display desing, default 'popup'
      scope: ["photos"], // access rights, whoose you want get,
      responseType: "token", // response type, default 'token'
    };

    const oauth = new OAuthVK(require("electron").remote.BrowserWindow, options);

    oauth.login().then(authData => {
      console.log(authData);
    });
  };

  // Hide menu bar
  mainWindow.setMenu(null);

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../public/index.html"));

  // Open the DevTools in development mode
  isDevelopment && mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
