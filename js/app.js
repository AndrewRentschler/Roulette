console.log("...init")
// ---- Variables ----
const spins = []
const wheelNums = ["0","00","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36"]
const redNums = ["1","3","5","7","9","12","14","16","18","19","21","23","25","27","30","32","34","36"]
const blkNums = []
// ---- Outside Bets Winning Squares
const win1to18 = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18"]
const win19to36 = ["19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36"]
const winEven = wheelNums.filter(num=>(!(num%2) && num != "0" && num != "00"))
const winOdd = wheelNums.filter(num=>num%2)
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

let wheelInfoEl = document.getElementById('wheel-info')

let insideBets = [...document.getElementsByClassName('numBet')]
let outsideBets = [...document.getElementsByClassName("outsideBet")]

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];
var resetGame = document.getElementById('reset-game')

let betCards = []
let bettingClosed = false

// ---- Event Listeners
spinBtn.addEventListener('click',function(evt){
  spins.push(new Spin(evt))
})
board.addEventListener('click',function(evt){
  handleBoardClick(evt.target)
})
resetGame.onclick = function(evt) {
  main()
}
betBoard.addEventListener('click',deleteBetBoard)
// ---- Modal Handling
span.onclick = function() {modal.style.display = "none";}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


// ---- Classes ----
class Player {
  constructor(name, balance){
    this.name = name
    this.balance = balance
    this.bets = []
  }
  decBalance(amt){amt<this.balance ? this.balance -= amt:null;render()}
  addBalance(amt){
    this.balance += amt
    render()
    return amt
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

  
function setColor() {
  if (this.text === "0" || this.text === "00" ){
    this.color = "white"
  }else if (redNums.some(el=>el == this.text)){
    this.color = "red"
  }else if (this.text.length <= 2){
    this.color = "black"
  }
}
function renderColor(color){
  let sq = insideBets.find(el=>el.innerText === this.text)
  console.dir(sq)
  sq.style['color'] = color
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
    // console.log(`New Bet! ${betSq.text} for ${amount}`)
  }
  placeChip(){
    console.log(`...placing ${this.info}`)
    this.tgt.style['backgroundColor'] = '#bbb'
    this.tgt.style['borderRadius'] = '50%'
  }
  removeChip(){
    console.log(`...removing ${this.info}`)
    this.tgt.style['backgroundColor'] = ''
    this.tgt.style['borderRadius'] = ''
  }
  updateAmount(amt){
    this.amount = amt
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
    }else{

    }
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
    this.winNum = Math.floor(Math.random() * wheelNums.length)
    this.winNum = "5"
    console.log("Spin Winning Num", wheelNums[this.winNum])
    this.closeBets()
    this.checkBets(this.winNum)
    this.payouts()
    bettingClosed = false
    betCards = []
    betNum = 0
  }
  closeBets(){
    console.log("...Closing Bets")
    player.bets.forEach((bet)=>this.bets.push(bet))
    player.resetBets()  
    bettingClosed = true
  }
  checkBets(winNum){
    console.log(this.bets)
    this.bets.forEach(function (bet){
      bet.winner = bet.winNums.some(numToCheck => numToCheck == winNum)
    })
  }
  payouts(){
    this.bets.forEach(bet=>{
      console.log("Paying Out: ", (bet.winner ? player.addBalance(bet.pays*bet.amount) : null))
      bet.removeChip()
    })
    bettingClosed = false
  }

}

//....FUNCTIONS
let player = new Player("Andrew",1000)
render()
function handleBoardClick(tgt){
  console.dir(tgt)
  if (!(bettingClosed)){
    let newBet = new Bet(tgt,minBet)
    player.bets.push(newBet)
  }
  render()
}

function deleteBet(evt){
  null
}


function render(){
  wheelInfoEl.innerText = `Player: ${player.name}\nBalance: ${player.balance}`
  betBoard.innerHTML = ''
  player.bets.forEach((bet,idx)=>{
    addBetBoard(bet, idx)
  }
  )
  renderBoard()
}
// ....BETBOARD....
function addBetBoard (bet, idx) {
  bet.betID = idx
  let newBetCard = document.createElement('div')
  newBetCard.className = `bet-card`
  newBetCard.innerHTML = 
  `<div id='bet-card-${idx}' class='bet'>
    <p>${bet.text}</p>
    <p>${bet.amount}</p>
    <button class='delete-btn' id='delete-btn-${idx}'>X</button>
  `
  betBoard.appendChild(newBetCard)
}
function deleteBetBoard(evt){
  const idx = evt.target.id.replace('delete-btn-', '')
  player.bets[idx].removeChip()
  player.bets.splice(idx,1)


  render()
  
}


//....MAIN....
function main(){
  player = new Player("Andrew",1000)
  betNum = 0
  bettingClosed = false
  spins = []
  render()
}

main()