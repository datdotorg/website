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
                install: true,
            },
        },
        { 
            id: 2,
            url: 'https://www.seekdecor.com/demo-package/game/package.json',
            version: '1.1.0',
            status: {
                open: false,
                pin: true,
                install: true
            }
        },
        {
            id: 3,
            url: 'https://distracted-bhaskara-c0ba0e.netlify.app/package.json',
            version: '1.0.0',
            status: {
                open: false,
                pin: true,
                install: true
            }
        }
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

    function openTarget(title, packages) {
        const newApps = [...packages]
        newApps.map( item => { 
            
            if (title === item.sources.app.title) {
                // set all windows's level back to default
                let all = document.querySelectorAll("[class*='app_']")
                all.forEach ( i => i.style.zIndex = '2')

                if (item.status.open ) {
                    // bring window's level up to top
                    let switchWindow = document.querySelector(`.app_${item.id}`)
                    switchWindow.style.zIndex = "9"
                    return
                } else {
                    // create new window
                    item.status.open = true
                    packages = newApps
                    return document.body.appendChild( OpenWindow(item, AppInfo, loadAppContent) )
                }
                
            } else {
                
                return item
            }
            
        })
        
        
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
            // always update the newest data from author, this would be fixed the issue on cache when load the data 
            package.sources = { ...obj }
            applist.appendChild(  Desktop(packages, {title: app.title, icon: `${path}/dist/${package.version}/${version.icon}` }, openTarget )  )
            
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