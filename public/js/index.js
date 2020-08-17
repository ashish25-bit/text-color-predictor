const change = document.querySelector('.change_color')
const bg = document.querySelector('.background')
const output = document.querySelector('.output')
let data = []
let r // for red color
let g // for green color
let b // for blue color
let textColor = 0
const whiteBtn = document.querySelector('.white')
const blackBtn = document.querySelector('.black')
const send = document.querySelector('.send')
const add = document.querySelector('.add')
const link = document.querySelector('.predictLink')
const train = document.querySelector('.train')

readFile()
addColor()

// change the color to a random color
change.addEventListener('click', addColor)

function getHexCode(red=null, green=null, blue=null) {
    if (red != null) {
        r_hex = red.toString(16).length == 1 ? '0' + red.toString(16) : red.toString(16)
        g_hex = green.toString(16).length == 1 ? '0' + green.toString(16) : green.toString(16)
        b_hex = blue.toString(16).length == 1 ? '0' + blue.toString(16) : blue.toString(16)
        return `#${r_hex}${g_hex}${b_hex}`
    }
    else {
        r_hex = r.toString(16).length == 1 ? '0' + r.toString(16) : r.toString(16)
        g_hex = g.toString(16).length == 1 ? '0' + g.toString(16) : g.toString(16)
        b_hex = b.toString(16).length == 1 ? '0' + b.toString(16) : b.toString(16)
        return `#${r_hex}${g_hex}${b_hex}`
    }
}

function addColor() {
    r = Math.floor(Math.random() * 256)
    g = Math.floor(Math.random() * 256)
    b = Math.floor(Math.random() * 256)
    bg.style.backgroundColor = getHexCode()
}   

// add white text color
whiteBtn.addEventListener('click', () => {
    bg.style.color = '#fff'
    textColor = 1
})

// add black text color
blackBtn.addEventListener('click', () => {
    bg.style.color = '#000'
    textColor = 0
})

// send the json object to add in csv file
send.addEventListener('click', e => {
    if (!data.length)
        return alert('Please Enter Data')
    e.target.innerText = 'Adding Data'
    e.target.disabled = true
    
    axios.post('/add/colors', data)
        .then(res => {
            e.target.innerText = res.data
            e.target.disabled = false
            setTimeout(() => e.target.innerText = 'Add To CSV', 3000)
        })
        .catch(err => {
            console.log(err)
            e.target.innerText = 'Error'
            e.target.disabled = false
            setTimeout(() => e.target.innerText = 'Add To CSV', 3000)
        })
})

// adding color object to the parent json object
add.addEventListener('click', () => {
    let combination = { r: r/255, g: g/255, b: b/255, text: textColor }
    let hexCode = getHexCode()
    addNode({ hexCode, text: textColor })
    data.push(JSON.stringify(combination))
    addColor()
})

// reading the file
function readFile() {  
    axios.get('/csv/file')
        .then(res => {
            output.innerHTML = ''
            const lines = res.data.toString().trim().split('\n')
            for (let i=1; i<lines.length; i++) {
                const [red, green, blue, text] = getValuesFromCsv(lines[i])
                let hexCode = getHexCode(red, green, blue)
                addNode({ hexCode, text: text/255 })
            }
        })
        .catch(err => {
            console.log(err)
        })
}

// obtaining red, green, blue and text color from the csv file
function getValuesFromCsv(colorArray) {
    const rgbValue = colorArray.split(',').map(value => Math.trunc(value*255))
    return rgbValue
}

// add color and text value to the output node.
function addNode({ hexCode, text }) {
    let div = document.createElement('div')
    div.style.background = hexCode
    div.style.color = text ? '#fff' : '#000'
    div.innerText = 'TEXT COLOR'
    output.appendChild(div)
}

// training the model
train.addEventListener('click', () => {
    if (output.childNodes.length < 99) 
        return alert('Not Sufficient Data. Please Enter ATLEAST 100 values.')
    
    engagedBtn(true, '0.5', 'THIS WILL TAKE A MOMENT. PLEASE WAIT')
   
    axios.get('/train/model')
        .then(res => {
            engagedBtn(false, 1, `${res.data * 100}% Accuracy`) 
            setTimeout(() => document.querySelector('.res').innerText = '', 4000)
        })
        .catch(err => {
            console.log(err)
            engagedBtn(false, 1, 'THERE WAS AN ERROR')
            setTimeout(() => document.querySelector('.res').innerText = '', 4000)
        })
})

// function for enabling and disabling button
function engagedBtn(disable, opacity, msg) {
    train.disabled = disable
    train.innerText = disable ? 'TRAINING THE MODEL...' : 'TRAIN THE MODEL'
    whiteBtn.disabled = disable
    whiteBtn.style.opacity = opacity
    blackBtn.disabled = disable
    blackBtn.style.opacity = opacity
    add.disabled = disable
    add.style.opacity = opacity
    change.disabled = disable
    change.style.opacity = opacity
    send.disabled = disable
    disable ? link.setAttribute('href', 'javascript: void(0)') : link.setAttribute('href', '/')
    link.style.opacity = opacity
    document.querySelector('.res').innerText = msg
}