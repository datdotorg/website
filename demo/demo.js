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
        background-color: #eee;
        background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h16v2h-6v6h6v8H8v-6H2v6H0V0zm4 4h2v2H4V4zm8 8h2v2h-2v-2zm-8 0h2v2H4v-2zm8-8h2v2h-2V4z' fill='%23e2e2e2' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E");
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