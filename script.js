const stage = document.getElementById('stage')
const context = stage.getContext('2d')
const scoreContainer = document.querySelector('#score span')

const vel = 1

let velX = velY = 0
let headX = headY = 10
let gs = tc = 20
let appleX = appleY = 15
let trail = []
let tail = 4
let score = 0
let direction = 'right'
let isGameActive = true
let interval = null
let refreshTime = 60


// Game
const restart = () => {
    const gameOverScreen = document.getElementById('gameOverScreen')
    gameOverScreen.parentNode.removeChild(gameOverScreen)

    headX = headY = 10
    appleX = appleY = 15
    tail = 4
    trail = []
    score = 0

    scoreContainer.innerText = score

    isGameActive = true   

    start()

    direction = 'right'
    
    moveSnake()
}

const showGameOverScreen = () => {
    const div = document.createElement('div')
    div.setAttribute('id', 'gameOverScreen')
    div.innerHTML = `
        <h1>Game Over</h1>
        <h2>Your score: ${score}</h2>
        <button>Play Again</button>
    `

    document.getElementById('game').insertBefore(div, stage)
}

const stop = () => {
    clearInterval(interval)
}

const gameOver = () => {
    isGameActive = false  
    
    stop()

    showGameOverScreen()

    const restartButton = document.querySelector('#gameOverScreen button')
    restartButton.addEventListener('click', restart)
}

const gotEat = () => {
    tail++
    score++
    
    scoreContainer.innerText = score

    appleX = Math.floor(Math.random() * tc)
    appleY = Math.floor(Math.random() * tc)    
}

const createApple = () => {
    context.fillStyle = '#e74c3c'
    context.fillRect(appleX * gs, appleY * gs, gs, gs)
}

const createSnake = () => {
    context.fillStyle = '#2dd6af'
    for (let i = 0; i < trail.length; i++) {
        context.fillRect(trail[i].x*gs, trail[i].y*gs, gs-1, gs-1)
        if (trail[i].x === headX && trail[i].y === headY) gameOver()
    } 
}

const createBackground = () => {
    context.fillStyle = '#0a192f'
    context.fillRect(0, 0, stage.width, stage.height)
}   

const borderConfig = () => {
    if (headX < 0) headX = tc-1

    if (headX > tc-1) headX = 0

    if (headY < 0) headY = tc-1

    if (headY > tc-1) headY = 0
}

const game = () => {
    headX += velX
    headY += velY
    
    borderConfig()

    createBackground()
    createSnake()
    createApple()

    trail.push({x: headX, y: headY})

    while(trail.length > tail) trail.shift()

    if (appleX === headX && appleY === headY) gotEat() 
}

const start = () => interval = setInterval(game, refreshTime)
start()



// Controls
const moveSnake = () => {
    if (velY === 0) {
        if (direction === 'up') {
            velX = 0
            velY = -vel
        }
        if (direction === 'down') {
            velX = 0
            velY = vel
        }
    }
    if (velX === 0) {
        if (direction === 'left') {
            velX = -vel
            velY = 0
        }
        if (direction === 'right') {
            velX = vel
            velY = 0
        }
    }
}   
moveSnake()

const keyPush = (event) => {
    const key = event.key

    if (!isGameActive && key === 'Enter') restart()
    
    if (key === 'ArrowUp') direction = 'up'
    if (key === 'ArrowDown') direction = 'down'
    if (key === 'ArrowLeft') direction = 'left'
    if (key === 'ArrowRight') direction = 'right'

    moveSnake()
}   
document.addEventListener('keydown', keyPush) 



// Mobile
const mobileButtons = document.querySelectorAll('.mobileButtons button')
mobileButtons.forEach( button => {
    button.addEventListener('click', evt => {
        direction = evt.target.getAttribute('id')
        moveSnake()
    })
})