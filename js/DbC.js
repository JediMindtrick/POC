dbc = {};
    
dbc.require
= function(tests)
{
     var toReturn = tests;
    
     toReturn.func = dbc.func;
    
     return toReturn;  
};
 
dbc.func
= function(delegate)
{
     var prior = this;
	 
     var  toReturn =
	  function()
     {
          prior.apply(this,arguments);
          return delegate.apply(this,arguments);
		  //Following DOES NOT WORK
		  //prior(arguments);
		  //return delegate(arguments);
     }; 
    
     toReturn.ensure = dbc.ensure;
    
     return toReturn;
};

dbc.ensure
= function(tests)
{
     var prior = this;
    
     var  toReturn =
	 function()
     {
			var toReturn = prior.apply(this,arguments); 
     		tests(toReturn);
			return toReturn;
			//Following DOES NOT WORK
			//var toReturn = prior(arguments); 
     		//tests(toReturn);
			//return toReturn;
     }; 
    
     return toReturn;
};

var Test = {FName: 'Brandon', LName: 'Wilhite'};
 
Test.myFunction
= dbc.require(function(someInt){
     if (someInt < 1) {
	 	throw 'error on require!';
	 }
})
 
 
.func(function(someInt){
          return (someInt*someInt);
})
 
 
.ensure(function(someReturn){
     if (someReturn > 12) {
	 	throw 'error on ensure!';
	 }
});

var failRequire
= function()
{
	try {
		alert(Test.myFunction(-1));
	}
	catch(e)
	{
		alert('exception caught: ' + e.toString());
	}
};
var failEnsure
= function()
{
	try {
		alert(Test.myFunction(4));
	}
	catch(e)
	{
		alert('exception caught: ' + e.toString());
	}
};
var success
= function()
{
	try {
		alert(Test.myFunction(2));
	}
	catch(e)
	{
		alert('exception caught: ' + e.toString());
	}
};