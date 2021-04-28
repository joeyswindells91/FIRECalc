
//*************** */ variable declarations*******************

var currentValues = $(".current");
var currentContributions = $(".monthly-contribution");
var interest = $(".interest");
var expenses = $(".expense");
// var sumofExpenses = $("#total-expenses").val();
var currentBitcoinPrice = 0;
// var withdrawalRate = $("#withdrawal-rate").val();
var totalExpenses = 0;

// ******************** bitcoin price update ************************ //

// var btn = document.querySelector("button");
var btcPriceDisplay = document.querySelector("#btcPrice");
var currSymbol = "USD";
// var	currencyDesc = document.querySelector("#currencyDesc");


function myFunction() {
  setInterval(function(){

    var XHR = new XMLHttpRequest();

  XHR.onreadystatechange = function(){
     if(XHR.readyState == 4 && XHR.status == 200){
       var data = JSON.parse(XHR.responseText);
        price = data.bpi.USD.rate;
        bitcoinprice = data.bpi.USD.rate_float;
        symbol = data.bpi[currSymbol].code;
        desc = data.bpi.USD.description;
        btcPriceDisplay.innerText = " = $" + price;

        currentBitcoinPrice = isNumber(parseFloat(bitcoinprice));

        // currncySymbol.innerText =  currSymbol;
        // currencyDesc.innerText = desc;
       }
    }
    var url = "https://api.coindesk.com/v1/bpi/currentprice.json";
    XHR.open("GET", url);
    XHR.send();


  }, 100);
}

myFunction();

// ************************************************************************ //

// compound calculation

function compoundCalculation(principal, monthlycont, interestrate, years) {


  var result = (principal * (Math.pow((1 + (interestrate/12)), (12 * years)))) + (monthlycont * (      (Math.pow(  (1 + (interestrate/12))  , ((12 * years)   )      )        -1           )     /            (interestrate/12)     ));

  if (isNaN(result)) {
    result = 0;
  }

  return result.toFixed(2);


};

// Convert String to Number Function

function ConvertToNumber(numberString) {

  var result = Number(numberString.replace(/[^0-9.-]+/g,""));

  return result;
};

function ConvertNumToCommas(result) {

  return result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

};

// determines if input is a number or not, if not- return 0
function isNumber(input) {
  if (isNaN(input)) {
    return 0;
  }
  return input;
}


$("#btc-holdings").change(function () {
  // when the bitcoin amount changes

  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  // find the current dollar value of that value within bitcoin amount
  var amount = ConvertToNumber($("#btc-holdings").val()) * currentBitcoinPrice;
  // make amount equal to current dollar value of that amount of bitcoin

  $("#btc-value").val(formatter.format(amount));
  //assign bitcoin-current to go through formatter function
  });



  $(".expense").change(function ()  {
    for (var i = 0; i <expenses.length; i++) {
      totalExpenses = totalExpenses + ConvertToNumber(expenses[i].value);
    }

    $("#total-expenses").val(totalExpenses.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    }));

    totalExpenses = 0;
  })

// changes any input with the class "dollar" to convert the value to a dollar amount

$(".dollar").change(function () {
  // Create USD currency formatter.
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});


// Use it.

var amount = ConvertToNumber($(this).val());
// var amount = document.getElementById('input').innerHTML;
$(this).val(formatter.format(amount));
});





$("#calculate").click(function() {

  $("#results").addClass("invisible");
  $("#results").addClass("d-none");


  // fire number equals annual expenses divided by withdrawal rate


  var FIREnumber =  ConvertToNumber($("#total-expenses").val())  / (ConvertToNumber($("#withdrawal-rate").val()) * .01);


  $("#target-number").html(ConvertNumToCommas(FIREnumber.toFixed(2)));


  var netWorth = 0;

  var nominalnetWorth = 0;

  var yearnumber = 0;


  while (netWorth < FIREnumber && yearnumber < 100) {

    netWorth = 0;
    nominalnetWorth = 0;

    for (var x = 0; x < currentValues.length; x++) {
      var principal = ConvertToNumber(currentValues[x].value);
      var monthly = ConvertToNumber(currentContributions[x].value);
      var rate = ((ConvertToNumber(interest[x].value))*.01) - (ConvertToNumber($("#inflation").val()) * .01);
      var nominalrate = (ConvertToNumber(interest[x].value))*.01;

      netWorth = netWorth + ConvertToNumber(compoundCalculation(principal, monthly, rate, yearnumber));

      nominalnetWorth = nominalnetWorth + ConvertToNumber(compoundCalculation(principal, monthly, nominalrate, yearnumber));
    }

    // netWorth = ConvertToNumber(compoundCalculation(700000, 1000, .1, yearnumber));


   yearnumber = yearnumber + .1

   }

   if (yearnumber <= 0) {
     alert("fill in your expenses!");
   }
   else if (yearnumber >=100) {
     $("#years").html("You'll never retire, inflation ate all your purchasing power");
     $("#results").removeClass("invisible");
     $("#results").removeClass("d-none");
   }
   else {
    $("#years").html((yearnumber - .1).toFixed(2));
    $("#results").removeClass("invisible");
    $("#results").removeClass("d-none");
   }



   $("#inflation-results").html(ConvertNumToCommas(netWorth.toFixed(2)));
   $("#no-inflation-results").html(ConvertNumToCommas(nominalnetWorth.toFixed(2)));


});


  // Tip Bitcoin Wallet Address code


function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}