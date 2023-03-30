console.log("...init")


// ---- Variables ----
const spins = []
const players = []
const wheelNums = ["0","00",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36]
const wheel = document.getElementById('wheel')
const spinBtn = document.querySelector('button')
let bettingClosed = true
const betSqs = []
let outsideBets = document.getElementsByClassName("outsideBet")
const redNums = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]

// ---- Event Listeners
spinBtn.addEventListener('click',function(evt){
  spins.push(new Spin())
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
class Bet {
  constructor(playerID, betSq, amount){
    this.playerID = playerID
    this.betSq = betSq
    this.amount = amount
  }
  checkAmount(){
    //check if the amount is more than player balance
  }
}
class Spin {
  constructor(evt){
    this.evt = evt
    this.bets = []
    this.winNum = null
    this.spin()
    this.winBetSq = null
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
    //Reset board
  }
  closeBets(){
    console.log("...Closing Bets")
    bettingClosed = true
    players.forEach((player)=>this.bets.push(player.bets))
    console.log(this.bets)
  }
  checkBets(){
    console.log("checkbets")
    // this.bets.forEach((playerBets)=>{
    //   playerBets.forEach(bet => {
        
    //   });
    // })
  }

}
// class Bet {
//   constructor(playerID, betSq, amount){
//     this.playerID = playerID
//     this.betSq = betSq
//     this.amount = amount
//   }
// }
class Player {
  constructor(name, isUser, balance){
    this.name = name
    this.isUser = isUser
    this.balance = balance
    this.avatar = null
    this.bets = []
  }
}
class BetSq {
  constructor(text, pays){
    this.text = text
    this.pays = pays
  }
}
class NumberBetSq extends BetSq{
  constructor(text, pays, number){
    super(text,pays)
    this.color = null
    this.number = number
    this.setColor()
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
class OutsideBetsq extends BetSq{
  constructor(text, pays, winSqs){
    super(text, pays)
    this.winSqs = winSqs
  }
}

function createBetSqs() {
  let winNums = []
  for (let num in wheelNums){
    console.log(typeof wheelNums[num])
    betSqs.push(
      new NumberBetSq(
        wheelNums[num].toString(),
        35,
        wheelNums[num].toString()
      )
    )
  }
  // console.log(document.getElementsByClassName("column"))
  winNums = []
  for(i=1;i<19;i++){winNums.push(i)}
  betSqs.push(new OutsideBetsq("1 to 18", 1, winNums))
  winNums = []
  for(i=19;i<37;i++){winNums.push(i)}
  betSqs.push(new OutsideBetsq("19 to 36", 1, winNums))
  winNums = []
  for(i=1;i<13;i++){winNums.push(i)}
  betSqs.push(new OutsideBetsq("1st 12", 2, winNums))
  winNums = []
  for(i=12;i<25;i++){winNums.push(i)}
  betSqs.push(new OutsideBetsq("2nd 12", 2, winNums))
  winNums = []
  for(i=26;i<37;i++){winNums.push(i)}
  betSqs.push(new OutsideBetsq("3rd 12",2, winNums))
  betSqs.push(new OutsideBetsq("Red", 1, redNums))
  winNums = []
  for(i=19;i<37;i++){if (!(i in redNums)){winNums.push(i)}}
  betSqs.push(new OutsideBetsq("Black", 1, winNums))
  winNums = []
  for(i=1;i<37;i++){if (i%2){winNums.push(i)}}
  betSqs.push(new OutsideBetsq("Odd", 1, winNums))
  for(i=1;i<37;i++){if (!(i%2)){winNums.push(i)}}
  betSqs.push(new OutsideBetsq("Even", 1, winNums))
  console.log(outsideBets)
  console.log("Create Bet Sqs",betSqs)
}

createBetSqs()