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

// This function depends on current and finished investments.
function generateTableForAllLoanOriginatorsInvestedIn() {
    let investmentsLoanOriginators = listAllLoanOriginatorsWithRating();

    $("<h5>").html("Todos los originadores de préstamos con los que has invertido").appendTo("#investmentsLoanOriginatorsDiv");
    let table = $("<table>").addClass("table").appendTo("#investmentsLoanOriginatorsDiv");
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

    $("<h5>").html("Cantidad de inversiones actuales por cada originador de préstamos").appendTo("#loanOriginatorQuantityInCurrentInvestmentsDiv");
    let table = $("<table>").addClass("table").appendTo("#loanOriginatorQuantityInCurrentInvestmentsDiv");
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

    $("<h5>").html("Originadores de préstamos en los que invertistes y ahora no tienes ninguna inversión con ellos").appendTo("#loanOriginatorsFinishedThatAreNotInCurrentInvestmentsDiv");
    let table = $("<table>").addClass("table").appendTo("#loanOriginatorsFinishedThatAreNotInCurrentInvestmentsDiv");
    $("<thead>").html("<tr><th>Nombre</th></tr>").appendTo(table);
    let tbody = $("<tbody>").appendTo(table);

    for (let i=0; i<data.length; i++)
    {
        let row = $("<tr>").appendTo(tbody);
        $("<td>").html(data[i]).appendTo(row);
    }
}