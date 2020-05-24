const bel = require('bel')
const csjs = require('csjs-inject')

function main(opts, done) {
    const { theme } = opts
    const css = style
    const loadPage = bel`<h1>Hello world</h1>`
    return done(null, loadPage)
}
const style =  csjs`

`
module.exports = main