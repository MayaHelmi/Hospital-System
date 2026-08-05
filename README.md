# Hospital System 🏥

A small hospital system for managing patient information, built with HTML, CSS, and JavaScript.

## Live URL

**https://mayahelmi.github.io/Hospital-System/**

## Description

The page has a header with a navigation bar, a main section with the patient form and the list of
saved patients, and a footer.

Filling in the form and pressing **Save patient** runs the `render()` function in `app.js`, which:

1. Reads all the form data.
2. Builds a patient object with the `Patient` constructor.
3. Adds the patient to the `patients` array.
4. Saves the array to the browser's local storage.
5. Shows every patient in its own card.

Because the patients are saved in local storage, they are still there after closing and
reopening the page.

## The constructor

Each patient is made with a constructor, so every patient object has the same shape:

```js
function Patient(fullName, password, birthDate, gender, disease, imageUrl, phone) {
    this.fullName = fullName;
    this.password = password;
    ...
}

let patient = new Patient(fullName, password, birthDate, gender, disease, imageUrl, phone);
```

## The form

| Field | Input type | Why |
|-------|-----------|-----|
| Full name | `text` | normal words |
| Password | `password` | hides the letters while typing |
| Date of birth | `date` | gives the browser's date picker |
| Phone number | `tel` | made for phone numbers |
| Gender | `radio` | only one answer possible |
| Chronic diseases | `select` | the pre-defined list, including `No` |
| Image URL | `text` | a path to a picture in the `assets` folder |

If the image is left empty, `assets/default.svg` is used.

## Styling

The styling is **Tailwind CSS**, loaded from the CDN in `index.html`, so there is no build step.
`style.css` keeps the few rules that are easier to write as normal CSS.

## UX principles applied

| Principle | What was done |
|-----------|---------------|
| Visibility of system status | A confirmation message after saving, and a patient count next to the heading |
| Empty state | "No patients yet" instead of blank space when the list is empty |
| Error prevention | `required` fields, a `select` instead of free text, the password rule shown before typing |
| Recognition over recall | Every label is visible, with examples in the placeholders |
| Bigger click targets | The whole radio box is clickable, inputs and the button are around 48px tall |
| Keyboard access | A skip link, and a visible focus ring on every field |
| Screen readers | `alt` text on the pictures and `aria-live` on the confirmation message |
| Responsive | One column on a phone, form beside the cards on a wide screen |
| Reduced motion | Hover movement is switched off for anyone who asks for less animation |

## Files

- `index.html` — the header, nav, form, patient cards, and footer
- `app.js` — the `Patient` constructor and the `render()`, `showPatients()`, `makeCard()` functions
- `style.css` — the few custom rules that sit next to Tailwind
- `assets/` — the patient pictures

## How to Run

1. Open `index.html` in a browser (or use the live URL above).
2. Fill in the form and press **Save patient**.
3. The patient appears as a card, and stays there after a refresh.

## Note

The password is stored as plain text in local storage, because that is what the task asks for.
A real hospital system would never do this — passwords would be hashed and kept on a server.
