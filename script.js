const dashboard = document.querySelector('.dashboard');
const expandableTiles = [...document.querySelectorAll('.expandable')];
const backButton = document.querySelector('.back-button');
const themeButton = document.querySelector('.theme-toggle');
const status = document.querySelector('.screen-reader-status');

const projects = [
  {
    name: 'Prompt Lab',
    type: 'AI prompt workspace',
    summary: 'A focused workspace for shaping, testing, and organizing prompts. Save useful versions, compare outputs, and keep experiments easy to revisit.',
    tech: ['React', 'Node.js', 'LLM API'],
    code: 'https://github.com/', live: 'https://example.com/',
    slides: ['Workspace overview', 'Prompt editor', 'Output comparison', 'Saved library']
  },
  {
    name: 'Vector Search',
    type: 'Semantic search dashboard',
    summary: 'A sample search interface for exploring a document collection with natural language, useful filters, and clear source references.',
    tech: ['TypeScript', 'Python', 'Vector DB'],
    code: 'https://github.com/', live: 'https://example.com/',
    slides: ['Search overview', 'Results explorer', 'Source details']
  },
  {
    name: 'Agent Desk',
    type: 'AI workflow builder',
    summary: 'A visual workspace for connecting small AI tasks into repeatable workflows, with run history and helpful status at every step.',
    tech: ['Next.js', 'Python', 'AI agents'],
    code: 'https://github.com/', live: '',
    slides: ['Flow canvas', 'Agent settings', 'Run history', 'Task details']
  }
];

let selectedProject = 0;
let selectedSlide = 0;

function openPanel(tile) {
  const panel = tile.dataset.panel;
  dashboard.classList.add('is-expanded');
  tile.classList.add('active');
  tile.setAttribute('role', 'region');
  tile.setAttribute('aria-label', `${panel} details`);
  tile.removeAttribute('tabindex');
  tile.querySelector('.panel-content').hidden = false;
  backButton.hidden = false;
  status.textContent = `${panel} opened. Use the dashboard button to return.`;
  if (panel === 'projects') document.querySelector('.project-nav button')?.focus({preventScroll:true});
  else backButton.focus({preventScroll:true});
}

function closePanel() {
  const active = document.querySelector('.expandable.active');
  if (!active || active.classList.contains('closing')) return;
  const panel = active.dataset.panel;
  active.classList.add('closing');
  backButton.disabled = true;
  const finishClose = () => {
    active.querySelector('.panel-content').hidden = true;
    active.classList.remove('active', 'closing');
    active.setAttribute('role', 'button');
    active.setAttribute('aria-label', `Open ${panel}`);
    active.setAttribute('tabindex', '0');
    dashboard.classList.remove('is-expanded');
    backButton.hidden = true;
    backButton.disabled = false;
    status.textContent = 'Portfolio dashboard.';
    active.focus({preventScroll:true});
  };
  const closeDelay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 820;
  window.setTimeout(finishClose, closeDelay);
}

expandableTiles.forEach((tile) => {
  tile.addEventListener('click', (event) => {
    if (tile.classList.contains('active')) return;
    if (event.target.closest('a, button')) return;
    openPanel(tile);
  });
  tile.addEventListener('keydown', (event) => {
    if (!tile.classList.contains('active') && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      openPanel(tile);
    }
  });
});

backButton.addEventListener('click', closePanel);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closePanel();
});

themeButton.addEventListener('click', () => {
  const dark = document.body.classList.toggle('dark-mode');
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  document.querySelector('meta[name="theme-color"]').content = dark ? '#202624' : '#f3efe4';
});

const navList = document.querySelector('.project-nav ul');
const galleryTitle = document.querySelector('.project-gallery h3');
const counter = document.querySelector('.project-counter');
const techStack = document.querySelector('.tech-stack');
const galleryImage = document.querySelector('.carousel img');
const dots = document.querySelector('.carousel-dots');
const summary = document.querySelector('.project-summary');
const links = document.querySelector('.project-links');
const previousButton = document.querySelector('.carousel-arrow.previous');
const nextButton = document.querySelector('.carousel-arrow.next');

function makeProjectArtwork(project, slideIndex) {
  const palettes = [
    ['#e8eaff','#6254ed','#55dff6','#172342'],
    ['#edf1ff','#6656ef','#c6ff66','#161b38'],
    ['#e5f3f9','#2089a6','#9a8cff','#172b42']
  ];
  const colors = palettes[selectedProject];
  const title = project.slides[slideIndex];
  const cards = slideIndex % 2 === 0
    ? `<rect x="50" y="145" width="145" height="104" rx="5" fill="#fffdf7"/><rect x="210" y="145" width="145" height="104" rx="5" fill="#fffdf7"/><rect x="370" y="145" width="145" height="104" rx="5" fill="#fffdf7"/><circle cx="95" cy="190" r="20" fill="${colors[2]}"/><path d="M75 222q19-34 40 0" fill="${colors[1]}"/><rect x="225" y="165" width="100" height="7" rx="3" fill="${colors[1]}"/><rect x="225" y="181" width="75" height="5" rx="2" fill="#d6d3c8"/><rect x="225" y="197" width="87" height="5" rx="2" fill="#d6d3c8"/><rect x="385" y="166" width="90" height="54" rx="3" fill="${colors[0]}"/><circle cx="425" cy="193" r="17" fill="${colors[2]}"/>`
    : `<rect x="52" y="143" width="470" height="110" rx="5" fill="#fffdf7"/><rect x="72" y="162" width="74" height="72" rx="4" fill="${colors[0]}"/><rect x="160" y="163" width="130" height="8" rx="4" fill="${colors[1]}"/><rect x="160" y="181" width="220" height="5" rx="2" fill="#d6d3c8"/><rect x="160" y="195" width="188" height="5" rx="2" fill="#d6d3c8"/><rect x="160" y="209" width="150" height="5" rx="2" fill="#d6d3c8"/><rect x="410" y="164" width="88" height="52" rx="4" fill="${colors[2]}"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340"><rect width="600" height="340" fill="${colors[0]}"/><circle cx="520" cy="42" r="75" fill="${colors[2]}" opacity=".3"/><rect x="29" y="28" width="542" height="284" rx="9" fill="#f8f5ec"/><rect x="29" y="28" width="542" height="36" rx="9" fill="${colors[3]}"/><circle cx="47" cy="46" r="4" fill="#e18a67"/><circle cx="61" cy="46" r="4" fill="#d2aa70"/><circle cx="75" cy="46" r="4" fill="#95aa92"/><text x="92" y="50" fill="#f8f5ec" font-family="Arial,sans-serif" font-size="11">${project.name.toLowerCase()}</text><text x="51" y="103" fill="${colors[3]}" font-family="Arial,sans-serif" font-size="21" font-weight="700">${title}</text><text x="51" y="124" fill="#7e8279" font-family="Arial,sans-serif" font-size="9">A sample product screen / ${String(slideIndex+1).padStart(2,'0')}</text>${cards}<rect x="51" y="273" width="95" height="17" rx="8" fill="${colors[1]}"/><text x="66" y="285" fill="white" font-family="Arial,sans-serif" font-size="7">VIEW DETAILS</text><text x="491" y="286" fill="#85887e" font-family="monospace" font-size="8">SAMPLE UI</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function renderProjectNav() {
  navList.replaceChildren();
  projects.forEach((project, index) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = project.name;
    button.setAttribute('aria-current', String(index === selectedProject));
    button.addEventListener('click', () => {
      selectedProject = index;
      selectedSlide = 0;
      renderProjectNav();
      renderProject();
    });
    li.append(button);
    navList.append(li);
  });
}

function renderProject() {
  const project = projects[selectedProject];
  galleryTitle.textContent = project.name;
  counter.textContent = `${String(selectedProject + 1).padStart(2, '0')} / 0${projects.length} · ${project.type}`;
  techStack.replaceChildren(...project.tech.map((tech) => {
    const tag = document.createElement('span');
    tag.textContent = tech;
    return tag;
  }));
  summary.textContent = project.summary;
  galleryImage.src = makeProjectArtwork(project, selectedSlide);
  galleryImage.alt = `${project.name}: ${project.slides[selectedSlide]} sample screen`;
  dots.replaceChildren(...project.slides.map((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show image ${index + 1}: ${slide}`);
    dot.setAttribute('aria-current', String(index === selectedSlide));
    dot.addEventListener('click', () => {
      selectedSlide = index;
      renderProject();
    });
    return dot;
  }));
  previousButton.disabled = selectedSlide === 0;
  nextButton.disabled = selectedSlide === project.slides.length - 1;
  links.replaceChildren();
  [[project.code, 'VIEW CODE'], [project.live, 'VISIT SITE']].forEach(([href, label]) => {
    if (!href) return;
    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.innerHTML = `${label} <span aria-hidden="true">↗</span>`;
    links.append(link);
  });
}

previousButton.addEventListener('click', () => {
  if (selectedSlide > 0) selectedSlide -= 1;
  renderProject();
});
nextButton.addEventListener('click', () => {
  if (selectedSlide < projects[selectedProject].slides.length - 1) selectedSlide += 1;
  renderProject();
});

document.querySelector('#year').textContent = new Date().getFullYear();
renderProjectNav();
renderProject();
