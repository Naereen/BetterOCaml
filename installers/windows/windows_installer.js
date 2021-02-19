const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
    .then(createWindowsInstaller)
    .catch((error) => {
        console.error(error.message || error)
        process.exit(1)
    })

function getInstallerConfig () {
    console.log('creating windows installer')
    const rootPath = path.join('./')
    const outPath = path.join(rootPath, 'out')

    return Promise.resolve({
        appDirectory: path.join(outPath, 'BetterOCaml-win32-x64/'),
        authors: 'Jb Dod',
        noMsi: true,
        outputDirectory: path.join(outPath, 'windows-installer'),
        exe: 'betterocaml.exe',
        setupExe: 'BetterOCamlInstaller.exe',
        setupIcon: path.join(rootPath, 'src', 'icon', 'electron', 'icons', 'win',  'icon.ico')
    })
}
