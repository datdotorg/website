const csjs = require('csjs-inject')
const main = require('../')
const theme = require('theme')

const el = (err, loadPage) => {
    const vars = theme
    const styles = csjs`
    html {
        font-size: 62.5%;
    }
    body {
        font-family: var(--bodyFont);
        font-size: var(--bodyFontSize);
        color: var(--bodyColor);
        margin: 0;
        padding: 0;
    }
    img {
        width: 100%;
        height: auto;
    }
    `
    document.body.style = styles

    if (err) {
        document.body.style = `color: red; font-size: 1.6rem; text-align:center; background-color: #d9d9d9;`
        document.body.innerHTML = `<p>${err.stack}</p>`
    } else {
        document.body.appendChild(loadPage)
    }

    updateTheme(vars)
} 

function updateTheme (vars) {
    Object.keys(vars).forEach(name => {
      document.body.style.setProperty(`--${name}`, vars[name])
    })
}



main({theme}, el)