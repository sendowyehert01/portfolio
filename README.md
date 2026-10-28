# Rosendo.OS

A static developer portfolio inspired by eDEX-UI, built with HTML, CSS, and vanilla JavaScript.

Open `index.html` directly, or serve the directory locally:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Visit `http://127.0.0.1:4173`. No dependency installation or build step is needed.

## Explore the workstation

- Use the section tabs, welcome shortcuts, or file explorer to navigate.
- Type `help` in the terminal for clickable commands.
- Try `cd ~/projects`, `open prompt-lab`, `cat ~/about.md`, and `ls`.
- Use Up/Down for command history, Tab for completion, and Ctrl+K to clear.
- Press `/` to focus the command prompt, Alt+1–5 to switch sections, or Escape to return to the terminal.
- The virtual keyboard supports typing, Shift, Caps Lock, editing, history, and Ctrl+A/K/L.
- Select a project and use its image controls; expand a preview for a larger view. Arrow keys and Escape work in the preview dialog.
- Switch between cyan, amber, and green themes. Theme and sound preferences are stored locally; sound starts off.

The layout adapts to smaller screens and respects reduced-motion preferences. Frame rate, session time, and JavaScript memory (when exposed by the browser) use browser APIs. The globe and profile schematic are decorative.

## Customize the content

The existing three projects are presented as concepts with illustrative previews. Project descriptions, technology groups, and terminal behavior are in `script.js`. Profile copy and contact links are in `index.html`; update `EMAIL` in `script.js` alongside the email links.

Replace the sample `rosendo@example.com` address and generic GitHub/LinkedIn links before publishing. Styles and color themes are in `styles.css`.

Design reference: [eDEX-UI by GitSquared](https://github.com/GitSquared/edex-ui).
