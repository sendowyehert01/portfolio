# Rosendo.OS

A static portfolio for Rosendo E. Galang, a Full-Stack Software Engineer, inspired by eDEX-UI and built with HTML, CSS, and vanilla JavaScript.

Portfolio content is based on [regalang_resume.pdf](assets/documents/regalang_resume.pdf): professional experience, four projects and their results, technical skills, education, certification, and contact details. The PDF can be viewed or downloaded from the portfolio.

Open `index.html` directly, or serve the directory locally:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Visit `http://127.0.0.1:4173`. No dependency installation or build step is needed.

## Repository structure

```text
portfolio/
|-- index.html                     # Page markup and static profile content
|-- README.md                      # Setup, navigation, and maintenance guide
|-- .gitignore                     # Local preview artifacts
`-- assets/
    |-- css/
    |   |-- base.css               # Theme tokens, resets, and shared primitives
    |   |-- workstation.css        # Layout, UI components, and animations
    |   `-- responsive.css         # Breakpoints and reduced-motion overrides
    |-- js/
    |   |-- data/
    |   |   `-- portfolio.js       # Contact constants, projects, and skill groups
    |   |-- ui/
    |   |   `-- project-artwork.js # SVG project brief generation
    |   `-- app.js                 # State, routing, terminal, controls, and telemetry
    `-- documents/
        `-- regalang_resume.pdf    # Downloadable resume
```

`index.html` stays at the root so the repository can be served as a static site. Asset URLs are relative to the page, including when the site is hosted under a subdirectory. Local browser profiles, screenshots, and other scratch files belong in the ignored `.preview/` directory.

Styles load in this order: `base.css`, `workstation.css`, then `responsive.css`. Keep that order to preserve theme defaults and layout overrides.

JavaScript uses three ordered classic scripts with `defer`: `data/portfolio.js`, `ui/project-artwork.js`, then `app.js`. The first script creates the shared `window.RosendoOS` namespace, the second adds the artwork renderer, and the application consumes both. This keeps direct `file://` previews working without a module server or bundler. Keep data in `data/`, reusable presentation code in `ui/`, and application state and browser event handling in `app.js`.

The terminal's virtual filesystem is separate from these real folders. `RESUME_FILE` is the virtual filename (`regalang_resume.pdf`); `RESUME_URL` is its actual document-relative location (`assets/documents/regalang_resume.pdf`). Keep the filename and URL separate when moving downloadable assets.

## Explore the workstation

- Use the section tabs, welcome shortcuts, or terminal commands to navigate.
- Type `help` in the terminal for clickable commands.
- Try `cd ~/projects`, `open records-management`, `cat ~/about.md`, `resume`, and `ls`.
- Use Up/Down for command history, Tab for completion, and Ctrl+K to clear.
- Press `/` to focus the command prompt, Alt+1–5 to switch sections, or Escape to return to the terminal.
- Select a project and browse its overview and results; expand a project brief for a larger view. Arrow keys and Escape work in the dialog.
- Switch between cyan, amber, and green themes. Theme and sound preferences are stored locally; sound starts off.

The layout adapts to smaller screens and respects reduced-motion preferences. Frame rate, session time, and JavaScript memory (when exposed by the browser) use browser APIs. The globe and profile schematic are decorative.

## Customize the content

The four projects are Records Management System, ServiceDesk Management System, GCG Website, and Membership Management System. Their project briefs visualize the scope and results documented in the résumé. Edit project descriptions, skill groups, and contact constants in [portfolio.js](assets/js/data/portfolio.js). Profile copy, work experience, education, certification, and contact links are in [index.html](index.html).

When updating contact details, keep `EMAIL` in `assets/js/data/portfolio.js` and the email links in `index.html` consistent. Replace `assets/documents/regalang_resume.pdf` when updating the résumé, and update the displayed content to match. If you rename the PDF, update `RESUME_FILE`, `RESUME_URL`, and the PDF links in `index.html`.

Edit project brief rendering in [project-artwork.js](assets/js/ui/project-artwork.js), terminal commands and interactions in [app.js](assets/js/app.js), color themes in [base.css](assets/css/base.css), component styles in [workstation.css](assets/css/workstation.css), and mobile or reduced-motion behavior in [responsive.css](assets/css/responsive.css).

Design reference: [eDEX-UI by GitSquared](https://github.com/GitSquared/edex-ui).
