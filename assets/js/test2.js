
// Dados.
let data = {
    partSize: null,
    parts: []
}

// Listar Tiles como opções no menu.
function buildMenuTiles() {
    let menuOptions = document.querySelector('#menu-tiles')

    for (let i = 0; i < tileSprites.length; i++) {
        let h3 = document.createElement('h3')
        h3.classList.add(...['my-3', 'ps-1'])

        let title = document.createTextNode(tileSprites[i].title)

        h3.appendChild(title)
        menuOptions.appendChild(h3)
        
        for (let j = 0; j < tileSprites[i].files.length; j++) {
            let div = document.createElement('div')
            div.classList.add(...['col-4', 'border', 'border-secondary', 'py-2'])

            let img = document.createElement('img')
            img.dataset.group = i
            img.dataset.id = j
            img.classList.add('img-fluid')
            img.setAttribute('draggable', true)
            img.addEventListener('dragstart', dragTiles)

            const sprite = tileSprites[i].files[j]
            const url = tileSprites[i].dir + sprite
            img.src = url

            div.appendChild(img)
            menuOptions.appendChild(div)
        }
    }
}
buildMenuTiles()

// Listar Objects como opções no menu.
function buildMenuObjects() {
    let menuObjects = document.querySelector('#menu-objects')

    for (let i = 0; i < objectSprites.files.length; i++) {
        let div = document.createElement('div')
        div.classList.add(...['col-6', 'border', 'border-secondary', 'py-2'])

        let img = document.createElement('img')
        img.dataset.group = null
        img.dataset.id = i
        img.classList.add('img-fluid')
        img.setAttribute('draggable', true)
        img.addEventListener('dragstart', dragObjects)

        const sprite = objectSprites.files[i]
        const url = objectSprites.dir + sprite
        img.src = url

        div.appendChild(img)
        menuObjects.appendChild(div)
    }
}
buildMenuObjects()

// Montar grid.
function mount() {
    const width = document.querySelector('#gridWidth').value
    const height = document.querySelector('#gridHeight').value
    const partSize = document.querySelector('#gridPartSize').value

    if (!width || !height || !partSize) {
        alert('Fill in all fields!')
    }

    const partSizePx = partSize + 'px'
    buildPart(width, height, partSizePx)

    let screenOptions = document.querySelector('#screen-options')
    if (screenOptions.classList.contains('d-none')) {
        screenOptions.classList.remove('d-none')
        screenOptions.classList.add('d-block')
    }

    let screenBg = document.querySelector('#screen-bg')
    screenBg.style.height = partSizePx
    screenBg.style.width = partSizePx

    const clickEvent = new CustomEvent('click')
    document.querySelector('#tiles-accordion').dispatchEvent(clickEvent)

    // Dados.
    data.partSize = partSizePx
}

// Construir cada parte do grid.
function buildPart(width, height, size) {
    let screen = document.querySelector('#screen')
    screen.innerHTML = ''

    for (let h = 0; h < height; h++) {
        let tr = document.createElement('tr')
        data.parts.push([]) // Dados.

        for (let w = 0; w < width; w++) {
            let td = document.createElement('td')
            td.style.height = size
            td.style.width = size
            td.style.position = 'relative'
            td.style.backgroundSize = 'cover'

            td.dataset.h = h
            td.dataset.w = w

            td.dataset.group = ''
            td.dataset.id = ''

            td.addEventListener('dragover', allowDrop)
            td.addEventListener('drop', drop)

            td.setAttribute('draggable', true)
            td.addEventListener('dragstart', dragTiles)

            td.addEventListener('contextmenu', deleteSprite)

            tr.appendChild(td)

            // Dados.
            data.parts[h].push({background: null})
        }

        screen.appendChild(tr)
    }
}

// Arrastar tile do menu.
function dragTiles(event) {
    event.dataTransfer.setData('group', event.target.dataset.group)
    event.dataTransfer.setData('id', event.target.dataset.id)
}

// Arrastar object do menu.
function dragObjects(event) {
    event.dataTransfer.setData('group', '')
    event.dataTransfer.setData('id', event.target.dataset.id)
}

// Permitir soltar opção/imagem do menu.
function allowDrop(event) {
    event.preventDefault()
}
  
// Soltar tile ou object do menu: encaixar no grid.
function drop(event) {
    event.preventDefault()

    const id = event.dataTransfer.getData('id')
    if (!id) {
        return
    }

    const group = event.dataTransfer.getData('group')

    const element = event.target
    let td = null
    if (element.nodeName == 'TD') {
        td = element
    } else {
        td = element.parentElement
    }

    const h = td.dataset.h
    const w = td.dataset.w

    if (group != '') {
        // Tile.
        td.dataset.group = group
        td.dataset.id = id

        const url = tileSprites[group].dir + tileSprites[group].files[id]
        td.style.backgroundImage = 'url('+ url +')'
        
        // Dados.
        data.parts[h][w].background = url
    } else {
        // Object.
        let div = document.createElement('div')
        div.style.width = data.partSize
        div.style.height = data.partSize
        div.style.position = 'absolute'
        div.style.top = '0px'
        div.style.left = '0px'
        div.style.backgroundSize = 'contain'
        div.style.backgroundRepeat = 'no-repeat'

        const url = objectSprites.dir + objectSprites.files[id]
        div.style.backgroundImage = 'url('+ url +')'

        // Dados.
        if (!data.parts[h][w].objects) {
            data.parts[h][w].objects = []
        }
        data.parts[h][w].objects.push({
            background: url,
            size: data.partSize,
            position: {
                top: '0px',
                left: '0px'
            },
            transform: 'none'
        })

        const i = data.parts[h][w].objects.length - 1
        div.dataset.i = i

        td.appendChild(div)
    }
}

// Soltar tile no background do grid.
function dropBg(event) {
    event.preventDefault()

    const group = event.dataTransfer.getData('group')
    const id = event.dataTransfer.getData('id')
    if (group == '' || !id) {
        return
    }

    let td = event.target

    const url = tileSprites[group].dir + tileSprites[group].files[id]
    td.style.backgroundImage = 'url('+ url +')'
}

// Remover tile soltado em parte do grid.
function deleteSprite(event) {
    event.preventDefault()

    const element = event.target
    if (element.nodeName == 'TD') {
        // Tile.
        const h = element.dataset.h
        const w = element.dataset.w
        if (h && w) {
            data.parts[h][w].background = null
        }

        element.style.backgroundImage = null
        element.dataset.group = ''
        element.dataset.id = ''
    } else {
        // Object.
        const parent = element.parentElement
        const h = parent.dataset.h
        const w = parent.dataset.w

        const i = element.dataset.i
        data.parts[h][w].objects.splice(i, 1)

        element.remove()
    }
}