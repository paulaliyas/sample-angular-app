# Figma to Code: Checklist

The small things to check when building screens from a Figma design, based on the Daam Initiative feature.

## Before you start coding

- [ ] **Compare the EN and AR designs text by text.** They often say different things (e.g. SIMAH vs SAMA). List the differences and get an answer before coding, not after.
- [ ] **List what Figma doesn't show:** loading, empty, error, disabled, hover/focus, long text and validation states. Ask the designer for each one or agree on a default.
- [ ] **Check whether the host app is in the design**, such as a fixed header or sidebar. Popups and sticky bars need to sit below it.
- [ ] **Confirm the host app's Angular version and CSS libraries** (Bootstrap, Material, resets). They decide which syntax you can use (`*ngIf` vs `@if`) and which class names will clash.
- [ ] **Get the real copy for every message**, in both languages: tooltips, errors, hints, legal text. Don't ship your own wording without sign-off.
- [ ] **Know the rules behind the screen**, for example the acceptance criteria (ACs) for the T&C popup. Figma shows the look, not the behaviour.

## Layout and styling

- [ ] **Nest every style under the component's tag** so nothing leaks into the host app. Assume the host has global styles that will leak into yours.
- [ ] **Use unique class names**: avoid `.tooltip`, `.card`, `.modal`, `.btn` clashes. Bootstrap has all of them.
- [ ] **Put colours in design tokens (CSS variables)**, and remember they only exist inside the wrapper where they're defined.
- [ ] **Check every page width**: desktop, tablet (~900px) and phone (~600px). Look for stray white space on the right and horizontal scrolling.
- [ ] **Turn Figma's absolute positions into flex or grid layouts.** Don't copy pixel positions.
- [ ] **Keep an eye on the style size budget per component.** Split shared styles into separate files early.

## Assets and icons

- [ ] **Check whether an icon already exists before adding one.** A duplicate name caused the double tooltip arrow.
- [ ] **Use the exact Figma SVG and size.** The same icon can come in 18px and 24px versions.
- [ ] **Download every asset into the project.** Figma asset URLs expire after 7 days.

## Text and languages (i18n)

- [ ] **Use no hard-coded text in templates**, including placeholders, screen-reader labels, CSV headers and error messages.
- [ ] **Namespace the translation keys** (`initiative.*`) so they can't clash with the host app's keys.
- [ ] **Check the RTL layout**: arrows mirrored, `margin-inline` / `inset-inline` instead of left/right, and tooltips and popups placed correctly.
- [ ] **Decide how numbers, dates and currency look in Arabic** (Western or Arabic digits, where "SAR" or ر.س goes).
- [ ] **Check that long Arabic or English text doesn't break layouts**, especially buttons, tabs and badges.
- [ ] **Get legal text per language from the business.** Don't translate it yourself.

## Forms and inputs

- [ ] **Validate in the browser and show the error under the field**, with a generic message unless told otherwise.
- [ ] **Set a maximum length on every text box**, allowing spaces if users paste grouped values like IBANs.
- [ ] **Decide when errors appear**: on leaving the field, on submit, or while typing.
- [ ] **On submit, jump to the first error**, even if it's on another tab or page.
- [ ] **Explain disabled controls** with a tooltip or hint so users know why.
- [ ] **Clean values before sending them** (remove spaces, upper-case).

## Popups, tooltips and overlays

- [ ] **Make sure tooltips can't be clipped** by a parent's `overflow` or covered by a `z-index`. Attach them to `<body>` when the component is embedded in another app.
- [ ] **Note that disabled buttons and checkboxes may ignore hover**: put the tooltip on a wrapper.
- [ ] **Remember touch screens have no hover**: make sure tap or focus also shows tooltips.
- [ ] **Size popups to the screen**: set a maximum height, scroll inside, keep the buttons pinned, and leave a top offset for the host header.
- [ ] **Make popups closable** with ×, Escape and a background click, and return keyboard focus to the element that opened them.

## Data and states

- [ ] **Test with large mock data (600+ rows)**, not just the 10 rows in Figma: pagination, search, performance.
- [ ] **Keep mock data in JSON files behind one API service**, so swapping to the real API is one place.
- [ ] **Keep state when moving back and forth between steps**: selections, typed values, "terms read".
- [ ] **Don't validate data that came from the API with front-end rules** unless asked. Mock data may not pass them.

## Accessibility

- [ ] **Give every icon-only button an accessible label.**
- [ ] **Show a visible focus outline** on everything clickable.
- [ ] **Link each error to its field** with `aria-invalid` and `aria-describedby`.
- [ ] **Give tables, tabs and dialogs the correct roles.**

## Before saying "done"

- [ ] **`ng build` and `tsc --noEmit`**: the build can pass while the editor still shows type errors.
- [ ] **Click through in a real browser**: EN and AR, desktop and phone, Chrome and Firefox.
- [ ] **Test inside the host app**, not only in the sample app. Most CSS problems only show there.
- [ ] **Commit one feature at a time** so changes can be reviewed and pushed separately.
- [ ] **Write down what's still unconfirmed** (wording, missing designs) and send it to the designer or business team.
