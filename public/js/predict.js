const background = document.querySelector('.background')
const colorInput = document.querySelector('.select-color')
let data = []
const loader = `<div class="loader"> <span style="--i: 0"></span> <span style="--i: 0.2s"></span> <span style="--i: 0.4s"></span> </div>`

colorInput.addEventListener('change', e => {
    background.style.backgroundColor = e.target.value
    let rgbColor = hexToRgb(e.target.value)
    data = [JSON.stringify(rgbColor)]
})

document.querySelector('.predict').addEventListener('click', () => {
    if (!data.length)
        return alert('No Input Selected')

    background.innerHTML = loader

    axios.post('/predict/color', data)
        .then(res => {
            background.innerHTML = res.data == 1 ? 'Predicted Text Color: White' : 'Predicted Text Color: Black'
            background.style.color = res.data == 1 ? '#fff' : '#000'
        })
        .catch(err => {
            console.log(err)
            background.innerHTML = `<div style="background: #7d1111; padding: 10px; color: #fff;">There Was An Error in Predicting</div>`
        })
})

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    }
}