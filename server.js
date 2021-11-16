//import express 和 ws 套件
const express = require('express')
const SocketServer = require('ws').Server

//指定開啟的 port
const PORT = 1935

//創建 express 的物件，並綁定及監聽 3000 port ，且設定開啟後在 console 中提示
const server = express()
    .listen(PORT, () => console.log(`Listening on ${PORT}`))

//將 express 交給 SocketServer 開啟 WebSocket 的服務
const ws = new SocketServer({ server })

//當 WebSocket 從外部連結時執行
ws.on('connection', ws => {
    console.log('Client connected')

    //對 message 設定監聽，接收從 Client 發送的訊息
    ws.on('message', data => {
        //data 為 Client 發送的訊息，現在將訊息原封不動發送出去
		console.log(data.toString());
        ws.send(data)
    })

    ws.on('close', () => {
        console.log('Close connected')
    })
})