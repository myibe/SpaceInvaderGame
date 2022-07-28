// PROJET SETUP
// CANVAS AND WINDOW OF THE CANVAS

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

// CREATE AND MOVE THE PLAYER

class Player {
    constructor() {

        this.velocity = {
            x: 0,
            y: 0,
        }

        this.rotation = 0

// SPACESHIP IMAGE FOR PLAYER

        const image = new Image()
        image.src = './images/player.png'
        image.onload = () => {
            this.image = image
            this.width = image.width
            this.height = image.height
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }
    }

    draw() {
        // c.fillStyle = 'red'
        // c.fillRect(this.position.x , this.position.y, this.width, this.height)
        c.save()
        c.translate(
            player.position.x + player.width / 2, 
            player.position.y + player.height / 2
        )
        c.rotate(this.rotation)
        c.translate(
            -player.position.x - player.width / 2, 
            -player.position.y - player.height / 2
        )

        c.drawImage(
            this.image, 
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
        )

        c.restore()
    }


    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
        }
    }
}

class Projectile {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity

        this.radius = 3
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, 
            Math.PI * 2)
        c.fillStyle = 'red'
        c.fill()
        c.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}


// INVADERS


class Invader {
    constructor({position}) {

        this.velocity = {
            x: 0,
            y: 0,
        }

        const image = new Image()
        image.src = './images/enemy2.png'
        image.onload = () => {
            const scale = .5
            this.image = image
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: position.x,
                y: position.y
        }
    }
}
    draw() {
        // c.fillStyle = 'red'
        // c.fillRect(this.position.x , this.position.y, this.width, this.height)


        c.drawImage(
            this.image, 
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
        )

    }


    update({velocity}) {
        if (this.image) {
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y

        }
    }
}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 3,
            y: 0
        }

        this.invaders =[]

        const columns = Math.floor(Math.random() * 10 + 5)
        const rows = Math.floor(Math.random() * 5 + 2)

        this.width = columns * 30

        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(
                    new Invader({
                        position: {
                            x: x * 30,
                            y: y * 30
                        }
                    })
                )
            }
        }
        console.log(this.invaders)
    }

    update () {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this;this.velocity.y = 0

        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }


    }
}
// PLAYER
const player = new Player()
// ADDING PROJECTILES
const projectiles = []
// ENEMIES
const grids = []

const keys = {
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    space: {
        pressed: false
    },

}
let frames = 0
let randomInverval  = Math.floor(Math.random() * 500) + 500

console.log(randomInverval)

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    projectiles.forEach((projectile, index) => {

        if(projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
            projectiles.splice(index, 1)
            }, 0)
        } else {
            projectile.update()
        }
    })

    grids.forEach(grid => {
        grid.update()
        grid.invaders.forEach((invader, i) => {
            invader.update({velocity : grid.velocity})

            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <= 
                    invader.position.y + invader.height &&
                    projectile.position.x + projectile.radius >= invader.position.x && 
                    projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >= invader.position.y
                    ) {

                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(
                            (invader2) => invader2 == invader
                        )
                        const projectileFound = projectiles.find(
                            (projectile2) => projectile2 === projectile
                        )
                        // remove invaders and projectiles 
                        if (invaderFound && projectileFound) {
                        grid.invaders.splice(i, 1)
                        projectiles.splice(j, 1)

                        if (grid.invaders/length > 0) {
                            const firstInvader = grid.invaders [0]
                            const lastInvader = grid.invaders [grid.invaders.length - 1]

                            grid.width = lastInvader.position.x - 
                                firstInvader.position.x
                            grid.position.x = firstInvader.position.x
                            }
                        }
                    }, 0)
                }
            })
        })
    })

// ROTATION OF THE SPACESHIP

    if (keys.ArrowLeft.pressed && player.position.x >= 0) {
        player.velocity.x = -7
        player.rotation = -.15
    } else if(keys.ArrowRight.pressed  && player.position.x + player.width < canvas.width) {
        player.velocity.x = 7
        player.rotation = .15
    } else {
        player.velocity.x = 0
        player.rotation = 0
    }
    
    // spawning enemies
    if (frames % randomInverval === 0) {
        grids.push(new Grid())
        randomInverval  = Math.floor(Math.random() * 500) + 500
        frames = 0
        console.log(randomInverval)
    }

    frames++
}

animate()

addEventListener('keydown', ({key}) => {
    // console.log(key)
    switch(key) {
        case 'ArrowLeft':
            // console.log('left')
            player.velocity.x = -5
            keys.ArrowLeft.pressed = true
            break
        case 'ArrowRight':
            // console.log('right')
            keys.ArrowRight.pressed = true
            break    
        case ' ':
            // console.log('space')
            projectiles.push(
                new Projectile({
                    position: {
                        x: player.position.x + player.width / 2,
                        y: player.position.y
                    },
                    velocity: {
                        x: 0,
                        y: -10
                    }
                }))
            break  
    }
})

addEventListener('keyup', ({key}) => {
    // console.log(key)
    switch(key) {
        case 'ArrowLeft':
            // console.log('left')
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowRight':
            // console.log('right')
            keys.ArrowRight.pressed = false
            break    
        case ' ':
            // console.log('space')
            break  
    }
})