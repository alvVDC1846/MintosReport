const LOAN_ORIGINATOR = "Loan Originator";
const REMAINING_TERM = "Remaining Term";
const MINTOS_RATINGS = "Mintos Ratings";
const DETAILS = "Details";
const DETAILS_DEPOSIT = "Incoming client payment";
const DETAILS_WITHDRAW = "Withdraw application";
const DETAILS_INTEREST = "Interest income";
const TURNOVER = "Turnover";
const CURRENCY = "Currency";

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

function calculateTotalEuroDeposited()
{
    const DETAILS_POS = getColumnPositionFromHeader(DETAILS, accountStatementHeader);
    const TURNOVER_POS = getColumnPositionFromHeader(TURNOVER, accountStatementHeader);
    const CURRENCY_POS = getColumnPositionFromHeader(CURRENCY, accountStatementHeader);
    let totalDeposited = 0;

    for (let i=0; i<accountStatement.length; i++)
    {
        if (accountStatement[i][CURRENCY_POS] == "EUR" && accountStatement[i][DETAILS_POS] == DETAILS_DEPOSIT)
        {
            totalDeposited += Number(accountStatement[i][TURNOVER_POS]);
        }
    }
    return totalDeposited;
}

function calculateTotalEuroWithdraw()
{
    const DETAILS_POS = getColumnPositionFromHeader(DETAILS, accountStatementHeader);
    const TURNOVER_POS = getColumnPositionFromHeader(TURNOVER, accountStatementHeader);
    const CURRENCY_POS = getColumnPositionFromHeader(CURRENCY, accountStatementHeader);
    let totalWithdraw = 0;

    for (let i=0; i<accountStatement.length; i++)
    {
        if (accountStatement[i][CURRENCY_POS] == "EUR" && accountStatement[i][DETAILS_POS] == DETAILS_WITHDRAW)
        {
            totalWithdraw += Number(accountStatement[i][TURNOVER_POS]);
        }
    }
    return totalWithdraw;
}

function calculateTotalEuroInterestIncome()
{
    const DETAILS_POS = getColumnPositionFromHeader(DETAILS, accountStatementHeader);
    const TURNOVER_POS = getColumnPositionFromHeader(TURNOVER, accountStatementHeader);
    const CURRENCY_POS = getColumnPositionFromHeader(CURRENCY, accountStatementHeader);
    let totalInterest = 0;

    for (let i=0; i<accountStatement.length; i++)
    {
        if (accountStatement[i][CURRENCY_POS] == "EUR" && (accountStatement[i][DETAILS_POS].indexOf(DETAILS_INTEREST) != -1))
        {
            totalInterest += Number(accountStatement[i][TURNOVER_POS]);
        }
    }
    return totalInterest;
}