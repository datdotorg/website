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
        background-color: #e2e2e2;
background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23ffffff' fill-opacity='0.4' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
    img {
        max-width: 100%;
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
        return document.body.innerHTML = `<p>${err.stack}</p>`
    }
    
    document.body.appendChild(loadPage)
    updateTheme(vars)
}

function updateTheme(vars) {
    Object.keys(vars).forEach(name => {
        document.body.style.setProperty(`--${name}`, vars[name])
    })
}



main({ theme }, el)