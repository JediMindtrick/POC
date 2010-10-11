/*
 * BASIC FUNCTIONS
 * Q(object obj,string prop)
 * 		adds a quality method to the passed object, also registers it
 * 		quality methods currently contain 'require', 'body', and 'ensure' methods attached
 * Q.check(bool someTest, string someErrorMsg);
 * 
 * ADVANCED FUNCTIONS
 * Q.report()
 * 		returns a list of report objects for all registered quality methods 
 * 
 * @param {Object} options
 */
Q = function(){
	/*
	 * object to hold code related to Q methods 
	 * require() is called first, then on success body() is called, then result is handed to ensure()  
	 */
	var QualityMethod =
	{
		/* 
		 * Function to create a require function, pass in (obj,prop) in order to be able to assign the results
		 * to a particular object property. 
		 */
		makeRequire : function(obj,prop){
			return	function(precondition){
     			var toReturn = precondition;
    
     			toReturn.body = QualityMethod.makeBody(obj,prop);
   
   				//the reason this is needed:
				/*
				 * This allows the chaining of calls like so: Q(someObj,'someMethod').require().body().ensure();
				 * without the need to assign the result.  
				 * Otherwise the call would have to be like this: 
				 * someObj.someMethod = Q.require().body().ensure();
				 */
     			obj[prop] = toReturn;
				return obj[prop];  
			};
		} ,
		/* 
		 * Function to create a body function, pass in (obj,prop) in order to be able to assign the results
		 * to a particular object property. 
		 */
		makeBody : function(obj,prop){
			return function(delegate){
     			var prior = this;
	 
				var  toReturn =
	  			function(){
          			prior.apply(this,arguments);
          			return delegate.apply(this,arguments);
     			}; 
    
     			toReturn.ensure = QualityMethod.makeEnsure(obj,prop);
    
     			obj[prop] = toReturn;
				
				return obj[prop];
			};
		} ,
		makeEnsure : function(obj,prop){
			//basic ensure function
			return function(postcondition){
     			var prior = this;
    
     			var  toReturn =
	 			function(){
					var toReturn = prior.apply(this,arguments); 
     				postcondition(toReturn);
					return toReturn;
     			}; 
    			//assign results
				obj[prop] = toReturn;
				
				return obj[prop];
			};	
		} 
	};
	var RegisteredMethods = [];
	var registerFunc = function(obj,prop){
		RegisteredMethods[obj] = {func : prop};
	};
	var registerObj = function(obj){
	};
	var myObjConstructor = function(obj){
		//decorate object
		return obj;  
	};
	var myFuncConstructor = function(obj,prop){
		//function that will be decorated
		var toDecorate = function(){};
		if (obj[prop] !== undefined) {
			toDecorate = obj[prop];
		}
			
		//decorate the function
		toDecorate.require = QualityMethod.makeRequire(obj,prop);
		toDecorate.body = QualityMethod.makeBody(obj,prop);
		toDecorate.ensure = QualityMethod.makeEnsure(obj,prop);
		
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