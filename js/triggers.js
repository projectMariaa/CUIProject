
async function triggers(data){
    // idle
    if(data[0].probability > 0.75){
        player.velocity.x = 0
        player.isAttacking = false
        player.isBlocking = false
        player.superPunch = false
    }
    // moveRight
    if(data[1].probability > 0.75){
        player.velocity.x += 3
    }  
    // moveLeft
    if(data[2].probability > 0.75){
        player.velocity.x -= 3
    }  
    // punch
    if(data[3].probability > 0.75){
        player.velocity.x = 0
        player.isAttacking = true
        player.superPunch = false
        player.isBlocking = false
    }  
    // block
    if(data[4].probability > 0.90){
        player.velocity.x = 0
        player.isBlocking = true
        player.superPunch = false
        player.isAttacking = false
    }  
    // superPunch
    if(data[5].probability > 0.55){
        player.velocity.x = 0
        player.isAttacking = false
        player.superPunch = true
        player.isBlocking = false
    }  
}