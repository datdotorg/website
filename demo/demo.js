const csjs = require('csjs-inject')
const main = require('../')
const theme = require('theme')

const el = (err, loadPage) => {
    const vars = theme
    const styles = csjs `
    * {
        box-sizing: border-box;
    }
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
    button {
        border: none;
        background: none;
        cursor: pointer;
    }
    pre {
        margin-bottom: 0;
        word-break: normal;
        font-size: 1.6rem;
        font-family: var(--codeFont);
        line-height: 1.45;
    }
    code {
        word-break: break-all;
        word-break: break-word;
        /* Non standard for webkit */
        -webkit-hyphens: auto;
        -moz-hyphens: auto;
        hyphens: auto;
        white-space: pre-wrap; 
    }
    table {
        border-spacing: 0;
        border-collapse: collapse;
    }
    td, th {
        padding: 0;
    }
    iframe {
        width: 100%;
        height: 100%;
        border: none;
    }
    a {
        color: var(--linkColor);
    }
    a:hover {
        color: var(--linkHoverColor);
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

function updateTheme(vars) {
    Object.keys(vars).forEach(name => {
        document.body.style.setProperty(`--${name}`, vars[name])
    })
}



main({ theme }, el)