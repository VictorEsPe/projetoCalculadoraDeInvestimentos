import { generateReturnsArray } from './src/investimentsGoals';

const form = document.getElementById('investment-form');
const clearFormBtn = document.getElementById('clear-form');

function renderProgression(e) {
  e.preventDefault();

  if (document.querySelector('.error')) {
    return;
  }

  const startingAmount = Number(
    document.getElementById('starting-amount').value
  );
  const additionalContribution = Number(
    document.getElementById('additional-contribution').value
  );
  const timeAmount = Number(
    document.getElementById('time-amount').value.replace(',', '.')
  );
  const timeAmountPeriod = document.getElementById('time-amount-period').value;
  const returnRate = Number(
    document.getElementById('return-rate').value.replace(',', '.')
  );
  const returnRatePeriod = document.getElementById('evaluation-period').value;
  const taxRate = Number(
    document.getElementById('tax-rate').value.replace(',', '.')
  );

  const returnsArray = generateReturnsArray(
    startingAmount,
    timeAmount,
    timeAmountPeriod,
    additionalContribution,
    returnRate,
    returnRatePeriod
  );

  console.log(returnsArray);
}

function clearForm() {
  form['starting-amount'].value = '';
  form['additional-contribution'].value = '';
  form['time-amount'].value = '';
  form['return-rate'].value = '';
  form['tax-rate'].value = '';

  const errorInputsList = document.querySelectorAll('.error');

  for (const errorInput of errorInputsList) {
    errorInput.classList.remove('error');
    errorInput.parentElement.querySelector('p').remove();
  }
}

function validateInput(event) {
  // event.target aponta para o elemento que disparou o evento
  if (event.target.value === '') {
    return;
  }

  const parentElement = event.target.parentElement;
  const grandParentElement = event.target.parentElement.parentElement;
  const inputValue = event.target.value.replace(',', '.');

  if (
    isNaN(inputValue) ||
    (Number(inputValue) <= 0 && !parentElement.classList.contains('error'))
  ) {
    const errorTextElement = document.createElement('p');
    errorTextElement.classList.add('text-red-500');
    errorTextElement.innerText = 'Insira um valor numérico e maior que zero';

    parentElement.classList.add('error');
    grandParentElement.appendChild(errorTextElement);
  } else if (
    !isNaN(inputValue) &&
    Number(inputValue) > 0 &&
    parentElement.classList.contains('error')
  ) {
    parentElement.classList.  remove('error');
    grandParentElement.querySelector('p').remove();
  }
}

// a referência ao elemento 'form' possui um array contendo seus elementos filhos
for (const formElement of form) {
  if (formElement.tagName === 'INPUT' && formElement.hasAttribute('name')) {
    // 'blur' é o evento que é acionado quando um input perde o foco
    formElement.addEventListener('blur', validateInput);
  }
}

form.addEventListener('submit', renderProgression);
clearFormBtn.addEventListener('click', clearForm);