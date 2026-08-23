function multiply(x , y){return x * y};
console.log( multiply(12,4));
console.log( multiply(5,4));

function getMultiplier (){return function(x , y){ return x * y}};
const product = getMultiplier();
console.log(product(5,5));

function getMultiplier2(x){return function(y){ return x * y};}
var multiplyByFive = getMultiplier2(5);
console.log(multiplyByFive(2)); 



  const array1 = ['A', 'B', 'C'];
const array2 = ['a', 'B', 'c'];

function checkIfUppercase(letter) {
  return letter === letter.toUpperCase();
}
function checkIflowercase(letter) {
  return letter !== letter.toUpperCase();
}

let myEvery = function(arr, cb) {
   for (let i = 0; i < arr.length; i++) {
      if (!cb(arr[i])) {
          return false;
      }
   }
   return true;
};
let mysome = function(arr, cb) {
   for (let i = 0; i < arr.length; i++) {
      if (cb(arr[i])) {
          return true;
      }
   }
   return false;
};

console.log(myEvery(array1, checkIfUppercase)); 
console.log(myEvery(array2, checkIfUppercase)); 
console.log(myEvery(array2, checkIflowercase));
console.log (array1.every(checkIfUppercase));

console.log(mysome(array1, checkIfUppercase));
console.log(mysome(array2, checkIfUppercase));




