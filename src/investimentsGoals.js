function convertToMonthlyReturnRate(yearlyReturnRate) {
  return yearlyReturnRate ** (1 / 12);
}

function generateReturnsArray(
  startingAmount = 0,
  timeHorizon = 0,
  timePeriod = 'monthly',
  monthlyContibution = 0,
  returnRate = 0,
  returnTimeFrame = 'monthly'
) {
  if (!timeHorizon || !startingAmount) {
    throw new Error(
      'Investimento inicial e prazo devem ser preenchidos com valores positivos'
    );
  }

  const finalReturnRate =
    returnTimeFrame === 'monthly'
      ? 1 + returnRate / 100
      : convertToMonthlyReturnRate(1 + returnRate / 100);

  const finalTimeHorizon =
    timePeriod === 'monthly' ? timeHorizon : timeHorizon * 12;

  const referenceInvestmentObject = {
    investedAmount: startingAmount,
    interestReturns: 0,
    totalInterestReturns: 0,
    month: 0,
    totalAmount: startingAmount,
  };

  const returnsArray = [referenceInvestmentObject];

  for( let timeReference; timeReference <= finalTimeHorizon; timeReference++) {
    const totalAmount = returnsArray[timeReference - 1].totalAmount * finalReturnRate + monthlyContibution;
    const interestReturns = returnsArray[timeReference - 1].totalAmount * finalReturnRate;
    const investedAmount = startingAmount + monthlyContibution * timeReference;
    const totalInterestReturns = totalAmount - investedAmount;
    
    returnsArray.push({
      investedAmount,
      interestReturns,
      totalInterestReturns,
      month: timeReference,
      totalAmount
    })
  }

  return returnsArray;
}