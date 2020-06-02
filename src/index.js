const bel = require('bel')
const csjs = require('csjs-inject')
const Desktop = require('Desktop')
const OpenWindow = require('OpenWindow')
const AppInfo = require('AppInfo')

function main(opts, done) {
    // catch screen size
    // alert(`${window.innerWidth}x${window.innerHeight}`);
    const { theme } = opts
    const css = style
    let packages = [
        { 
            id: 1,
            url: 'https://raw.githubusercontent.com/fionataeyang/datdot/master/packages/datdot/package.json',
            version: '1.0.0',
            status: {
                open: false,
                pin: true,
            }
        },
        { 
            id: 2,
            url: 'https://www.seekdecor.com/demo-package/package1/package.json',
            version: '1.1.0',
            status: {
                open: false,
                pin: true,
            }
        },
    ]

    const desktop  = bel`<main class=${css.desktop} role="desktop"></main>`
    const applist = bel`<div class=${css["app-list"]}></div>`
    
    // applist load
    desktopLoad()
    
    desktop.appendChild(applist)
    return done(null, desktop)
    

    function loadAppContent(el, app) {
        return bel`${el}`
    }

    function openTarget(app) {
        if (app.status.open) return
        const newApps = [...packages]
        newApps.map( obj => app.id === obj.id ? obj.open = true : obj )
        packages = newApps
        return document.body.appendChild( OpenWindow(app, AppInfo, loadAppContent) )
    }

    // load the applist on the desktop
    function desktopLoad() {
        packages.map( async package => {
            // package's status is not pin on the desktop
            if (!package.status.pin) return 
    
            const cors = "https://cors-anywhere.herokuapp.com/"
            const regex = /^http/
            // for localhost using
            const url = package.url.match(regex) ? `${cors}${package.url}` : `${package.url}`
            // find the current path
            const path = url.slice(0, url.lastIndexOf('/'))
            const app = await fetch(url).then( res => res.json() ).catch(err => console.log(err))
            const version = await fetch(`${path}/dist/${package.version}/version.json`).then( res => res.json() ).catch(err => console.log(err))
            // make a new obj
            let obj = { app, version }
            applist.appendChild(  Desktop(package, {title: app.title, icon: `${path}/dist/${package.version}/${version.icon}` } , openTarget )  )
        })
    }

}

let style = csjs`
svg {
    width: 100%;
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