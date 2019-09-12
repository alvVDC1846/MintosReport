const LOAN_ORIGINATOR = "Loan Originator";
const REMAINING_TERM = "Remaining Term";
const MINTOS_RATINGS = "Mintos Ratings";
const DETAILS = "Details";
const DETAILS_DEPOSIT = "Incoming client payment";
const DETAILS_WITHDRAW = "Withdraw application";
const DETAILS_INTEREST = "Interest income";
const TURNOVER = "Turnover";
const CURRENCY = "Currency";
const DATE = "Date";

var DETAILS_POS;
var TURNOVER_POS;
var CURRENCY_POS;
var DATE_POS;

// List load originators from current and finished investments. It does not show repeated values.
function listAllLoanOriginators()
{
    let currentInvestmentsLoanOriginators = listColumn(currentInvestments, getColumnPositionFromHeader(LOAN_ORIGINATOR, currentInvestmentsHeader));
    let finishedInvestmentsLoanOriginators = listColumn(finishedInvestments, getColumnPositionFromHeader(LOAN_ORIGINATOR, finishedInvestmentsHeader));
    let result = new Array();

    for (let i=0; i<currentInvestmentsLoanOriginators.length; i++)
    {
        if (!result.includes(currentInvestmentsLoanOriginators[i]))
            result.push(currentInvestmentsLoanOriginators[i]);
    }

    for (let i=0; i<finishedInvestmentsLoanOriginators.length; i++)
    {
        if (!result.includes(finishedInvestmentsLoanOriginators[i]))
            result.push(finishedInvestmentsLoanOriginators[i]);
    }

    return result.sort();
}

// List load originators and their rating from current and finished investments. It does not show repeated values.
function listAllLoanOriginatorsWithRating()
{
    let currentOriginators = new Array();
    let finishedOriginators = new Array();
    let result = new Array();

    for (let i=0; i<currentInvestments.length; i++)
    {
        let originator = new Array();
        originator.push(currentInvestments[i][getColumnPositionFromHeader(LOAN_ORIGINATOR, currentInvestmentsHeader)]);
        originator.push(currentInvestments[i][getColumnPositionFromHeader(MINTOS_RATINGS, currentInvestmentsHeader)]);
        currentOriginators.push(originator);
    }

    for (let i=0; i<finishedInvestments.length; i++)
    {
        let originator = new Array();
        originator.push(finishedInvestments[i][getColumnPositionFromHeader(LOAN_ORIGINATOR, finishedInvestmentsHeader)]);
        originator.push(finishedInvestments[i][getColumnPositionFromHeader(MINTOS_RATINGS, finishedInvestmentsHeader)]);
        finishedOriginators.push(originator);
    }

    let includedOriginatorsName = new Array();

    for (let i=0; i<currentOriginators.length; i++)
    {       
        if (!includedOriginatorsName.includes(currentOriginators[i][0]))
        {
            result.push(currentOriginators[i]);
            includedOriginatorsName.push(currentOriginators[i][0]);
        }
    }

    for (let i=0; i<finishedOriginators.length; i++)
    {
        if (!includedOriginatorsName.includes(finishedOriginators[i][0]))
        {
            result.push(finishedOriginators[i]);
            includedOriginatorsName.push(finishedOriginators[i][0]);
        }
    }    

    return result.sort();
}

function listCurrentInvestmentsAreLate()
{
    let remainingTermColumnPosition = getColumnPositionFromHeader(REMAINING_TERM, currentInvestmentsHeader);
    let lateInvestments = new Array();

    for (let i=0; i<currentInvestments.length; i++)
    {
        if (currentInvestments[i][remainingTermColumnPosition] == "Late")
            lateInvestments.push(currentInvestments[i]);
    }

    return lateInvestments;
}

function listLoanOriginatorQuantityInCurrentInvestments()
{
    let loanOriginatorsSorted = listColumn(currentInvestments, getColumnPositionFromHeader(LOAN_ORIGINATOR, currentInvestmentsHeader)).sort();
    let result = new Array(); // LoanOriginatorName/Quantity
    let lastOriginatorName = "";
    let counter = 0;

    for (let i=0; i<=loanOriginatorsSorted.length; i++)
    {
        if (lastOriginatorName != loanOriginatorsSorted[i])
        {
            result.push([lastOriginatorName, counter]);
            lastOriginatorName = loanOriginatorsSorted[i];
            counter = 1;
        }
        else
        {
            counter++;
        }
    }

    result.shift();
    return result;
}

function listLoanOriginatorsFinishedThatAreNotInCurrentInvestments()
{
    let currentInvestmentsLoanOriginators = listColumn(currentInvestments, getColumnPositionFromHeader(LOAN_ORIGINATOR, currentInvestmentsHeader));
    let finishedInvestmentsLoanOriginators = listColumn(finishedInvestments, getColumnPositionFromHeader(LOAN_ORIGINATOR, finishedInvestmentsHeader));
    let result = new Array();

    for (let i=0; i<finishedInvestmentsLoanOriginators.length; i++)
    {
        if (!currentInvestmentsLoanOriginators.includes(finishedInvestmentsLoanOriginators[i]) && !result.includes(finishedInvestmentsLoanOriginators[i]))
        {
            result.push(finishedInvestmentsLoanOriginators[i]);
        }
    }

    return result;
}

function calculateTotalDeposited()
{
    let totalDeposited = 0;
    let depositedCurrencies = new Array(); // Total deposited, currency
    let lastCurrency = accountStatementSortedByCurrency[0][CURRENCY_POS];

    for (let i=0; i<accountStatementSortedByCurrency.length; i++)
    {
        if (accountStatementSortedByCurrency[i][CURRENCY_POS] == lastCurrency && accountStatementSortedByCurrency[i][DETAILS_POS] == DETAILS_DEPOSIT)
        {
            totalDeposited += Number(accountStatementSortedByCurrency[i][TURNOVER_POS]);
        }
        else if (accountStatementSortedByCurrency[i][CURRENCY_POS] != lastCurrency && accountStatementSortedByCurrency[i][DETAILS_POS] == DETAILS_DEPOSIT)
        {
            depositedCurrencies.push([totalDeposited, lastCurrency]);
            totalDeposited = Number(accountStatementSortedByCurrency[i][TURNOVER_POS]);
            lastCurrency = accountStatementSortedByCurrency[i][CURRENCY_POS];
        }
        if (i == accountStatementSortedByCurrency.length-1)
            depositedCurrencies.push([totalDeposited, lastCurrency]);
    }
    return depositedCurrencies;
}

function calculateTotalWithdraw()
{
    let totalWithdraw = 0;
    let withdrawedCurrencies = new Array(); // Total withdrawed, currency
    let lastCurrency = accountStatementSortedByCurrency[0][CURRENCY_POS];

    for (let i=0; i<accountStatementSortedByCurrency.length; i++)
    {
        if (accountStatementSortedByCurrency[i][CURRENCY_POS] == lastCurrency && accountStatementSortedByCurrency[i][DETAILS_POS] == DETAILS_WITHDRAW)
        {
            totalWithdraw += Number(accountStatementSortedByCurrency[i][TURNOVER_POS]);
        }
        else if (accountStatementSortedByCurrency[i][CURRENCY_POS] != lastCurrency && accountStatementSortedByCurrency[i][DETAILS_POS] == DETAILS_WITHDRAW)
        {
            withdrawedCurrencies.push([totalWithdraw, lastCurrency]);
            totalWithdraw = Number(accountStatementSortedByCurrency[i][TURNOVER_POS]);
            lastCurrency = accountStatementSortedByCurrency[i][CURRENCY_POS];
        }
        if (i == accountStatementSortedByCurrency.length-1)
            withdrawedCurrencies.push([totalWithdraw, lastCurrency]);
    }
    return withdrawedCurrencies;
}

function calculateTotalInterestIncome()
{
    let totalInterest = 0;
    let interestCurrencies = new Array(); // Total interest gained, currency
    let lastCurrency = accountStatementSortedByCurrency[0][CURRENCY_POS];

    for (let i=0; i<accountStatementSortedByCurrency.length; i++)
    {
        if (accountStatementSortedByCurrency[i][CURRENCY_POS] == lastCurrency && (accountStatementSortedByCurrency[i][DETAILS_POS].indexOf(DETAILS_INTEREST) != -1))
        {
            totalInterest += Number(accountStatementSortedByCurrency[i][TURNOVER_POS]);
        }
        else if (accountStatementSortedByCurrency[i][CURRENCY_POS] != lastCurrency && (accountStatementSortedByCurrency[i][DETAILS_POS].indexOf(DETAILS_INTEREST) != -1))
        {
            interestCurrencies.push([totalInterest, lastCurrency]);
            totalInterest = Number(accountStatementSortedByCurrency[i][TURNOVER_POS]);
            lastCurrency = accountStatementSortedByCurrency[i][CURRENCY_POS];
        }
        if (i == accountStatementSortedByCurrency.length-1)
            interestCurrencies.push([totalInterest, lastCurrency]);
    }
    return interestCurrencies;
}