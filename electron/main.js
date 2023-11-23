
const { app, BrowserWindow, ipcMain, desktopCapturer} = require('electron');

const path = require('path');
const isDev = require('electron-is-dev');
const fs = require("fs");
const moment = require("moment");
const aws = require("aws-sdk");
const dotenv = require ('dotenv');
require('@electron/remote/main').initialize();
dotenv.config();

const region = "eu-north-1";
const bucketName = "1337bucket1337";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const folderName = path.join(__dirname, '../Downloads');

const s3 = new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: 'v4'
});

function createWindow() {
    const win = new BrowserWindow({
        width: 1080,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        }
    })

    require('@electron/remote/main').enable(win.webContents)

    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    )
}

app.on('ready', ()=> {
    createWindow();
});

ipcMain.handle('get-video-sources', async () => {
    return await desktopCapturer.getSources({ types: ['window', 'screen'] })
});

ipcMain.handle('save-video-data', (event, videoData) => {
    try {
        if (!fs.existsSync(folderName)) {
            fs.mkdirSync(folderName);
        }
    } catch (err) {
        console.error(err);
    }

    const fileName = moment().format('DD-MM-YY-h-m-s');
    const filePath = `${folderName}/${fileName}.webm`;
    if (folderName) {
        fs.writeFile(filePath, videoData, () => {
            console.log('video created')});
        return {
            code: 'successes',
            data: {
                [`${fileName}.webm`]: { path: filePath },
            }
        };
    }
    return {
        code: 'error',
        data: null,
    };
});

ipcMain.handle('upload-video', async (event, fileName) => {
    const params = ({
        Bucket: bucketName,
        Key: fileName,
        Expires: 60
    })
    return await s3.getSignedUrlPromise('putObject', params);
});

ipcMain.handle('delete-video', (event, filePath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                reject(err.message);
            } else {
                resolve();
            }
        });
    });
});

ipcMain.handle('get-video-data', (event, filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, async (err, data) => {
            if (err) {
                reject(err.message);
            }
            resolve(data);
        });
    });
});

ipcMain.handle('get-video-files', () => {
    const appPath = app.getAppPath();
    return fs.readdirSync(path.join(appPath, './Downloads')).filter(file => file.endsWith('.webm'))
});

ipcMain.handle('close-app', () => {
    app.quit();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
