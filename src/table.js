function isNonEmptyArray(arrayElement) {
  return Array.isArray(arrayElement) && arrayElement.length > 0;
}

export function createTable(columnsArray, dataArray, tableId) {
  if (
    !isNonEmptyArray(columnsArray) ||
    !isNonEmptyArray(dataArray) ||
    !tableId
  ) {
    throw new Error(
      'Para a correta execução, precisamos de um array com as colunas, outro com as informações das linhas e também o id do elemento da tabela selecionada.'
    );
  }

  const tableElement = document.getElementById(tableId);

  if (!tableElement || tableElement.nodeName !== 'TABLE') {
    throw new Error('Id informado não corresponde a nenhum elemento table.');
  }

  createTableHader(tableElement, columnsArray);
  createTableBody(tableElement , dataArray, columnsArray);
}

function createTableHader(tableReference, columnsArray) {
  function createTheadElement(tableReference) {
    const thead = document.createElement('thead');
    tableReference.appendChild(thead);
    return thead;
  }

  const tableHeaderReference =
    tableReference.querySelector('thead') ?? createTheadElement(tableReference);

  const headerRow = document.createElement('tr');

  ['bg-blue-900', 'text-slate-200', 'sticky', 'top-0'].forEach((cssClass) => headerRow.classList.add(cssClass));

  for (const tableColumnObject of columnsArray) {
    const headerElement = /*html*/ `<th class='text-center'>${tableColumnObject.columnLabel}</th>`;

    headerRow.innerHTML += headerElement;
  }

  tableHeaderReference.appendChild(headerRow);
}

function createTableBody(tableReference, tableItems, columnsArray) {
  function createTbodyElement(tableReference) {
    const tbody = document.createElement('tbody');
    tableReference.appendChild(tbody);
    return tbody;
  }

  const tableBodyReference =
    tableReference.querySelector('tbody') ?? createTbodyElement(tableReference);

  // o método entries() retorna o iterator de um array
  // um iterator é um objeto que controla a iteração de cada um dos itens do array
  for (const [itemIndex, tableItem] of tableItems.entries()) {
    const tableRow = document.createElement('tr');

    ['even:bg-blue-200',].forEach(cssClass => tableRow.classList.add(cssClass));

    for (const tableColumn of columnsArray) {
      const formatFn = tableColumn.format ?? ((info) => info)

      tableRow.innerHTML += /*html*/ `<td class='text-center'>${formatFn(tableItem[tableColumn.accessor])}</td>`
    }
    tableBodyReference.appendChild(tableRow)
  }
}
