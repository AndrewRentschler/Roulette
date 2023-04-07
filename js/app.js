// ---- Variables ----
let spins = []
const wheelNums = ["0","00","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36"]
const redNums = ["1","3","5","7","9","12","14","16","18","19","21","23","25","27","30","32","34","36"]
let blkNums = []
// ---- Outside Bets Winning Squares
const win1to18 = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18"]
const win19to36 = ["19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36"]
let winEven = wheelNums.filter(num=>(!(num%2) && num != "0" && num != "00"))
let winOdd = wheelNums.filter(num=>num%2)
const win1to12 = ["1","2","3","4","5","6","7","8","9","10","11","12"]
const win13to24 = ["13","14","15","16","17","18","19","20","21","22","23","24"]
const win25to36 = ["25","26","27","28","29","30","31","32","33","34","35","36"]
const minBet = 10
const maxBet = 100

const wheel = document.getElementById('wheel')
let spinBtn = document.querySelector('button')
let board = document.getElementById('board')
let boardNums = document.getElementById('numbers')
let betBoard = document.getElementById('bet-board')
let lastSpinEl = document.getElementById('last-spin')
let wheelInfoEl = document.getElementById('wheel-info')
let winMsgEl = document.getElementById('win-msg')
let insideBets = [...document.getElementsByClassName('numBet')]
let outsideBets = [...document.getElementsByClassName("outsideBet")]

let resetGameBtn = document.getElementById('reset-game')

let betCards = []
let bettingClosed = false

// ---- Event Listeners
spinBtn.addEventListener('click',function(evt){spins.push(new Spin(evt))})
board.addEventListener('click',function(evt){handleBoardClick(evt.target)})
resetGameBtn.addEventListener('click',main)
betBoard.addEventListener('click',handleBetBoardClick)

// ---- Classes ----
class Player {
  constructor(name, balance){
    this.name = name
    this.balance = balance
    this.bets = []
  }
  decBalance(amt){
    amt<this.balance ? this.balance -= amt : null
  }
  addBalance(amt){
    this.balance += amt
  }
  ckBet(amt){
    if (amt<this.balance){
      return true
    }else{
      return false
    }
  }
  resetBets(){this.bets = [];render()}
}

class Bet {
  constructor(tgt, amount){
    this.tgt = tgt
    this.amount = amount
    this.winner = false
    this.pays = 0
    this.text = tgt.innerText
    this.info = `${this.text} : $${this.amount}`
    this.getWinNums(tgt)
    this.takeBet(this.amount)
    this.betID = null
  }
  placeChip(){
    this.tgt.style['backgroundColor'] = '#bbb'
    this.tgt.style['borderRadius'] = '50%'
  }
  removeChip(){
    this.tgt.style['backgroundColor'] = ''
    this.tgt.style['borderRadius'] = ''
  }
  updateAmount(pos){
    if (pos){
      this.amount += 10
      return true
    }else{
      this.amount -= 10
      return true
    }
  }
  takeBet(amt){
    player.decBalance(amt)
    this.placeChip()
    render()
  }
  getEl(tgt){
    if (tgt.innerText.length <= 2){
      return insideBets.find(el=>el.innerText === this.text)
    }else{
      return outsideBets.find(el=>el.innerText === this.text)
    }
  }
  getWinNums(tgt){
    if (tgt.innerText.length <= 2){
      this.winNums = [tgt.innerText.toString()]
      this.pays = 35
    }else if (tgt.innerText == '1st 12'){
      this.winNums = win1to12
      this.pays = 4
    }else if (tgt.innerText == '2nd 12'){
      this.winNums = win13to24
      this.pays = 4
    }else if (tgt.innerText == '3rd 12'){
      this.winNums = win25to36
      this.pays = 4
    }else if (tgt.innerText == '1 to 18'){
      this.winNums = win1to18
      this.pays = 2
    }else if (tgt.innerText == '19 to 36'){
      this.winNums = win19to36
      this.pays = 2
    }else if (tgt.innerText == 'Even'){
      this.winNums = wheelNums.filter((num,i)=>{
        ((i > 1) && !(num % 2))
      })
      this.pays = 2
    }else if (tgt.innerText == 'Odd'){
      this.winNums = wheelNums.filter((num,i)=>{
        ((i > 1) && (num % 2))
      })
      this.pays = 2
    }else if (tgt.innerText == 'Red'){
      this.winNums = redNums
      this.pays = 2
    }else if (tgt.innerText == 'Black'){
      this.winNums = wheelNums.filter(x => redNums.indexOf(x) === -1)
      this.pays = 2
    }else{}
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
    this.winNum = wheelNums[Math.floor(Math.random() * wheelNums.length)]
    this.closeBets()
    this.checkBets(this.winNum)
    this.payouts()
    bettingClosed = false
    betCards = []
    betNum = 0
    lastSpinEl.innerText = `Last Spin: ${this.winNum}`
  }
  closeBets(){
    player.bets.forEach((bet)=>this.bets.push(bet))
    player.resetBets()  
    bettingClosed = true
  }
  checkBets(winNum){
    this.bets.forEach(function (bet){
      bet.winner = bet.winNums.some(numToCheck => numToCheck == winNum)
    })
  }
  payouts(){
    let isWinner = false
    this.bets.forEach(bet=>{
      if (bet.winner) {
        player.addBalance(bet.pays*bet.amount)
        winMsgEl.innerText = `Congratulations! Winner! $${bet.pays*bet.amount}`
        isWinner = true
      }
      bet.removeChip()
    })
    if (!(isWinner)){
      winMsgEl.innerText = `No hits.`
    }
    bettingClosed = false
  }
}
//....FUNCTIONS
let player = new Player("Andrew",1000)
render()
function handleBoardClick(tgt){
  if (!(bettingClosed) && tgt.childNodes.length < 2){ // If betting is Open, and the correct element was clicked
    let newBet = new Bet(tgt,minBet)
    player.bets.push(newBet)
  }
  render()
}
function render(){
  wheelInfoEl.innerText = `Player: ${player.name}\nBalance: ${player.balance}`
  betBoard.innerHTML = ''
  winMsgEl.innerText = ''
  player.bets.forEach((bet,idx)=>{
    bet.removeChip()
    addBetBoard(bet, idx)
  })
  renderRed()
}
function renderRed(){ // Render the Red nums Red, 
  insideBets.forEach((el)=>{
    redNums.some((redEl)=>redEl==el.innerText)?el.style['color'] = '#9f2305':el.style['color'] = 'Black'
  })
  outsideBets.find(el=>el.innerText=='Red').style['color'] = '#9f2305' // Render 'Red' Red
  outsideBets.find(el=>el.innerText=='Black').style['color'] = 'Black' // Render 'Black' Black
}
// ....BETBOARD....
function addBetBoard (bet, idx) { // Create New element to display the bet
  bet.betID = idx
  let newBetCard = document.createElement('div')
  newBetCard.className = `bet-card`
  newBetCard.innerHTML = 
  `<div id='bet-card-${idx}' class='bet'>
    <p>${bet.text}</p>
    <p>Bet $${bet.amount}</p>
    <button class="bet-adj-btn" id="bet-adj-btn-${idx}">-</button>
    <button class="bet-adj-btn" id="bet-adj-btn-${idx}">+</button>
    <button class='delete-btn' id='delete-btn-${idx}'>X</button>
  `
  betBoard.appendChild(newBetCard)
}

function handleBetBoardClick(evt){
  if (evt.target.className === 'delete-btn'){ // Handle Delete button
    const idx = evt.target.id.replace('delete-btn-', '')
    player.bets[idx].removeChip()
    player.addBalance(player.bets[idx].amount) //Return the bet amount to the player
    player.bets.splice(idx,1)
  }else if (evt.target.className === 'bet-adj-btn'){32
    const idx = evt.target.id.replace('bet-adj-btn-', '')
    if (evt.target.innerText==='+'){
      player.bets[idx].updateAmount(true)
    }else{
      player.bets[idx].updateAmount(false)
    }
  }
  render()
}

//....MAIN....
function main(){
  player = new Player("Andrew",1000)
  betNum = 0
  lastSpinEl.innerText = ''
  bettingClosed = false
  spins = []
  render()
}

main()