const bel = require('bel')
const csjs = require('csjs-inject')
const Desktop = require('Desktop')
const OpenWindow = require('OpenWindow')

function main(opts, done) {
    const { theme } = opts
    const css = style
    const icons = [
        {
            id: 1,
            name: css.software,
            title: 'DatDot.install',
            url: './src/node_modules/assets/svg/software.svg'
        },
        {
            id: 2,
            name: css.software1,
            title: 'Long name app Long name app Long name app Long name app',
            url: './src/node_modules/assets/svg/software.svg'
        },
        {
            id: 3,
            name: css.software2,
            title: 'App1',
            url: './src/node_modules/assets/svg/software.svg'
        },
        {
            id: 4,
            name: css.software1,
            title: 'App2',
            url: './src/node_modules/assets/svg/software.svg'
        },
        {
            id: 5,
            name: css.software2,
            title: 'App3',
            url: './src/node_modules/assets/svg/software.svg'
        },
        {
            id: 6,
            name: css.software1,
            title: 'App4',
            url: './src/node_modules/assets/svg/software.svg'
        },
        {
            id: 7,
            name: css.software2,
            title: 'App5',
            url: './src/node_modules/assets/svg/software.svg'
        },
        {
            id: 8,
            name: css.software1,
            title: 'App6',
            url: './src/node_modules/assets/svg/software.svg'
        },
        {
            id: 9,
            name: css.software2,
            title: 'App7',
            url: './src/node_modules/assets/svg/software.svg'
        },
        {
            id: 10,
            name: css.software1,
            title: 'App8',
            url: './src/node_modules/assets/svg/software.svg'
        },
        {
            id: 11,
            name: css.software2,
            title: 'App9',
            url: './src/node_modules/assets/svg/software.svg'
        }
    ]

    const loadPage = bel`${Desktop(icons, openTarget)}`
    return done(null, loadPage)

    function loadContent(el) {
        return bel`${el}`
    }

    function openTarget(app) {
        return loadPage.appendChild( OpenWindow(app, loadContent) )
    }

}
const style =  csjs`
.software {}
.software1 {}
.software2 {}
`
module.exports = main