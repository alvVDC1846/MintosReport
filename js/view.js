

function generateTableForAllLoanOriginatorsInvestedIn() {
    let investmentsLoanOriginators = listAllLoanOriginatorsWithRating();

    $("<h5>").html("Todos los originadores de préstamos con los que has invertido").appendTo("#investmentsLoanOriginatorsTable");
        let table = $("<table>").addClass("table").appendTo("#investmentsLoanOriginatorsTable");
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