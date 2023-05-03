// Get the canvas element and its context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// canvas size + gravity (not really used much)
canvas.width = 1024;
canvas.height = 576;
const gravity = 0.2;

// class for fighters in boxing game
class Fighter {
  constructor({ position, velocity, color = 'red', offset }) {
    this.position = position;
    this.color = color
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset: offset,
      width: 100,
      height: 50
    }
    this.blockBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset: offset,
      width: 100,
      height: 100
    }
    this.superPunchBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset: offset,
      width: 100,
      height: 50
    }
    this.isAttacking
    this.superPunch
    this.health = 100
    this.isBlocking 
  }
  draw() {
    ctx.fillStyle = this.color
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    //attack box
    if (this.isAttacking) {
      ctx.fillStyle = 'green'
      ctx.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
    }

    //block box
    if (this.isBlocking) {
      ctx.fillStyle = "rgba(153, 153, 225, .7)"
      ctx.fillRect(this.blockBox.position.x, this.blockBox.position.y, this.blockBox.width, this.blockBox.height)
    }

    // super punch box
    if (this.superPunch) {
      ctx.fillStyle = "yellow"
      ctx.fillRect(this.superPunchBox.position.x, this.superPunchBox.position.y, this.superPunchBox.width, this.superPunchBox.height)
    }

  }
  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x
    this.attackBox.position.y = this.position.y
    this.blockBox.position.x = this.position.x + this.blockBox.offset.x
    this.blockBox.position.y = this.position.y
    this.superPunchBox.position.x = this.position.x + this.superPunchBox.offset.x
    this.superPunchBox.position.y = this.position.y

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }
  attack() {
    this.isAttacking = true
    setTimeout(() => {
      this.isAttacking = false
    }, 100)
  }
  superPunchAttack() {
    this.superPunch = true
    setTimeout(() => {
      this.superPunch = false
    }, 100)
  }
  block() {
    this.isBlocking = true
    setTimeout(() => {
      this.isBlocking = false
    }, 600)
  }
}

// playable player
const player = new Fighter({
  position: {
    x: 300,
    y: 0
  },
  velocity: {
    x:0,
    y:0,
  },
  offset: {
    x:0,
    y:0
  }
})

// opponent
const enemy = new Fighter({
  position: {
    x: 600,
    y: 100
  },
  velocity: {
    x:0,
    y:0,
  },
  offset: {
    x:-50,
    y:0
  },
  color: 'blue'
})

// button override
const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

// collision detection of atack box
const rectangularCollision = ({ rectangle1, rectangle2 }) => {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
    rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width 
  )
}

// determine winner based on health
function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId)
  document.querySelector('#displayText').style.display = 'flex'
  if (player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Tie'
    setTimeout(() => {
      document.location.reload();
    }, 2000)
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
    setTimeout(() => {
      document.location.reload();
    }, 2000)
  } else if (player.health < enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
    setTimeout(() => {
      document.location.reload();
    }, 2000)
  }
}

// game timer
let timer = 200
let timerId
const timerCount = () => {
  if (timer > 0) {
    timerId = setTimeout(timerCount, 1000)
    timer--
    document.querySelector('#timer').innerHTML = timer
  }
  if (timer === 0) {
    determineWinner({ player, enemy, timerId})
    setTimeout(() => {
      document.location.reload();
    }, 2000)
  }
}
timerCount()

// animation on canvas
const animate = () => {
  window.requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

//movement
  if (keys.a.pressed && lastKey === 'a') {
    player.velocity.x += -3;
  } else if (keys.d.pressed && lastKey === 'd') {
    player.velocity.x += 3;
  }

  if (keys.ArrowLeft.pressed && lastKey === 'ArrowLeft') {
    enemy.velocity.x += -3;
  } else if (keys.ArrowRight.pressed && lastKey === 'ArrowRight') {
    enemy.velocity.x += 3;
  }

//collision + attack + block player
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) && 
    player.isAttacking && !(enemy.isBlocking) 
  ) {
    player.isAttacking = false;
    enemy.health -= 10
    document.querySelector('#enemyHealth').style.width = enemy.health + '%'
  } else if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) && 
    !(player.isAttacking) && !(enemy.isBlocking) && player.superPunch
  ) {
    player.superPunch = false;  
    enemy.health -= 30
    document.querySelector('#enemyHealth').style.width = enemy.health + '%'
  }
  // collision + attack + block enemy
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) && 
    enemy.isAttacking && !(player.isBlocking) 
  ) {
    enemy.isAttacking = false;  
    player.health -= 10
    document.querySelector('#playerHealth').style.width = player.health + '%'
  } else if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) && 
    !(enemy.isAttacking) && !(player.isBlocking) && emeny.superPunch
  ) {
    enemy.superPunch = false;  
    player.health -= 30
    document.querySelector('#playerHealth').style.width = player.health + '%'
  }

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}
animate();

// controls
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true;
      lastKey = 'd';
      break;
    case 'a':
      keys.a.pressed = true;
      lastKey = 'a';
      break;
    case ' ':
      player.attack()
      break;
    case 'e':
      player.block()
      break;
    case 'q':
      player.superPunchAttack()
      break;
    case 'ArrowRight':
      keys.ArrowRight.pressed = true;
      lastKey = 'ArrowRight';
      break;
    case 'ArrowLeft': 
      keys.ArrowLeft.pressed = true;
      lastKey = 'ArrowLeft';
      break;
    case 'ArrowUp':
      enemy.attack()
      break;
    case 'ArrowDown':
      enemy.block()
      break;
    case 'p':
      enemy.superPunchAttack()
      break;
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      lastKey = 'ArrowRight';
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      lastKey = 'ArrowLeft';
      break;
}
})