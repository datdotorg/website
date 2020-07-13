const bel = require('bel')
const csjs = require('csjs-inject')
// widgets
const Desktop = require('Desktop')
const OpenWindow = require('OpenWindow')
const AppInfo = require('AppInfo')
const fetchFromGithub = require('fetchFromGithub')
// widgets
const updateApp = require('updateApp')
const removeApp = require('removeApp')

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
                open: true,
                pin: true,
                app: {
                    install: false,
                    version: null,
                    data: null
                }
            },
        },
        { 
            id: 2,
            name: 'fionataeyang',
            repo: 'datdot',
            path: 'packages/pacman/package.json',
            version: 'packages/pacman/dist/1.0.0/version.json',
            status: {
                open: false,
                pin: false,
                app: {
                    install: false,
                    version: null,
                    data: null
                }
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
                pin: false,
                app: {
                    install: false,
                    version: null,
                    data: null
                }
            }
        }
    ]

    // store installed app to here
    let installedApp = []

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
            const result = { id: index, link, ...appRes, ...versionRes, status: package.status }

            if ( package.status.open ) {
                document.body.append( OpenWindow(css.current, link, result, AppInfo, loadAppContent) )

                // if all windows are opened, then find last one window and bring to top level
                let allWindows =  document.body.querySelectorAll("[class^='window']")

                // only when all windows are opened and greater than 1 to deal with
                if (allWindows.length > 1) {
                    allWindows.forEach( (panel, index, arr) => {
                        panel.classList.remove(css.current) 
                        if ( arr[arr.length - 1] === panel ) {
                            panel.classList.add(css.current) 
                        }
                    })
                }
               
            }

            Desktop(result, openTarget, desktopLoaded )

        } catch(err) {
            return console.error(err)
        }
        
    })

    return done(null, desktop)

    // load app content
    function loadAppContent({item, app, appicon, update, remove}) {

        if (update !== undefined && typeof update === 'object') {
            updateApp(packages, update)
            // push installed package's data into installedApp
            installedApp.push(update)
        } 

        if (remove !== undefined && installedApp.length > 0) {
            removeApp(packages, remove, installedApp)
            console.log('update installed:', installedApp);
            console.log('update packages', packages)
        }

        if (appicon) {
            appicon.addEventListener('click', () => {
                // covert app.title to add on window
                let title = app.title.split(' ').join('').toLowerCase()
                openTarget({url: app.link, title}, app)
            })
        }

        return bel`${item}`
    }

    // open window
    function openTarget({url, title}, app) {
        let all = document.querySelectorAll("[class*='app_']")
        let excApp = document.querySelector(`.app_${title}`)
        // set all windows's level back to default
        all.forEach ( i => { 
            i.classList.remove(css.current)
        })

        // if app is existed, then bring window to top level
        if ( excApp ) {
            all.forEach ( i => { 
                if ( i.classList.contains(`app_${title}`) ) {
                    i.classList.add(css.current)
                } 
            })
        } else {
            // if app is not existed, then create new window
            document.body.appendChild( OpenWindow(css.current, url, app, AppInfo, loadAppContent) )
            app.status.open = true

            let appName = app.title.split(' ').join('').toLowerCase()
            let dashName = app.title.split(' ').join('-').toLowerCase()
            packages.map( package => {
                if (package.path.includes(appName) ||  package.path.includes(dashName) ) {
                    package.status.open = app.status.open
                }
            })
        }
    }

    
    // load the applist on desktop
    function desktopLoaded(err, el, title) {
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
.current {
    z-index: 9;
}
.current [class*='body'] {
    border-color: var(--panelCurrentBorderColor);
}
.current [class*='header'] {
    border-color: var(--panelCurrentBorderColor);
    background-color: var(--panelCurrentHeaderBgColor);
}
`

module.exports = main