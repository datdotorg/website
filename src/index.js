const bel = require('bel')
const csjs = require('csjs-inject')
// widgets
const Desktop = require('Desktop')
const OpenWindow = require('OpenWindow')
const AppInfo = require('AppInfo')
const fetchFromGithub = require('fetchFromGithub')

function main(opts, done) {
    const { theme } = opts
    const css = style

    let packages = [
        { 
            id: 1,
            name: 'fionataeyang',
            repo: 'datdot',
            path: 'packages/datdot/package.json',
            version: 'packages/datdot/dist/1.1.0/version.json',
            status: {
                open: false,
                pin: true,
                install: true,
            },
        },
        { 
            id: 2,
            name: 'fionataeyang',
            repo: 'datdot',
            path: 'packages/game/package.json',
            version: 'packages/game/dist/1.0.0/version.json',
            status: {
                open: false,
                pin: true,
                install: true
            }
        },
        {
            id: 3,
            name: 'fionataeyang',
            repo: 'datdot',
            path: 'packages/alarm-clock/package.json',
            version: 'packages/alarm-clock/dist/1.0.0/version.json',
            status: {
                open: false,
                pin: true,
                install: true
            }
        }
    ]

    const desktop  = bel`<main class=${css.desktop} role="desktop"></main>`
    const applist = bel`<div class=${css["app-list"]}></div>`
    
    
    desktop.appendChild(applist)


    packages.map( async (package, index) => {
        // package's status is not pin on the desktop
        if (!package.status.pin) return 
        let app = {name: package.name, repo: package.repo, path: package.path}
        let version = {name: package.name, repo: package.repo, path: package.version}

        try {
            let getApp = await fetchFromGithub(app)
            let getVersion = await fetchFromGithub(version)
            
            // conver to JSON type
            const appRes = JSON.parse(getApp)
            const versionRes = JSON.parse(getVersion)

            // catch url
            const url = location.origin.includes('localhost') || location.port === '9966' ?
            `${location.protocol}//${location.host}/${app.path}`
            : `https://raw.githubusercontent.com/${app.name}/${app.repo}/master/${app.path}`

            const link = url.slice(0, url.lastIndexOf('/'))
            
            // make full result
            const result = { id: index, link, ...appRes, ...versionRes }

            Desktop(result, openTarget, desktopLoaded )

        } catch(err) {
            return console.error(err)
        }
        
    })

    return done(null, desktop)
    

    // load app content
    function loadAppContent(el, app) {
        return bel`${el}`
    }

    // open window
    function openTarget({url, title}, app) {
        let panel = document.querySelector(`.app_${title}`)
        if (panel) {
            // set all windows's level back to default
            let all = document.querySelectorAll("[class*='app_']")
            all.forEach ( i => i.style.zIndex = '2')
            panel.style.zIndex = "9"
            return
        } 
           
        return document.body.appendChild( OpenWindow(url, app, AppInfo, loadAppContent) )

    }

    
    // load the applist on desktop
    function desktopLoaded(err, el) {
        if (err) return console.log(err)
        return applist.appendChild(el)
    }

}

let style = csjs`
svg {
    width: 100%;
    height: auto;
}
.desktop {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: calc(100vh - 43px) 43px;
}
.app-list {
    padding: 20px 20px 0 20px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(auto, 90px));
    grid-template-rows: repeat(auto-fit, minmax(auto, 94px));
    gap: 5px 22px;
    grid-auto-flow: column;
    justify-items: center;
}
`

module.exports = main