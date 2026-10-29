(() => {
  'use strict';

  const { EMAIL, RESUME_FILE, RESUME_URL, projects, stack } = window.RosendoOS.portfolio;
  const { makeProjectArtwork } = window.RosendoOS;
  const views = ['terminal', 'about', 'projects', 'stack', 'contact'];
  const themes = ['cyan', 'amber', 'green'];
  const commands = ['help', 'about', 'projects', 'stack', 'contact', 'resume', 'home', 'ls', 'cd', 'cat', 'open', 'pwd', 'whoami', 'date', 'echo', 'clear', 'theme', 'sound', 'fullscreen', 'reboot'];
  const $ = (selector) => document.querySelector(selector);
  const input = $('#commandInput');
  const output = $('#terminalOutput');
  const welcome = $('#terminalWelcome');
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const state = { view: 'terminal', directory: '', project: 0, slide: 0, theme: 'cyan', sound: false };
  const history = [];
  let historyPosition = 0;
  let historyDraft = '';
  let audioContext;
  let toastTimer;
  let eventTotal = 0;
  const sessionStart = performance.now();

  function readPreference(key, fallback) {
    try { return localStorage.getItem(`rosendo-os:${key}`) ?? fallback; } catch { return fallback; }
  }
  function savePreference(key, value) {
    try { localStorage.setItem(`rosendo-os:${key}`, value); } catch { /* The interface also works without storage. */ }
  }
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function notify(message) {
    clearTimeout(toastTimer);
    $('#toast').textContent = message;
    $('#toast').classList.add('is-visible');
    toastTimer = setTimeout(() => $('#toast').classList.remove('is-visible'), 3000);
  }
  function logEvent(message) {
    const item = element('li');
    const now = new Date();
    const time = element('time', '', now.toLocaleTimeString('en-GB', { hour12: false }));
    time.dateTime = now.toISOString();
    item.append(time, element('span', '', message));
    $('#eventLog').prepend(item);
    while ($('#eventLog').children.length > 3) $('#eventLog').lastElementChild.remove();
    $('#eventCount').textContent = String(++eventTotal).padStart(2, '0');
  }
  function playSound(frequency = 640) {
    if (!state.sound) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioContext ||= new AudioContextClass();
      if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      gain.gain.setValueAtTime(.018, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + .045);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + .05);
    } catch { /* Sound must never interrupt navigation. */ }
  }


  // Virtual paths power terminal commands independently of the page layout.
  const filesystem = new Map([
    ['', [
      { name: 'about.md', type: 'file', view: 'about' },
      { name: 'projects', type: 'directory' },
      { name: 'stack', type: 'directory' },
      { name: 'contact.json', type: 'file', view: 'contact' },
      { name: RESUME_FILE, type: 'file', resume: true },
      { name: 'README.md', type: 'file' }
    ]],
    ['projects', projects.map((project, index) => ({ name: `${project.slug}.project`, type: 'file', project: index }))],
    ['stack', stack.map((group) => ({ name: group.id, type: 'directory' }))]
  ]);
  stack.forEach((group) => filesystem.set(`stack/${group.id}`, group.tools.map(([name]) => ({ name: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.tool`, type: 'file', tool: name, group: group.name }))));

  function cwd() { return `/home/rosendo${state.directory ? `/${state.directory}` : ''}`; }
  function writeRoute() {
    const detail = state.view === 'projects' ? `/${projects[state.project].slug}` : state.view === 'stack' && state.directory.startsWith('stack/') ? `/${state.directory.split('/')[1]}` : '';
    const hash = `#${state.view}${detail}`;
    if (location.hash === hash) return;
    try { window.history.pushState(null, '', hash); } catch { location.hash = hash; }
  }
  function navigate(view, { preserveDirectory = false, focus = false, updateHash = true, announce = true, group = '' } = {}) {
    if (!views.includes(view)) return;
    group = stack.some((item) => item.id === group) ? group : '';
    const changed = state.view !== view;
    state.view = view;
    tabs.forEach((tab) => {
      const selected = tab.dataset.view === view;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    views.forEach((name) => { $(`#view-${name}`).hidden = name !== view; });
    if (!preserveDirectory) state.directory = view === 'projects' ? 'projects' : view === 'stack' ? (stack.some((item) => item.id === group) ? `stack/${group}` : 'stack') : '';
    document.querySelectorAll('.stack-group').forEach((node) => node.classList.toggle('is-highlighted', node.dataset.group === group));
    $('#promptPath').textContent = state.directory ? `:~/${state.directory}` : ':~';
    $('#systemStatus').textContent = { terminal: 'SYSTEM READY', about: 'ABOUT.MD OPEN', projects: 'PROJECTS MOUNTED', stack: 'STACK MOUNTED', contact: 'CONNECTION OPEN' }[view];
    if (updateHash) writeRoute();
    if (changed && announce) {
      logEvent(`${view === 'terminal' ? 'Terminal' : view[0].toUpperCase() + view.slice(1)} opened`);
      $('#screenReaderStatus').textContent = `${view} section opened.`;
    }
    if (focus) {
      $(`#view-${view}`).focus({ preventScroll: true });
      if (window.innerWidth <= 800) $('#workspace').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
    }
    if (group) requestAnimationFrame(() => $(`[data-group="${group}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'instant' }));
  }
  function applyRoute() {
    const [view, detail] = location.hash.slice(1).split('/');
    const projectIndex = projects.findIndex((project) => project.slug === detail);
    if (view === 'projects' && projectIndex >= 0) { state.project = projectIndex; state.slide = 0; renderProject(); }
    navigate(views.includes(view) ? view : 'terminal', { updateHash: !views.includes(view), announce: false, group: detail || '' });
  }
  function resolvePath(argument = '~') {
    let value = argument;
    let base = state.directory;
    if (value === '~' || value === '/' || value === '/home/rosendo' || value === '/portfolio') return '';
    if (value.startsWith('~/')) { value = value.slice(2); base = ''; }
    else if (value.startsWith('/home/rosendo/')) { value = value.slice(14); base = ''; }
    else if (value.startsWith('/portfolio/')) { value = value.slice(11); base = ''; }
    else if (value.startsWith('/')) return null;
    const parts = base ? base.split('/') : [];
    for (const part of value.split('/')) {
      if (!part || part === '.') continue;
      if (part === '..') parts.pop();
      else parts.push(part);
    }
    return parts.join('/');
  }
  function findEntry(path) {
    if (path === null) return null;
    if (filesystem.has(path)) return { type: 'directory', path };
    const parts = path.split('/');
    const name = parts.pop();
    const parent = parts.join('/');
    const file = filesystem.get(parent)?.find((entry) => entry.name === name);
    return file ? { ...file, path, parent } : null;
  }
  function openEntry(entry, commandEntry) {
    const focus = document.activeElement !== input;
    if (entry.type === 'directory') {
      state.directory = entry.path;
      navigate(entry.path.startsWith('projects') ? 'projects' : entry.path.startsWith('stack') ? 'stack' : 'terminal', { preserveDirectory: true, focus, group: entry.path.split('/')[1] });
      commandEntry.append(element('p', 'output-text', `Mounted ${cwd()}`));
    } else if (entry.project !== undefined) {
      selectProject(entry.project, false);
      navigate('projects', { focus });
      commandEntry.append(element('p', 'output-text', `Opened ${projects[entry.project].name}`));
    } else if (entry.view) {
      navigate(entry.view, { focus });
      commandEntry.append(element('p', 'output-text', `Opened ~/${entry.name}`));
    } else if (entry.resume) {
      printOutput(commandEntry, 'Rosendo E. Galang — résumé\nView or download the PDF below.');
      const actions = element('div', 'resume-links');
      const viewLink = element('a', 'outline-button', 'VIEW RESUME');
      viewLink.href = RESUME_URL;
      viewLink.target = '_blank';
      viewLink.rel = 'noopener noreferrer';
      const downloadLink = element('a', 'outline-button', 'DOWNLOAD RESUME');
      downloadLink.href = RESUME_URL;
      downloadLink.download = 'Rosendo-E-Galang-Resume.pdf';
      actions.append(viewLink, downloadLink);
      commandEntry.append(actions);
    } else if (entry.tool) {
      printOutput(commandEntry, `${entry.tool}\nCategory: ${entry.group}\nPart of Rosendo's development toolkit.\n\nUse stack to see all technologies, or cd .. to return.`);
    } else {
      printOutput(commandEntry, `ROSENDO.OS / PERSONAL WORKSTATION\n\nWelcome to Rosendo E. Galang's developer portfolio.\nFull-Stack Software Engineer · 2 years of experience\nExplore the tabs, click a file, or type a command.\n\nabout     Experience, education, and certification\nprojects  ${projects.length} projects and their results\nstack     Technologies, tools, and practices\ncontact   Email, phone, and LinkedIn\nresume    View or download the résumé PDF\nhelp      All available commands\n\nShortcuts: / to focus the terminal, ↑/↓ for history, Tab to complete.\nThis portfolio uses a virtual filesystem in your browser.`);
    }
  }

  function renderProject() {
    const project = projects[state.project];
    const slide = project.slides[state.slide];
    $('#projectType').textContent = `${project.type} · ${project.organisation}`;
    $('#projectTitle').textContent = project.name;
    $('#projectSummary').textContent = project.summary;
    $('#projectTech').replaceChildren(...project.tags.map((tag) => element('span', '', tag)));
    const accent = getComputedStyle(document.body).getPropertyValue('--accent').trim();
    const image = makeProjectArtwork(project, state.slide, accent);
    $('#projectImage').src = image;
    $('#projectImage').alt = `${project.name}: ${slide.title}. ${slide.metric} ${slide.metricLabel.toLowerCase()}. ${slide.points.join('. ')}.`;
    $('#slideLabel').textContent = `${String(state.slide + 1).padStart(2, '0')} / ${String(project.slides.length).padStart(2, '0')} — ${slide.title}`;
    $('#previousSlide').disabled = state.slide === 0;
    $('#nextSlide').disabled = state.slide === project.slides.length - 1;
    [...$('#projectSelector').children].forEach((button, index) => button.setAttribute('aria-pressed', String(index === state.project)));
    if ($('#slideDots').children.length !== project.slides.length) {
      $('#slideDots').replaceChildren(...project.slides.map((slide, index) => {
        const dot = element('button');
        dot.type = 'button';
        dot.addEventListener('click', () => { state.slide = index; renderProject(); });
        return dot;
      }));
    }
    [...$('#slideDots').children].forEach((button, index) => {
      button.setAttribute('aria-current', String(index === state.slide));
      button.setAttribute('aria-label', `Show ${project.name} brief ${index + 1}: ${project.slides[index].title}`);
    });
    $('#previewTitle').textContent = project.name;
    $('#dialogImage').src = image;
    $('#dialogImage').alt = $('#projectImage').alt;
    $('#dialogSlideLabel').textContent = $('#slideLabel').textContent;
    $('#dialogPrevious').disabled = $('#previousSlide').disabled;
    $('#dialogNext').disabled = $('#nextSlide').disabled;
  }
  function selectProject(index, updateHash = true) {
    state.project = index;
    state.slide = 0;
    renderProject();
    if (updateHash && state.view === 'projects') writeRoute();
    logEvent(`Opened ${projects[index].name}`);
  }
  function changeSlide(delta) {
    const next = Math.max(0, Math.min(projects[state.project].slides.length - 1, state.slide + delta));
    if (next === state.slide) return;
    state.slide = next;
    renderProject();
    playSound(740);
  }
  function openPreview() {
    if ($('#previewDialog').open) return;
    $('#previewDialog').showModal();
    document.body.classList.add('has-dialog');
    logEvent('Project brief expanded');
  }
  function renderStack() {
    $('#stackGroups').replaceChildren(...stack.map((group, index) => {
      const section = element('section', 'stack-group');
      section.dataset.group = group.id;
      section.setAttribute('aria-label', `${group.name} technologies`);
      const heading = element('h3', 'stack-heading', group.name.toUpperCase());
      heading.append(element('span', '', `0${index + 1}`));
      const tools = element('div', 'skill-list');
      tools.append(...group.tools.map(([name, mark]) => {
        const chip = element('span', 'skill-chip');
        const symbol = element('span', 'skill-mark', mark);
        symbol.setAttribute('aria-hidden', 'true');
        chip.append(symbol, element('span', '', name));
        return chip;
      }));
      section.append(heading, tools);
      return section;
    }));
  }
  function setTheme(theme, announce = true) {
    state.theme = theme;
    document.body.dataset.theme = theme;
    const next = themes[(themes.indexOf(theme) + 1) % themes.length];
    $('#themeToggle span').textContent = theme.toUpperCase();
    $('#themeToggle').setAttribute('aria-label', `Switch to ${next} theme`);
    $('#themeToggle').title = `Switch to ${next} theme`;
    savePreference('theme', theme);
    renderProject();
    if (announce) { notify(`${theme.toUpperCase()} theme loaded`); logEvent(`Theme set to ${theme}`); }
  }
  function setSound(enabled, announce = true) {
    if (enabled && !(window.AudioContext || window.webkitAudioContext)) { notify('Interface sounds are unavailable in this browser.'); return false; }
    state.sound = enabled;
    $('#soundToggle').setAttribute('aria-pressed', String(enabled));
    $('#soundToggle').setAttribute('aria-label', `${enabled ? 'Disable' : 'Enable'} interface sounds`);
    $('#soundToggle').title = `${enabled ? 'Disable' : 'Enable'} interface sounds`;
    $('#soundToggle span').textContent = `SOUND ${enabled ? 'ON' : 'OFF'}`;
    $('#soundToggle use').setAttribute('href', `#i-${enabled ? 'sound' : 'muted'}`);
    savePreference('sound', String(enabled));
    if (announce) { notify(`Interface sounds ${enabled ? 'enabled' : 'muted'}`); logEvent(`Sound ${enabled ? 'enabled' : 'muted'}`); playSound(880); }
    return true;
  }
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else notify('Fullscreen is unavailable in this browser.');
    } catch { notify('Fullscreen could not be opened. Try your browser’s fullscreen shortcut.'); }
  }
  async function copyEmail() {
    let copied = false;
    try { await navigator.clipboard.writeText(EMAIL); copied = true; } catch {
      const previousFocus = document.activeElement;
      const field = element('textarea', 'sr-only', EMAIL);
      document.body.append(field);
      field.select();
      try { copied = document.execCommand('copy'); } catch { /* Report failure below. */ }
      field.remove();
      previousFocus?.focus({ preventScroll: true });
    }
    notify(copied ? 'Email address copied to clipboard' : `Select and copy ${EMAIL} from the Contact section.`);
    if (copied) { logEvent('Email address copied'); $('#copyEmail').textContent = 'COPIED ✓'; setTimeout(() => { $('#copyEmail').textContent = 'COPY EMAIL'; }, 2200); }
  }

  function beginCommand(command) {
    const entry = element('div', 'output-entry');
    const line = element('p', 'output-command');
    line.append(element('span', '', `guest@rosendo:${state.directory ? `~/${state.directory}` : '~'} $ `), document.createTextNode(command));
    entry.append(line);
    output.append(entry);
    while (output.children.length > 80) output.firstElementChild.remove();
    return entry;
  }
  function revealOutput() {
    welcome.hidden = true;
    navigate('terminal', { preserveDirectory: true });
    requestAnimationFrame(() => { $('#terminalScroll').scrollTop = $('#terminalScroll').scrollHeight; });
  }
  function printOutput(entry, text, error = false) {
    entry.append(element('p', `output-text${error ? ' is-error' : ''}`, text));
    revealOutput();
  }
  function clearTerminal() {
    output.replaceChildren();
    welcome.hidden = true;
    navigate('terminal', { preserveDirectory: true });
    logEvent('Terminal cleared');
  }
  function runCommand(raw) {
    const command = raw.trim().slice(0, 400);
    if (!command) return;
    if (history.at(-1) !== command) history.push(command);
    if (history.length > 50) history.shift();
    historyPosition = history.length;
    historyDraft = '';
    input.value = '';
    const tokens = command.match(/"[^"]*"|'[^']*'|\S+/g) || [];
    const name = tokens.shift().toLowerCase();
    const args = tokens.map((token) => token.replace(/^(["'])(.*)\1$/, '$2'));
    const argument = args.join(' ');
    const entry = beginCommand(command);
    playSound(820);
    const nav = { about: 'about', projects: 'projects', stack: 'stack', skills: 'stack', contact: 'contact' }[name];
    if (nav) { entry.append(element('p', 'output-text', `Opening ${nav}…`)); navigate(nav, { focus: document.activeElement !== input }); return; }
    switch (name) {
      case 'help': case '?': {
        entry.append(element('p', 'output-text', 'AVAILABLE COMMANDS / click any command to run it'));
        const table = element('div', 'command-table');
        [['about', 'Experience, education, and certification'], ['projects', 'Explore projects and their results'], ['stack', 'Browse the development toolkit'], ['contact', 'Email, phone, and LinkedIn'], ['resume', 'View or download the résumé PDF'], ['ls', 'List the current directory'], ['cd ~/projects', 'Change directory (also: cd ..)'], ['cat ~/README.md', 'Read a portfolio file'], ['open records-management', 'Open a project or file'], ['pwd', 'Print the current directory'], ['whoami', 'The human behind the code'], ['date', 'Your local date and time'], ['echo hello', 'Print a message'], ['theme amber', 'Themes: cyan / amber / green'], ['sound on', 'Optional sounds: on / off'], ['fullscreen', 'Toggle fullscreen'], ['clear', 'Clear the terminal'], ['home', 'Return to the welcome screen'], ['reboot', 'Restart the portfolio interface']].forEach(([cmd, description]) => {
          const row = element('div');
          const button = element('button', '', cmd);
          button.type = 'button';
          button.dataset.command = cmd;
          row.append(button, element('span', '', description));
          table.append(row);
        });
        entry.append(table);
        revealOutput();
        break;
      }
      case 'home': case 'reboot':
        if (name === 'reboot') { output.replaceChildren(); state.project = 0; state.slide = 0; renderProject(); logEvent('Interface restarted'); }
        welcome.hidden = false;
        navigate('terminal', { focus: document.activeElement !== input });
        $('#terminalScroll').scrollTop = 0;
        break;
      case 'clear': case 'cls': clearTerminal(); break;
      case 'pwd': printOutput(entry, cwd()); break;
      case 'whoami': printOutput(entry, `Rosendo E. Galang\nFull-Stack Software Engineer\n2 years of experience\nBiñan City, Laguna, Philippines\n\nWeb applications, internal management systems, and service desk solutions.\nAPI integration and workflow digitization.\n\nEmail: ${EMAIL}\nUse about for experience, education, and certification.`); break;
      case 'resume': openEntry({ type: 'file', resume: true, name: RESUME_FILE }, entry); break;
      case 'date': printOutput(entry, new Date().toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'long' })); break;
      case 'echo': printOutput(entry, argument); break;
      case 'ls': {
        const path = argument ? resolvePath(argument) : state.directory;
        const files = filesystem.get(path);
        if (!files) { printOutput(entry, `Directory not found: ${argument}`, true); break; }
        const list = element('div', 'output-files');
        files.forEach((file) => {
          const button = element('button', '', `${file.name}${file.type === 'directory' ? '/' : ''}`);
          button.type = 'button';
          button.dataset.command = `open /home/rosendo/${path ? `${path}/` : ''}${file.name}`;
          list.append(button);
        });
        entry.append(list);
        revealOutput();
        break;
      }
      case 'cd': case 'cat': case 'open': {
        if (!argument && name !== 'cd') { printOutput(entry, `Usage: ${name} <file or directory>`, true); break; }
        const projectIndex = projects.findIndex((project) => [project.slug, project.name.toLowerCase(), `${project.slug}.project`].includes(argument.toLowerCase()));
        let found = findEntry(resolvePath(argument || '~'));
        if (name === 'open' && projectIndex >= 0) found = { type: 'file', project: projectIndex };
        if (name === 'open' && ['about', 'contact', 'projects', 'stack'].includes(argument)) { navigate(argument, { focus: document.activeElement !== input }); break; }
        if (!found) { printOutput(entry, `Path not found: ${argument}\nUse ls to see the files in this directory.`, true); break; }
        if (name === 'cd' && found.type !== 'directory') { printOutput(entry, `Not a directory: ${argument}`, true); break; }
        if (name === 'cat' && found.type === 'directory') { printOutput(entry, `${argument} is a directory. Try ls ${argument} or cd ${argument}.`, true); break; }
        openEntry(found, entry);
        break;
      }
      case 'theme': {
        const theme = argument.toLowerCase() || themes[(themes.indexOf(state.theme) + 1) % themes.length];
        if (!themes.includes(theme)) { printOutput(entry, 'Available themes: cyan, amber, green.', true); break; }
        setTheme(theme);
        printOutput(entry, `${theme.toUpperCase()} theme loaded.`);
        break;
      }
      case 'sound':
        if (argument && !['on', 'off'].includes(argument.toLowerCase())) { printOutput(entry, 'Usage: sound on | sound off', true); break; }
        setSound(argument ? argument.toLowerCase() === 'on' : !state.sound);
        printOutput(entry, `Interface sounds are ${state.sound ? 'on' : 'off'}.`);
        break;
      case 'fullscreen': toggleFullscreen(); entry.append(element('p', 'output-text', 'Fullscreen requested.')); break;
      case 'sudo': printOutput(entry, 'Curiosity requires no elevated permissions. Try help.', true); break;
      default: printOutput(entry, `Command not found: ${name}\nType help to explore the portfolio.`, true);
    }
  }

  function setInputValue(value) {
    input.value = value;
    input.setSelectionRange(value.length, value.length);
  }
  function recallHistory(direction) {
    if (!history.length) return;
    if (historyPosition === history.length) historyDraft = input.value;
    historyPosition = Math.max(0, Math.min(history.length, historyPosition + direction));
    setInputValue(historyPosition === history.length ? historyDraft : history[historyPosition]);
  }
  function completeInput() {
    const value = input.value;
    const prefix = value.match(/\S*$/)[0];
    const head = value.slice(0, value.length - prefix.length);
    let candidates = commands;
    if (head.trim()) {
      const command = head.trim().split(/\s+/)[0].toLowerCase();
      const currentFiles = filesystem.get(state.directory) || [];
      const paths = [...filesystem].flatMap(([path, files]) => files.filter((file) => command !== 'cd' || file.type === 'directory').map((file) => `~/${path ? `${path}/` : ''}${file.name}`));
      candidates = command === 'theme' ? themes : command === 'sound' ? ['on', 'off'] : command === 'cd' ? ['~', '..', ...currentFiles.filter((file) => file.type === 'directory').map((file) => file.name), ...paths] : ['open', 'cat', 'ls'].includes(command) ? [...currentFiles.map((file) => file.name), ...paths, ...(command === 'open' ? projects.map((project) => project.slug) : [])] : [];
    }
    const matches = [...new Set(candidates)].filter((candidate) => candidate.toLowerCase().startsWith(prefix.toLowerCase()));
    if (!matches.length) return false;
    if (matches.length === 1) setInputValue(`${head}${matches[0]} `);
    else {
      let common = matches[0];
      while (common && !matches.every((match) => match.startsWith(common))) common = common.slice(0, -1);
      if (common.length > prefix.length) setInputValue(`${head}${common}`);
      notify(`Matches: ${matches.slice(0, 6).join(' · ')}${matches.length > 6 ? ' …' : ''}`);
    }
    return true;
  }
  function escapeToTerminal() {
    if ($('#previewDialog').open) { $('#previewDialog').close(); return; }
    input.value = '';
    if (state.view !== 'terminal') navigate('terminal');
    input.focus({ preventScroll: true });
  }

  // Session telemetry comes from browser APIs; no simulated CPU or network usage.
  const frameRates = [];
  let frameCount = 0;
  let sampleTime = performance.now();
  let graphDrawn = false;
  function measureFrames(now) {
    frameCount += 1;
    const elapsed = now - sampleTime;
    if (elapsed >= 1000) {
      const fps = Math.round(frameCount * 1000 / elapsed);
      $('#fpsValue').textContent = String(fps);
      $('#frameTime').textContent = `${(elapsed / frameCount).toFixed(1)} ms`;
      frameRates.push(fps);
      if (frameRates.length > 30) frameRates.shift();
      if (!reducedMotion.matches || !graphDrawn) {
        const maximum = Math.max(60, ...frameRates);
        const points = frameRates.map((value, index) => `${frameRates.length === 1 ? 200 : index * 200 / (frameRates.length - 1)},${56 - value / maximum * 47}`).join(' ');
        $('#activityLine').setAttribute('points', points);
        $('#activityFill').setAttribute('d', `M0 62 L${points.replaceAll(' ', ' L')} L200 62Z`);
        graphDrawn = frameRates.length > 1;
      }
      frameCount = 0;
      sampleTime = now;
    }
    requestAnimationFrame(measureFrames);
  }
  function updateSession() {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, '0');
    $('#clock').replaceChildren(document.createTextNode(`${pad(now.getHours())}:${pad(now.getMinutes())}`), element('span', '', `:${pad(now.getSeconds())}`));
    $('#clock').dateTime = now.toISOString();
    $('#dateLabel').textContent = now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    const seconds = Math.floor((performance.now() - sessionStart) / 1000);
    $('#uptime').textContent = `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}`;
    const offset = -now.getTimezoneOffset();
    $('#timezoneLabel').textContent = `UTC${offset >= 0 ? '+' : '−'}${pad(Math.floor(Math.abs(offset) / 60))}:${pad(Math.abs(offset) % 60)}`;
    const memory = performance.memory;
    if (memory?.totalJSHeapSize) {
      $('#memoryValue').textContent = (memory.usedJSHeapSize / 1048576).toFixed(1);
      $('#memoryLimit').textContent = `/ ${(memory.totalJSHeapSize / 1048576).toFixed(1)} MB`;
      const filled = Math.ceil(memory.usedJSHeapSize / memory.totalJSHeapSize * 24);
      [...$('#memorySegments').children].forEach((segment, index) => segment.classList.toggle('is-filled', index < filled));
    } else {
      $('#memoryValue').textContent = 'N/A';
      $('#memoryUnit').textContent = '';
      $('#memoryLimit').textContent = 'NOT EXPOSED';
    }
  }
  function updateConnection() {
    $('#connectionStatus').textContent = navigator.onLine ? 'ONLINE' : 'OFFLINE';
    $('#connectionStatus').classList.toggle('is-offline', !navigator.onLine);
    $('#connectionStatus').title = 'Network status reported by your browser.';
  }

  // Bind each control once so project changes preserve keyboard focus.
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => { navigate(tab.dataset.view); playSound(); });
    tab.addEventListener('keydown', (event) => {
      const offset = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
      if (!offset && !['Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + offset + tabs.length) % tabs.length;
      navigate(tabs[next].dataset.view);
      tabs[next].focus();
    });
  });
  $('#projectSelector').replaceChildren(...projects.map((project, index) => {
    const button = element('button');
    button.type = 'button';
    button.setAttribute('aria-pressed', String(index === 0));
    button.append(element('span', '', `0${index + 1}`), document.createTextNode(project.name));
    button.addEventListener('click', () => { selectProject(index); playSound(); });
    return button;
  }));
  $('#previousSlide').addEventListener('click', () => changeSlide(-1));
  $('#nextSlide').addEventListener('click', () => changeSlide(1));
  $('#dialogPrevious').addEventListener('click', () => changeSlide(-1));
  $('#dialogNext').addEventListener('click', () => changeSlide(1));
  $('#expandPreview').addEventListener('click', openPreview);
  $('#projectPreview').addEventListener('click', openPreview);
  $('#closePreview').addEventListener('click', () => $('#previewDialog').close());
  $('#previewDialog').addEventListener('close', () => document.body.classList.remove('has-dialog'));
  $('#previewDialog').addEventListener('click', (event) => {
    if (event.target !== $('#previewDialog')) return;
    const bounds = $('#previewDialog').getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) $('#previewDialog').close();
  });
  [$('#projectPreview'), $('#previewDialog')].forEach((node) => node.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    changeSlide(event.key === 'ArrowLeft' ? -1 : 1);
  }));
  $('#themeToggle').addEventListener('click', () => { setTheme(themes[(themes.indexOf(state.theme) + 1) % themes.length]); playSound(); });
  $('#soundToggle').addEventListener('click', () => setSound(!state.sound));
  $('#fullscreenToggle').addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () => {
    const full = Boolean(document.fullscreenElement);
    $('#fullscreenToggle').setAttribute('aria-pressed', String(full));
    $('#fullscreenToggle').setAttribute('aria-label', `${full ? 'Exit' : 'Enter'} fullscreen`);
    $('#fullscreenToggle').title = `${full ? 'Exit' : 'Enter'} fullscreen`;
  });
  $('#copyEmail').addEventListener('click', copyEmail);
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-command]');
    if (button) runCommand(button.dataset.command);
    const brand = event.target.closest('.brand');
    if (brand) { event.preventDefault(); runCommand('home'); }
  });
  let composing = false;
  input.maxLength = 400;
  input.addEventListener('compositionstart', () => { composing = true; });
  input.addEventListener('compositionend', () => { composing = false; });
  $('#terminalForm').addEventListener('submit', (event) => { event.preventDefault(); if (!composing) runCommand(input.value); });
  input.addEventListener('input', () => { historyPosition = history.length; historyDraft = input.value; });
  input.addEventListener('keydown', (event) => {
    if (event.isComposing) return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); clearTerminal(); return; }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') { event.preventDefault(); recallHistory(event.key === 'ArrowUp' ? -1 : 1); }
    if (event.key === 'Tab' && !event.shiftKey && input.value.trim() && completeInput()) event.preventDefault();
    if (event.key.length === 1 || event.key === 'Backspace') playSound(600);
  });
  document.addEventListener('keydown', (event) => {
    if (event.isComposing) return;
    const editing = event.target.closest('input, textarea, [contenteditable="true"]');
    if (!editing && !$('#previewDialog').open && event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey) { event.preventDefault(); input.focus({ preventScroll: true }); }
    if (event.key === 'Escape' && !$('#previewDialog').open) { event.preventDefault(); escapeToTerminal(); }
    if (event.altKey && !event.ctrlKey && /^[1-5]$/.test(event.key) && !$('#previewDialog').open) { event.preventDefault(); navigate(views[Number(event.key) - 1], { focus: true }); }
  });
  document.addEventListener('visibilitychange', () => { frameCount = 0; sampleTime = performance.now(); });
  window.addEventListener('hashchange', applyRoute);
  window.addEventListener('popstate', applyRoute);
  window.addEventListener('online', () => { updateConnection(); logEvent('Browser connection online'); });
  window.addEventListener('offline', () => { updateConnection(); logEvent('Browser connection offline'); });

  renderStack();
  $('#memorySegments').replaceChildren(...Array.from({ length: 24 }, () => element('span')));
  $('#year').textContent = new Date().getFullYear();
  const userAgent = navigator.userAgent;
  $('#browserLabel').textContent = /Edg\//.test(userAgent) ? 'EDGE CLIENT' : /Firefox\//.test(userAgent) ? 'FIREFOX CLIENT' : /Chrome\//.test(userAgent) ? 'CHROME CLIENT' : /Safari\//.test(userAgent) ? 'SAFARI CLIENT' : 'WEB CLIENT';
  const savedTheme = readPreference('theme', 'cyan');
  setTheme(themes.includes(savedTheme) ? savedTheme : 'cyan', false);
  setSound(readPreference('sound', 'false') === 'true', false);
  applyRoute();
  updateSession();
  updateConnection();
  logEvent('Portfolio filesystem mounted');
  logEvent('Session initialized');
  setInterval(updateSession, 1000);
  requestAnimationFrame(measureFrames);
})();
