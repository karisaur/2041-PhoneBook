var params = [];
var result = [];
var contactsAdded = new Number(0);
var strURL = "http://www.cse.yorku.ca/~cse93023/pb/pb.cgi";
var outOfSync = new Boolean();

function doAjax(funcSucceed, funcFail) {
	var request = false;
    var self = this;
	if (window.XMLHttpRequest) // Mozilla/Safari
		self.request = new XMLHttpRequest();
	else if (window.ActiveXObject) // IE
		self.request = new ActiveXObject("Microsoft.XMLHTTP");
	
	self.request.onreadystatechange = function() {
		if (self.request.readyState == 4) {
			if (self.request.status == 200) {
				funcSucceed();
			} else {
				outOfSync = true;
			}
		}
	}
	
	self.request.open('GET', strURL);
	self.request.send();
	funcFail();
}

function doAjaxCheckingNetwork(succeedFunc, failFunc) {
	var request = false;
    var self = this;
	if(blackberry.system.hasDataCoverage()) {
		if (window.XMLHttpRequest) { // Mozilla/Safari
			self.request = new XMLHttpRequest();
		} else if (window.ActiveXObject) { // IE
			self.request = new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		self.request.onreadystatechange = function() {
			if (self.request.readyState == 4) {
				if (self.request.status == 200) {
					succeedFunc();
				} else {
					failFunc("PIM");
				}
			}
		}
		self.request.open('GET', strURL);
		self.request.send();
	} else {
		failFunc("PIM");
	}
}
	
function doAjaxPost(sendFunction, succeedFunc) {
    var request = false;
    var self = this;
    // Mozilla/Safari
    if (window.XMLHttpRequest) {
        self.request = new XMLHttpRequest();
    }
    // IE
    else if (window.ActiveXObject) {
        self.request = new ActiveXObject("Microsoft.XMLHTTP");
    }
	
    self.request.open('POST', strURL, true);
    self.request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    self.request.onreadystatechange = function() {
        if (self.request.readyState == 4) {
			if (self.request.status == 200) {
				succeedFunc("SERVER", self.request.responseText);
			}
        }
    }
    self.request.send(sendFunction());
}

function search() { doAjaxCheckingNetwork(search_server, fetchData); }

function search_server() { doAjaxPost(searchQuery, fetchData); }

function searchQuery() 
	{ return "op=search&entry=" + escape(document.getElementById("text_searchTerm").value); }


function init() {
	document.body.appendChild(document.createElement("div"));
	setupView_LandingPage();
	document.body.style.height = screen.height + 'px';
}

/**
 Function:	clearTextField(Object id)
	Require:	id is an HTMLTextBoxElement, or some equivalent object.
	Ensure:		The object is cleared of its default value. If the value is anything else,
					it is left alone.
*/
function clearTextField(id){
	if (id.defaultValue == id.value) id.value = "";
} 

/** Function:	makeContactDataForm(HTMLElement form)
	Require: 	form is the wrapping HTMLElement (usually a div) that all the contact fields will reside in
	Ensure:		form contains all the fields and labels corresponding to a contact entry in the database.
	Purpose:	Given an HTMLElement form (commonly a div tag), makeContactDataForm(form) creates the usable 
					text boxes that hold contact data and stores them all in the HTMLElement object.
*/
function makeContactDataForm(form) {
	var argv = makeContactDataForm.arguments;
	var argc = argv.length;
	
	var ID = "";
	if (argc == 2)
		ID = "" + argv[1];
		
	var div_lastName = document.createElement("div");
	var label_lastName = document.createElement("label");
	label_lastName.setAttribute("for", "text_lastName" + ID);
	label_lastName.innerHTML = "Last name:";
	div_lastName.appendChild(label_lastName);
		
	var text_lastName = document.createElement("input");
	text_lastName.setAttribute("id", "text_lastName" + ID);
	text_lastName.setAttribute("name", "lastName");
	div_lastName.appendChild(text_lastName);
	form.appendChild(div_lastName);
		
	var div_firstName = document.createElement("div");
	var label_firstName = document.createElement("label");
	label_firstName.setAttribute("for", "text_firstName" + ID);
	label_firstName.innerHTML = "First Name:";
	div_firstName.appendChild(label_firstName);
		
	var text_firstName = document.createElement("input");
	text_firstName.setAttribute("id", "text_firstName" + ID);
	text_firstName.setAttribute("name", "firstName");
	div_firstName.appendChild(text_firstName);
	form.appendChild(div_firstName);
		
	var div_phoneNumber = document.createElement("div");
	var label_phoneNumber = document.createElement("label");
	label_phoneNumber.setAttribute("for", "text_phoneNumber" + ID);
	label_phoneNumber.innerHTML = "Phone Number:";
	div_phoneNumber.appendChild(label_phoneNumber);
		
	var text_phoneNumber = document.createElement("input");
	text_phoneNumber.setAttribute("id", "text_phoneNumber" + ID);
	text_phoneNumber.setAttribute("name", "number");
	div_phoneNumber.appendChild(text_phoneNumber);
	form.appendChild(div_phoneNumber);
		
	var div_address = document.createElement("div");
	var label_address = document.createElement("label");
	label_address.setAttribute("for", "text_address" + ID);
	label_address.innerHTML = "Address:";
	div_address.appendChild(label_address);
		
	var text_address = document.createElement("input");
	text_address.setAttribute("id", "text_address" + ID);
	text_address.setAttribute("name", "address");
	div_address.appendChild(text_address);
	form.appendChild(div_address);
}

/** Function: 	setupView_AddContact(null)
	Require:	nil
	Ensure:		The page contains the view for adding contacts to the database.
	Purpose:	Displays the form to add a contact to the database, when called. Should only be called
					when the user requests to add contacts.
*/
function setupView_AddContact() {
	var form = document.createElement("div");
	form.setAttribute("id", "contactDataForm");
	makeContactDataForm(form);

	var button_submit = document.createElement("input");
	button_submit.setAttribute("id", "add_submit");
	button_submit.setAttribute("type" , "image");
	button_submit.setAttribute("onclick", "add()");
	button_submit.setAttribute("src", "addcontact.gif");
	button_submit.setAttribute("value", "Add Entry");
	form.appendChild(button_submit);
	
	var button_back = document.createElement("input");
	button_back.setAttribute("id", "back_to_landing");
	button_back.setAttribute("type", "image");
	button_back.setAttribute("src", "goback.gif");
	button_back.setAttribute("onclick", "setupView_LandingPage()");
	button_back.setAttribute("value", "Back");
	form.appendChild(button_back);

	document.body.replaceChild(form, document.body.firstChild);
}
	
/** Function: 	setupView_SearchDatabase(null)
	Require:	 nil
	Ensure:		The page contains the correct view, the view associated with searching the address book.
	Purpose:	Displays the form that allows the user to search the application's database, when called.
					Should only be called in situations where the user has requested access to the
					applications entries, in the form of a search operation.
*/
function setupView_SearchDatabase() {
	var form = document.createElement("div");
	var text_searchBox = document.createElement("input");
	text_searchBox.setAttribute("id", "text_searchTerm");
	text_searchBox.setAttribute("value", "");
	text_searchBox.setAttribute("defaultValue", "");
	text_searchBox.setAttribute("name", "query");
	text_searchBox.setAttribute("onclick", "");
	form.appendChild(text_searchBox);
		
	var button_submit = document.createElement("input");
	button_submit.setAttribute("id", "search_submit");
	button_submit.setAttribute("type", "image");
	button_submit.setAttribute("value", "Search");
	button_submit.setAttribute("src", "search.gif");
	button_submit.setAttribute("onclick", "search()");
	form.appendChild(button_submit);
	var resultPane = document.createElement("span");
	resultPane.setAttribute("id", "contact_container");
	form.appendChild(resultPane);
	
	var button_back = document.createElement("input");
	button_back.setAttribute("id", "back_to_landing");
	button_back.setAttribute("type", "image");
	button_back.setAttribute("src", "goback.gif");
	button_back.setAttribute("onclick", "setupView_LandingPage()");
	button_back.setAttribute("value", "Back");
	form.appendChild(button_back);

	document.body.replaceChild(form, document.body.firstChild);
}

/** Function: 	setupView_LandingPage(null)
	Require:	nil
	Ensure:		The page contains the correct view, the view associated with asking the user what hto do next.
	Purpose:	To update the page to display the landing view.		
*/
function setupView_LandingPage() {
	var div_landing = document.createElement("div");
	
	var span_landingText = document.createElement("span");
	span_landingText.innerHTML = "What would you like to do today? <br /> <br />";
	div_landing.appendChild(span_landingText);
	
	var button_addContact = document.createElement("input");
	button_addContact.setAttribute("type", "image");
	button_addContact.setAttribute("value", "Add Entry");
	button_addContact.setAttribute("src", "addcontact.gif");
	button_addContact.setAttribute("onclick", "setupView_AddContact()");
	div_landing.appendChild(button_addContact);
	
	var button_searchDatabase = document.createElement("input");
	button_searchDatabase.setAttribute("type", "image");
	button_searchDatabase.setAttribute("value", "Search");
	button_searchDatabase.setAttribute("src", "search.gif");
	button_searchDatabase.setAttribute("onclick", "setupView_SearchDatabase()");
	div_landing.appendChild(button_searchDatabase);

	document.body.replaceChild(div_landing, document.body.firstChild);
}

/** Function: 	add(null)
	Require:	User enters appropriate data into the form created in the recent call to setupView_AddContact().
	Ensure:		The app creates a new contact entry from the given data. This contact is entered into the database.
	Purpose:	Assuming input is valid, this function creates a new contact object, adds it to the database, and displays a
					success message to the user. The object creation is delegated to the function createNewContact().
*/
function add() {
	doAjax(add_server, add_PIM); // Passes the two functions 
	var sucessMsg = document.getElementById("span_add_sucess");
	if (sucessMsg != null) document.body.firstChild.removeChild(sucessMsg);

	var span_sucess = document.createElement("span");
	span_sucess.setAttribute("id", "span_add_sucess");
	span_sucess.innerHTML = "Sucess!  Contact added.<br /><br />";
	document.body.firstChild.insertBefore(span_sucess, document.body.firstChild.firstChild);
}

function add_server() { doAjaxPost(querystring_add); }

/** Function: 	createNewContact(null)
	Require:	User enters appropriate data into the form created in the recent call to setupView_AddContact().
	Ensure:		A new contact is added to the database, constructed from appropriate data recieved from the user.
	Purpose:	Creates the new contact and stores it in the database.
*/
function add_PIM() {
		var address = new blackberry.pim.Address();
		address.address1 = document.getElementById("text_address").value;
		var contact = new blackberry.pim.Contact();
		contact.firstName = "" + document.getElementById("text_firstName").value;
		contact.lastName = "" + document.getElementById("text_lastName").value;
		contact.homePhone = "" + document.getElementById("text_phoneNumber").value;
		contact.homeAddress = address;
		
		if (outOfSync == true)
			contact.note = "STALE_NEW";
			
		contact.save();
}

function querystring_add() {
	var firstName = document.getElementById("text_firstName").value;
	var lastName = document.getElementById("text_lastName").value;
	var phoneNumber = document.getElementById("text_phoneNumber").value;
	var address = document.getElementById("text_address").value;
    return  "op=add&lastName=" + escape(lastName) + "&firstName=" + escape(firstName) + 
			"&phoneNumber=" + escape(phoneNumber) + "&address=" + escape(address);
}

/** Function:	searchForContact_PIM(null)
	Require:	nil
	Ensure:		Grabs all contacts that find() returns (blackberry API).
	Purpose:	Allows for data retrieval from the device PIM. Returns an array containing all 
					contacts in the PIM that matched the search query.
*/
function fetchData(str) {
	var argv = fetchData.arguments;
	var argc = argv.length;
	
	var oldContainer = document.getElementById("contact_container");
	if (oldContainer != null)
		oldContainer.parentNode.removeChild(oldContainer);
		
	var container = document.createElement("div");
	container.setAttribute("id", "contact_container");
	document.body.firstChild.appendChild(container);
	
	var len = 0;
	var resultFirst = [];
	if (str == "PIM") {
		var searchTerm = document.getElementById("text_searchTerm").value;
		var fe = new blackberry.find.FilterExpression("lastName", "==", searchTerm);
		resultFirst = blackberry.pim.Contact.find(fe);
		len = resultFirst.length;
		
	} else if (str == "SERVER") {
		resultFirst = argv[argc-1].split("\n");
		len = resultFirst.length - 1; // Every result is truncated with a newline; A\nB\nC\n
	}
	
	for (var iter = 0; iter < len; iter++) {
		var result = [];
		if (str == "SERVER") {
			getKVPair(resultFirst[iter], result);
			result['lastName'] = unescape(result['lastName']).replace(/\+/g, " ");
			result['firstName'] = unescape(result['firstName']).replace(/\+/g, " ");
			result['phoneNumber'] = unescape(result['phoneNumber']).replace(/\+/g, " ");
			result['address'] = unescape(result['address']).replace(/\+/g, " ");
		} else {
			result['lastName'] = resultFirst[iter].lastName;
			result['firstName'] = resultFirst[iter].firstName;
			result['phoneNumber'] = resultFirst[iter].homePhone;
			result['address'] = resultFirst[iter].homeAddress.address1;
		}
		
		var form = document.createElement("div");
		form.setAttribute("id", iter);
		makeContactDataForm(form, iter);
		container.appendChild(form);
		document.getElementById("text_lastName" + iter).value = result['lastName'];
		document.getElementById("text_firstName" + iter).value = result['firstName'];
		document.getElementById("text_phoneNumber" + iter).value = result['phoneNumber'];
		document.getElementById("text_address" + iter).value = result['address'];
		
		document.getElementById("text_lastName" + iter).defaultValue = result['lastName'];
		document.getElementById("text_firstName" + iter).defaultValue = result['firstName'];
		document.getElementById("text_phoneNumber" + iter).defaultValue = result['phoneNumber'];
		document.getElementById("text_address" + iter).defaultValue = result['address'];
		
		var button_editEntry = document.createElement("input");
		button_editEntry.setAttribute("type", "image");
		button_editEntry.setAttribute("src", "editcontact.gif");
		button_editEntry.setAttribute("value", "Edit Entry");
		button_editEntry.setAttribute("onclick", "edit(this)");
		form.appendChild(button_editEntry);
		
		var button_deleteEntry = document.createElement("input");
		button_deleteEntry.setAttribute("type", "image");
		button_deleteEntry.setAttribute("src", "deletecontact.gif");
		button_deleteEntry.setAttribute("value", "Remove Entry");
		button_deleteEntry.setAttribute("onclick", "remove(this)");
		form.appendChild(button_deleteEntry);
		
		var button_callContact = document.createElement("input");
		button_callContact.setAttribute("id", "call_contact");
		button_callContact.setAttribute("type", "image");
		button_callContact.setAttribute("src", "callcontact.gif");
		button_callContact.setAttribute("onclick", "callContact(this)");
		button_callContact.setAttribute("value", "Call Contact");
		form.appendChild(button_callContact);
	}
}

/** Function: callContact()
	In theory, this takes the contacts phone number and should call it.
*/
function callContact(callButton){
	var ID = callButton.parentNode.id;
	var number = document.getElementById("text_phoneNumber" + ID).defaultValue;
	var phoneNumber = new blackberry.invoke.PhoneArguments(number, true);
	phoneNumber.view = blackberry.invoke.PhoneArguments.VIEW_CALL;     
	blackberry.invoke.invoke(blackberry.invoke.APP_PHONE, phoneNumber);  
}

/** Function:	getKVPairs (String, Array)
	Require:	Given a string to parse, and an array to store the results in.
	Ensure:		Array contains as the key value pairs as indices and values, respectively.
*/
function getKVPair(string, returnArray) {
	// gets the KV Pairs
	var variables = string.split("&");
	var numberOfVars = variables.length;
	
	for (var i = 0; i < numberOfVars; i++) {
		var entries = variables[i].split("=");
		returnArray[entries[0]] = entries[1];
	}
}

/** Function:	editQuery(button)
	Require:	Given the id of a button corresponding to the fields in which you wish to update
	Ensure:		Constructs the POST string used in an AJAX edit request.
*/
function editQuery(ID) {
	var firstName = document.getElementById("text_firstName" + ID);
	var lastName = document.getElementById("text_lastName" + ID);
	var address = document.getElementById("text_address" + ID);
	var phoneNumber = document.getElementById("text_phoneNumber" + ID);
	return "op=edit&firstName=" + escape(firstName.value) + "&lastName=" + escape(lastName.value) + "&phoneNumber=" + escape(phoneNumber.value) + "&address=" + escape(address.value) + "&oldFirstName=" + escape(firstName.defaultValue) + "&oldLastName=" + escape(lastName.defaultValue) + "&oldPhoneNumber=" + escape(phoneNumber.defaultValue) + "&oldAddress=" + escape(address.defaultValue);
}

/** Function:	edit(button)
	Require:	Given the button corresponding to the fields that you wish to edit the contact to be
	Ensure:		The contact is updated in the PIM, and database(if accessable).
*/
function edit(result) {
	var ID = result.parentNode.id; // get the ID number of this result (counting starts from zero)
	var origFirstName = document.getElementById("text_firstName" + ID).defaultValue;
	var origLastName = document.getElementById("text_lastName" + ID).defaultValue;
	var origPhoneNumber = document.getElementById("text_phoneNumber" + ID).defaultValue;
	var origAddress = document.getElementById("text_address" + ID).defaultValue;
	
	var fe_fn		 = new blackberry.find.FilterExpression("firstName", "==", origFirstName);
	var fe_ln		 = new blackberry.find.FilterExpression("lastName", "==", origLastName);
	var fe_phone	 = new blackberry.find.FilterExpression("homePhone", "==", origPhoneNumber);
	var fe_address 	 = new blackberry.find.FilterExpression("homeAddress.address1", "==", origAddress);
	var fe_faln 	 = new blackberry.find.FilterExpression(fe_fn, "AND", fe_ln);
	var fe_pa 		 = new blackberry.find.FilterExpression(fe_phone, "AND", fe_address);
	var fe_total 	 = new blackberry.find.FilterExpression(fe_faln, "AND", fe_pa);

	var contact = blackberry.pim.Contact.find(fe_total);

	// Only change things if the fields are empty first!
	if(contact.user1 == "") {
		contact.user1 = contact.firstName;
		contact.user2 = contact.lastName;
		contact.user3 = contact.homePhone;
		contact.user4 = contact.homeAddress;
		contact.note = "STALE_EDIT";
	}
	
	contact[0].lastName = document.getElementById("text_lastName" + ID).value;
	contact[0].firstName = document.getElementById("text_firstName" + ID).value;
	contact[0].homePhone = document.getElementById("text_phoneNumber" + ID).value;
	contact[0].homeAddress.address1 = document.getElementById("text_address" + ID).value;
	contact[0].save();
	doAjaxCheckingNetwork( doAjaxPost( function() { return editQuery(ID); } , blackHole ), blackHole );
}

function remove(result) {
	var ID = result.parentNode.id; // get the ID number of this result (counting starts from zero)
	var origFirstName = document.getElementById("text_firstName" + ID).defaultValue;
	var origLastName = document.getElementById("text_lastName" + ID).defaultValue;
	var origPhoneNumber = document.getElementById("text_phoneNumber" + ID).defaultValue;
	var origAddress = document.getElementById("text_address" + ID).defaultValue;
	
	var fe_fn		 = new blackberry.find.FilterExpression("firstName", "==", origFirstName);
	var fe_ln		 = new blackberry.find.FilterExpression("lastName", "==", origLastName);
	var fe_phone	 = new blackberry.find.FilterExpression("homePhone", "==", origPhoneNumber);
	var fe_address 	 = new blackberry.find.FilterExpression("homeAddress.address1", "==", origAddress);
	var fe_faln 	 = new blackberry.find.FilterExpression(fe_fn, "AND", fe_ln);
	var fe_pa 		 = new blackberry.find.FilterExpression(fe_phone, "AND", fe_address);
	var fe_total 	 = new blackberry.find.FilterExpression(fe_faln, "AND", fe_pa);

	var contact = blackberry.pim.Contact.find(fe_total);
	
	contact[0].remove();

	doAjaxCheckingNetwork( doAjaxPost( function() { return deleteQuery(ID); }, blackHole ), blackHole );
	document.getElementById(ID).parentNode.removeChild(document.getElementById(ID));
}

function deleteQuery(ID) {
	var firstName = document.getElementById("text_firstName" + ID);
	var lastName = document.getElementById("text_lastName" + ID);
	var address = document.getElementById("text_address" + ID);
	var phoneNumber = document.getElementById("text_phoneNumber" + ID);
	return "op=delete&firstName=" + escape(firstName.value) + "&lastName=" + escape(lastName.value) + "&phoneNumber=" + escape(phoneNumber.value) + "&address=" + escape(address.value) + "&oldFirstName=" + escape(firstName.defaultValue) + "&oldLastName=" + escape(lastName.defaultValue) + "&oldPhoneNumber=" + escape(phoneNumber.defaultValue) + "&oldAddress=" + escape(address.defaultValue);
}

// Blackhole function required because of the way the ajax functions were handled.
function blackHole() { }