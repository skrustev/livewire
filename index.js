/// <reference path="typings/node/node.d.ts"/>

var app = require('app');
var BrowserWindow = require('browser-window');
var globalShortcut = require('global-shortcut');

var mainWindow;

app.on('ready', function () {

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: __dirname + '/icon.png'
  });

  mainWindow.show();
  
  //mainWindow.openDevTools();

  mainWindow.loadUrl('file://' + __dirname + '/app/index.html');
  
  mainWindow.webContents.on('did-finish-load', function() {
    if(process.platform.toLowerCase() === 'darwin'){
      mainWindow.webContents.send('isMac', true);
    }
  });

  globalShortcut.register('CmdOrCtrl+F12', function () {
    mainWindow.show();
	});

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
});

app.on('window-all-closed', function () {
  if (process.platform.toLowerCase() != 'darwin') {
    app.quit();
  }
});