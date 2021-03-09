import express from 'express'
import bodyParser from 'body-parser'
import { MicroPythonDevice } from './main'
import { WEBSERVER_PORT } from './settings';

const app = express()
app.use(bodyParser.text());
let server;

let _device: MicroPythonDevice | null = null

app.get('/', (_req, res) => {
  res.send('Hello World')
})

app.get('/api', (_req, res) => {
  res.send({
    deviceId: _device!.getState().connectionPath
  });
})

app.post('/api/run-script', async (req, res) => {
  console.log('runscript', req.body)
  if (!req.body) { return res.status(400).send({ success: false, error: 'no script in request body' })}
  const scriptResponse = await _device!.runScript(req.body)
  res.send(scriptResponse)
})

export const close = async () => {
  server?.close()
}

export const run = async (device: MicroPythonDevice) => {
  _device = device
  server = app.listen(WEBSERVER_PORT)
}

if (require.main === module) {
  const d = new MicroPythonDevice()
  run(d)
}
