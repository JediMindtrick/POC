/*
 * BASIC FUNCTIONS
 * Q(object obj,string prop)
 * 		adds a quality method to the passed object
 * 		quality methods currently contain 'require', 'body', and 'ensure' methods attached
 * 		--add private 'register' method
 * Q.require(bool someTest, string someErrorMsg);
 * Q.ensure(bool someTest, string someErrorMsg);
 * 
 * ADVANCED FUNCTIONS
 * Q.report()
 * 		returns a list of report objects for all registered quality methods 
 * 
 * 
 * 
 * @param {Object} options
 */
Q = function(){
	//object to hold code related to Q methods
	var QualityMethod =
	{
//		method : function(){}, 
		require : function(precondition){
     		var toReturn = precondition;
    
     		toReturn.body = QualityMethod.body;
   
//   			this.method = toReturn;
     		return toReturn;  
		},
		body : function(delegate){
     		var prior = this;
	 
			var  toReturn =
	  		function()
     		{
          		prior.apply(this,arguments);
          		return delegate.apply(this,arguments);
     		}; 
    
     		toReturn.ensure = QualityMethod.ensure;
    
//			this.method = toReturn;
     		return toReturn;
		},
		ensure : function(postcondition){
     		var prior = this;
    
     		var  toReturn =
	 		function()
     		{
				var toReturn = prior.apply(this,arguments); 
     			postcondition(toReturn);
				return toReturn;
     		}; 
    
//			this.method = toReturn;
			return toReturn;
		}  
	};
	var registeredMethods = [];
	var registerFunc = function(obj,prop){	
		registeredMethods.push(prop);
	};
	var registerObj = function(obj){
	};
	var myObjConstructor = function(obj){
		//decorate object
		return obj;  
	};
	var myFuncConstructor = function(obj,prop){
		//function that will be decorated
		var toDecorate = null;
		if (obj[prop] === undefined) {
			toDecorate = function(){};
		}
		else {
			toDecorate = obj[prop];
		}
			
		//decorate the function
		//toDecorate.method = QualityMethod.method;
		toDecorate.require = QualityMethod.require;
		toDecorate.body = QualityMethod.body;
		toDecorate.ensure = QualityMethod.ensure;
		
		//assign the function
		obj[prop] = toDecorate;
		return obj[prop];
	};
	
	//main Q() returned
	return function(obj,prop){
		//if only an object is passed through, then we will decorate this as an object
		if (prop === undefined) {
			registerObj(obj);
			return myObjConstructor(obj);
		}
		//if an object and a property is passed through, then we will decorate this as a function
		else {
			registerFunc(obj,prop);
			return myFuncConstructor(obj, prop);
		}
	};
}();

//test commit

var Test = {FName: 'Brandon', LName: 'Wilhite'};

Q(Test,'myFunction')
.require(function(someInt){
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
 
/*
Test.myFunction
= Q.require(function(someInt){
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
*/

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