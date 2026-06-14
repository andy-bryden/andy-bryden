    // ── TAB NAVIGATION ──
    function showTab(id) {
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('panel-' + id).classList.add('active');
      event.currentTarget.classList.add('active');
    }

    // ── SUB TAB NAVIGATION ──
    function showSub(group, id) {
      document.querySelectorAll('#panel-' + group + ' .sub-panel').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('#panel-' + group + ' .sub-tab').forEach(b => b.classList.remove('active'));
      document.getElementById(group + '-' + id).classList.add('active');
      event.currentTarget.classList.add('active');
    }

    // ── TIMEZONE DATA ──
    const TZ = [
      {
        label: 'NSW / VIC',
        summer: { off: '+3h', their9: '5:00 AM', their5: '2:00 PM', win: '7:30–14:00', wstart: 7.5, wend: 14, style: 'background:#FAEEE7;color:#C4622D', strat: 'Contact by 2:00 PM Perth — they finish before you. Treat like an international TZ from Oct–Apr.' },
        winter: { off: '+2h', their9: '6:00 AM', their5: '3:00 PM', win: '7:30–15:00', wstart: 7.5, wend: 15, style: 'background:#E8F4EE;color:#2A7A52', strat: 'Better overlap in winter. Contact by 3:00 PM Perth.' }
      },
      {
        label: 'South Australia',
        summer: { off: '+2.5h', their9: '5:30 AM', their5: '2:30 PM', win: '7:30–14:30', wstart: 7.5, wend: 14.5, style: 'background:#FAEEE7;color:#C4622D', strat: 'Contact by 2:30 PM Perth.' },
        winter: { off: '+1.5h', their9: '6:30 AM', their5: '3:30 PM', win: '7:30–15:30', wstart: 7.5, wend: 15.5, style: 'background:#E8F4EE;color:#2A7A52', strat: 'Full day overlap in winter.' }
      },
      {
        label: 'Queensland',
        summer: { off: '+2h', their9: '6:00 AM', their5: '3:00 PM', win: '7:30–15:00', wstart: 7.5, wend: 15, style: 'background:#E8F4EE;color:#2A7A52', strat: 'No daylight saving — better than VIC/NSW. Contact by 3:00 PM.' },
        winter: { off: '+2h', their9: '6:00 AM', their5: '3:00 PM', win: '7:30–15:00', wstart: 7.5, wend: 15, style: 'background:#E8F4EE;color:#2A7A52', strat: 'No change year-round. Contact by 3:00 PM.' }
      },
      {
        label: 'Japan (JST)',
        summer: { off: '+1h', their9: '7:00 AM', their5: '4:00 PM', win: '7:30–16:00', wstart: 7.5, wend: 16, style: 'background:#E8F4EE;color:#2A7A52', strat: 'Strong all-day overlap. 7:30 AM Perth = 8:30 AM Tokyo.' },
        winter: { off: '+1h', their9: '7:00 AM', their5: '4:00 PM', win: '7:30–16:00', wstart: 7.5, wend: 16, style: 'background:#E8F4EE;color:#2A7A52', strat: 'No change year-round. Strong overlap.' }
      },
      {
        label: 'China (CST)',
        summer: { off: '0', their9: '8:00 AM', their5: '5:00 PM', win: '7:30–17:00', wstart: 7.5, wend: 17, style: 'background:#E8F4EE;color:#2A7A52', strat: 'Same time zone. Full day overlap. Easiest to work with.' },
        winter: { off: '0', their9: '8:00 AM', their5: '5:00 PM', win: '7:30–17:00', wstart: 7.5, wend: 17, style: 'background:#E8F4EE;color:#2A7A52', strat: 'Same time zone year-round.' }
      },
      {
        label: 'Malaysia (MYT)',
        summer: { off: '0', their9: '8:00 AM', their5: '5:00 PM', win: '7:30–17:00', wstart: 7.5, wend: 17, style: 'background:#E8F4EE;color:#2A7A52', strat: 'Same time zone. Full day overlap.' },
        winter: { off: '0', their9: '8:00 AM', their5: '5:00 PM', win: '7:30–17:00', wstart: 7.5, wend: 17, style: 'background:#E8F4EE;color:#2A7A52', strat: 'Same time zone year-round.' }
      },
      {
        label: 'India (IST)',
        summer: { off: '−2.5h', their9: '10:30 AM', their5: '7:30 PM Perth', win: '10:30–15:00', wstart: 10.5, wend: 15, style: 'background:#FBF3E3;color:#B07D2A', strat: 'Contact window 10:30 AM–3:00 PM Perth (their 8:00 AM–4:30 PM). No DST — offset is constant year-round.' },
        winter: { off: '−2.5h', their9: '10:30 AM', their5: '7:30 PM Perth', win: '10:30–15:00', wstart: 10.5, wend: 15, style: 'background:#FBF3E3;color:#B07D2A', strat: 'Same window year-round — neither Perth nor India observes daylight saving. Contact 10:30 AM–3:00 PM Perth.' }
      },
      {
        label: 'Turkey (TRT)',
        summer: { off: '−5h', their9: '1:00 PM', their5: 'After Perth close', win: '13:00–16:30', wstart: 13, wend: 16.5, style: 'background:#EBF2F8;color:#2C5F8A', strat: '1:00 PM Perth = 8:00 AM Istanbul. Good afternoon window. Turkey is UTC+3 year-round (no DST since 2016).' },
        winter: { off: '−5h', their9: '1:00 PM', their5: 'After Perth close', win: '13:00–16:30', wstart: 13, wend: 16.5, style: 'background:#EBF2F8;color:#2C5F8A', strat: 'Same window year-round. 1:00 PM Perth = 8:00 AM Istanbul.' }
      },
      {
        label: 'Poland (CET)',
        summer: { off: '−6h', their9: '2:00 PM', their5: 'After Perth close', win: '14:00–16:30', wstart: 14, wend: 16.5, style: 'background:#EBF2F8;color:#2C5F8A', strat: '2:00 PM Perth = 8:00 AM Warsaw. Good 2.5-hour window daily in summer.' },
        winter: { off: '−7h', their9: '3:00 PM', their5: 'After Perth close', win: '15:00–16:30', wstart: 15, wend: 16.5, style: 'background:#FAEEE7;color:#C4622D', strat: '3:00 PM Perth = 8:00 AM Warsaw. Only 90 minutes before your close. Prioritise.' }
      },
      {
        label: 'Italy (CET)',
        summer: { off: '−6h', their9: '2:00 PM', their5: 'After Perth close', win: '14:00–16:30', wstart: 14, wend: 16.5, style: 'background:#EBF2F8;color:#2C5F8A', strat: '2:00 PM Perth = 8:00 AM Rome. Good 2.5-hour window in summer.' },
        winter: { off: '−7h', their9: '3:00 PM', their5: 'After Perth close', win: '15:00–16:30', wstart: 15, wend: 16.5, style: 'background:#FAEEE7;color:#C4622D', strat: '3:00 PM Perth = 8:00 AM Rome. 90 minutes. Prioritise calls Nov–Mar.' }
      },
      {
        label: 'Germany (CET)',
        summer: { off: '−6h', their9: '2:00 PM', their5: 'After Perth close', win: '14:00–16:30', wstart: 14, wend: 16.5, style: 'background:#EBF2F8;color:#2C5F8A', strat: '2:00 PM Perth = 8:00 AM Berlin. Good 2.5-hour window in summer.' },
        winter: { off: '−7h', their9: '3:00 PM', their5: 'After Perth close', win: '15:00–16:30', wstart: 15, wend: 16.5, style: 'background:#FAEEE7;color:#C4622D', strat: '3:00 PM Perth = 8:00 AM Berlin. 90 minutes. Send priority queries before 3:00 PM.' }
      },
      {
        label: 'UK (GMT/BST)',
        summer: { off: '−7h', their9: '3:00 PM', their5: 'After Perth close', win: '15:00–16:30', wstart: 15, wend: 16.5, style: 'background:#FAEEE7;color:#C4622D', strat: '3:00 PM Perth = 8:00 AM London. 90-minute window in summer — use it.' },
        winter: { off: '−8h', their9: '4:00 PM', their5: 'After Perth close', win: '16:00–16:30', wstart: 16, wend: 16.5, style: 'background:#FAEEE7;color:#C4622D', strat: '4:00 PM Perth = 8:00 AM London. Just 30 minutes before your close. Send queries by 3:00 PM Perth to land at their morning open.' }
      }
    ];

    function renderTZ(season) {
      // Viz
      const viz = document.getElementById('tz-viz');
      viz.innerHTML = '';
      TZ.forEach(z => {
        const d = z[season];
        const row = document.createElement('div');
        row.className = 'tz-viz-row';
        const lbl = document.createElement('div');
        lbl.className = 'tz-viz-label';
        lbl.textContent = z.label;
        const track = document.createElement('div');
        track.className = 'tz-track';

        if (d.wstart === null) {
          const seg = document.createElement('div');
          seg.className = 'tz-seg';
          seg.style.cssText = 'flex:1;background:#F1EFE8;color:#9C9A95';
          seg.textContent = 'email only';
          track.appendChild(seg);
        } else {
          const total = 16.5 - 7.5;
          const before = Math.max(0, d.wstart - 7.5) / total;
          const during = Math.max(0, Math.min(d.wend, 16.5) - d.wstart) / total;
          const after = Math.max(0, 1 - before - during);
          if (before > 0.01) { const s = document.createElement('div'); s.style.cssText = 'flex:' + before + ';background:#F4F2EE'; track.appendChild(s); }
          if (during > 0.01) { const s = document.createElement('div'); s.className = 'tz-seg'; s.style.cssText = 'flex:' + during + ';' + d.style; if (during > 0.1) s.textContent = d.win; track.appendChild(s); }
          if (after > 0.01) { const s = document.createElement('div'); s.style.cssText = 'flex:' + after + ';background:#F4F2EE'; track.appendChild(s); }
        }
        row.appendChild(lbl);
        row.appendChild(track);
        viz.appendChild(row);
      });

      // Table
      const tbody = document.getElementById('tz-table');
      tbody.innerHTML = '';
      TZ.forEach(z => {
        const d = z[season];
        const tr = document.createElement('tr');
        tr.innerHTML = '<td>' + z.label + '</td>' +
          '<td>' + d.off + '</td>' +
          '<td>' + d.their9 + '</td>' +
          '<td>' + d.their5 + '</td>' +
          '<td><span style="display:inline-block;font-size:10px;font-weight:500;padding:2px 8px;border-radius:3px;' + d.style + '">' + d.win + '</span></td>' +
          '<td style="font-size:11px">' + d.strat + '</td>';
        tbody.appendChild(tr);
      });

      // Windows
      const s = season === 'summer';
      document.getElementById('win-china').textContent = s
        ? 'Same time zone as Perth. Open 8:00 AM–5:00 PM their time = 8:00 AM–5:00 PM Perth. Full overlap all day. Last chance for same-day response: 4:30 PM Perth.'
        : 'Same time zone as Perth. Open 8:00 AM–5:00 PM = 8:00 AM–5:00 PM Perth. Full overlap all day.';
      document.getElementById('win-japan').textContent = s
        ? 'UTC+9, one hour ahead. Open 8:00 AM–5:00 PM Tokyo = 7:00 AM–4:00 PM Perth. Available from when you start. Last chance for same-day response: 4:00 PM Perth.'
        : 'UTC+9, one hour ahead. Open 8:00 AM–5:00 PM Tokyo = 7:00 AM–4:00 PM Perth. Same window year-round.';
      document.getElementById('win-india').textContent = s
        ? 'IST is UTC+5:30, Perth is 2.5h ahead. Open 8:00 AM–5:00 PM IST = 10:30 AM–7:30 PM Perth. Real-time window: 10:30 AM–4:30 PM Perth. No DST — same year-round.'
        : 'IST is UTC+5:30, Perth is 2.5h ahead. Open 8:00 AM–5:00 PM IST = 10:30 AM–7:30 PM Perth. Real-time window: 10:30 AM–4:30 PM Perth. Same year-round.';
      document.getElementById('win-europe').textContent = s
        ? 'CEST (summer, UTC+2). Perth 6h ahead. Open 8:00 AM–5:00 PM = 2:00 PM–11:00 PM Perth. Real-time window: 2:00 PM–4:30 PM Perth.'
        : 'CET (winter, UTC+1). Perth 7h ahead. Open 8:00 AM–5:00 PM = 3:00 PM–12:00 AM Perth. Real-time window: 3:00 PM–4:30 PM Perth.';
      document.getElementById('win-turkey').textContent = s
        ? 'UTC+3 year-round (no DST since 2016). Perth 5h ahead. Open 8:00 AM–5:00 PM Istanbul = 1:00 PM–10:00 PM Perth. Real-time window: 1:00 PM–4:30 PM Perth.'
        : 'UTC+3 year-round. Perth 5h ahead. Open 8:00 AM–5:00 PM Istanbul = 1:00 PM–10:00 PM Perth. Real-time window: 1:00 PM–4:30 PM Perth. Same year-round.';
      document.getElementById('win-uk').textContent = s
        ? 'BST (summer, UTC+1). Perth 7h ahead. Open 8:00 AM–5:00 PM London = 3:00 PM–12:00 AM Perth. Real-time window: 3:00 PM–4:30 PM Perth.'
        : 'GMT (winter, UTC+0). Perth 8h ahead. Open 8:00 AM–5:00 PM London = 4:00 PM–1:00 AM Perth. Real-time window: 4:00 PM–4:30 PM Perth (30 min only).';
      document.getElementById('tz-critical').innerHTML = s
        ? '<strong>Summer cutoffs:</strong> Japan — 4:00 PM Perth. China/Malaysia — 4:30 PM Perth. India — 4:30 PM Perth. Turkey — 4:30 PM Perth. Europe — 4:30 PM Perth. UK — 4:30 PM Perth. NSW/VIC — call before 2:00 PM Perth.'
        : '<strong>Winter cutoffs:</strong> Japan — 4:00 PM Perth. China/Malaysia — 4:30 PM Perth. India — 4:30 PM Perth. Turkey — 4:30 PM Perth. Europe — 4:30 PM Perth. UK — 4:30 PM Perth (30 min window only). NSW/VIC — call before 3:00 PM Perth.';
    }

    function setSeason(s) {
      document.getElementById('btn-summer').classList.toggle('active', s === 'summer');
      document.getElementById('btn-winter').classList.toggle('active', s === 'winter');
      renderTZ(s);
    }

    // Init
    setSeason('summer');

    // ── TIMELINE DURATION HEIGHTS ──
    // Sets min-height on each tl-row proportional to duration.
    // Content can still expand a row if it genuinely needs more space —
    // that's fine and preferable to clipping or scrolling.
    // Duration label lives in tl-time (below the clock), not inside tl-block.
    function applyTimelineDurations() {
      const PX_PER_MIN = 1.4;  // px per minute of duration
      const MIN_HEIGHT = 52;   // floor for any slot

      function toMins(str) {
        // Strip any child element text (e.g. duration label already injected)
        // by reading only the first text node
        const text = str.trim().split('\n')[0].trim();
        const [h, m] = text.split(':').map(Number);
        const hour = h < 7 ? h + 12 : h; // 1:15 → 13:15
        return hour * 60 + m;
      }

      document.querySelectorAll('.timeline').forEach(tl => {
        const rows = Array.from(tl.querySelectorAll('.tl-row'));

        rows.forEach((row, i) => {
          const timeEl = row.querySelector('.tl-time');
          if (!timeEl) return;

          // Remove any previously-injected duration label before reading time text
          const existing = timeEl.querySelector('.tl-duration');
          if (existing) existing.remove();

          const startMins = toMins(timeEl.textContent);
          const endMins = i < rows.length - 1
            ? (() => {
                const nextTime = rows[i + 1].querySelector('.tl-time');
                const nextExisting = nextTime.querySelector('.tl-duration');
                if (nextExisting) nextExisting.remove();
                return toMins(nextTime.textContent);
              })()
            : 16 * 60 + 30; // 4:30 PM end of day

          const durationMins = Math.max(0, endMins - startMins);
          const minH = Math.max(MIN_HEIGHT, durationMins * PX_PER_MIN);

          // min-height only — let content expand freely beyond this if needed
          row.style.minHeight = minH + 'px';
          row.style.height = 'auto';
          row.style.overflow = 'visible';

          // Inject duration label into tl-time, below the clock time
          const dur = document.createElement('span');
          dur.className = 'tl-duration';
          const hrs = Math.floor(durationMins / 60);
          const mins = durationMins % 60;
          dur.textContent = hrs > 0
            ? (mins > 0 ? hrs + 'h ' + mins + 'm' : hrs + (hrs === 1 ? ' hr' : ' hrs'))
            : mins + ' min';
          timeEl.appendChild(dur);

          // tl-block: no overflow changes — let it be natural
          const block = row.querySelector('.tl-block');
          if (block) {
            block.style.overflowY = '';
            block.style.height = '';
          }
        });
      });
    }

    applyTimelineDurations();
