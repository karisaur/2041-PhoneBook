var params = [];
var result = [];
var contactsAdded = new Number(0);
var strURL = "http://www.cse.yorku.ca/~cse93023/pb/pb.cgi";
var outOfSync = new Boolean();
var temp = blackberry.pim.Contact.find(new blackberry.find.filterExpression("note", "==", "STALE")); // May break program!
outOfSync = (temp.length > 0);//
temp = null;//

function init() {
	document.body.appendChild(document.createElement("div"));
	setupView_LandingPage();
}

/** Function:	clearTextField(Object id)
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
	
////////////
		
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
	button_submit.setAttribute("type" , "button");
	button_submit.setAttribute("onclick", "add()");
	button_submit.setAttribute("value", "Add Entry");
	form.appendChild(button_submit);
	
	var button_back = document.createElement("input");
	button_back.setAttribute("id", "back_to_landing");
	button_back.setAttribute("type" , "button");
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
	var form = document.createElement("form");
		
	var text_searchBox = document.createElement("input");
	text_searchBox.setAttribute("id", "text_searchTerm");
	text_searchBox.setAttribute("value", "Search...");
	text_searchBox.setAttribute("defaultValue", "Search...");
	text_searchBox.setAttribute("name", "query");
	text_searchBox.setAttribute("onclick", "clearTextField(this)");
	form.appendChild(text_searchBox);
		
	var button_submit = document.createElement("input");
	button_submit.setAttribute("id", "search_submit");
	button_submit.setAttribute("type", "button");
	button_submit.setAttribute("value", "Search");
	
	button_submit.setAttribute("onclick", "search()");
	form.appendChild(button_submit);
	
	var resultPane = document.createElement("span");
	resultPane.setAttribute("id", "contact_container");
	form.appendChild(resultPane);

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
	button_addContact.setAttribute("type", "button");
	button_addContact.setAttribute("value", "Add Entry");
	button_addContact.setAttribute("onclick", "setupView_AddContact()");
	div_landing.appendChild(button_addContact);
	
	var button_searchDatabase = document.createElement("input");
	button_searchDatabase.setAttribute("type", "button");
	button_searchDatabase.setAttribute("value", "Search");
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
	addContactToDatabases(); // Literally all of the actual work, whee
	var sucessMsg = document.getElementById("span_add_sucess");
	if (sucessMsg != null) 
		document.body.firstChild.removeChild(sucessMsg);

	var span_sucess = document.createElement("span");
	span_sucess.setAttribute("id", "span_add_sucess");
	span_sucess.innerHTML = "Sucess!  Contact added.<br /><br />";
	document.body.firstChild.insertBefore(span_sucess, document.body.firstChild.firstChild); // Why did it take me 20 minnutes to get this line working properly?
}

/** Function:	addContactToDatabases()
	Require:	nil
	Ensure:		Contact in the entry form of the add view is added to both the server database
					(if online and accepting connections) as well as the device PIM.
*/
function addContactToDatabases() {
	var request = false;
    var self = this;
 
    if (window.XMLHttpRequest) { // Mozilla/Safari
        self.request = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // IE
        self.request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    self.request.onreadystatechange = function() {
        if (self.request.readyState ==4) {
			if(self.request.status == 200) {
				if (outOfSync == true)
					sync();
					
				add_server();
			} else {
				outOfSync = true;
			}
		}
    }
	
	self.request.open('GET', strURL);
	self.request.send();
	add_PIM();
}

function add_server() {
    var xmlHttpReq = false;
    var self = this;
    // Mozilla/Safari
    if (window.XMLHttpRequest) {
        self.xmlHttpReq = new XMLHttpRequest();
    }
    // IE
    else if (window.ActiveXObject) {
        self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
    }
    self.xmlHttpReq.open('POST', strURL, true);
    self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    self.xmlHttpReq.onreadystatechange = function() {
        if (self.xmlHttpReq.readyState == 4) {}
    }
    self.xmlHttpReq.send(querystring_add());
}

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
    qstr = "op=add&lastName=" + escape(lastName) + "&firstName=" + escape(firstName) + "&phoneNumber=" + escape(phoneNumber) + "&address=" + escape(address);  // NOTE: no '?' before querystring
    return qstr;
}

function search() {
	var request = false;
    var self = this;
	if(blackberry.system.hasDataCoverage()) {
		alert("DEB: Found network.");
		if (window.XMLHttpRequest) { // Mozilla/Safari
			self.request = new XMLHttpRequest();
		} else if (window.ActiveXObject) { // IE
			self.request = new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		self.request.onreadystatechange = function() {
			if (self.request.readyState ==4) {
				if(self.request.status == 200) {
					search_server();
				} else {
					search_PIM();
				}
			}
		}
		self.request.open('GET', strURL);
		self.request.send();
	} else {
		alert("DEB: No network.");
		search_PIM();
	}
}

function search_server() {
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
			if(self.request.status == 200) {
				updatepage_search(self.request.responseText);
			}
        }
    }
    self.request.send(querystring_search());
}

/** Function:	searchForContact_PIM(null)
	Require:	nil
	Ensure:		Grabs all contacts that find() returns (blackberry API).
	Purpose:	Allows for data retrieval from the device PIM. Returns an array containing all 
					contacts in the PIM that matched the search query.
*/
function search_PIM() {
	var oldContainer = document.getElementById("contact_container");
	if (oldContainer != null)
		oldContainer.parentNode.removeChild(oldContainer);
		
	var container = document.createElement("div");
	container.setAttribute("id", "contact_container");
	document.body.firstChild.appendChild(container);
	var searchTerm = document.getElementById("text_searchTerm").value;
	var fe = new blackberry.find.FilterExpression("lastName", "==", searchTerm);
	result = blackberry.pim.Contact.find(fe);
	var len = result.length;
	
	for (var iter = 0; iter < len; iter++) {
		var form = document.createElement("div");
		form.setAttribute("id", iter);
		makeContactDataForm(form, iter);
		container.appendChild(form);
		document.getElementById("text_lastName" + iter).value = result[iter].lastName;
		document.getElementById("text_firstName" + iter).value = result[iter].firstName;
		document.getElementById("text_phoneNumber" + iter).value = result[iter].homePhone;
		document.getElementById("text_address" + iter).value = result[iter].homeAddress.address1;
		
		document.getElementById("text_lastName" + iter).defaultValue = result[iter].lastName;
		document.getElementById("text_firstName" + iter).defaultValue = result[iter].firstName;
		document.getElementById("text_phoneNumber" + iter).defaultValue = result[iter].homePhone;
		document.getElementById("text_address" + iter).defaultValue = result[iter].homeAddress.address1;
		
		var button_editEntry = document.createElement("input");
		button_editEntry.setAttribute("type", "button");
		button_editEntry.setAttribute("value", "Edit Entry");
		button_editEntry.setAttribute("onclick", "edit(this)");
		form.appendChild(button_editEntry);
	}
}

function querystring_search() {
    var word = document.getElementById("text_searchTerm").value;
    qstr = "op=search&entry=" + escape(word);  // NOTE: no '?' before querystring
    return qstr;
}

function updatepage_search(str){
    // Parse into the vars needed for a single form
	// for each of these tokens, create a form, and fill data
	// done.
	var oldContainer = document.getElementById("contact_container");
	if (oldContainer != null) 
		oldContainer.parentNode.removeChild(oldContainer);
	
	var container = document.createElement("div");
	container.setAttribute("id", "contact_container");
	document.body.firstChild.appendChild(container);
			
	var formData = str.split("\n");
	var entries = formData.length - 1; // Every result is truncated with a newline; A\nB\nC\n
	
	// Loops through all the result strings that were recieved, and creates and fills in a 
	// 'form' div for each contact. Relies on the helper function getKVPair to split up the
	// values and store them in the specified array (second arg).
	for (var i = 0; i < entries; i++) {
		// Set up display form
		var contactTable = document.createElement("div");
		contactTable.setAttribute("id", i);
		makeContactDataForm(contactTable, i);
		container.appendChild(contactTable);
		var button_edit = document.createElement("input");
		button_edit.setAttribute("value", "Edit Contact");
		button_edit.setAttribute("type", "button");
		button_edit.setAttribute("onclick", "edit(this)");
		contactTable.appendChild(button_edit);
		
		// Fill in fields with values returned from server
		var data = [];
		getKVPair(formData[i], data);
		document.getElementById("text_lastName" + i).value = unescape(data['lastName'].replace(/\+/g, " "));
		document.getElementById("text_firstName" + i).value = unescape(data['firstName'].replace(/\+/g, " "));
		document.getElementById("text_phoneNumber" + i).value = unescape(data['phoneNumber'].replace(/\+/g, " "));
		document.getElementById("text_address" + i).value = unescape(data['address'].replace(/\+/g, " "));
		
		document.getElementById("text_lastName" + i).defaultValue = unescape(data['lastName'].replace(/\+/g, " "));
		document.getElementById("text_firstName" + i).defaultValue = unescape(data['firstName'].replace(/\+/g, " "));
		document.getElementById("text_phoneNumber" + i).defaultValue = unescape(data['phoneNumber'].replace(/\+/g, " "));
		document.getElementById("text_address" + i).defaultValue = unescape(data['address'].replace(/\+/g, " "));
	}
	alert("DEB: updatepage_search() ending.");
}

/** Function:	getKVPairs (String, Array)
	Require:	given a string to parse, and an array to store the results in.
	Ensure:		array contains as the key value pairs as indices and values, respectively.
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

/** Function:	edit(button)
	Require:	Given the id of a button corresponding to the fields in which you wish to update
	Ensure:		Updates the PIM, and server if possible. If not currently possible, stores stale info data
				that a sync routine will be able to parse and know to process.
*/
function edit(button) {
// Check connectivity. If we are online, attempt to make the change on the server
// and the PIM. If you cant make the changes on the server, document them in the PIM
// ONLY IF the fields are empty - if not it means multiple edits have taken place
// while offline and we want to leave them alone so the system can update the contact
//once online.
	var request = false;
	var self = this;
	if (blackberry.system.hasDataCoverage()) {
		if (window.XMLHttpRequest) { // Mozilla/Safari
			self.request = new XMLHttpRequest();
		} else if (window.ActiveXObject) { // IE
			self.request = new ActiveXObject("Microsoft.XMLHTTP");
		}
		self.request.onreadystatechange = function() {
			if (self.request.readyState == 4) {
				if (self.request.status == 200) {
					edit_server(button);
				} else {
					outOfSync = true;
				}
			}
		}
		self.request.open('GET', strURL);
		self.request.send();
	} else {
		outOfSync = true;
	}
	edit_PIM(button);
}

function edit_server(resultID) {
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
    self.request.onreadystatechange = function() {}
    self.request.send(querystring_edit(resultID));
}

function querystring_edit(result) {
	var ID = result.parentNode.id;
	var firstName = document.getElementById("text_firstName" + ID);
	var lastName = document.getElementById("text_lastName" + ID);
	var address = document.getElementById("text_address" + ID);
	var phoneNumber = document.getElementById("text_phoneNumber" + ID);
	var qstr = "op=edit&firstName="+ escape(firstName.value) + "&lastName=" + escape(lastName.value) + "&phoneNumber=" + escape(phoneNumber.value) + "&address=" + escape(address.value) + "&oldFirstName=" + escape(firstName.defaultValue) + "&oldLastName=" + escape(lastName.defaultValue) + "&oldPhoneNumber=" + escape(phoneNumber.defaultValue) + "&oldAddress=" + escape(address.defaultValue);
	return qstr;
}

/** Function:	edit_PIM(button)
	Require:	Given the button corresponding to the fields that you wish to edit the contact to be
	Ensure:		The contact is updated in the PIM, with stale information saved it required.
*/
function edit_PIM(result) {
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
	alert("DEB: Everything but the home.");
	contact[0].homeAddress.address1 = document.getElementById("text_address" + ID).value;
	contact[0].save();
	alert("DEB: GREAT SUCESS.");
}

/** Function:	syncToDatabase()
	Require:	nil
	Ensure:		If the databases were out of sync, then we have at least attempted to sync them.
					Else databases remain untouched.
*/
function sync() {
	alert("DEB: Now syncing!");
	if (outOfSync == false) return;
	var fe_stale = new blackberry.find.filterExpression("note", "==", "STALE");
	var staleHandles = blackberry.pim.Contact.find(fe_stale);
	
	var len = staleHandles.length;
	
	for (var i = 0; i < len; i++) {
		// Post transaction; if we get 200OK then remove the note that this object is stale
		// Need to check for new entries or updates, as both could be stale.
	}
		
}
