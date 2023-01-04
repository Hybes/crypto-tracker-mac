let saveConfig = document.getElementById('saveConfig')
let cancel = document.getElementById('cancel')

let config = null

const save = async () => {
    let inputs = document.forms['config'].getElementsByTagName('input')

    for (const input of inputs) {
        config[input.id] = input.value
    }
    
    await api.saveConfig(config)
    api.exit()
}

const exit = async () => {
    await api.exit()
}

const loadConfig = async () => {
    config = await api.loadConfig()

    for (const setting in config) {
        let el = document.getElementById(setting)

        if (el)
            el.value = config[setting]
    }
}

window.addEventListener('DOMContentLoaded', loadConfig)

saveConfig.onclick = async () => {
    await save()
}