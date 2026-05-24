import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { jsPDF } from 'npm:jspdf@4.0.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Load data in parallel
    const [settingsArr, projects] = await Promise.all([
      base44.asServiceRole.entities.SiteSettings.filter({ key: 'profile' }),
      base44.asServiceRole.entities.Project.filter({ status: 'published' }),
    ]);

    const s = settingsArr?.[0] || {};
    const publishedProjects = (projects || [])
      .sort((a, b) => (a.display_order || 99) - (b.display_order || 99))
      .slice(0, 3);

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = 210;
    const MARGIN = 18;
    const CONTENT_W = W - MARGIN * 2;

    // ── Helpers ──────────────────────────────────────────────────────────────
    const stripHtml = (html) => (html || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

    const wrapText = (text, maxWidth, fontSize) => {
      doc.setFontSize(fontSize);
      return doc.splitTextToSize(text, maxWidth);
    };

    let y = 0;

    const checkPage = (needed = 10) => {
      if (y + needed > 272) {
        doc.addPage();
        y = 18;
      }
    };

    const sectionLine = (label) => {
      checkPage(12);
      y += 4;
      doc.setDrawColor(0, 245, 255);
      doc.setLineWidth(0.4);
      doc.line(MARGIN, y, W - MARGIN, y);
      y += 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(0, 245, 255);
      doc.text(label.toUpperCase(), MARGIN, y);
      y += 6;
    };

    // ── PAGE 1: Header ────────────────────────────────────────────────────────
    // Dark header band
    doc.setFillColor(2, 2, 4);
    doc.rect(0, 0, W, 68, 'F');

    // Accent left bar
    doc.setFillColor(0, 245, 255);
    doc.rect(0, 0, 4, 68, 'F');

    // Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(248, 250, 252);
    doc.text((s.builder_name || 'YOUR NAME').toUpperCase(), MARGIN, 20);

    // Title
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(0, 245, 255);
    doc.text((s.title || 'AI NATIVE PRODUCT BUILDER').toUpperCase(), MARGIN, 29);

    // Tagline
    doc.setTextColor(142, 145, 150);
    doc.setFontSize(8);
    const taglineLines = wrapText(s.tagline || '', CONTENT_W - 20, 8);
    doc.text(taglineLines, MARGIN, 37);

    // Contact line (right side of header)
    doc.setFontSize(7.5);
    doc.setTextColor(142, 145, 150);
    const contactItems = [
      s.email ? s.email : null,
      s.apps_website_url ? '🌐 ' + s.apps_website_url.replace(/^https?:\/\//, '') : null,
      s.github_url ? 'gh: ' + s.github_url.replace(/^https?:\/\/(www\.)?github\.com\//, '') : null,
      s.linkedin_url ? 'li: ' + s.linkedin_url.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '') : null,
    ].filter(Boolean);
    contactItems.forEach((item, i) => {
      doc.text(item, W - MARGIN, 20 + i * 7, { align: 'right' });
    });

    y = 76;

    // ── BIO ───────────────────────────────────────────────────────────────────
    if (s.bio) {
      sectionLine('About');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 50);
      const bioLines = wrapText(s.bio, CONTENT_W, 9.5);
      checkPage(bioLines.length * 5 + 4);
      doc.text(bioLines, MARGIN, y);
      y += bioLines.length * 5 + 4;
    }

    // ── STATS ─────────────────────────────────────────────────────────────────
    checkPage(20);
    y += 2;
    const stats = [
      { label: 'APPS DEPLOYED', value: String(s.apps_deployed || '12+') },
      { label: 'TOKENS ORCHESTRATED', value: s.tokens_orchestrated || '—' },
      { label: 'AVG BUILD TIME', value: (s.avg_build_time || '< 5 DAYS').toUpperCase() },
    ];
    const boxW = CONTENT_W / 3 - 3;
    stats.forEach((stat, i) => {
      const bx = MARGIN + i * (boxW + 4.5);
      doc.setFillColor(245, 248, 252);
      doc.rect(bx, y, boxW, 14, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(2, 2, 4);
      doc.text(stat.value, bx + boxW / 2, y + 7, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(142, 145, 150);
      doc.text(stat.label, bx + boxW / 2, y + 12, { align: 'center' });
    });
    y += 20;

    // ── SKILLS ────────────────────────────────────────────────────────────────
    {
      // Merge profile skills + most-used project tags
      const profileSkills = s.skills || [];
      const tagCount = {};
      for (const p of projects || []) {
        for (const t of (p.tech_stack || [])) {
          tagCount[t] = (tagCount[t] || 0) + 1;
        }
      }
      const topProjectTags = Object.entries(tagCount)
        .sort((a, b) => b[1] - a[1])
        .map(([tag]) => tag);
      const normalize = (str) => str.toLowerCase().replace(/[\s\-_.]+/g, '');
      const seen = new Map();
      for (const skill of [...profileSkills, ...topProjectTags]) {
        const key = normalize(skill);
        if (!seen.has(key)) seen.set(key, skill);
      }
      const allSkills = [...seen.values()];

      if (allSkills.length) {
        sectionLine('Skills & Stack');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(40, 40, 50);
        let tx = MARGIN;
        let rowY = y;
        for (const skill of allSkills) {
          const tw = doc.getTextWidth(skill) + 6;
          if (tx + tw > W - MARGIN) {
            tx = MARGIN;
            rowY += 9;
            checkPage(9);
          }
          doc.setFillColor(240, 248, 255);
          doc.roundedRect(tx, rowY - 5, tw, 7, 1, 1, 'F');
          doc.setTextColor(2, 2, 4);
          doc.text(skill, tx + 3, rowY);
          tx += tw + 3;
        }
        y = rowY + 10;
      }
    }

    // ── PROJECTS ──────────────────────────────────────────────────────────────
    sectionLine('Active Projects');

    for (const [idx, project] of publishedProjects.entries()) {
      checkPage(50);

      // Thumbnail image (right side, 35x22mm)
      const THUMB_W = 35;
      const THUMB_H = 22;
      const thumbX = W - MARGIN - THUMB_W;
      const thumbStartY = y - 4;
      if (project.thumbnail_url) {
        try {
          const imgResp = await fetch(project.thumbnail_url);
          if (imgResp.ok) {
            const imgBuf = await imgResp.arrayBuffer();
            const imgBytes = new Uint8Array(imgBuf);
            const base64 = btoa(String.fromCharCode(...imgBytes));
            const contentType = imgResp.headers.get('content-type') || 'image/jpeg';
            const format = contentType.includes('png') ? 'PNG' : 'JPEG';
            doc.addImage(`data:${contentType};base64,${base64}`, format, thumbX, thumbStartY, THUMB_W, THUMB_H);
            // Thin cyan border around thumbnail
            doc.setDrawColor(0, 245, 255);
            doc.setLineWidth(0.3);
            doc.rect(thumbX, thumbStartY, THUMB_W, THUMB_H);
          }
        } catch (_) { /* skip if image fails */ }
      }

      const textW = project.thumbnail_url ? CONTENT_W - THUMB_W - 5 : CONTENT_W;

      // Project number + title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(2, 2, 4);
      doc.text(`${String(idx + 1).padStart(2, '0')}  ${project.title || ''}`, MARGIN, y);

      // Live link (below title, left side)
      if (project.live_url) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(0, 245, 255);
        doc.text('↗ ' + project.live_url, MARGIN, y + 5);
      }
      y += project.live_url ? 10 : 5;

      // Tagline
      if (project.tagline) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 100);
        const taglineLines = wrapText(project.tagline, textW, 9);
        doc.text(taglineLines, MARGIN, y);
        y += taglineLines.length * 5 + 1;
      }

      // THE LOGIC
      if (project.problem_statement) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(0, 245, 255);
        doc.text('THE LOGIC', MARGIN, y);
        y += 4;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(40, 40, 50);
        const lines = wrapText(project.problem_statement, textW, 8.5);
        checkPage(lines.length * 4.5 + 4);
        doc.text(lines, MARGIN, y);
        y += lines.length * 4.5 + 3;
      }

      // Ensure y clears the thumbnail before continuing
      if (project.thumbnail_url) {
        y = Math.max(y, thumbStartY + THUMB_H + 4);
      }

      // ARCHITECTURE
      const arch = stripHtml(project.architecture);
      if (arch) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(0, 245, 255);
        doc.text('ARCHITECTURE', MARGIN, y);
        y += 4;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(40, 40, 50);
        const lines = wrapText(arch, CONTENT_W, 8.5);
        const preview = lines.slice(0, 4);
        checkPage(preview.length * 4.5 + 4);
        doc.text(preview, MARGIN, y);
        y += preview.length * 4.5 + 3;
      }

      // AI LOG EXCERPT
      const aiLog = stripHtml(project.ai_collaboration_log);
      if (aiLog) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(0, 245, 255);
        doc.text('AI COLLABORATION HIGHLIGHT', MARGIN, y);
        y += 4;
        // Terminal-style box
        doc.setFillColor(10, 10, 20);
        const logText = aiLog.slice(0, 320) + (aiLog.length > 320 ? '...' : '');
        const logLines = wrapText(logText, CONTENT_W - 8, 8);
        const boxH = logLines.length * 4.5 + 8;
        checkPage(boxH + 4);
        doc.rect(MARGIN, y, CONTENT_W, boxH, 'F');
        doc.setFont('courier', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(0, 245, 255);
        doc.text(logLines, MARGIN + 4, y + 6);
        y += boxH + 4;
      }

      // Tech stack tags
      if (project.tech_stack?.length) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        let tx = MARGIN;
        for (const tag of project.tech_stack) {
          const tw = doc.getTextWidth(tag) + 5;
          if (tx + tw > W - MARGIN) break;
          doc.setFillColor(230, 248, 255);
          doc.roundedRect(tx, y - 4, tw, 6, 1, 1, 'F');
          doc.setTextColor(0, 80, 100);
          doc.text(tag, tx + 2.5, y);
          tx += tw + 3;
        }
        y += 8;
      }

      // Separator between projects
      if (idx < publishedProjects.length - 1) {
        checkPage(6);
        doc.setDrawColor(220, 225, 235);
        doc.setLineWidth(0.3);
        doc.line(MARGIN, y, W - MARGIN, y);
        y += 8;
      }
    }

    // ── FOOTER ────────────────────────────────────────────────────────────────
    const pageCount = doc.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(180, 185, 195);
      doc.text(
        `${s.builder_name || ''} — AI Native Product Builder  |  Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
        MARGIN,
        290
      );
      doc.text(`${p} / ${pageCount}`, W - MARGIN, 290, { align: 'right' });
      // Bottom accent line
      doc.setDrawColor(0, 245, 255);
      doc.setLineWidth(0.5);
      doc.line(0, 293, W, 293);
    }

    const pdfBuffer = doc.output('arraybuffer');

    const name = (s.builder_name || 'portfolio').toLowerCase().replace(/\s+/g, '-');
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${name}-portfolio.pdf"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});