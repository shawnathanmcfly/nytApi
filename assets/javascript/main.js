var monthText = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
var days = 31;
var selDay, selMonth, selYear, compDate;
var selEndDay, selEndMonth, selEndYear, compEndDate;
    
    //takes in query and options for start and end date. If start or end is
    //omitted, a default of todays date is inserted
    //**********NOTE:  amount = number of sets to get. each increment adds 10 results 
    //to JSON object returned EX: 0 = 0 - 9, 1 = 10 - 19.

    //NOTHER NOTE: date needs to be in YYYYMMDD format, and in a string
    function searchNYT( entry, page, amount ,start, end ){

        var d = new Date(), startDate = start, endDate = end;

       

        if( start === undefined ){
            startDate = d.getFullYear().toString() + d.getMonth().toString() + d.getDay().toString();
            console.log(startDate);
        }
        if( end === undefined ){
            endDate = d.getFullYear().toString() + d.getMonth().toString() + d.getDay().toString();
            console.log(endDate);
        }
        if( page === undefined )
            page = 0;
        

        let urlQuery = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
        urlQuery += '?' + $.param({
                'api-key': "46e02f2d014a489ea182a65f77eb921e",
                'q': entry,
                'begin_date': startDate,
                'end_date' : endDate,
                'page' : page
                
            });

        var list = new Array();
        $.ajax({ 'url': urlQuery, 'method':"GET" }).then(function(callBack){

            console.log(callBack);

            let results = callBack.response.docs;

            for( let i = 0; i < amount; i++ ){
                let cutTime = results[i].pub_date.indexOf('T');

                results[i].pub_date = results[i].pub_date.slice( 0, cutTime );

                $("#articles").append( "<div id='listing" + (i * (page * 10)) + "' class='bg-primary rounded mt-3 mb-3 p-4'>" +
                
                    "<h2><a class='text-white' href='" + results[i].web_url + "'>" + 
                        results[i].headline.main + "</a></h2><br><h4>" + results[i].pub_date + "</h4></div>"

                );

            }
        });
        
    }

window.onload = function(){

    let curDate = new Date();

    //load up start date
    for( let i = 1969; i < curDate.getFullYear() + 1; i++ ){
        $("#startYear").append('<option>' + i + '</option>');
    }

    for( let i = 1; i < 13; i++ ){
        $("#startMonth").append('<option>' + monthText[i - 1] + '</option>');
    }

    for( let i = 1; i < days; i++ ){
        $("#startDay").append('<option id="' + i + '">' + i + '</option>');
    }

    //complete data for initial start date
    selYear = "" + $("#startYear").val();
    selMonth = "" + monthText.indexOf( $("#startMonth").val() ) + 1;
    selDay = "" + $("#startDay").val();
    compDate = selYear + selMonth + selDay;

    //load up end date
    for( let i = 1970; i < curDate.getFullYear() + 1; i++ ){
        $("#endYear").append('<option>' + i + '</option>');
    }

    for( let i = 1; i < 13; i++ ){
        $("#endMonth").append('<option>' + monthText[i - 1] + '</option>');
    }

    for( let i = 1; i < days; i++ ){
        $("#endDay").append('<option id="' + i + '">' + i + '</option>');
    }
    
    //complete data for initial end date
    selEndYear = "" + $("#endYear").val();
    selEndMonth = "" + monthText.indexOf( $("#endMonth").val() ) + 1;
    selEndDay = "" + $("#endDay").val();
    compEndDate = selEndYear + selEndMonth + selEndDay;
    
    $("#startYear, #startDay, #startMonth").change( function(){

        let numPad = "";

        switch( $(this).attr('id') ){
            case "startYear":
            selYear = "" + $(this).val();
            break;
            case "startMonth":

            selMonth = "" + (monthText.indexOf( $(this).val() ) + 1 );
            if( monthText.indexOf( $(this).val() ) + 1 < 10 )
                selMonth = '0' + selMonth;
            days = 31;

            let dayChange = $(this).val();

            if( dayChange === "Apr" || dayChange === "Jun" || dayChange === "Sep" || 
                dayChange === "Nov" )
                days = 30;
            else if( dayChange === "Feb")
                days = 28;

            $("#startDay").empty();

            for( let i = 1; i <= days; i++ ){
                $("#startDay").append('<option>' + i + '</option>');
            }
            break;
            case "startDay":
            selDay = "" + $(this).val();
            
            break;
            default:
            break;

        }

        compDate = selYear + selMonth + selDay;

    });

    $("#endYear, #endDay, #endMonth").change( function(){

        let numPad = "";

        switch( $(this).attr('id') ){
            case "endYear":
            selEndYear = "" + $(this).val();
            break;
            case "endMonth":

            selEndMonth = "" + (monthText.indexOf( $(this).val() ) + 1 );
            if( monthText.indexOf( $(this).val() ) + 1 < 10 )
                selEndMonth = '0' + selEndMonth;
            days = 31;

            let dayChange = $(this).val();

            if( dayChange === "Apr" || dayChange === "Jun" || dayChange === "Sep" || 
                dayChange === "Nov" )
                days = 30;
            else if( dayChange === "Feb")
                days = 28;

            $("#endDay").empty();

            for( let i = 1; i <= days; i++ ){
                $("#endDay").append('<option>' + i + '</option>');
            }
            break;
            case "endDay":
            selEndDay = "" + $(this).val();
            
            break;
            default:
            break;

        }

        compEndDate = selEndYear + selEndMonth + selEndDay;

        console.log(compEndDate);
    });

    $("#clear").on("click", function(){
        $("#articles").empty();
    });

    $("#searchButton").on( "click", function(){

        let page = 0, i = 0;

        

            searchNYT( $("#search").val(), page, parseInt($("#records").val()) ,compDate, compEndDate );
            i += 10;

       
        
    });
}