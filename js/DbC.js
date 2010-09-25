quality = function(options){
	
	
		var require 
		= function(precondition)
		{
     		var toReturn = precondition;
    
     		toReturn.func = dbc.func;
    
     		return toReturn;  
		};

		var body
		= function(delegate)
		{
     		var prior = this;
	 
		    var  toReturn =
	  		function()
     		{
          		prior.apply(this,arguments);
          		return delegate.apply(this,arguments);
     		}; 
    
     		toReturn.ensure = dbc.ensure;
    
     		return toReturn;
		};
		
		var ensure
		= function(postcondition)
		{
     		var prior = this;
    
     		var  toReturn =
	 		function()
     		{
				var toReturn = prior.apply(this,arguments); 
     			postcondition(toReturn);
				return toReturn;
     		}; 
    
     		return toReturn;
		};
	
		var myConstructor
		= function(){
			return {
				require: require,
				func: body,
				ensure: ensure		
			};
		};
	
		return myConstructor;
}();

dbc = quality();
    

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