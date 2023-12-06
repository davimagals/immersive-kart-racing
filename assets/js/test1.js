
// Tela.
let screen = document.querySelector('#screen')

// Construir o cenário.
function buildScene(scene) {

    // Background geral.
    screen.style.backgroundImage = scene.general.background.image
    screen.style.backgroundSize = scene.general.background.size

    // Montar grade.
    const parts = scene.grid.parts
    for (let i = 0; i < parts.length; i++) {
        let tr = document.createElement('tr')

        for (let j = 0; j < parts[i].length; j++) {
            const td = buildPart(i, j, scene)
            tr.appendChild(td)
        }

        screen.appendChild(tr)
    }
}

// Construir cada parte da grade do cenário.
function buildPart(i, j, scene) {
    const part = scene.grid.parts[i][j]

    let td = document.createElement('td')

    // Tamanho.
    td.style.width = scene.grid.partSize
    td.style.height = scene.grid.partSize

    // Background.
    if (part.background) {
        td.style.backgroundSize = 'cover'
        td.style.backgroundImage =
            `url(./assets/racing-pack/PNG/Tiles/${part.background})`
    }

    // Objetos.
    if (part.objects) {
        for (let x = 0; x < part.objects.length; x++) {
            const object = part.objects[x]

            let div = document.createElement('div')
            div.style.width = object.size
            div.style.height = object.size
            div.style.position = 'absolute'
            div.style.backgroundSize = 'contain'
            div.style.backgroundRepeat = 'no-repeat'
            div.style.transform = object.transform
            div.style.top = object.position.top
            div.style.left = object.position.left

            div.style.backgroundImage =
                `url(./assets/racing-pack/PNG/Objects/${object.background})`

            td.style.position = 'relative'
            td.appendChild(div)
        }
    }

    return td
}

// Principal.
// speedway1 no arquivo speedway1.js
buildScene(speedway1)