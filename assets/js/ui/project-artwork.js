(() => {
  'use strict';

  // Project briefs present the résumé's documented scope and results.
  function makeProjectArtwork(project, slideIndex, accent) {
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

  window.RosendoOS.makeProjectArtwork = makeProjectArtwork;
})();
