/* ============================================================
   OQENTRA — main.js
   Interactions, live data simulation, animations
   ============================================================ */

'use strict';

// ============================================================
// UTILITY
// ============================================================

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  return Math.floor(randomBetween(min, max + 1));
}

function formatTime(date) {
  return date.toLocaleTimeString('en-GB', { hour12: false });
}

// ============================================================
// NAV — LIVE TIME
// ============================================================

function initNavTime() {
  const timeEl = document.getElementById('nav-time');
  const opsTimeEl = document.getElementById('ops-timestamp');

  function tick() {
    const now = new Date();
    const t = formatTime(now);
    if (timeEl) timeEl.textContent = t;
    if (opsTimeEl) opsTimeEl.textContent = t;
  }

  tick();
  setInterval(tick, 1000);
}

// ============================================================
// NAV — SCROLL BEHAVIOR
// ============================================================

function initNavScroll() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 80) {
      nav.style.borderBottomColor = 'rgba(184,115,51,0.2)';
    } else {
      nav.style.borderBottomColor = 'rgba(248,244,236,0.08)';
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

// ============================================================
// SCROLL REVEAL
// ============================================================

function initScrollReveal() {
  const elements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach((el) => observer.observe(el));
}

// ============================================================
// HERO — LIVE DATA SIMULATION
// ============================================================

function initHeroData() {
  const nodesEl = document.getElementById('hero-nodes');
  const latencyEl = document.getElementById('hero-latency');

  let baseNodes = 48291;
  let baseLatency = 12;

  setInterval(() => {
    // Nodes fluctuate ±5
    baseNodes += randomInt(-3, 5);
    if (nodesEl) nodesEl.textContent = baseNodes.toLocaleString();
  }, 3000);

  setInterval(() => {
    // Latency fluctuates 10–16ms
    baseLatency = clamp(baseLatency + randomBetween(-1.5, 1.5), 9, 18);
    if (latencyEl) latencyEl.textContent = Math.round(baseLatency) + ' ms';
  }, 2500);
}

// ============================================================
// OPERATIONS — LIVE METRIC SIMULATION
// ============================================================

function initOpsMetrics() {
  // Temperature
  let temp = 82.0;
  const tempEl = document.getElementById('metric-temp');
  const gaugeTempEl = document.getElementById('gauge-temp');
  const gaugeTempFillEl = document.getElementById('gauge-temp-fill');
  const m1TempEl = document.getElementById('m1-temp');

  // Power
  let power = 1.84;
  const powerEl = document.getElementById('metric-power');
  const gaugePowerReadEl = document.getElementById('gauge-power');
  const gaugePowerFillEl = document.getElementById('gauge-power-fill');

  // Latency
  let latency = 12;
  const latencyMetricEl = document.getElementById('metric-latency');

  // Vibration
  let vib = 4.8;
  const vibEl = document.getElementById('metric-vibration');
  const gaugeVibFillEl = document.getElementById('gauge-vib-fill');
  const m4VibEl = document.getElementById('m4-vib');
  const stripVibEl = document.getElementById('strip-vibration');

  // M2 temp
  let m2temp = 96;
  const m2TempEl = document.getElementById('m2-temp');

  // M6 (HVAC) temp
  let hvacTemp = 22;
  const m6TempEl = document.getElementById('m6-temp');

  setInterval(() => {
    // Temperature
    temp = clamp(temp + randomBetween(-0.4, 0.6), 78, 92);
    const tempRounded = temp.toFixed(1);
    if (tempEl) tempEl.textContent = Math.round(temp);
    if (gaugeTempEl) gaugeTempEl.textContent = tempRounded + '°C';
    if (gaugeTempFillEl) {
      const pct = clamp(((temp - 60) / 60) * 100, 0, 100);
      gaugeTempFillEl.style.width = pct + '%';
    }
    if (m1TempEl) m1TempEl.textContent = Math.round(temp) + '°C';

    // Power
    power = clamp(power + randomBetween(-0.04, 0.04), 1.6, 2.1);
    const powerRounded = power.toFixed(2);
    if (powerEl) powerEl.textContent = powerRounded;
    if (gaugePowerReadEl) gaugePowerReadEl.textContent = powerRounded + ' MW';
    if (gaugePowerFillEl) {
      const pct = clamp((power / 2.5) * 100, 0, 100);
      gaugePowerFillEl.style.width = pct + '%';
    }

    // Latency
    latency = clamp(latency + randomBetween(-1, 1), 9, 18);
    if (latencyMetricEl) latencyMetricEl.textContent = Math.round(latency);

    // Vibration — slowly increasing (alert scenario)
    vib = clamp(vib + randomBetween(-0.05, 0.12), 3.5, 5.8);
    const vibRounded = vib.toFixed(1);
    if (vibEl) vibEl.textContent = vibRounded;
    if (gaugeVibFillEl) {
      const pct = clamp((vib / 6) * 100, 0, 100);
      gaugeVibFillEl.style.width = pct + '%';
    }
    if (m4VibEl) m4VibEl.textContent = vibRounded + 'g';
    if (stripVibEl) stripVibEl.textContent = 'HIGH — ' + vibRounded + 'g';

    // M2 temp
    m2temp = clamp(m2temp + randomBetween(-0.5, 0.8), 90, 104);
    if (m2TempEl) m2TempEl.textContent = Math.round(m2temp) + '°C';

    // HVAC
    hvacTemp = clamp(hvacTemp + randomBetween(-0.1, 0.1), 21, 24);
    if (m6TempEl) m6TempEl.textContent = hvacTemp.toFixed(1) + '°C';

  }, 2200);
}

// ============================================================
// OPERATIONS — ACTIVITY FEED
// ============================================================

function initActivityFeed() {
  const feed = document.getElementById('ops-feed');
  if (!feed) return;

  const events = [
    { msg: 'PRESS.LINE.A1 cycle count updated — 14,820 completed', src: 'PROD.SYS' },
    { msg: 'GRID.07 power factor corrected — efficiency restored to 97.4%', src: 'GRID.SYS' },
    { msg: 'HVAC.ZONE.02 setpoint adjusted — ambient 22.1°C achieved', src: 'BMS.SYS' },
    { msg: 'FLEET.11 vehicle #B-031 departed geofence zone Distribution Hub', src: 'FLEET.SYS' },
    { msg: 'Predictive model retrained — accuracy improved to 94.2%', src: 'ML.SYS' },
    { msg: 'PUMP.STATION.7 flow rate nominal — 240 L/min maintained', src: 'HYDRO.SYS' },
    { msg: 'Security scan complete — 0 anomalies detected across network', src: 'SEC.SYS' },
    { msg: 'Edge node EDGE.12 firmware update scheduled for 02:00 UTC', src: 'OPS.SYS' },
    { msg: 'COMP.UNIT.B4 cooling protocol active — temperature stabilizing', src: 'AUTO.SYS' },
    { msg: 'Carbon emissions report generated — 2,841 tonnes CO₂ saved this month', src: 'ENV.SYS' },
  ];

  let eventIndex = 0;

  setInterval(() => {
    const now = new Date();
    const timeStr = formatTime(now);
    const event = events[eventIndex % events.length];

    const item = document.createElement('div');
    item.className = 'ops-feed-item';
    item.style.opacity = '0';
    item.style.transition = 'opacity 0.4s ease';
    item.innerHTML = `
      <span class="ops-feed-time">${timeStr}</span>
      <span class="ops-feed-message">${event.msg}</span>
      <span class="ops-feed-source">${event.src}</span>
    `;

    feed.insertBefore(item, feed.firstChild);

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { item.style.opacity = '1'; });
    });

    // Remove oldest if more than 4 items
    while (feed.children.length > 4) {
      const last = feed.lastChild;
      if (last) {
        feed.removeChild(last);
      }
    }

    eventIndex++;
  }, 7000);
}

// ============================================================
// MACHINE LIST — CLICK INTERACTION
// ============================================================

function initMachineList() {
  const machines = document.querySelectorAll('.ops-machine');

  machines.forEach((machine) => {
    machine.addEventListener('click', () => {
      machines.forEach((m) => m.classList.remove('active'));
      machine.classList.add('active');
    });

    machine.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        machine.click();
      }
    });
  });
}

// ============================================================
// HERO VISUALIZATION — NODE HOVER INTERACTIONS
// ============================================================

function initHeroVisualization() {
  const nodes = document.querySelectorAll('.viz-node');

  nodes.forEach((node) => {
    const nodeId = node.getAttribute('data-id');
    const outerCircle = node.querySelector('circle:first-child');

    node.addEventListener('mouseenter', () => {
      if (outerCircle) {
        outerCircle.style.transition = 'all 0.3s ease';
        outerCircle.setAttribute('fill', 'rgba(184,115,51,0.15)');
        outerCircle.setAttribute('stroke', 'rgba(184,115,51,0.6)');
      }
    });

    node.addEventListener('mouseleave', () => {
      if (outerCircle) {
        outerCircle.setAttribute('fill', 'rgba(184,115,51,0.08)');
        outerCircle.setAttribute('stroke', 'rgba(184,115,51,0.25)');
      }
    });
  });
}

// ============================================================
// INFRASTRUCTURE MAP — NODE HOVER
// ============================================================

function initInfraMap() {
  const hubNodes = document.querySelectorAll('.ci-hub-node, .ci-machine-node');

  hubNodes.forEach((node) => {
    node.addEventListener('mouseenter', () => {
      node.style.filter = 'brightness(1.3)';
    });

    node.addEventListener('mouseleave', () => {
      node.style.filter = 'none';
    });
  });
}

// ============================================================
// JOURNEY NODES — SEQUENTIAL HIGHLIGHT
// ============================================================

function initJourneyHighlight() {
  const nodes = document.querySelectorAll('.journey-node');
  let currentIdx = 0;

  function highlightNode(idx) {
    nodes.forEach((n, i) => {
      const orb = n.querySelector('.journey-node-orb');
      if (!orb) return;
      if (i === idx) {
        orb.style.borderColor = 'rgba(184,115,51,0.8)';
        orb.style.background = 'rgba(184,115,51,0.12)';
        orb.style.boxShadow = '0 0 20px rgba(184,115,51,0.15)';
      } else {
        orb.style.borderColor = '';
        orb.style.background = '';
        orb.style.boxShadow = '';
      }
    });
  }

  // Auto-advance
  const journeyTimer = setInterval(() => {
    highlightNode(currentIdx);
    currentIdx = (currentIdx + 1) % nodes.length;
  }, 2000);

  // Manual hover overrides
  nodes.forEach((node, idx) => {
    node.addEventListener('mouseenter', () => {
      clearInterval(journeyTimer);
      highlightNode(idx);
    });
  });
}

// ============================================================
// INDUSTRY TILES — PARALLAX OFFSET ON HOVER
// ============================================================

function initIndustryTiles() {
  const tiles = document.querySelectorAll('.industry-tile');

  tiles.forEach((tile) => {
    const img = tile.querySelector('.industry-tile-image');

    tile.addEventListener('mousemove', (e) => {
      if (!img) return;
      const rect = tile.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
      img.style.transform = `scale(1.06) translate(${x}px, ${y}px)`;
    });

    tile.addEventListener('mouseleave', () => {
      if (!img) return;
      img.style.transform = '';
    });
  });
}

// ============================================================
// STATS — COUNT-UP ANIMATION
// ============================================================

function initCountUp() {
  const stats = [
    { id: 'stat-nodes', target: 48, duration: 1800, suffix: '' },
    { id: 'stat-latency', target: 12, duration: 1200, suffix: '' },
    { id: 'stat-uptime', target: 97, duration: 1500, suffix: '' },
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = parseInt(el.getAttribute('data-duration'), 10);
        const startTime = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(({ id, target, duration }) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.setAttribute('data-target', target);
    el.setAttribute('data-duration', duration);
    el.textContent = '0';
    observer.observe(el);
  });
}

// ============================================================
// AUTOMATION FLOW — SEQUENTIAL STEP ANIMATION
// ============================================================

function initAutomationFlow() {
  const steps = document.querySelectorAll('.auto-flow-step');
  if (!steps.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        steps.forEach((step, i) => {
          step.style.opacity = '0';
          step.style.transform = 'translateX(-10px)';
          step.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

          setTimeout(() => {
            step.style.opacity = '1';
            step.style.transform = 'translateX(0)';
          }, i * 180);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const flow = document.getElementById('automation-flow');
  if (flow) observer.observe(flow);
}

// ============================================================
// HERO STAT TICKER — strips coordinates
// ============================================================

function initStatTicker() {
  const statNodes = document.getElementById('stat-nodes');

  // Live global node count drift
  let nodes = 48291;
  setInterval(() => {
    nodes += randomInt(-2, 4);
    if (statNodes) statNodes.textContent = Math.floor(nodes / 1000);
  }, 4000);
}

// ============================================================
// SMOOTH SCROLL — NAV LINKS
// ============================================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = link.getAttribute('href');
      if (!target || target === '#') return;
      const el = document.querySelector(target);
      if (!el) return;
      e.preventDefault();
      const offsetTop = el.getBoundingClientRect().top + window.pageYOffset - 64;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    });
  });
}

// ============================================================
// SIGNAL STRIP — PAUSE ON HOVER
// ============================================================

function initSignalStrip() {
  const strip = document.querySelector('.signal-strip-inner');
  if (!strip) return;

  const parent = strip.parentElement;
  parent.addEventListener('mouseenter', () => {
    strip.style.animationPlayState = 'paused';
  });
  parent.addEventListener('mouseleave', () => {
    strip.style.animationPlayState = 'running';
  });
}

// ============================================================
// CURSOR REFINEMENT — subtle copper crosshair on viz areas
// ============================================================

function initVizCursor() {
  const vizAreas = document.querySelectorAll('#hero-visualization, #infra-map');
  vizAreas.forEach((el) => {
    el.style.cursor = 'crosshair';
  });
}

// ============================================================
// NAV — ACTIVE STATE HIGHLIGHTER
// ============================================================

function initNavActiveState() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  const observer = new IntersectionObserver((entries) => {
    let activeId = null;

    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeId = entry.target.id;
      }
    });

    if (activeId) {
      navLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${activeId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }, {
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0.1
  });

  sections.forEach((section) => observer.observe(section));
}

// ============================================================
// INIT
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavTime();
  initNavScroll();
  initScrollReveal();
  initHeroData();
  initOpsMetrics();
  initActivityFeed();
  initMachineList();
  initHeroVisualization();
  initInfraMap();
  initJourneyHighlight();
  initIndustryTiles();
  initCountUp();
  initAutomationFlow();
  initStatTicker();
  initSmoothScroll();
  initSignalStrip();
  initVizCursor();
  initNavActiveState();

  console.log(
    '%c OQENTRA — Connected Intelligence Systems\n%c v4.2.1 | 48,291 nodes active | 99.97% uptime',
    'color:#B87333;font-family:monospace;font-size:14px;font-weight:bold;',
    'color:#6A6866;font-family:monospace;font-size:11px;'
  );
});
