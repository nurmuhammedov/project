import {app, BrowserWindow} from 'electron'


let mainWindow

app.whenReady().then(() => {
	mainWindow = new BrowserWindow({
		width: 1400,
		height: 1000,
		minWidth: 1400,
		minHeight: 1000,
		frame: true,
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: true
		}
	})

	mainWindow.loadURL('https://jr.technocorp.uz/').then(r => console.log(r))
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})
