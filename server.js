const express = require('express')
const path = require('path')
const fs = require('fs')
const { PythonShell } = require('python-shell')

let options = {
    mode: 'text',
    encoding: 'utf8',
    pythonPath: '/usr/bin/python3',
    pythonOptions: ['-u'], // get print results in real-time
    scriptPath: './scripts/',
    args: []
}

const app = express()

// initialize the body parser for ajax calls
app.use(express.json({ extented: false }))

// setting the static folder
app.use(express.static(path.join(__dirname, '/public')))


app.post('/add/colors', (req, res) => {
    try {
        options.args = req.body
        let add = new PythonShell('add_colors.py', options)
        add.on('message', message => res.send(message) )   
    } 
    catch (err) {
        console.log(err)
        res.send('Error')
    }
})

// server the main index file
app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, './public/html/predict.html'))
)

// the training file
app.get('/train', (req, res) => 
    res.sendFile(path.join(__dirname, './public/html/index.html'))
)

// predicting the color
app.post('/predict/color', (req, res) => {
    options.args = req.body
    try {
        let predict = new PythonShell('predict.py', options)
        predict.on('message', message => {
            res.send(message)
        })
    } 
    catch (err) {
        console.log(err)
        res.send('Error')    
    }
})

// returns the colors csv file
app.get('/csv/file', (req, res) => {
    fs.readFile('./scripts/colors.csv', (err, data) => {
        if (err) {
            res.status(500).send('Error')
            throw err
        }
        else res.status(200).send(data)
    })
})

// training the model
app.get('/train/model', (req, res) => {
    try {
        options.args = []
        let train = new PythonShell('model.py', options)
        train.on('message', message => {
            res.send(message)
        })
    } 
    catch (err) {
        console.log(err)
        res.send('Error')    
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server Running on port ${PORT}`))