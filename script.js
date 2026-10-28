(() => {
  'use strict';

  // Portfolio content from regalang_resume.pdf.
  const EMAIL = 'rsndo.galang@gmail.com';
  const RESUME = 'regalang_resume.pdf';
  const projects = [
    {
      name: 'Records Management System', slug: 'records-management', type: 'Internal records routing', organisation: 'Governance Commission for GOCCs',
      summary: 'Led development of the agency’s internal Records Management System. Digitized routing for 1,000+ incoming, outgoing, internal, and acknowledgement receipts monthly, cutting manual processing by 70%.',
      tags: ['Records routing', 'Workflow digitization'],
      slides: [
        { title: 'System overview', metric: '1,000+', metricLabel: 'RECEIPTS ROUTED MONTHLY', headline: 'Digitizing agency records.', points: ['Incoming and outgoing records', 'Internal and acknowledgement receipts', 'Digitized document routing'] },
        { title: 'Impact & delivery', metric: '70%', metricLabel: 'LESS MANUAL PROCESSING', headline: 'Improving records workflows.', points: ['Replaced manual routing with an internal application', 'Handled 1,000+ receipts per month', 'Led development of the agency system'] }
      ]
    },
    {
      name: 'ServiceDesk Management System', slug: 'servicedesk-management', type: 'HR service requests', organisation: 'Governance Commission for GOCCs',
      summary: 'Led development of an internal ServiceDesk Management System for HR service requests from 400+ internal and external employees. The application replaced manual, email-based requests.',
      tags: ['HR services', 'Request management'],
      slides: [
        { title: 'System overview', metric: '400+', metricLabel: 'INTERNAL & EXTERNAL EMPLOYEES', headline: 'HR requests in one system.', points: ['Created an internal HR service request application', 'Served internal and external employees', 'Led development for the agency'] },
        { title: 'Impact & delivery', metric: 'HR', metricLabel: 'SERVICE REQUEST WORKFLOW', headline: 'Digitizing service requests.', points: ['Replaced manual email-based requests', 'Supported service requests for 400+ employees', 'Built an internal agency management system'] }
      ]
    },
    {
      name: 'GCG Website', slug: 'gcg-website', type: 'Public-facing agency website', organisation: 'Governance Commission for GOCCs',
      summary: 'Contributed 10+ pages, features, and modules to the agency’s public-facing website, streamlining access to services and centralizing scattered information. Improved performance and maintainability through modular code and API integration, and reduced walk-in inquiries.',
      tags: ['Public services', 'API integration'],
      slides: [
        { title: 'Website overview', metric: '10+', metricLabel: 'PAGES / FEATURES / MODULES', headline: 'Making services accessible.', points: ['Contributed to the public-facing agency website', 'Streamlined access to agency services', 'Centralized previously scattered information'] },
        { title: 'Impact & delivery', metric: 'API', metricLabel: 'INTEGRATION & MODULAR CODE', headline: 'Improving the agency website.', points: ['Enhanced website performance and maintainability', 'Used modular code structure and API integration', 'Reduced walk-in inquiries'] }
      ]
    },
    {
      name: 'Membership Management System', slug: 'membership-management', type: 'Membership data management', organisation: 'Automobile Association of the Philippines',
      summary: 'Led development of a Membership Management System that stores members’ personal data and replaces spreadsheet-based tracking. Also enhanced payment method integration as a Junior Full-Stack Software Developer.',
      tags: ['Member records', 'Payment integration'],
      slides: [
        { title: 'System overview', metric: 'Members', metricLabel: 'PERSONAL DATA MANAGEMENT', headline: 'Organizing membership data.', points: ['Designed a membership data application', 'Replaced spreadsheet-based tracking', 'Led development for the Automobile Association'] },
        { title: 'Impact & delivery', metric: 'Payments', metricLabel: 'PAYMENT METHOD INTEGRATION', headline: 'Connecting membership workflows.', points: ['Enhanced payment method integration', 'Developed the full-stack membership application', 'Centralized members’ personal data'] }
      ]
    }
  ];
  const stack = [
    { id: 'frontend', name: 'Frontend', tools: [['HTML', '5'], ['CSS', '3'], ['JavaScript', 'JS'], ['TypeScript', 'TS'], ['React.js', 'Re'], ['Next.js', 'N'], ['Alpine.js', 'Al'], ['Vue.js', 'V'], ['Bootstrap', 'B'], ['Tailwind CSS', 'TW']] },
    { id: 'backend', name: 'Backend', tools: [['Node.js', 'No'], ['Express.js', 'ex'], ['Nest.js', 'Ne'], ['PHP', 'php'], ['Laravel', 'La']] },
    { id: 'databases', name: 'Databases', tools: [['MongoDB', 'Mo'], ['MySQL', 'My']] },
    { id: 'tools-practices', name: 'Tools & practices', tools: [['Git', 'Gi'], ['Postman', 'Po'], ['JIRA', 'Ji'], ['QA Testing', 'QA'], ['Agile/Scrum', 'Ag'], ['AWS', 'AWS']] },
    { id: 'ai-tools', name: 'AI tools & practices', tools: [['ChatGPT', 'AI'], ['Claude', 'Cl'], ['Codex', 'Cx'], ['Windsurf', 'Wi'], ['AI-assisted coding', 'AI'], ['Prompt engineering', 'PE'], ['AI-powered debugging', 'DB'], ['Code optimization', 'CO']] }
  ];
  const views = ['terminal', 'about', 'projects', 'stack', 'contact'];
  const themes = ['cyan', 'amber', 'green'];
  const commands = ['help', 'about', 'projects', 'stack', 'contact', 'resume', 'home', 'ls', 'cd', 'cat', 'open', 'pwd', 'whoami', 'date', 'echo', 'clear', 'theme', 'sound', 'fullscreen', 'reboot'];
  const $ = (selector) => document.querySelector(selector);
  const input = $('#commandInput');
  const output = $('#terminalOutput');
  const welcome = $('#terminalWelcome');
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const state = { view: 'terminal', directory: '', project: 0, slide: 0, theme: 'cyan', sound: false, caps: false, shift: false, ctrl: false };
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
  function makeIcon(name) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('icon');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `#i-${name}`);
    svg.append(use);
    return svg;
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

  // Project briefs present the résumé's documented scope and results.
  function makeProjectArtwork(project, slideIndex) {
    const accent = getComputedStyle(document.body).getPropertyValue('--accent').trim();
    const slide = project.slides[slideIndex];
    const escapeText = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const text = (x, y, value, size = 13, fill = '#a9bdc5', extra = '') => `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" ${extra}>${escapeText(value)}</text>`;
    const rect = (x, y, w, h, fill = '#111e27', stroke = '#263e49', radius = 4) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}"/>`;
    const wrappedText = (x, y, value, maxLength, size, fill = '#a9bdc5') => {
      const lines = [''];
      value.split(' ').forEach((word) => {
        const last = lines.length - 1;
        if (lines[last] && lines[last].length + word.length + 1 > maxLength) lines.push(word);
        else lines[last] += `${lines[last] ? ' ' : ''}${word}`;
      });
      return lines.map((line, index) => text(x, y + index * (size + 7), line, size, fill)).join('');
    };
    const points = slide.points.map((point, index) => rect(385, 210 + index * 64, 27, 27, '#162a32', 'none') + text(391, 229 + index * 64, `0${index + 1}`, 12, accent) + wrappedText(430, 228 + index * 64, point, 53, 13, '#c5d6df')).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 498"><title>${escapeText(project.name)} — ${escapeText(slide.title)}</title><rect width="960" height="498" fill="#090f15"/><g font-family="monospace">${rect(20, 20, 920, 458, '#0c151e', '#263e49', 7)}${text(48, 51, 'PROJECT BRIEF / HIGHLIGHTS', 11, accent)}${text(718, 51, 'ROSENDO E. GALANG', 11)}<path d="M20 69h920M48 156h864" stroke="#263e49"/>${text(48, 110, project.name, 27, '#dde8ec')}${text(48, 137, project.organisation, 13)}${rect(48, 180, 300, 235)}${text(70, 249, slide.metric, 46, accent)}${wrappedText(70, 277, slide.metricLabel, 31, 10)}<path d="M70 315h256" stroke="#263e49"/>${wrappedText(70, 351, slide.headline, 25, 17, '#dde8ec')}${rect(366, 180, 546, 235)}${points}${text(48, 449, project.type, 12)}${text(912, 449, slide.title.toUpperCase(), 11, accent, 'text-anchor="end"')}</g></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  const filesystem = new Map([
    ['', [
      { name: 'about.md', type: 'file', view: 'about', label: 'MARKDOWN' },
      { name: 'projects', type: 'directory', label: `${String(projects.length).padStart(2, '0')} PROJECTS` },
      { name: 'stack', type: 'directory', label: `${String(stack.length).padStart(2, '0')} CATEGORIES` },
      { name: 'contact.json', type: 'file', view: 'contact', label: 'CONTACT' },
      { name: RESUME, type: 'file', resume: true, label: 'PDF / RESUME' },
      { name: 'README.md', type: 'file', readme: true, label: 'START HERE' }
    ]],
    ['projects', projects.map((project, index) => ({ name: `${project.slug}.project`, type: 'file', project: index, label: 'PROJECT / BRIEF' }))],
    ['stack', stack.map((group) => ({ name: group.id, type: 'directory', label: `${String(group.tools.length).padStart(2, '0')} TOOLS` }))]
  ]);
  stack.forEach((group) => filesystem.set(`stack/${group.id}`, group.tools.map(([name]) => ({ name: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.tool`, type: 'file', tool: name, group: group.name, label: 'TECHNOLOGY' }))));

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
    renderFiles();
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
  function renderFiles() {
    const directory = state.directory;
    const files = filesystem.get(directory) || [];
    $('#fileList').dataset.directory = directory || 'root';
    $('#fileList').setAttribute('aria-label', `Files in ${cwd()}`);
    $('#directoryPath').textContent = directory ? `rosendo / ${directory.replaceAll('/', ' / ')}` : 'home / rosendo';
    $('#fileCount').textContent = `${String(files.length).padStart(2, '0')} ITEMS`;
    $('#directoryUp').disabled = !directory;
    $('#fileList').replaceChildren(...files.map((file) => {
      const button = element(file.resume ? 'a' : 'button', `file-button${file.type === 'file' ? ' is-file' : ''}`);
      if (file.resume) {
        button.href = RESUME;
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
      } else {
        button.type = 'button';
        const selected = file.project !== undefined ? file.project === state.project : Boolean(file.view && file.view === state.view);
        button.setAttribute('aria-pressed', String(selected));
        button.addEventListener('click', () => runCommand(`open /home/rosendo/${directory ? `${directory}/` : ''}${file.name}`));
      }
      button.title = file.name;
      button.setAttribute('aria-label', `Open ${file.name}${file.type === 'directory' ? ' directory' : ''}`);
      button.append(makeIcon(file.type === 'directory' ? 'folder' : file.project !== undefined || file.tool ? 'code' : 'file'), element('span', 'file-name', `${file.name}${file.type === 'directory' ? '/' : ''}`), element('span', 'file-type', file.label));
      return button;
    }));
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
      viewLink.href = RESUME;
      viewLink.target = '_blank';
      viewLink.rel = 'noopener noreferrer';
      const downloadLink = element('a', 'outline-button', 'DOWNLOAD RESUME');
      downloadLink.href = RESUME;
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
    const image = makeProjectArtwork(project, state.slide);
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
    renderFiles();
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
      case 'resume': openEntry({ type: 'file', resume: true, name: RESUME }, entry); break;
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
  const keyButtons = new Map();
  function renderKeyboard() {
    const character = (char, code, shifted = '') => ({ label: char.toUpperCase(), char, code, shifted });
    const special = (label, code, width = 1, accent = false) => ({ label, code, width, accent });
    const letters = (word) => [...word].map((letter) => character(letter, `Key${letter.toUpperCase()}`));
    const rows = [
      [character('`', 'Backquote', '~'), ...'1234567890'.split('').map((digit, index) => character(digit, `Digit${digit}`, '!@#$%^&*()'[index])), character('-', 'Minus', '_'), character('=', 'Equal', '+'), special('BKSP', 'Backspace', 1.65)],
      [special('TAB', 'Tab', 1.35), ...letters('qwertyuiop'), character('[', 'BracketLeft', '{'), character(']', 'BracketRight', '}'), character('\\', 'Backslash', '|')],
      [special('CAPS', 'CapsLock', 1.6), ...letters('asdfghjkl'), character(';', 'Semicolon', ':'), character("'", 'Quote', '"'), special('ENTER ↵', 'Enter', 2.05, true)],
      [special('SHIFT', 'ShiftLeft', 2), ...letters('zxcvbnm'), character(',', 'Comma', '<'), character('.', 'Period', '>'), character('/', 'Slash', '?'), special('SHIFT', 'ShiftRight', 2.65)],
      [special('CTRL', 'ControlLeft', 1.3), special('ESC', 'Escape'), special('HOME', 'Home'), { ...character(' ', 'Space'), label: 'S P A C E', width: 6.25 }, special('END', 'End'), special('←', 'ArrowLeft'), special('↓', 'ArrowDown'), special('↑', 'ArrowUp'), special('→', 'ArrowRight')]
    ];
    $('#virtualKeyboard').replaceChildren(...rows.map((row) => {
      const node = element('div', 'keyboard-row');
      row.forEach((key) => {
        const button = element('button', `keyboard-key${key.char === undefined ? ' is-special' : ''}${key.accent ? ' is-accent' : ''}${key.code === 'Space' ? ' space-key' : ''}`, key.label);
        button.type = 'button';
        button.dataset.code = key.code;
        button.style.flexGrow = key.width || 1;
        button.setAttribute('aria-label', key.code === 'Space' ? 'Space' : key.code.startsWith('Shift') ? 'Toggle virtual Shift' : key.code === 'CapsLock' ? 'Toggle virtual Caps Lock' : key.code === 'ControlLeft' ? 'Toggle virtual Control (A, K, L)' : key.code === 'Enter' ? 'Enter: execute command' : key.code === 'Tab' ? 'Tab: complete command' : key.label);
        if (['CapsLock', 'ShiftLeft', 'ShiftRight', 'ControlLeft'].includes(key.code)) button.setAttribute('aria-pressed', 'false');
        if (key.shifted) button.append(element('small', '', key.shifted));
        button.addEventListener('click', () => {
          button.classList.add('is-pressed');
          setTimeout(() => button.classList.remove('is-pressed'), 130);
          pressVirtualKey(key);
        });
        keyButtons.set(key.code, button);
        node.append(button);
      });
      return node;
    }));
  }
  function syncModifiers() {
    for (const [code, pressed] of [['CapsLock', state.caps], ['ShiftLeft', state.shift], ['ShiftRight', state.shift], ['ControlLeft', state.ctrl]]) keyButtons.get(code)?.setAttribute('aria-pressed', String(pressed));
  }
  function editSelection(value, backward = false) {
    let start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    if (backward && start === end) start = Math.max(0, start - 1);
    input.setRangeText(value, start, end, 'end');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
  function applyControl(letter) {
    if (letter === 'k') clearTerminal();
    else if (letter === 'a') input.select();
    else if (letter === 'l') input.focus({ preventScroll: true });
    else notify('Virtual Ctrl shortcuts: A select all · K clear · L focus');
    state.ctrl = false;
    syncModifiers();
  }
  function escapeToTerminal() {
    if ($('#previewDialog').open) { $('#previewDialog').close(); return; }
    input.value = '';
    if (state.view !== 'terminal') navigate('terminal');
    input.focus({ preventScroll: true });
  }
  function pressVirtualKey(key) {
    if (key.code === 'CapsLock') { state.caps = !state.caps; syncModifiers(); playSound(480); return; }
    if (key.code.startsWith('Shift')) { state.shift = !state.shift; syncModifiers(); playSound(480); return; }
    if (key.code === 'ControlLeft') { state.ctrl = !state.ctrl; syncModifiers(); playSound(480); return; }
    input.focus({ preventScroll: true });
    if (state.ctrl && key.char) { applyControl(key.char.toLowerCase()); return; }
    switch (key.code) {
      case 'Enter': $('#terminalForm').requestSubmit(); break;
      case 'Backspace': editSelection('', true); break;
      case 'Tab': completeInput(); break;
      case 'Escape': escapeToTerminal(); break;
      case 'ArrowUp': recallHistory(-1); break;
      case 'ArrowDown': recallHistory(1); break;
      case 'ArrowLeft': { const position = input.selectionStart === input.selectionEnd ? Math.max(0, input.selectionStart - 1) : input.selectionStart; input.setSelectionRange(position, position); break; }
      case 'ArrowRight': { const position = input.selectionStart === input.selectionEnd ? Math.min(input.value.length, input.selectionEnd + 1) : input.selectionEnd; input.setSelectionRange(position, position); break; }
      case 'Home': input.setSelectionRange(0, 0); break;
      case 'End': input.setSelectionRange(input.value.length, input.value.length); break;
      default:
        if (key.char !== undefined) {
          const value = /^[a-z]$/.test(key.char) ? (state.caps !== state.shift ? key.char.toUpperCase() : key.char) : state.shift && key.shifted ? key.shifted : key.char;
          if (input.value.length - (input.selectionEnd - input.selectionStart) + value.length <= 400) editSelection(value);
          state.shift = false;
          syncModifiers();
        }
    }
    playSound(600);
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
  $('#directoryUp').addEventListener('click', () => runCommand('cd ..'));
  $('#directoryHome').addEventListener('click', () => runCommand('cd ~'));
  $('#fileList').addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const buttons = [...$('#fileList').children];
    const index = buttons.indexOf(document.activeElement);
    if (index < 0) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next].focus();
  });
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
    if (state.ctrl && event.key.length === 1) { event.preventDefault(); applyControl(event.key.toLowerCase()); return; }
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') { event.preventDefault(); recallHistory(event.key === 'ArrowUp' ? -1 : 1); }
    if (event.key === 'Tab' && !event.shiftKey && input.value.trim() && completeInput()) event.preventDefault();
    if (event.key.length === 1 || event.key === 'Backspace') playSound(600);
  });
  const keyboardStatus = () => {
    const dot = element('span', 'status-dot');
    $('#keyboardState').replaceChildren(dot, document.createTextNode(document.activeElement === input ? ' INPUT ACTIVE' : ' CLICK TO TYPE'));
  };
  input.addEventListener('focus', keyboardStatus);
  input.addEventListener('blur', keyboardStatus);
  $('#virtualKeyboard').addEventListener('pointerdown', (event) => { if (event.target.closest('button')) event.preventDefault(); });
  document.addEventListener('keydown', (event) => {
    keyButtons.get(event.code)?.classList.add('is-pressed');
    if (event.isComposing) return;
    const editing = event.target.closest('input, textarea, [contenteditable="true"]');
    if (!editing && !$('#previewDialog').open && event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey) { event.preventDefault(); input.focus({ preventScroll: true }); }
    if (event.key === 'Escape' && !$('#previewDialog').open) { event.preventDefault(); escapeToTerminal(); }
    if (event.altKey && !event.ctrlKey && /^[1-5]$/.test(event.key) && !$('#previewDialog').open) { event.preventDefault(); navigate(views[Number(event.key) - 1], { focus: true }); }
  });
  document.addEventListener('keyup', (event) => keyButtons.get(event.code)?.classList.remove('is-pressed'));
  window.addEventListener('blur', () => { keyButtons.forEach((button) => button.classList.remove('is-pressed')); state.shift = false; state.ctrl = false; syncModifiers(); });
  document.addEventListener('visibilitychange', () => { frameCount = 0; sampleTime = performance.now(); });
  window.addEventListener('hashchange', applyRoute);
  window.addEventListener('popstate', applyRoute);
  window.addEventListener('online', () => { updateConnection(); logEvent('Browser connection online'); });
  window.addEventListener('offline', () => { updateConnection(); logEvent('Browser connection offline'); });

  renderStack();
  renderKeyboard();
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
