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
            version: 'packages/datdot/dist/1.0.0/version.json',
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


    packages.map( package => {
        // package's status is not pin on the desktop
        if (!package.status.pin) return 
        let app = {name: package.name, repo: package.repo, path: package.path}
        let version = {name: package.name, repo: package.repo, path: package.version}

        fetchFromGithub(app, (err, data) => {
            if (err) return console.error(err)
            
            const url = location.origin.includes('localhost') || location.port === '9966' ?
            `${location.protocol}//${location.host}/${app.path}`
            : `https://raw.githubusercontent.com/${app.name}/${app.repo}/master/${app.path}`

            const text = JSON.parse(data)

            const result = { 
                data: text,
                url: `${url.slice(0, url.lastIndexOf("/"))}/dist/${text.versions.latest}`
             }
             
            Desktop({data: result.data , url: result.url, title: result.data.title, opts: version }, openTarget, desktopLoaded )
        })

    })

    return done(null, desktop)
    

    function loadAppContent(el, app) {
        return bel`${el}`
    }

    function openTarget(title, data) {
        const newApps = [...data]
        console.log('open:', title);
        // newApps.map( item => { 
        //     if (title === item.sources.app.title) {
        //         // set all windows's level back to default
        //         let all = document.querySelectorAll("[class*='app_']")
        //         all.forEach ( i => i.style.zIndex = '2')

        //         if (item.status.open ) {
        //             // bring window's level up to top
        //             let switchWindow = document.querySelector(`.app_${item.id}`)
        //             switchWindow.style.zIndex = "9"
        //             return
        //         } else {
        //             // create new window
        //             item.status.open = true
        //             packages = newApps
        //             return document.body.appendChild( OpenWindow(item, AppInfo, loadAppContent) )
        //         }
                
        //     } else {
                
        //         return item
        //     }
            
        // })
        
        
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