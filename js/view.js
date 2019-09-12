// Alerts
let alert = $("<div>").attr("role", "alert").appendTo("#alertMessage");

function showAlert(type, message)
{
    alert.removeClass();
    alert.html(message);
    alert.addClass("alert");
    
    switch (type)
    {
        case "primary":
            alert.addClass("alert-primary");
            break;
        case "secondary":
            alert.addClass("alert-secondary");
            break;
        case "success":
            alert.addClass("alert-success");
            break;
        case "danger":
            alert.addClass("alert-danger");
            break;
        case "warning":
            alert.addClass("alert-warning");
            break;
        case "info":
            alert.addClass("alert-info");
            break;
        case "light":
            alert.addClass("alert-light");
            break;
        case "dark":
            alert.addClass("alert-dark");
            break;
    }

    alert.addClass("visible");
}

function hideAlert()
{
    alert.removeClass();
    alert.addClass("invisible");
}

function generateTables(target)
{
    if (target == CURRENT_INVESTMENTS_TARGET)
    {
        if (areCurrentInvestmentsTablesGenerated == false)
        {
            generateTableForLoanOriginatorQuantityInCurrentInvestments();
            areCurrentInvestmentsTablesGenerated = true;
            showAlert("info", "Toda la información relacionada con las inversiones actuales se ha generado.");
        }
        else
        {
            showAlert("warning", "Ya hay información generada, para volver a cargar otros archivos recarga la página.");
        }
    }
    else if (target == FINISHED_INVESTMENTS_TARGET)
    {
        if (areFinishedInvestmentsTablesGenerated == false)
        {

            areFinishedInvestmentsTablesGenerated = true;
            showAlert("info", "Toda la información relacionada con las inversiones finalizadas se ha generado.");
        }
        else
        {
            showAlert("warning", "Ya hay información generada, para volver a cargar otros archivos recarga la página.");
        }
    }
    else if (target == ACCOUNT_STATEMENT_TARGET)
    {
        if (areAccountStatementTablesGenerated == false)
        {
            generateTableForTotalDepositedAndWithdrawed();
            generateTableForGainedInterest();
            areAccountStatementTablesGenerated = true;
            showAlert("success", "Toda la información relacionada con el estado de tu cuenta se ha generado.");
        }
        else
        {
            showAlert("warning", "Ya hay información generada, para volver a cargar otros archivos recarga la página.");
        }
    }
    
    if ( (target == CURRENT_INVESTMENTS_TARGET || target == FINISHED_INVESTMENTS_TARGET) &&
            (areCurrentInvestmentsTablesGenerated == true && areFinishedInvestmentsTablesGenerated == true) )
    {
        if (areCombinationCurrentAndFinishedInvestmentsTablesGenerated == false)
        {
            generateTableForAllLoanOriginatorsInvestedIn();
            generateTableForLoanOriginatorsFinishedThatAreNotInCurrentInvestments();
            areCombinationCurrentAndFinishedInvestmentsTablesGenerated = true;
            showAlert("success", "Toda la información relacionada con las inversiones actuales y finalizadas se ha generado.");
        }
        else
        {
            showAlert("warning", "Ya hay información generada, para volver a cargar otros archivos recarga la página.");
        }
    }
}

// This function depends on current and finished investments.
function generateTableForAllLoanOriginatorsInvestedIn() {
    let investmentsLoanOriginators = listAllLoanOriginatorsWithRating();

    $("<h5>").html("Todos los originadores de préstamos con los que has invertido").appendTo("#firstRowFirstColumn");
    let table = $("<table>").addClass("table").appendTo("#firstRowFirstColumn");
    $("<thead>").html("<tr><th>Nombre</th><th>Evaluación</th></tr>").appendTo(table);
    let tbody = $("<tbody>").appendTo(table);

    for (let i=0; i<investmentsLoanOriginators.length; i++)
    {
        let row = $("<tr>").appendTo(tbody);
        $("<td>").html(investmentsLoanOriginators[i][0]).appendTo(row);
        let rate = $("<td>").html("<span>" + investmentsLoanOriginators[i][1] + "</span>").appendTo(row);

        switch(investmentsLoanOriginators[i][1])
        {
            case "A+":
                $(rate).addClass("ratingColorAPlus");
                break;
            case "A":
                $(rate).addClass("ratingColorA");
                break;
            case "A-":
                $(rate).addClass("ratingColorAMinus");
                break;
            case "B+":
                $(rate).addClass("ratingColorBPlus");
                break;
            case "B":
                $(rate).addClass("ratingColorB");
                break;
        }
    }
}

// This function depends on current investments only.
function generateTableForLoanOriginatorQuantityInCurrentInvestments() {
    let data = listLoanOriginatorQuantityInCurrentInvestments();

    $("<h5>").html("Cantidad de inversiones actuales por cada originador de préstamos").appendTo("#firstRowSecondColumn");
    let table = $("<table>").addClass("table").appendTo("#firstRowSecondColumn");
    $("<thead>").html("<tr><th>Nombre</th><th>Cantidad</th></tr>").appendTo(table);
    let tbody = $("<tbody>").appendTo(table);

    for (let i=0; i<data.length; i++)
    {
        let row = $("<tr>").appendTo(tbody);
        $("<td>").html(data[i][0]).appendTo(row);
        $("<td>").html("<span>" + data[i][1] + "</span>").appendTo(row);
    }
}

// This function depends on current and finished investments.
function generateTableForLoanOriginatorsFinishedThatAreNotInCurrentInvestments() {
    let data = listLoanOriginatorsFinishedThatAreNotInCurrentInvestments();

    $("<h5>").html("Originadores de préstamos en los que invertistes y ahora no tienes ninguna inversión con ellos").appendTo("#firstRowThirdColumn");
    let table = $("<table>").addClass("table").appendTo("#firstRowThirdColumn");
    $("<thead>").html("<tr><th>Nombre</th></tr>").appendTo(table);
    let tbody = $("<tbody>").appendTo(table);

    for (let i=0; i<data.length; i++)
    {
        let row = $("<tr>").appendTo(tbody);
        $("<td>").html(data[i]).appendTo(row);
    }
}

// This function only depends on account statement.
function generateTableForTotalDepositedAndWithdrawed()
{
    let deposited = calculateTotalDeposited();
    let withdrawed = calculateTotalWithdraw();

    $("<h4>").html("Transferencias").appendTo("#secondRow");
    let table = $("<table>").addClass("table").appendTo("#secondRow");
    $("<thead>").html("<tr><th>Total depositado</th><th>Total retirado</th><th>Total</th><th>Divisa</th></tr>").appendTo(table);
    let tbody = $("<tbody>").appendTo(table);

    for (let i=0; i<deposited.length; i++)
    {
        let row = $("<tr>").appendTo(tbody);
        $("<td>").html(deposited[i][0]).appendTo(row);
        let withdrawedQuantity = 0;

        for (let j=0; j<withdrawed.length; j++)
        {
            if (withdrawed[j][1] == deposited[i][1])
            {
                withdrawedQuantity = withdrawed[j][0];
            }
        }

        $("<td>").html(withdrawedQuantity).appendTo(row);
        $("<td>").html(deposited[i][0]+withdrawedQuantity).appendTo(row);
        $("<td>").html(deposited[i][1]).appendTo(row);
    }
}

// This function only depends on account statement.
function generateTableForGainedInterest()
{
    let deposited = calculateTotalDeposited();
    let withdrawed = calculateTotalWithdraw();
    let interest = calculateTotalInterestIncome();

    $("<h4>").html("Intereses").appendTo("#thirdRow");
    let table = $("<table>").addClass("table").appendTo("#thirdRow");
    $("<thead>").html("<tr><th>Intereses ganados</th><th>Porcentaje</th><th>Divisa</th></tr>").appendTo(table);
    let tbody = $("<tbody>").appendTo(table);

    for (let i=0; i<interest.length; i++)
    {
        let row = $("<tr>").appendTo(tbody);
        $("<td>").html(interest[i][0]).appendTo(row);

        let totalDeposited = 0;
        for (let j=0; j<deposited.length; j++)
        {
            if (deposited[j][1] == interest[i][1])
                totalDeposited = deposited[j][0];                
        }

        let totalWithdrawed = 0;
        for (let j=0; j<withdrawed.length; j++)
        {
            if (withdrawed[j][1] == interest[i][1])
                totalWithdrawed = withdrawed[j][0];                
        }

        $("<td>").html(interest[i][0]/(totalDeposited+totalWithdrawed)*100).appendTo(row);
        $("<td>").html(interest[i][1]).appendTo(row);
    }
}

// This function only depends on account statement.
function generateChartForAccumulatedInterest()
{
    let totalInterest = 0;
    let accumulatedInterest = new Array();
    let dates = new Array();

    for (let i=0; i<accountStatement.length; i++)
    {
        if (accountStatement[i][DETAILS_POS].indexOf(DETAILS_INTEREST) != -1)
        {
            totalInterest += Number(accountStatement[i][TURNOVER_POS]);
            accumulatedInterest.push(totalInterest);
            dates.push(accountStatement[i][DATE_POS]);
        }
    }


    
    var ctx = document.getElementById("interestCanvas").getContext("2d");

    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: "EUR",
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                borderColor: 'rgb(255, 99, 132)',
                data: accumulatedInterest
            }]
        },
        options: {}
    });
}