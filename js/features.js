const LOAN_ORIGINATOR = "Loan Originator";
const REMAINING_TERM = "Remaining Term";

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