const bankaccount1 = {
  balance: 0,
  performTransaction(amount) {
    this.balance += amount;
  }
};

const bankaccount2 = {
  balance: 1000,
  performTransaction(amount) {
    this.balance += amount;
  }
};

bankaccount1.performTransaction(50);
bankaccount2.performTransaction(-200);

console.log(bankaccount1);
console.log(bankaccount2); 

function performTransaction2(amount) {
    this.balance += amount;
  }
;
performTransaction2.call(bankaccount1,10000);
console.log(bankaccount1); 


const depositFiftyInSavings = performTransaction2.bind(bankaccount1, 50);

depositFiftyInSavings();
console.log(bankaccount1.balance); 