let clicks = 1;
const theButton = document.querySelector('#thebutton'); 

theButton.textContent = clicks;

theButton.addEventListener('click', function createbutton () {
  clicks++;

  const myNewButton = document.createElement('button');
  myNewButton.textContent = clicks;
 

  
  document.body.appendChild(myNewButton);
   
});
myNewButton.addEventListener('click', createbutton);