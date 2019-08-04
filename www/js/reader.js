var currentInvestments;
var currentInvestmentsHeader;

var finishedInvestments;
var finishedInvestmentsHeader;

var accountStatement;
var accountStatementHeader;

var currentInvestmentsFileInput = document.getElementById("currentInvestmentsFileInput");
var finishedInvestmentsFileInput = document.getElementById("finishedInvestmentsFileInput");
var accountStatementFileInput = document.getElementById("accountStatementFileInput");

window.onload = function() {
    currentInvestmentsFileInput.addEventListener("change", changedFileInputListener);
    finishedInvestmentsFileInput.addEventListener("change", changedFileInputListener);
    accountStatementFileInput.addEventListener("change", changedFileInputListener);
}

function changedFileInputListener(event) {

    let file = event.target.files[0];
    let reader = new FileReader();

    reader.readAsText(file);
    reader.onload = function(readerEvent) {
        let colums = parseCSV(reader.result);

        if (event.target == currentInvestmentsFileInput)
        {
            console.log("current");
            currentInvestmentsHeader = colums[0];
            colums.shift();
            currentInvestments = colums;
        }
        else if (event.target == finishedInvestmentsFileInput)
        {
            console.log("finished");
            finishedInvestmentsHeader = colums[0];
            colums.shift();
            finishedInvestments = colums;
        }
        else if (event.target == accountStatementFileInput)
        {
            console.log("account");
            accountStatementHeader = colums[0];
            colums.shift();
            accountStatement = colums;
        }
    }
}

function parseCSV(text) {
    let rows = text.split("\n");
    rows.pop();

    let colums = new Array();

    for (let i=0; i<rows.length; i++)
    {
        colums.push(rows[i].split(","));
    }

    return colums;
}

function listColumn(dataArray, columnPosition)
{
    let column = new Array();

    for (let i=0; i<dataArray.length; i++)
    {
        column.push(dataArray[i][columnPosition]);
    }
    return column;
}

function getColumnPositionFromHeader(columnName, header) {

    for (let i=0; i<header.length; i++)
    {
        if (header[i] == columnName)
        {
            return i;
        }
    }
}