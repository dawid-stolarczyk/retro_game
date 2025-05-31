var endedGame = false
const gameContainer = document.getElementById('gameContainer')

const character = document.getElementById('character')
var godmode = false
var lifes = 3
let lastMove = ''
let countTheSameMove = 0
document.addEventListener('keydown', e => {
	if (e.key === 'ArrowLeft') {
		if (lastMove == 'left') {
			countTheSameMove++
		} else {
			countTheSameMove = 0
		}
		lastMove = 'left'

		let movePx = 7
		if (countTheSameMove > 10) {
			movePx = 10
		}
		moveCharacterLeft(movePx)
		return
	}
	if (e.key === 'ArrowRight') {
		if (lastMove == 'right') {
			countTheSameMove++
		} else {
			countTheSameMove = 0
		}
		lastMove = 'right'

		let movePx = 7
		if (countTheSameMove > 10) {
			movePx = 10
		}
		moveCharacterRight(movePx)
		return
	}
})
const maxLeftVal = 485
function moveCharacterLeft(movePx) {
	if (endedGame) {
		return
	}
	let characterLeftVal = parseInt(character.style.left)
	if (characterLeftVal - movePx < 0) {
		character.style.left = '0px'
	} else {
		character.style.left = characterLeftVal - movePx + 'px'
	}
}
function moveCharacterRight(movePx) {
	if (endedGame) {
		return
	}
	let characterLeftVal = parseInt(character.style.left)
	if (characterLeftVal + movePx > maxLeftVal) {
		character.style.left = maxLeftVal + 'px'
	} else {
		character.style.left = characterLeftVal + movePx + 'px'
	}
}

function spawnTheBomb() {
	let rand = Math.random() * maxLeftVal
	var bomb = document.createElement('img')
	bomb.classList.add('bomb')
	bomb.src = './img/bomb.png'
	bomb.style.left = rand + 'px'

	bomb.animate([{ top: '0px' }, { top: '360px' }], {
		duration: 2000,
	}).onfinish = () => {
		bomb.remove()
	}
	gameContainer.appendChild(bomb)
}
const spawnBombInterval = setInterval(spawnTheBomb, 2000)

function checkCollisions() {
	let characterPositionX = parseInt(character.style.left)
	let bombs = document.querySelectorAll('.bomb')
	bombs.forEach(bomb => {
		let bombLeftVal = parseInt(bomb.style.left)
		let bombTopVal = parseInt(bomb.getBoundingClientRect().top)
		if (
			characterPositionX <= bombLeftVal + 50 &&
			characterPositionX + 50 >= bombLeftVal &&
			bombTopVal > 435 &&
			!godmode
		) {
			var explosion = document.createElement('img')
			explosion.classList.add('explosionGif')
			explosion.src = './img/explosion.gif'
			explosion.style.top = bombTopVal - 100 + 'px'
			explosion.style.left = bombLeftVal + 'px'
			setTimeout(() => {
				explosion.remove()
			}, 500)
			gameContainer.appendChild(explosion)
			bomb.remove()

			if (lifes > 1) {
				document.getElementById('heart' + lifes).src = './img/heart2.svg'
				lifes--
				godmode = true
				character.animate([{ opacity: 1 }, { opacity: 0.3 }, { opacity: 1 }], {
					iterations: 3,
					duration: 1500,
				}).onfinish = () => {
					godmode = false
				}
			} else {
				endTheGame()
			}
		}
	})
}
const collisionsInterval = setInterval(checkCollisions, 100)

function endTheGame() {
	endedGame = true
	clearInterval(spawnBombInterval)
	clearInterval(collisionsInterval)
	document.getElementById('hearts').style.visibility = 'hidden'
	character.style.left = '250px'
	character.src = './img/character_crying.gif'

	var title = document.createElement('p')
	title.classList.add('loseTitle')
	title.innerHTML = 'PRZEGRAŁEŚ'
	gameContainer.appendChild(title)
}
