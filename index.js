// require('dotenv').config();
require('dotenv').config();

const express = require('express')
const app = express()
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()
const cors = require('cors')
const PORT = process.env.PORT || 7310
const fs = require('fs')
const path = require('path')



console.log(
    process.env.COLOR 
)

app.use(cors())
app.use(express.json())

app.ws('/', (ws, req) => {

    ws.on('message', (msg) => {
        console.log('msg : ', msg)

        msg = JSON.parse(msg)
        console.log(msg)

        switch (msg.method) {
            case "connection":
                connectionHandler(ws, msg)
                break
            case "draw":
                broadcastConnection(ws, msg)
                break
            case "pushToUndo":
                // broadcastPushToUndo(ws, msg);
                broadcastConnection(ws, msg);

                break;
            case "undo":
                // broadcastPushToUndo(ws, msg);
                broadcastConnection(ws, msg);
                break;
            case "redo":
                // broadcastPushToUndo(ws, msg);
                broadcastConnection(ws, msg);
                break;
            case "setLineWidth":
                // broadcastPushToUndo(ws, msg);
                broadcastConnection(ws, msg);
                break;
            case "changeColorFIllStyle":
                // broadcastPushToUndo(ws, msg);
                broadcastConnection(ws, msg);
                break;
        }
    })
})

app.post('/image', (req, res) => {
    try {
        const data = req.body.img.replace(`data:image/png;base64,`, '')
        fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64')
        return res.status(200).json({ message: "Загружено" })
    } catch (e) {
        console.log(e)
        return res.status(500).json('error')
    }
})
// app.get('/image', (req, res) => {
//     try {
//         const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`))
//         const data = `data:image/png;base64,` + file.toString('base64')
//         res.json(data)
//     } catch (e) {
//         console.log(e)
//         return res.status(500).json('error')
//     }
// })
app.get('/image', (req, res) => {
    const filePath = path.resolve(__dirname, 'files', `${req.query.id}.jpg`);

    if (!fs.existsSync(filePath)) {
        console.log('File not found');
        return res.status(404).json('File not found');
    }

    try {
        const file = fs.readFileSync(filePath);
        const data = `data:image/png;base64,` + file.toString('base64');
        res.json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json('error');
    }
});

app.listen(PORT, () => console.log(`server started on PORT ${PORT}`))

const connectionHandler = (ws, msg) => {
    ws.id = msg.id
    broadcastConnection(ws, msg)
}

const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach(client => {
        if (client.id === msg.id) {
            client.send(JSON.stringify(msg))
        }
    })
}
