# Rosendo.OS

A static portfolio for Rosendo E. Galang, a Full-Stack Software Engineer, inspired by eDEX-UI and built with HTML, CSS, and vanilla JavaScript.

Portfolio content is based on [regalang_resume.pdf](regalang_resume.pdf): professional experience, four projects and their results, technical skills, education, certification, and contact details. The PDF can be viewed or downloaded from the portfolio.

Open `index.html` directly, or serve the directory locally:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Visit `http://127.0.0.1:4173`. No dependency installation or build step is needed.

## Explore the workstation

- Use the section tabs, welcome shortcuts, or file explorer to navigate.
- Type `help` in the terminal for clickable commands.
- Try `cd ~/projects`, `open records-management`, `cat ~/about.md`, `resume`, and `ls`.
- Use Up/Down for command history, Tab for completion, and Ctrl+K to clear.
- Press `/` to focus the command prompt, Alt+1–5 to switch sections, or Escape to return to the terminal.
- The virtual keyboard supports typing, Shift, Caps Lock, editing, history, and Ctrl+A/K/L.
- Select a project and browse its overview and results; expand a project brief for a larger view. Arrow keys and Escape work in the dialog.
- Switch between cyan, amber, and green themes. Theme and sound preferences are stored locally; sound starts off.

The layout adapts to smaller screens and respects reduced-motion preferences. Frame rate, session time, and JavaScript memory (when exposed by the browser) use browser APIs. The globe and profile schematic are decorative.

## Customize the content

The four projects are Records Management System, ServiceDesk Management System, GCG Website, and Membership Management System. Their project briefs visualize the scope and results documented in the résumé. Project descriptions, skill groups, and terminal behavior are in `script.js`. Profile copy, work experience, education, certification, and contact links are in `index.html`.

When updating contact details, keep `EMAIL` in `script.js` and the email links in `index.html` consistent. Replace `regalang_resume.pdf` when updating the résumé, and update the displayed content to match. Styles and color themes are in `styles.css`.

Design reference: [eDEX-UI by GitSquared](https://github.com/GitSquared/edex-ui).
