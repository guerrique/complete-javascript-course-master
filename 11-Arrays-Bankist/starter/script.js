'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-11-15T17:01:17.194Z',
    '2020-11-17T23:36:17.929Z',
    '2020-11-18T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-11-18T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatMovementDate = function (date) {
    const calcDaysPassed = (date1, date2) =>
      Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));


    const daysPassed = calcDaysPassed(new Date(), date);
    // console.log(daysPassed);

    if(daysPassed === 0) return 'Today';
    if(daysPassed === 1) return 'Yesterday';
    if(daysPassed <= 7) return `${daysPassed} days ago`;
    else {
        const day = `${date.getDate()}`.padStart(2, 0);
        const month = `${date.getMonth() + 1}`.padStart(2, 0);
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
}

const displayMovements = function(acc, sort = false) {
  containerMovements.innerHTML = '';

  //using the slice method here allows us to make a copy of the movements array
  //if we sort it directly we would mutate it and we don't want that
  const movs = sort ? acc.movements.slice().sort((a,b) => a - b) : acc.movements;

  movs.forEach(function(mov, index) {

    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[index]);
    const displayDate = formatMovementDate(date);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov}</div>
      </div>
        `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  })
}

// console.log(containerMovements.innerHTML);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;

};

const calcDisplaySummary = function(acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      //console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`
};

const createUserNames = function(accts) {
  accts.forEach(function(acc) {
    acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(word => word[0])
    .join('');
    });
};

createUserNames(accounts);
// console.log(accounts);

const updateUI = function(acc) {
  //display movements
    displayMovements(acc);

    //display balance
    calcDisplayBalance(acc);

    // display summary
    calcDisplaySummary(acc);
};

const startLogOutTimer = function() {
  const tick = function() {
    const min = String(Math.trunc(time / 60)).padStart(2,0);
    const seconds = String(time % 60).padStart(2,0);

  //in each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${seconds}`;

  //decrease 1 second
  //time --; c'est la meme chose

  //when the time is at zero, stop timer and log out user
    if(time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    time = time -1;
  };
  //set time to 2 minutes (in seconds)
  let time = 120;

  //call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

//Event Handler
let currentAccount, timer;

//fake always logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;



btnLogin.addEventListener('click', function(e) {
  // prevents form from submitting, very common thing to do when working with forms
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
    );
  // console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // console.log('login');

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    //makes the field loose its focus
    inputLoginPin.blur();

    if(timer) clearInterval(timer);

    timer = startLogOutTimer();

    //display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    //create current date
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2,0);
    const min = `${now.getMinutes()}`.padStart(2,0);

labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // console.log(amount, receiverAccount);
  inputTransferAmount.value = inputTransferTo.value = '';

  if(
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username)
  {
    // console.log('transfer valid');

    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    //add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    //updating UI
    updateUI(currentAccount);

    //rest timer
    clearInterval(timer);
    timer = startLogOutTimer();

  }
});

btnLoan.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {

    setTimeout(function() {//add movement to current data
        currentAccount.movements.push(amount);

        //add loan date
        currentAccount.movementsDates.push(new Date().toISOString());


        //update UI
        updateUI(currentAccount);

        //clear input field
        inputLoanAmount.value = '';}, 2500);

        clearInterval(timer);
        timer = startLogOutTimer();
  }
})

btnClose.addEventListener('click', function(e) {
  e.preventDefault();
  // console.log('delete');

  if(
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin) {

    // console.log('ok');

    //delete account
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    // console.log(index);
    accounts.splice(index, 1);

    //log out user (hide UI)
    containerApp.style.opacity = 0;

    //empty fields
    inputCloseUsername.value = inputClosePin.value = '';
  }
})

let sorted = false;


btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


//GETTING TOTAL OF ALL MOVEMENTS OF ALL ACCOUNTS BY FLATTENING ARRAYS

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

// const overalBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);

// const overalBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance2);


// //SORT METHODS
// movements.sort((a,b) => a - b);
// console.log(movements);

// movements.sort((a,b) => b - a);
// console.log(movements);

//SETINTERVAL
// setInterval(function() {
//     const now = new Date();
//     const hour = `${now.getHours()}`.padStart(2,0);
//     const min = `${now.getMinutes()}`.padStart(2,0);
//     const sec = `${now.getSeconds()}`.padStart(2,0);
//     console.log(`${hour}:${min}:${sec}`);
// }, 1000);



/////////////////////////////////////////////////
