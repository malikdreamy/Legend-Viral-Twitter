const { contextBridge, ipcRenderer } = require('electron');

// Expose the insertText and sendMessageToMain function to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  insertText: (text) => {
    ipcRenderer.send('insertText', text);
  },
  insertTextK: (text) => {
    ipcRenderer.send('insertTextK', text);
  },
  sendMessageToMain: (message) => {
    ipcRenderer.send('messageFromRenderer', message);
  },
  sendMessageToMainK: (message) => {
    ipcRenderer.send('messageFromRendererK', message);
  }
});


ipcRenderer.on('messageFromMain', (event, message) => {
  console.log('Received message from main:', message);
});