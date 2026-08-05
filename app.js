/* ==========================================================================
   HOSPITAL SYSTEM  -  app.js   (runs on index.html)

   ---------------------------------------------------------------------
   HOW TO READ THIS FILE
   Every important line is tagged so you can see the topic it belongs to:

     [DOM]     working with the page: finding, creating or changing elements
     [EVENT]   events: waiting for something the user does
     [STORAGE] local storage: keeping the data in the browser
     [OBJECT]  the constructor and the array of patients
     [UX]      a small thing added to make the page nicer to use

   ---------------------------------------------------------------------
   WHAT IS THE DOM?
   When the browser opens index.html it builds a tree of objects out of the
   HTML. That tree is the DOM (Document Object Model). JavaScript cannot
   touch the HTML file itself, it changes this tree, and the browser then
   repaints the screen. "document" is the whole tree.

   THE 4 DOM JOBS USED IN THIS FILE
     1. FIND an element      document.getElementById("fullName")
                             document.querySelector("input[name='gender']:checked")
     2. READ or CHANGE it    .value  .textContent  .className  .src  .alt  .disabled
     3. CREATE a new element document.createElement("div")
                             document.createTextNode("some text")
     4. PUT it in the page   parent.appendChild(child)      .innerHTML = ""

   ---------------------------------------------------------------------
   WHAT IS AN EVENT?
   An event is something that happens: a click, a form submit, a key press.
   We do not run our function ourselves, we hand it to the browser and say
   "run this later, when that happens". That is addEventListener.

       element.addEventListener("submit", render);
                 ^event name ^          ^ the function to run later
       note: "render" with no ( ) after it. Writing render() would run it
       straight away instead of saving it for later.

   THE 3 EVENTS IN THIS FILE
     1. "submit" on the form        -> runs render()      (add a patient)
     2. "click"  on Clear All       -> empties the list
     3. "click"  on the menu icon   -> opens/closes the nav on phones

   The browser also passes an "event object" to the function. render(event)
   uses it for event.preventDefault(), which stops the page reloading.
   ========================================================================== */


/* --------------------------------------------------------------------------
   1. SAVED PATIENTS
   -------------------------------------------------------------------------- */

// [OBJECT] the array that holds every patient while the page is open
let patients = [];

// [STORAGE] load previously saved patients from localStorage
let saved = localStorage.getItem("patients");

if (saved != null) {

    patients = JSON.parse(saved);

}


/* --------------------------------------------------------------------------
   2. PATIENT OBJECT  (the constructor)
   -------------------------------------------------------------------------- */

// [OBJECT] a constructor is a blueprint for making objects.
// we call it with the word "new", and "this" means the new object being made.
// there is no DOM and no event here, it only builds an object in memory.
function Patient(fullName, password, birthDate, gender, disease, imageUrl, phone) {

    this.id = crypto.randomUUID();

    this.fullName = fullName;
    this.password = password;
    this.birthDate = birthDate;
    this.gender = gender;
    this.disease = disease;
    this.imageUrl = imageUrl;
    this.phone = phone;

}


// [DOM] a short way to do DOM job 1 (find) and job 2 (read the value).
// value("fullName") is the same as document.getElementById("fullName").value
function value(id) {

    return document.getElementById(id).value;

}


/* --------------------------------------------------------------------------
   3. BUILDING A CARD
   All DOM work here: it CREATES elements and puts them inside each other.
   Nothing is on the screen yet, that happens in showPatients().
   -------------------------------------------------------------------------- */

// builds one line of a card, for example:   Gender : Female
function makeLine(label, text) {

    // [DOM] job 3: create a new <p> element
    let line = document.createElement("p");

    // [DOM] job 2: className sets the class="..." attribute (Tailwind styling)
    line.className = "text-sm text-slate-600 break-words overflow-hidden";

    // [DOM] job 3: a <span> to hold the bold label part
    let strong = document.createElement("span");

    strong.className = "font-semibold text-slate-800";

    // [DOM] job 2: textContent writes plain text inside the element
    strong.textContent = label + " : ";

    // [DOM] job 4: put the bold label inside the paragraph
    line.appendChild(strong);

    // [DOM] job 3 + 4: create a piece of plain text and add it after the label.
    // createTextNode is safer than innerHTML because it can never run code.
    line.appendChild(document.createTextNode(text));

    // hand the finished paragraph back to whoever called this function
    return line;

}


// builds the whole white card for one patient
function makeCard(patient) {

    // [DOM] job 3: the card itself is a <div>
    let card = document.createElement("div");

    card.className = "bg-white rounded-2xl border border-slate-200 shadow-sm p-5 min-w-0 w-full";
    // [DOM] job 3: the patient picture
    let image = document.createElement("img");

    // [DOM] job 2: src is the address of the picture file
    image.src = patient.imageUrl;

    image.className = "w-28 h-28 mx-auto rounded-full object-cover mb-4";

    // [UX] alt describes the picture for screen readers,
    // and is shown if the picture file is missing
    image.alt = "Photo of " + patient.fullName;

    // [DOM] job 4: put the picture inside the card
    card.appendChild(image);

    // [DOM] job 4: one line per piece of information
    card.appendChild(makeLine("Full name", patient.fullName));
    card.appendChild(makeLine("Date of birth", patient.birthDate));
    card.appendChild(makeLine("Gender", patient.gender));
    card.appendChild(makeLine("Phone number", patient.phone));
    card.appendChild(makeLine("Chronic diseases", patient.disease));


    // Create delete button
    let deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.className =
        "bg-red-600 text-white px-4 py-2 rounded-lg mt-4";


    // When this button is clicked
    deleteButton.addEventListener("click", function () {

        patients = patients.filter(function (p) {

            return p.id !== patient.id;

        });


        localStorage.setItem(
            "patients",
            JSON.stringify(patients)
        );


        showPatients();

    });


    // Add button inside the card
    card.appendChild(deleteButton);


    // send the finished card back
    return card;

}


/* --------------------------------------------------------------------------
   4. SHOWING THE LIST
   -------------------------------------------------------------------------- */

// [UX] the message shown while there are no patients at all
function makeEmptyMessage() {

    // [DOM] job 3: create the paragraph
    let empty = document.createElement("p");

    // col-span-full makes it stretch across the whole grid row
    empty.className = "col-span-full bg-white border border-dashed border-slate-300 " +
        "text-slate-500 rounded-xl p-8 text-center";

    // [DOM] job 2: write the message inside it
    empty.textContent = "No patients registered yet.";

    return empty;

}


// draws the whole list again, from the patients array
function showPatients() {

    // [DOM] job 1: find the empty <div> that is waiting in index.html
    let container = document.getElementById("patientsCards");

    // [DOM] job 2: empty it first, otherwise the old cards stay
    // and every patient would be printed twice
    container.innerHTML = "";

    // [DOM] job 1 + 2: write how many patients there are, next to the heading
    document.getElementById("patientCount").textContent = patients.length + " saved";

    // [UX] a button that cannot do anything should not look available.
    // disabled is a property of buttons, true means it cannot be clicked.
    document.getElementById("clearButton").disabled = patients.length === 0;

    // if the array is empty, show the message instead of cards and stop here
    if (patients.length === 0) {

        // [DOM] job 4: put the message on the page
        container.appendChild(makeEmptyMessage());

        return;

    }

    // go through the array one patient at a time
    patients.forEach(function (patient) {

        // [DOM] job 3 + 4: build that patient's card and put it on the page.
        // this is the moment the card actually becomes visible.
        container.appendChild(makeCard(patient));

    });

}


/* --------------------------------------------------------------------------
   5. RENDER   <-- the main event handler of the project

   We never call render() ourselves. The browser calls it when the form is
   submitted, and hands it the event object.

   It does four things:
     1. stops the page from reloading
     2. reads the form                (DOM)
     3. builds a Patient and pushes it into the array   (OBJECT)
     4. saves the array and redraws the cards           (STORAGE + DOM)
   -------------------------------------------------------------------------- */

function render(event) {

    event.preventDefault();


    let imageUrl = value("imageUrl");


    if (imageUrl === "") {

        imageUrl = "assets/default.svg";

    }


    createPatient(imageUrl);

}



function createPatient(imageUrl) {

    let patient = new Patient(

        value("fullName"),

        value("password"),

        value("birthDate"),

        document.querySelector("input[name='gender']:checked").value,

        value("disease"),

        imageUrl,

        value("phone")

    );


    patients.push(patient);


    localStorage.setItem(
        "patients",
        JSON.stringify(patients)
    );


    showPatients();


    document.getElementById("patientForm").reset();


    document.getElementById("fullName").focus();

}


// [EVENT] THE MAIN LINE: find the form, and tell the browser
// "when a submit happens on this form, run render".
document.getElementById("patientForm").addEventListener("submit", render);


/* --------------------------------------------------------------------------
   6. BUTTONS  (two more events)
   -------------------------------------------------------------------------- */

// [EVENT] "Clear All Patients" deletes everything, so it asks first.
// here the function is written straight inside addEventListener instead of
// being given a name, that is called an anonymous function.
document.getElementById("clearButton").addEventListener("click", function () {

    // [UX] confirm() shows the browser's Yes/No box and gives back true or false
    let sure = confirm("Delete all " + patients.length + " patients? This cannot be undone.");

    // the user pressed Cancel, so leave without deleting anything
    if (!sure) {
        return;
    }

    // [STORAGE] delete the saved text from local storage
    localStorage.removeItem("patients");

    // [OBJECT] empty the array in memory too
    patients = [];

    // [DOM] redraw, which now shows the empty message
    showPatients();

});


// [EVENT] the menu icon shows and hides the nav on small screens.
// [DOM] classList lets us add and remove classes. toggle() removes the class
// if it is there, and adds it if it is not.
// "hidden" and "flex" are the two Tailwind classes we swap between.
document.getElementById("menuButton").addEventListener("click", function () {

    // [DOM] job 1: find the nav
    let nav = document.getElementById("mainNav");

    nav.classList.toggle("hidden");
    nav.classList.toggle("flex");

    // [DOM] contains() asks whether the class is on the element right now
    let isOpen = nav.classList.contains("flex");

    // [UX] tell screen readers whether the menu is open or closed.
    // inside an event function, "this" means the element that was clicked.
    this.setAttribute("aria-expanded", isOpen);

    this.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");

});


// [DOM] draw the patients that were saved on an earlier visit.
// this runs once, as soon as the page finishes loading.
showPatients();
