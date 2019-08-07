const CURRENT_INVESTMENTS_HEADER = ["Country", "ID", "Issue Date", "Loan Type", "Amortization Method", "Loan Originator", "Mintos Ratings", "Loan Amount", "Remaining Principal", "Next Payment", "Estimated Next Payment", "LTV", "Interest Rate", "Remaining Term", "Payments Received", "Status", "Buyback Guarantee", "My Investments", "Date of Investment", "Received Payments", "Outstanding Principal", "Amount in Secondary Market", "Price", "Discount/Premium", "Currency"];
const FINISHED_INVESTMENTS_HEADER = ["Country", "ID", "Issue Date", "Closing Date", "Loan Type", "Amortization Method", "Loan Originator", "Mintos Ratings", "Loan Amount", "Remaining Principal", "LTV", "Interest Rate", "Initial Term", "Payments Received", "Status", "Buyback Guarantee", "My Investments", "Date of Investment", "Received Payments", "Outstanding Principal", "Amount in Secondary Market", "Price", "Discount/Premium", "Currency", "Finished", "Rebuy reasons"];
const ACCOUNT_STATEMENT_HEADER = ["Transaction ID", "Date", "Details", "Turnover", "Balance", "Currency"];

const CURRENT_INVESTMENTS_TARGET = 0;
const FINISHED_INVESTMENTS_TARGET = 1;
const ACCOUNT_STATEMENT_TARGET = 2;

var currentInvestments;
var currentInvestmentsHeader;

var finishedInvestments;
var finishedInvestmentsHeader;

var accountStatement;
var accountStatementHeader;

var areCurrentInvestmentsTablesGenerated = false;
var areFinishedInvestmentsTablesGenerated = false;
var areAccountStatementTablesGenerated = false;
var areCombinationCurrentAndFinishedInvestmentsTablesGenerated = false;

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

    if (file.type == "text/csv")
    {
        let reader = new FileReader();

        reader.readAsText(file);
        reader.onload = function(readerEvent)
        {
            let colums = parseCSV(reader.result);
            
            if (colums.length > 0)
            {
                if (event.target == currentInvestmentsFileInput)
                {
                    currentInvestmentsHeader = colums[0];                    
                    if (currentInvestmentsHeader.equals(CURRENT_INVESTMENTS_HEADER))
                    {
                        colums.shift();
                        currentInvestments = colums;

                        if (currentInvestments.length > 0)
                        {
                            generateTables(CURRENT_INVESTMENTS_TARGET);
                        }
                        else
                        {
                            showAlert("danger", "Error de archivo: el archivo no contiene valores o no es el correcto.");
                        }
                    }
                    else
                    {
                        showAlert("danger", "Error de archivo: el archivo no incluye la cabecera de los valores o no es el correcto.");
                    }
                }
                else if (event.target == finishedInvestmentsFileInput)
                {
                    finishedInvestmentsHeader = colums[0];
                    if (finishedInvestmentsHeader.equals(FINISHED_INVESTMENTS_HEADER))
                    {
                        colums.shift();
                        finishedInvestments = colums;

                        if (finishedInvestments.length > 0)
                        {
                            generateTables(FINISHED_INVESTMENTS_TARGET);
                        }
                        else
                        {
                            showAlert("danger", "Error de archivo: el archivo no contiene valores o no es el correcto.");
                        }
                    }
                    else
                    {
                        showAlert("danger", "Error de archivo: el archivo no incluye la cabecera de los valores o no es el correcto.");
                    }
                }
                else if (event.target == accountStatementFileInput)
                {
                    accountStatementHeader = colums[0];
                    if (accountStatementHeader.equals(ACCOUNT_STATEMENT_HEADER))
                    {
                        colums.shift();
                        accountStatement = colums;

                        if (accountStatement.length > 0)
                        {
                            generateTables(ACCOUNT_STATEMENT_TARGET);
                        }
                        else
                        {
                            showAlert("danger", "Error de archivo: el archivo no contiene valores o no es el correcto.");
                        }
                    }
                    else
                    {
                        showAlert("danger", "Error de archivo: el archivo no incluye la cabecera de los valores o no es el correcto.");
                    }
                }
            }
            else
            {
                showAlert("danger", "Error de archivo: el archivo no tiene contenido o no se ha podido cargar correctamente.");
            }
        }
    }
    else
    {
        showAlert("danger", "Error de archivo: debes de seleccionar un archivo .csv");
    }
}

function parseCSV(text) {
    let rows = text.split("\n");
    rows.pop();

    let columns = new Array();

    for (let i=0; i<rows.length; i++)
    {
        columns.push(rows[i].split(","));
    }

    return columns;
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