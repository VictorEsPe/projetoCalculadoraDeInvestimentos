import { generateReturnsArray } from './src/investimentsGoals';
import { Chart } from 'chart.js/auto';
import { createTable } from './src/table';

const form = document.getElementById('investment-form');
const clearFormBtn = document.getElementById('clear-form');
const finalMoneyChart = document.getElementById('final-money-distribution');
const progressionChart = document.getElementById('progression');
let doughnutChartReference = {};
let progressionChartReference = {};

const columnsArray = [
  { columnLabel: 'Mês', accessor: 'month' },
  { columnLabel: 'Total investido', accessor: 'investedAmount', format: (numberInfo) => formatCurrencyToTable(numberInfo) },
  { columnLabel: 'Rendimento mensal', accessor: 'interestReturns', format: (numberInfo) => formatCurrencyToTable(numberInfo) },
  { columnLabel: 'Rendimento total', accessor: 'totalInterestReturns', format: (numberInfo) => formatCurrencyToTable(numberInfo) },
  { columnLabel: 'Quantia Total', accessor: 'totalAmount', format: (numberInfo) => formatCurrencyToTable(numberInfo) },
];

function formatCurrencyToTable(value) {
  return value.toLocaleString('pt-BR', {style: 'currency', currency:'BRL'});
}

function formatCurrencyToGraph(value) {
  return value.toFixed(2);
}

function renderProgression(e) {
  e.preventDefault();

  if (document.querySelector('.error')) {
    return;
  }

  resetCharts();
  resetTable()

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

  const finalInvestmentObject = returnsArray[returnsArray.length - 1];

  doughnutChartReference = new Chart(finalMoneyChart, {
    type: 'doughnut',
    data: {
      labels: ['Total investido', 'Rendimento', 'Imposto'],
      datasets: [
        {
          data: [
            formatCurrencyToGraph(finalInvestmentObject.investedAmount),
            formatCurrencyToGraph(
              finalInvestmentObject.totalInterestReturns * (1 - taxRate / 100)
            ),
            formatCurrencyToGraph(
              finalInvestmentObject.totalInterestReturns * (taxRate / 100)
            ),
          ],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
          ],
          hoverOffset: 4,
        },
      ],
    },
  });

  progressionChartReference = new Chart(progressionChart, {
    type: 'bar',
    data: {
      labels: returnsArray.map(investmentObject => investmentObject.month),
      datasets: [
        {
          label: 'Total investido',
          data: returnsArray.map(investmentObject =>
            formatCurrencyToGraph(investmentObject.investedAmount)
          ),
          backgroundColor: 'rgb(255, 99, 132)',
        },
        {
          label: 'Retorno do investimento',
          data: returnsArray.map(investmentObject =>
            formatCurrencyToGraph(investmentObject.interestReturns)
          ),
          backgroundColor: 'rgb(54, 162, 235)',
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
    },
  });

  createTable(columnsArray, returnsArray, 'results-table');
}

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function resetCharts() {
  if (
    !isObjectEmpty(doughnutChartReference) &&
    !isObjectEmpty(progressionChartReference)
  ) {
    // destroy() é um método dos objetos do Chart.js
    doughnutChartReference.destroy();
    progressionChartReference.destroy();
  }
}

function resetTable() {
  const tableElement = document.getElementById('results-table');
  tableElement.innerHTML = '';
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

  resetCharts();
  resetTable()
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
    parentElement.classList.remove('error');
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

const mainEl = document.querySelector('main');
const carouselEl = document.getElementById('carousel');
const previousButton = document.getElementById('slide-arow-previous');
const nextButton = document.getElementById('slide-arow-next');

previousButton.addEventListener('click', () => {
  carouselEl.scrollLeft -= mainEl.clientWidth;
})

nextButton.addEventListener('click', () => {
  carouselEl.scrollLeft += mainEl.clientWidth;
})

form.addEventListener('submit', renderProgression);
clearFormBtn.addEventListener('click', clearForm);
