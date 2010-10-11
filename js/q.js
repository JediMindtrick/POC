//test commit
q = function(options){
		var myRequire 
		= function(precondition)
		{
     		var toReturn = precondition;
    
     		toReturn.body = myBody;
    
     		return toReturn;  
		};

		var myBody
		= function(delegate)
		{
     		var prior = this;
	 
		    var  toReturn =
	  		function()
     		{
          		prior.apply(this,arguments);
          		return delegate.apply(this,arguments);
     		}; 
    
     		toReturn.ensure = myEnsure;
    
     		return toReturn;
		};
		
		var myEnsure
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
				require: myRequire,
				body: myBody,
				ensure: myEnsure		
			};
		};
	
		return myConstructor;
}()();

//q = dbc();
    

var Test = {FName: 'Brandon', LName: 'Wilhite'};
 
Test.myFunction
= q.require(function(someInt){
     if (someInt < 1) {
	 	throw 'error on require!';
	 }
})
 
 
.body(function(someInt){
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