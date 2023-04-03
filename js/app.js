console.log("...init")


// ---- Variables ----
const spins = []
const wheelNums = ["0","00",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36]
const wheel = document.getElementById('wheel')
const spinBtn = document.querySelector('button')
let bettingClosed = false
const betSqs = []
let outsideBets = document.getElementsByClassName("outsideBet")
const redNums = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]
const board = document.getElementById('board')
let boardNums = document.getElementById('numbers')
let betNum = 0
let betBoard = document.getElementById('bet-board')
let insideBets = document.getElementsByClassName('numBet')


// ---- Event Listeners
spinBtn.addEventListener('click',function(evt){
  spins.push(new Spin())
})
board.addEventListener('click',function(evt){
  // console.log(evt.target)
  handleBoardClick(evt.target)
})
wheel.addEventListener('click',function(evt){
  // alert("Don't Touch the Wheel")
})

// ---- Classes ----
// class Game {
//   constructor(){
//     this.spins = []
//     this.players = []
//     this.wheelNums = ["0","00",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36]
//     this.wheel = document.getElementById('wheel')
//     this.spinBtn = document.querySelector('button')
//     this.bettingClosed = true
//     this.betSqs = this.createBetSqs()
//   }
//   createBetSqs(){
//     let betSqs = []
//     for (let num in this.wheelNums){
//       betSqs.push(new NumberBetSq(toString(num),35,"black",num))
//     }
//     // for (let outside in document.getElementsByClassName("column")){}
//     console.log("Create Bet Sqs",betSqs)
//   }
// }

// class Bet {
//   constructor(playerID, betSq, amount){
//     this.playerID = playerID
//     this.betSq = betSq
//     this.amount = amount
//   }
// }
class Player {
  constructor(name, balance){
    this.name = name
    this.balance = balance
    // this.avatar = null
    this.bets = []
  }
  decBalance(amt){amt>this.balance?this.balance-=amt:null}
  addBalance(amt){this.balance += amt}
  ckBalance(){return this.balance}
}

class BetSq {
  constructor(text, pays, winSqs){
    this.text = text
    this.pays = pays
    this.winSqs = winSqs
    this.color = null
    // this.style.backgroundColor = this.color
    this.setColor()
  }
  checkWinner(winNum){
    console.log(winNum)
    return this.winSqs.some((winSq)=>winSq == winNum)
  }
  setColor() {
    if (this.text === "0" || this.text === "00" ){
      this.color = "green"
    }else if (this.text in redNums){
      this.color = "red"
    }else{
      this.color = "black"
    }
  }
}
class Bet {
  constructor(betSq, amount){
    this.betSq = betSq
    this.amount = amount
    this.winner = false

    this.takeBet(amount)
    this.info = `${betSq.text} : $${amount}`
    // this.betID = betNum
    // betNum++
    console.log(`New Bet! ${betSq.text} for ${amount}`)
    //update player balance
    //place chip art on board
    //display the bet on screen
  }
  takeBet(amt){
    player.balance -= amt
  }
  deleteBet(){
    console.log('deletepress')
  }
}
class Spin {
  constructor(evt){
    this.evt = evt
    this.bets = []
    this.winNum = null
    this.winBetSq = null
    this.spin()

  }
  spin() {
    console.log("Spinning...")
    let winNum = Math.floor(Math.random() * wheelNums.length)
    console.log("Spin Winning Num", wheelNums[winNum].toString())
    // wheel.animation-play-state[play]
    //need a rand num function
    //need to run animation
    //need to close bets & collect them
    this.closeBets()
    //check WinningNum vs the bets
    this.checkBets()
    //-Payout bets and update balances
    this.render()
    bettingClosed = false
    //Reset board
  }
  closeBets(){
    console.log("...Closing Bets")
    bettingClosed = true
    player.bets.forEach((bet)=>this.bets.push(bet))
    // console.log(this.bets)
  }
  checkBets(){
    console.log("checkbets")
    console.log(this.bets)
    this.bets.forEach(bet=>{
      console.log(bet.betSq.text)
      if (bet.betSq.checkWinner(this.winNum)){
        console.log(`Winner! Pays ${bet.betSq.pays*bet.amount}`)
        console.dir(bet.betSq)
      }
    })

  }
  render(){
    // console.log(typeof this.bets[0])
  }
}
function createBetSqs() {
  let winNums = []
  for (let num in wheelNums){
    // console.log(typeof wheelNums[num])
    betSqs.push(
      new BetSq(
        wheelNums[num].toString(),
        35,
        [wheelNums[num].toString()]
      )
    )
  }
  // console.log(document.getElementsByClassName("column"))
  winNums = []
  for(i=1;i<19;i++){winNums.push(i)}
  betSqs.push(new BetSq("1 to 18", 1, winNums))
  winNums = []
  for(i=19;i<37;i++){winNums.push(i)}
  betSqs.push(new BetSq("19 to 36", 1, winNums))
  winNums = []
  for(i=1;i<13;i++){winNums.push(i)}
  betSqs.push(new BetSq("1st 12", 2, winNums))
  winNums = []
  for(i=12;i<25;i++){winNums.push(i)}
  betSqs.push(new BetSq("2nd 12", 2, winNums))
  winNums = []
  for(i=26;i<37;i++){winNums.push(i)}
  betSqs.push(new BetSq("3rd 12",2, winNums))
  betSqs.push(new BetSq("Red", 1, redNums))
  winNums = []
  for(i=19;i<37;i++){if (!(i in redNums)){winNums.push(i)}}
  betSqs.push(new BetSq("Black", 1, winNums))
  winNums = []
  for(i=1;i<37;i++){if (i%2){winNums.push(i)}}
  betSqs.push(new BetSq("Odd", 1, winNums))
  for(i=1;i<37;i++){if (!(i%2)){winNums.push(i)}}
  betSqs.push(new BetSq("Even", 1, winNums))
  console.log("Create Bet Sqs",betSqs)
  betSqs.forEach(sq=>sq.setColor())
}

function handleBoardClick(tgt){
  // console.dir(tgt)
  if (!bettingClosed){
    let click_betSq = betSqs.find(sq=>sq.text == tgt.innerText)
    let newBet = new Bet(click_betSq,100)
    player.bets.push(newBet)
    updateBetBoard(newBet) // NEED TO ADD AMOUNT
    // console.log(player.bets)
  }
}

function updateBetBoard(bet) {
  let betCard = document.createElement("div")
  betCard.className = 'bet-card'
  betCard.innerHTML =
  `<div class= 'bet'>
    <p>${bet.info}</p>
    <button class='delete-btn' id='delete-btn'>X</button>
  </div>`
  betBoard.appendChild(betCard)
}
createBetSqs()
let player = new Player("Andrew",1000)