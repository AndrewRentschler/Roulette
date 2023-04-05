console.log("...init")


// ---- Variables ----
const spins = []
const wheelNums = ["0","00",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36]
const wheel = document.getElementById('wheel')
const spinBtn = document.querySelector('button')
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var resetGame = document.getElementById('reset-game')
let bettingClosed = false
const betSqs = []
let outsideBets = [...document.getElementsByClassName("outsideBet")]
const redNums = ["1","3","5","7","9","12","14","16","18","19","21","23","25","27","30","32","34","36"]
const board = document.getElementById('board')
let boardNums = document.getElementById('numbers')
let betNum = 0
let betBoard = document.getElementById('bet-board')
let betCards = []
let insideBets = [...document.getElementsByClassName('numBet')]
let sliders = []
let wheelInfoEl = document.getElementById('wheel-info')

// ---- Event Listeners
spinBtn.addEventListener('click',function(evt){
  spins.push(new Spin())
})
board.addEventListener('click',function(evt){
  handleBoardClick(evt.target)
})
// wheel.addEventListener('click',function(evt){})
// betBoard.addEventListener('click',)
span.onclick = function() {modal.style.display = "none";}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
resetGame.onclick = function(event) {
  main()
}

// ---- Classes ----

class Player {
  constructor(name, balance){
    this.name = name
    this.balance = balance
    // this.avatar = null
    this.bets = []
  }
  decBalance(amt){amt<this.balance ? this.balance -= amt:null}
  addBalance(amt){this.balance += amt}
  ckBet(amt){
    if (amt<this.balance){
      return true
    }else{
      return false
    }

  }
}
class BetSq {
  constructor(text, pays, winSqs){
    this.text = text
    this.pays = pays
    this.winSqs = winSqs
    this.color = null
    // this.style.backgroundColor = this.color
    this.setColor()
    this.winSqs.length == 1 ? this.renderColor(this.color): null
    this.el = this.getEl()
  }
  getEl(){
    if (this.winSqs.length == 1){
      return insideBets.find(el=>el.innerText === this.text)
    }else{
      return outsideBets.find(el=>el.innerText === this.text)
    }
  }
  checkWinner(winNum){
    console.log(winNum)
    return this.winSqs.some((winSq)=>winSq == winNum)
  }
  setColor() {
    if (this.text === "0" || this.text === "00" ){
      this.color = "white"
    }else if (redNums.some(el=>el == this.text)){
      this.color = "red"
    }else if (this.text.length <= 2){
      this.color = "black"
    }
  }
  renderColor(color){
    let sq = insideBets.find(el=>el.innerText === this.text)
    console.dir(sq)
    sq.style['color'] = color
  }
}
class Bet {
  constructor(betSq, amount, betNum){
    this.betSq = betSq
    this.amount = amount
    this.winner = false
    this.takeBet(this.amount)
    this.info = `${betSq.text} : $${amount}`
    this.betID = betNum
    this.slider = null
    // betNum++
    console.log(`New Bet! ${betSq.text} for ${amount}`)
    this.placeChip()
    render()
    //update player balance
    //place chip art on board
    //display the bet on screen
  }
  placeChip(){
    this.betSq.el.style['backgroundColor'] = '#bbb'
    this.betSq.el.style['borderRadius'] = '50%'
  }
  removeChip(){
    this.betSq.el.style['backgroundColor'] = ''
    this.betSq.el.style['borderRadius'] = ''
  }
  updateAmount(amt){
    this.amount = amt
  }
  takeBet(amt){
    player.decBalance(amt)

    // console.log("Take Bet - User Balance Before ",player.balance)
    // this.decBalance(amt)
    // console.log("Take Bet - User Balance After ",player.balance)
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
    this.closeBets()
    document.getElementById('last-spin').textContent = "Spin Winning Num"+wheelNums[winNum].toString()
    this.checkBets()
    // this.render()
    bettingClosed = false
    //Reset board
  }
  closeBets(){
    console.log("...Closing Bets")
    bettingClosed = true
    player.bets.forEach((bet)=>this.bets.push(bet))
    console.log(this.bets)
  }
  checkBets(){
    console.log("checkbets")
    console.log(this.bets)
    this.bets.forEach(bet=>{
      console.log(bet.betSq.text)
      if (bet.betSq.checkWinner(this.winNum)){
        console.log(`Winner! Pays ${bet.betSq.pays*bet.amount}`)
        console.dir(bet.betSq)
        player.addBalance(bet.betSq.pays*bet.amount)
      }
      bet.removeChip()
    })

  }

}

//....FUNCTIONS
let player = new Player("Andrew",1000)

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
    if (player.ckBet(100)){
      let newBet = new Bet(click_betSq,100,betNum)
      modal.style.display = "none" // MODAL
      console.log(betNum)
      betNum++
      player.bets.push(newBet)
      updateBetBoard(newBet) // NEED TO ADD AMOUNT
      // console.log(player.bets)
    }
  }
}

function updateBetBoard(bet) {
  let betCard = document.createElement("div")
  betCard.className = 'bet-card'
  betCard.id = `betCard-${betNum}`
  betCard.innerHTML =
  `<div class= 'bet'>
    <p>${bet.info}</p><div class="slidecontainer">
    <input type="range" min="1" max="1000" value="0" class="slider" id="betSlider-${betNum}">
  </div>
    <button class='delete-btn' id='delete-btn-${betNum}'>X</button>
  </div>`

  betBoard.appendChild(betCard)
  betCards.push(betCard)
  bet.slider = document.getElementById(`betSlider-${betNum}`)
  sliders.push(bet.slider)
  console.log(sliders)
  console.log(betCards)
}
function render(){
  wheelInfoEl.innerText = `Player: ${player.name}\nBalance: ${player.balance}`
}

//....MAIN....
function main(){
  player = new Player("Andrew",1000)
  createBetSqs()
  betNum = 0
  betBoard
  render()
}

main()