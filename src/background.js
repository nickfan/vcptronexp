"use strict";
import log from "./log";
import { app, protocol, BrowserWindow, ipcMain } from "electron";
import {
  createProtocol,
  // eslint-disable-next-line no-unused-vars
  installVueDevtools
} from "vue-cli-plugin-electron-builder/lib";
import MyDemoModel from "./common/MyDemoModel";
import Datastore from "nedb-promises";
import * as path from "path";
import { autoUpdater } from "electron-updater";
import carlo from "carlo";
import { rpc } from "carlo/rpc";
import { Backend } from "./Backend";

const isDevelopment = process.env.NODE_ENV !== "production";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

function createWindow() {
  log.verbose("enter createWindow");
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  win.on("closed", () => {
    win = null;
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  log.verbose("app on ready");
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools();
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

// eslint-disable-next-line no-unused-vars
ipcMain.on("asynchronous-message", (event, arg) => {
  event.sender.send("asynchronous-reply", "pong");
});

// eslint-disable-next-line no-unused-vars
ipcMain.on("synchronous-message", (event, arg) => {
  event.returnValue = "pong";
});

const myrecorddev = async () => {
  let title =
    "BG Side" +
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15);
  let myDemo = new MyDemoModel({
    title: title,
    opAt: Date.now()
  });
  await myDemo.save();
  console.log("myrecorddev.myDemo", myDemo);
  return myDemo;
};
// eslint-disable-next-line no-unused-vars
ipcMain.on("carlo-start", (event, arg) => {
  (async () => {
    carlo.launch().then(async app => {
      app.serveFolder(__dirname);
      // app.serveFolder(__static);
      // app.on('exit', () => process.exit());
      await app.load("index.html", rpc.handle(new Backend()));
      // await app.load("https://github.com", rpc.handle(new Backend()));
    });
    event.sender.send("carlo-reply", "carlo-done");
  })().catch(err => {
    console.log(err);
  });
});

// eslint-disable-next-line no-unused-vars
ipcMain.on("record-insert", (event, arg) => {
  (async () => {
    let record = await myrecorddev();
    console.log("record", record);
    event.sender.send("record-reply", record);
  })().catch(err => {
    console.log(err);
  });
});

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
autoUpdater.on("checking-for-update", () => {
  log.info("1check4update");
});
// eslint-disable-next-line no-unused-vars
autoUpdater.on("update-available", (ev, info) => {
  log.info("1update-isavailable", info);
});
autoUpdater.on("update-not-available", (ev, info) => {
  log.info("1update-notavailable", info);
});
autoUpdater.on("error", (ev, err) => {
  log.info("1update-error", err);
});
autoUpdater.on("download-progress", (ev, progressObj) => {
  log.info("1update-progress", progressObj);
});
autoUpdater.on("update-downloaded", (ev, info) => {
  log.info("1update-downloaded", info);
  setTimeout(function() {
    autoUpdater.quitAndInstall();
  }, 2000);
});

// eslint-disable-next-line no-unused-vars
ipcMain.on("check4update", (event, arg) => {
  (async () => {
    autoUpdater.checkForUpdates();
    event.sender.send("check4update-reply", "reply");
  })().catch(err => {
    console.log(err);
  });
});

(async () => {
  const myDataStore = Datastore.create({
    filename: path.join(app.getPath("userData"), "mydata.db"),
    inMemoryOnly: false,
    autoload: true,
    timestampData: true
  });
  const myrecordnew = await myDataStore.insert({ doc: "yourdoc" });
  console.log("boot myDataStore", myrecordnew);
  console.log("boot myrecorddev", await myrecorddev());
})().catch(err => {
  console.log(err);
});
