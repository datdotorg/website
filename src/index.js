const bel = require('bel')
const csjs = require('csjs-inject')
const Desktop = require('Desktop')
const OpenWindow = require('OpenWindow')
const AppInfo = require('AppInfo')

function main(opts, done) {
    const { theme } = opts
    const css = style
    let apps = [
        {
            id: 1,
            name: css.software,
            title: 'DatDot.install',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 2,
            name: css.software1,
            title: 'Long name app Long name app Long name app Long name app',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 3,
            name: css.software2,
            title: 'App1',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 4,
            name: css.software1,
            title: 'App2',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 5,
            name: css.software2,
            title: 'App3',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 6,
            name: css.software1,
            title: 'App4',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 7,
            name: css.software2,
            title: 'App5',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 8,
            name: css.software1,
            title: 'App6',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 9,
            name: css.software2,
            title: 'App7',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 10,
            name: css.software1,
            title: 'App8',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 11,
            name: css.software2,
            title: 'App9',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 12,
            name: css.software1,
            title: 'App10',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 13,
            name: css.software2,
            title: 'App11',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 14,
            name: css.software1,
            title: 'App12',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 15,
            name: css.software2,
            title: 'App13',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 16,
            name: css.software1,
            title: 'App14',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 17,
            name: css.software2,
            title: 'App15',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 18,
            name: css.software1,
            title: 'App16',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 19,
            name: css.software2,
            title: 'App17',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 20,
            name: css.software1,
            title: 'App88',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        },
        {
            id: 21,
            name: css.software2,
            title: 'App89',
            url: './src/node_modules/assets/svg/software.svg',
            open: false,
        }
    ]

    const loadPage = bel`${Desktop(apps, openTarget)}`
    return done(null, loadPage)

    function loadAppContent(el, app) {
        return bel`${el}`
    }

    function openTarget(app) {
        if (app.open) return
        const newApps = [...apps]
        newApps.map( obj => app.id === obj.id ? obj.open = true : obj )
        apps = newApps
        // console.log(apps)
        return loadPage.appendChild( OpenWindow(app, AppInfo, loadAppContent) )
    }

}
const style =  csjs`
.software {}
.software1 {}
.software2 {}
`
module.exports = main