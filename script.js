(function () {
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  /* ============================================================== */
  /* LIGHTSPEED PRESETS (MATCHING YOUR VUE LIGHTSPEED COMPONENT)    */
  /* ============================================================== */
  const lightSpeedPresets = {
    one: {
      name: 'Light 1',
      fov: 90,
      speedUp: 2,
      carLightsFade: 0.4,
      totalSideLightSticks: 36,
      lightPairsPerRoadWay: 50,
      colors: {
        roadColor: 0x080808,
        leftCars: [0xff3b14, 0xff6b3d, 0xf2efe9],
        rightCars: [0xf2efe9, 0xff3b14, 0xff8c66],
        sticks: 0xff3b14
      }
    },
    two: {
      name: 'Light 2',
      fov: 90,
      speedUp: 2,
      carLightsFade: 0.4,
      totalSideLightSticks: 36,
      lightPairsPerRoadWay: 50,
      colors: {
        roadColor: 0x010102,
        leftCars: [0x58F5B1, 0xAD96F1, 0xf4f2ff],
        rightCars: [0xAD96F1, 0x58F5B1, 0x7c5ce6],
        sticks: 0x58F5B1
      }
    },
    three: {
      name: 'Light 3',
      fov: 90,
      speedUp: 2,
      carLightsFade: 0.4,
      totalSideLightSticks: 36,
      lightPairsPerRoadWay: 50,
      colors: {
        roadColor: 0x042533,
        leftCars: [0xDB3996, 0xFCFFFF, 0xff6ec7],
        rightCars: [0xFCFFFF, 0x0993C6, 0xDB3996],
        sticks: 0xDB3996
      }
    },
    four: {
      name: 'Light 4',
      fov: 90,
      speedUp: 2,
      carLightsFade: 0.4,
      totalSideLightSticks: 36,
      lightPairsPerRoadWay: 50,
      colors: {
        roadColor: 0x2a0504,
        leftCars: [0xFEED65, 0xE13A28, 0xfff6a8],
        rightCars: [0xE13A28, 0xFEED65, 0xff614f],
        sticks: 0xFEED65
      }
    }
  };

  /* ============================================================== */
  /* 4 CURATED COLOR THEMES (DEFAULT + 3 SCREENSHOT PALETTES)       */
  /* ============================================================== */
  const THEMES = [
    {
      id: 'obsidian-vermilion',
      lightPreset: 'one',
      bgDark: '#0b0b0a',
      bgLight: '#f2efe9',
      textLight: '#f2efe9',
      textDark: '#0b0b0a',
      accentPrimary: '#ff3b14',
      accentSecondary: '#ff3b14',
      accentRgb: '255, 59, 20',
      chromaR: '255, 45, 20',
      chromaB: '0, 215, 255',
      fogHex: 0x0b0b0a,
      splatDark: { r: 0.92, g: 0.25, b: 0.08 },
      splatLight: { r: 0.06, g: 0.72, b: 0.88 },
      splatMid: { r: 0.95, g: 0.92, b: 0.88 }
    },
    {
      id: 'cobalt-lavender-lime',
      lightPreset: 'two',
      bgDark: '#010102',
      bgLight: '#AD96F1',
      textLight: '#f4f2ff',
      textDark: '#010102',
      accentPrimary: '#58F5B1',
      accentSecondary: '#AD96F1',
      accentRgb: '88, 245, 177',
      chromaR: '173, 150, 241',
      chromaB: '88, 245, 177',
      fogHex: 0x010102,
      splatDark: { r: 0.35, g: 0.96, b: 0.69 },
      splatLight: { r: 0.32, g: 0.88, b: 0.55 },
      splatMid: { r: 0.68, g: 0.59, b: 0.95 }
    },
    {
      id: 'skyblue-white-hotpink',
      lightPreset: 'three',
      bgDark: '#0993C6',
      bgLight: '#FCFFFF',
      textLight: '#FCFFFF',
      textDark: '#042533',
      accentPrimary: '#DB3996',
      accentSecondary: '#0993C6',
      accentRgb: '219, 57, 150',
      chromaR: '219, 57, 150',
      chromaB: '9, 147, 198',
      fogHex: 0x0993C6,
      splatDark: { r: 0.86, g: 0.22, b: 0.59 },
      splatLight: { r: 0.88, g: 0.24, b: 0.62 },
      splatMid: { r: 0.96, g: 0.98, b: 1.0 }
    },
    {
      id: 'crimson-deepred-yellow',
      lightPreset: 'four',
      bgDark: '#6D1613',
      bgLight: '#E13A28',
      textLight: '#FEED65',
      textDark: '#2a0504',
      accentPrimary: '#FEED65',
      accentSecondary: '#E13A28',
      accentRgb: '254, 237, 101',
      chromaR: '225, 58, 40',
      chromaB: '254, 237, 101',
      fogHex: 0x6D1613,
      splatDark: { r: 0.99, g: 0.93, b: 0.40 },
      splatLight: { r: 0.99, g: 0.93, b: 0.40 },
      splatMid: { r: 0.88, g: 0.23, b: 0.16 }
    }
  ];

  let currentThemeIdx = 0;
  let currentSurfaceMode = 'dark';
  let isInsideWhatIDoTrack = false;
  window.__fluidSplatColor = THEMES[0].splatDark;

  function syncFluidSplatColor() {
    const t = THEMES[currentThemeIdx];
    const lsCanvas = document.getElementById('lightSpeedBgCanvas');
    if (currentSurfaceMode === 'light') {
      window.__fluidSplatColor = t.splatLight;
      if (lsCanvas) lsCanvas.style.opacity = '0';
    } else if (currentSurfaceMode === 'mid') {
      window.__fluidSplatColor = t.splatMid;
      if (lsCanvas) lsCanvas.style.opacity = '0';
    } else {
      window.__fluidSplatColor = t.splatDark;
      if (lsCanvas) lsCanvas.style.opacity = '0.88';
    }
  }

  /* ============================================================== */
  /* 3D LIGHTSPEED BACKGROUND ENGINE (FOR EMPTY DARK AREAS)         */
  /* ============================================================== */
  let applyLightSpeedPreset = null;

  (function initLightSpeedBackground() {
    const canvas = document.getElementById('lightSpeedBgCanvas');
    if (!canvas || !window.THREE) return;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const baseFov = 90;
    const camera = new THREE.PerspectiveCamera(baseFov, window.innerWidth / window.innerHeight, 0.1, 450);
    // Standard Three.js camera looking down -Z
    camera.position.set(0, 7.5, 0);
    camera.lookAt(0, 1.5, -160);

    const roadLength = 320;
    const streaksGroup = new THREE.Group();
    scene.add(streaksGroup);

    const streakMaterials = [];

    const vertexShader = `
      uniform float uTime;
      uniform float uSpeed;
      uniform float uRoadLength;
      uniform float uCurveAmp;
      attribute vec3 aOffset;
      attribute float aSpeedMul;
      attribute float aLength;
      attribute float aRadius;
      varying float vAlpha;

      void main() {
        vec3 pos = position;
        pos.x *= aRadius;
        pos.y *= aRadius;
        pos.z *= aLength;

        // Travel along -Z (in front of camera)
        float zTravel = mod(aOffset.z + uTime * uSpeed * aSpeedMul, uRoadLength);
        float zWorld = -zTravel;
        pos.z += zWorld;

        float normZ = clamp(-pos.z / uRoadLength, 0.0, 1.0);
        float curveX = sin(normZ * 3.14159 * 1.4 + uTime * 0.35) * uCurveAmp * (normZ * normZ);
        float curveY = cos(normZ * 3.14159 * 0.85) * 3.2 * (normZ * normZ);

        pos.x += aOffset.x + curveX;
        pos.y += aOffset.y + curveY;

        vAlpha = smoothstep(0.01, 0.14, normZ) * (1.0 - smoothstep(0.65, 0.98, normZ));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      uniform vec3 uColor;
      varying float vAlpha;
      void main() {
        gl_FragColor = vec4(uColor, vAlpha * 0.82);
      }
    `;

    function buildHighwayStream(PresetConfig) {
      while (streaksGroup.children.length > 0) {
        const child = streaksGroup.children[0];
        streaksGroup.remove(child);
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      }
      streakMaterials.length = 0;

      const palette = [
        PresetConfig.colors.leftCars[0],
        PresetConfig.colors.rightCars[0],
        PresetConfig.colors.leftCars[1],
        PresetConfig.colors.rightCars[1],
        PresetConfig.colors.sticks
      ];

      const baseBox = new THREE.BoxBufferGeometry(1, 1, 1);

      palette.forEach(function (hexColor, groupIdx) {
        const isSticks = groupIdx === 4;
        const count = isSticks ? PresetConfig.totalSideLightSticks : PresetConfig.lightPairsPerRoadWay;
        const instGeo = new THREE.InstancedBufferGeometry();
        instGeo.index = baseBox.index;
        instGeo.attributes.position = baseBox.attributes.position;

        const offsets = new Float32Array(count * 3);
        const speedMuls = new Float32Array(count);
        const lengths = new Float32Array(count);
        const radii = new Float32Array(count);

        const isLeft = groupIdx % 2 === 0;
        for (let i = 0; i < count; i++) {
          const laneX = isSticks
            ? (i % 2 === 0 ? -1 : 1) * (16 + Math.random() * 8)
            : (isLeft ? -1 : 1) * (2.2 + Math.random() * 13.5);

          offsets[i * 3 + 0] = laneX;
          offsets[i * 3 + 1] = isSticks ? (Math.random() * 2.5) : (-1.2 + Math.random() * 1.8);
          offsets[i * 3 + 2] = Math.random() * roadLength;

          speedMuls[i] = (isLeft ? 1.15 : 0.85) + Math.random() * 0.7;
          lengths[i] = isSticks ? (4 + Math.random() * 8) : (14 + Math.random() * 34);
          radii[i] = isSticks ? 0.14 : (0.16 + Math.random() * 0.18);
        }

        instGeo.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 3));
        instGeo.setAttribute('aSpeedMul', new THREE.InstancedBufferAttribute(speedMuls, 1));
        instGeo.setAttribute('aLength', new THREE.InstancedBufferAttribute(lengths, 1));
        instGeo.setAttribute('aRadius', new THREE.InstancedBufferAttribute(radii, 1));

        const mat = new THREE.ShaderMaterial({
          vertexShader: vertexShader,
          fragmentShader: fragmentShader,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          uniforms: {
            uTime: { value: 0 },
            uSpeed: { value: 52 },
            uRoadLength: { value: roadLength },
            uCurveAmp: { value: 22.0 },
            uColor: { value: new THREE.Color(hexColor) }
          }
        });

        const mesh = new THREE.Mesh(instGeo, mat);
        mesh.frustumCulled = false;
        streaksGroup.add(mesh);
        streakMaterials.push(mat);
      });
    }

    buildHighwayStream(lightSpeedPresets.one);

    applyLightSpeedPreset = function (presetKey) {
      const chosen = lightSpeedPresets[presetKey] || lightSpeedPresets.one;
      buildHighwayStream(chosen);
    };

    let isSpeedingUp = false;
    let scrollSpeedBoost = 0;
    let lastScrollPos = window.scrollY;
    let mouseTargetX = 0;
    let mouseCurrentX = 0;

    window.addEventListener('pointerdown', function () {
      isSpeedingUp = true;
    }, { passive: true });

    window.addEventListener('pointerup', function () {
      isSpeedingUp = false;
    }, { passive: true });

    window.addEventListener('pointermove', function (e) {
      mouseTargetX = ((e.clientX / window.innerWidth) - 0.5) * 4.5;
    }, { passive: true });

    window.addEventListener('scroll', function () {
      const sy = window.scrollY;
      scrollSpeedBoost = clamp(Math.abs(sy - lastScrollPos) * 0.045, 0, 2.5);
      lastScrollPos = sy;
    }, { passive: true });

    function resizeLightSpeed() {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
    resizeLightSpeed();
    window.addEventListener('resize', resizeLightSpeed);

    let accumulatedTime = 0;
    let currentSpeedMultiplier = 1;
    let currentFov = baseFov;
    let lastNow = performance.now();

    function animateLightSpeed(now) {
      requestAnimationFrame(animateLightSpeed);
      const dt = Math.min((now - lastNow) / 1000, 0.05);
      lastNow = now;

      scrollSpeedBoost *= 0.92;
      const targetMul = (isSpeedingUp ? 2.4 : 1.0) + scrollSpeedBoost;
      currentSpeedMultiplier = lerp(currentSpeedMultiplier, targetMul, 0.08);

      const targetFov = baseFov + (currentSpeedMultiplier - 1.0) * 14;
      if (Math.abs(currentFov - targetFov) > 0.05) {
        currentFov = lerp(currentFov, targetFov, 0.08);
        camera.fov = currentFov;
        camera.updateProjectionMatrix();
      }

      mouseCurrentX = lerp(mouseCurrentX, mouseTargetX, 0.05);
      camera.position.x = mouseCurrentX;

      accumulatedTime += dt * currentSpeedMultiplier;

      for (let i = 0; i < streakMaterials.length; i++) {
        streakMaterials[i].uniforms.uTime.value = accumulatedTime;
      }

      renderer.render(scene, camera);
    }

    requestAnimationFrame(animateLightSpeed);
  })();

  /* ============================================================== */
  /* 375.STUDIO SUBTLE CHROMATIC ABERRATION CONTROLLER              */
  /* ============================================================== */
  (function initSubtleChromaticAberration() {
    const redOffset = document.getElementById('chromaRedOffset');
    const blueOffset = document.getElementById('chromaBlueOffset');
    const rootStyle = document.documentElement.style;

    let lastScrollY = window.scrollY;
    let scrollVel = 0;
    let pointerVelX = 0;
    let pointerVelY = 0;
    let lastPtrX = 0;
    let lastPtrY = 0;
    let currentShiftX = 0.85;
    let currentShiftY = 0.2;

    window.addEventListener('scroll', function () {
      const sy = window.scrollY;
      scrollVel = clamp(Math.abs(sy - lastScrollY) * 0.035, 0, 1.65);
      lastScrollY = sy;
    }, { passive: true });

    window.addEventListener('pointermove', function (e) {
      if (lastPtrX !== 0 || lastPtrY !== 0) {
        pointerVelX = clamp((e.clientX - lastPtrX) * 0.025, -1.1, 1.1);
        pointerVelY = clamp((e.clientY - lastPtrY) * 0.025, -0.8, 0.8);
      }
      lastPtrX = e.clientX;
      lastPtrY = e.clientY;
    }, { passive: true });

    function updateChromaticLoop() {
      requestAnimationFrame(updateChromaticLoop);
      scrollVel *= 0.9;
      pointerVelX *= 0.88;
      pointerVelY *= 0.88;

      const isSmallScreen = window.innerWidth <= 640;
      const baseShift = isSmallScreen ? 0.45 : 0.75;
      const targetX = baseShift + Math.abs(pointerVelX) * 0.65 + scrollVel * 0.6;
      const targetY = (isSmallScreen ? 0.12 : 0.2) + Math.abs(pointerVelY) * 0.4 + scrollVel * 0.45;

      currentShiftX = lerp(currentShiftX, targetX, 0.14);
      currentShiftY = lerp(currentShiftY, targetY, 0.14);

      if (redOffset && blueOffset) {
        redOffset.setAttribute('dx', (-currentShiftX).toFixed(2));
        redOffset.setAttribute('dy', (-currentShiftY).toFixed(2));
        blueOffset.setAttribute('dx', currentShiftX.toFixed(2));
        blueOffset.setAttribute('dy', currentShiftY.toFixed(2));
      }

      rootStyle.setProperty('--chroma-x', currentShiftX.toFixed(2) + 'px');
      rootStyle.setProperty('--chroma-y', currentShiftY.toFixed(2) + 'px');
    }

    requestAnimationFrame(updateChromaticLoop);
  })();

  const CASES = [
    {
      id: 'fathom',
      title: 'Fathom Studio',
      liveUrl: 'https://scary09.github.io/experimental-web/#work'
    },
    {
      id: 'showroom',
      title: 'Supercar Showroom',
      liveUrl: 'https://scary09.github.io/supercar-showroom/'
    },
    {
      id: 'isle-thorne',
      title: 'Isle & Thorne Collective',
      liveUrl: 'https://scary09.github.io/isle-thorne-collective/'
    }
  ];

  const kolkataClock = document.getElementById('kolkataClock');
  function updateClock() {
    try {
      const now = new Date();
      const t = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      kolkataClock.textContent = 'CCU ' + t;
    } catch (e) {
      kolkataClock.textContent = 'CCU 21:18';
    }
  }
  updateClock();
  setInterval(updateClock, 15000);

  const scrubHeadline = document.getElementById('scrubHeadline');
  if (scrubHeadline) {
    const rawText = scrubHeadline.textContent.trim();
    const words = rawText.split(/\s+/);
    scrubHeadline.innerHTML = words.map(function (word) {
      const chars = word.split('').map(function (ch) {
        return '<span class="scrub-char">' + ch + '</span>';
      }).join('');
      return '<span class="inline-block mr-[0.26em]">' + chars + '</span>';
    }).join('');
  }

  const playedWithLine = document.getElementById('playedWithLine');
  if (playedWithLine) {
    const text = playedWithLine.textContent.trim();
    playedWithLine.innerHTML = text.split('').map(function (ch) {
      if (ch === ' ') return '<span class="inline-block w-[0.25em]">&nbsp;</span>';
      return '<span class="played-with-char">' + ch + '</span>';
    }).join('');
  }

  /* ============================================================== */
  /* PART 2 LOGIC: CHAMELEON "WHAT I DO" SLIDES ON SCROLL           */
  /* ============================================================== */
  const whatIDoScrollTrack = document.getElementById('whatIDoScrollTrack');
  const whatIDoSticky = document.getElementById('whatIDoSticky');
  const serviceSlides = document.querySelectorAll('.service-slide');
  const chameleonRibbonPath = document.getElementById('chameleonRibbonPath');
  const statementRibbonPath = document.getElementById('statementRibbonPath');
  const statementRibbonPathMobile = document.getElementById('statementRibbonPathMobile');
  const bridgeRibbonPath = document.getElementById('bridgeRibbonPath');

  let activePillarIdx = 0;

  function applyPillarSlideColors(idx) {
    const t = THEMES[currentThemeIdx];
    if (!whatIDoSticky) return;

    if (idx === 0) {
      whatIDoSticky.style.backgroundColor = t.bgLight;
      whatIDoSticky.style.color = t.textDark;
      if (chameleonRibbonPath) chameleonRibbonPath.setAttribute('stroke', t.accentPrimary);
      if (isInsideWhatIDoTrack) currentSurfaceMode = 'light';
    } else if (idx === 1) {
      whatIDoSticky.style.backgroundColor = t.accentPrimary;
      whatIDoSticky.style.color = t.textDark;
      if (chameleonRibbonPath) chameleonRibbonPath.setAttribute('stroke', t.bgDark);
      if (isInsideWhatIDoTrack) currentSurfaceMode = 'mid';
    } else {
      whatIDoSticky.style.backgroundColor = t.bgDark;
      whatIDoSticky.style.color = t.textLight;
      if (chameleonRibbonPath) chameleonRibbonPath.setAttribute('stroke', t.accentPrimary);
      if (isInsideWhatIDoTrack) currentSurfaceMode = 'dark';
    }
    syncFluidSplatColor();
  }

  function setWhatIDoSlide(idx, forceUpdate) {
    if (idx === activePillarIdx && !forceUpdate) return;
    activePillarIdx = idx;
    applyPillarSlideColors(idx);

    serviceSlides.forEach(function (slide, sIdx) {
      slide.classList.remove('is-active', 'is-exited');
      if (sIdx === idx) {
        slide.classList.add('is-active');
      } else if (sIdx < idx) {
        slide.classList.add('is-exited');
      }
    });
  }

  setWhatIDoSlide(0, true);

  /* ============================================================== */
  /* PART 3 LOGIC: 3D CYLINDRICAL GALLERY (3 PROJECTS)              */
  /* ============================================================== */
  const workSection = document.getElementById('workSection');
  const workStickyViewport = document.getElementById('workStickyViewport');
  const galleryCanvas = document.getElementById('threeuiGalleryCanvas');
  const hudProjectTitle = document.getElementById('hudProjectTitle');
  const hudProjectLink = document.getElementById('hudProjectLink');
  const workProgressFill = document.getElementById('workProgressFill');
  const spinFlashOverlay = document.getElementById('spinFlashOverlay');
  const casePills = document.querySelectorAll('.case-pill');
  const contactSection = document.getElementById('contactSection');

  let currentCaseIdx = 0;

  function applyActiveCaseHUD(nextIdx) {
    if (nextIdx === currentCaseIdx || !CASES[nextIdx]) return;
    currentCaseIdx = nextIdx;
    const item = CASES[nextIdx];

    hudProjectTitle.classList.add('hud-swap-out');

    casePills.forEach(function (pill, pIdx) {
      if (pIdx === nextIdx) {
        pill.classList.add('is-active');
      } else {
        pill.classList.remove('is-active');
      }
    });

    setTimeout(function () {
      hudProjectTitle.textContent = item.title;
      hudProjectLink.setAttribute('href', item.liveUrl);
      hudProjectTitle.classList.remove('hud-swap-out');
    }, 180);
  }

  casePills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      const targetIdx = parseInt(pill.getAttribute('data-jump-case'), 10) || 0;
      if (!workSection) return;
      const rect = workSection.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const scrollableSpan = workSection.offsetHeight - window.innerHeight;
      const targetRatios = [0.12, 0.50, 0.82];
      window.scrollTo({
        top: sectionTop + scrollableSpan * (targetRatios[targetIdx] || 0.12),
        behavior: 'smooth'
      });
    });
  });

  const galleryState = {
    entryProgress: 0,
    pinProgress: 0,
    smoothPinProgress: 0,
    dragRotY: 0,
    dragVelocityY: 0,
    dragPosY: 0,
    activeSet: 0,
    responsiveZOffset: 0
  };

  let rebuildGalleryPlatesForTheme = null;

  (function initFullScreenCylindricalGallery() {
    if (!workStickyViewport || !galleryCanvas || !window.THREE) return;

    const renderer = new THREE.WebGLRenderer({
      canvas: galleryCanvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setClearColor(0x000000, 0);
    if (THREE.sRGBEncoding) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(THEMES[0].fogHex, 0.036);

    const camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 14.2);

    const gallery = new THREE.Group();
    scene.add(gallery);

    const geometry = new THREE.CylinderGeometry(5.2, 5.2, 2.7, 72, 1, true, 0, Math.PI * 0.42);

    const FATHOM_PLATES = [
      {
        caseIndex: 0,
        project: 'FATHOM STUDIO',
        headline: 'KINETIC INTERFACE',
        spec: 'SPRING CURSOR · PARALLAX BG1–BG3 LAYERS',
        url: 'https://scary09.github.io/experimental-web/#work',
        mode: 'fathom-wave'
      },
      {
        caseIndex: 0,
        project: 'FATHOM STUDIO',
        headline: 'REAL-TIME AUDIO',
        spec: 'WEB AUDIO FFT · MUSICBLA.MP3 SPECTRUM',
        url: 'https://scary09.github.io/experimental-web/#work',
        mode: 'fathom-audio'
      },
      {
        caseIndex: 0,
        project: 'FATHOM STUDIO',
        headline: 'MOTION CHOREOGRAPHY',
        spec: 'GSAP TIMELINES · MAGNETIC DOM ENGINE',
        url: 'https://scary09.github.io/experimental-web/#work',
        mode: 'fathom-bezier'
      }
    ];

    const SHOWROOM_PLATES = [
      {
        caseIndex: 1,
        project: 'SUPERCAR SHOWROOM',
        headline: 'FERRARI LAFERRARI',
        spec: 'THREE.JS GLTF · REAL-TIME PBR SHOWCASE',
        url: 'https://scary09.github.io/supercar-showroom/',
        mode: 'showroom-chassis'
      },
      {
        caseIndex: 1,
        project: 'SUPERCAR SHOWROOM',
        headline: 'AERODYNAMICS',
        spec: 'ACTIVE DOWNFORCE · THREE.BOX3 RIGGING',
        url: 'https://scary09.github.io/supercar-showroom/',
        mode: 'showroom-aero'
      },
      {
        caseIndex: 1,
        project: 'SUPERCAR SHOWROOM',
        headline: 'V12 HY-KERS HUD',
        spec: '963 CV TELEMETRY · ORBIT CAMERA LERP',
        url: 'https://scary09.github.io/supercar-showroom/',
        mode: 'showroom-telemetry'
      }
    ];

    const ISLE_THORNE_PLATES = [
      {
        caseIndex: 2,
        project: 'ISLE & THORNE',
        headline: 'COLLECTIVE ATELIER',
        spec: 'ASTRO ARCHITECTURE · EDITORIAL DESIGN',
        url: 'https://scary09.github.io/isle-thorne-collective/',
        mode: 'isle-arch'
      },
      {
        caseIndex: 2,
        project: 'ISLE & THORNE',
        headline: 'CRESCENT ARMCHAIR',
        spec: 'BESPOKE FURNITURE · MULTI-ANGLE GALLERY',
        url: 'https://scary09.github.io/isle-thorne-collective/',
        mode: 'isle-chair'
      },
      {
        caseIndex: 2,
        project: 'ISLE & THORNE',
        headline: 'BEHIND THE CRAFT',
        spec: 'ELYSIAN LOUNGE · CURATED JOURNAL SYSTEM',
        url: 'https://scary09.github.io/isle-thorne-collective/',
        mode: 'isle-grid'
      }
    ];

    function buildHighResPlateTexture(plate, panelNumber, themeObj) {
      const off = document.createElement('canvas');
      off.width = 1536;
      off.height = 640;
      const ctx = off.getContext('2d');

      const accent = themeObj.accentPrimary;
      const fg = themeObj.textLight;
      const bgBase = themeObj.bgDark;

      const grad = ctx.createLinearGradient(0, 0, off.width, off.height);
      grad.addColorStop(0, bgBase);
      grad.addColorStop(0.65, '#100f0e');
      grad.addColorStop(1, bgBase);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, off.width, off.height);

      const glow = ctx.createRadialGradient(1120, 320, 20, 1120, 320, 420);
      glow.addColorStop(0, 'rgba(' + themeObj.accentRgb + ', 0.25)');
      glow.addColorStop(1, 'rgba(' + themeObj.accentRgb + ', 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, off.width, off.height);

      ctx.strokeStyle = 'rgba(242, 239, 233, 0.24)';
      ctx.lineWidth = 3;
      ctx.strokeRect(24, 24, off.width - 48, off.height - 48);

      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      const marks = [
        [44, 44],
        [off.width - 44, 44],
        [44, off.height - 44],
        [off.width - 44, off.height - 44]
      ];
      marks.forEach(function (pt) {
        ctx.beginPath();
        ctx.moveTo(pt[0] - 10, pt[1]);
        ctx.lineTo(pt[0] + 10, pt[1]);
        ctx.moveTo(pt[0], pt[1] - 10);
        ctx.lineTo(pt[0], pt[1] + 10);
        ctx.stroke();
      });

      ctx.save();
      if (plate.mode === 'fathom-wave') {
        for (let l = 0; l < 11; l++) {
          ctx.beginPath();
          for (let x = 820; x <= 1450; x += 12) {
            const norm = (x - 820) / 630;
            const env = Math.sin(norm * Math.PI);
            const y = 320 + Math.sin(norm * 10 + l * 0.45) * (95 - l * 5) * env;
            if (x === 820) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = l % 3 === 0 ? accent : 'rgba(242, 239, 233, 0.32)';
          ctx.lineWidth = l % 3 === 0 ? 3 : 1.5;
          ctx.stroke();
        }
      } else if (plate.mode === 'fathom-audio') {
        const barCount = 34;
        for (let b = 0; b < barCount; b++) {
          const h = 38 + Math.abs(Math.sin(b * 0.42) * Math.cos(b * 0.19)) * 270;
          ctx.fillStyle = b % 4 === 0 ? accent : 'rgba(242, 239, 233, 0.28)';
          ctx.fillRect(830 + b * 18, 460 - h, 10, h);
          if (b % 4 === 0) {
            ctx.fillStyle = fg;
            ctx.fillRect(830 + b * 18, 460 - h - 10, 10, 4);
          }
        }
      } else if (plate.mode === 'fathom-bezier') {
        ctx.strokeStyle = 'rgba(242, 239, 233, 0.14)';
        ctx.lineWidth = 1.5;
        for (let g = 0; g <= 6; g++) {
          ctx.beginPath();
          ctx.moveTo(840 + g * 95, 130);
          ctx.lineTo(840 + g * 95, 510);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(840, 490);
        ctx.bezierCurveTo(960, 490, 1020, 150, 1410, 150);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = fg;
        [[840, 490], [960, 490], [1020, 150], [1410, 150]].forEach(function (node) {
          ctx.beginPath();
          ctx.arc(node[0], node[1], 7, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (plate.mode === 'showroom-chassis') {
        ctx.strokeStyle = 'rgba(242, 239, 233, 0.25)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(1135, 435, 290, 58, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = accent;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(855, 390);
        ctx.quadraticCurveTo(920, 330, 1030, 305);
        ctx.quadraticCurveTo(1145, 248, 1275, 292);
        ctx.quadraticCurveTo(1375, 315, 1425, 382);
        ctx.lineTo(1400, 415);
        ctx.lineTo(875, 415);
        ctx.closePath();
        ctx.stroke();

        [965, 1315].forEach(function (wx) {
          ctx.beginPath();
          ctx.arc(wx, 415, 44, 0, Math.PI * 2);
          ctx.fillStyle = bgBase;
          ctx.fill();
          ctx.strokeStyle = fg;
          ctx.lineWidth = 3;
          ctx.stroke();
        });
      } else if (plate.mode === 'showroom-aero') {
        for (let s = 0; s < 5; s++) {
          ctx.beginPath();
          const yOff = 190 + s * 45;
          ctx.moveTo(830, yOff + 25);
          ctx.bezierCurveTo(980, yOff - 35, 1180, yOff - 40, 1430, yOff + 10);
          ctx.strokeStyle = s === 2 ? accent : 'rgba(242, 239, 233, 0.32)';
          ctx.lineWidth = s === 2 ? 3.5 : 1.8;
          ctx.stroke();
        }
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.strokeRect(860, 165, 520, 290);
      } else if (plate.mode === 'showroom-telemetry') {
        ctx.strokeStyle = 'rgba(242, 239, 233, 0.25)';
        ctx.lineWidth = 2;
        ctx.strokeRect(840, 130, 580, 380);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(1130, 320, 125, Math.PI * 0.75, Math.PI * 2.25);
        ctx.stroke();
        ctx.fillStyle = fg;
        ctx.font = '700 36px "JetBrains Mono", monospace';
        ctx.fillText('963 CV', 1062, 332);
      } else if (plate.mode === 'isle-arch') {
        ctx.strokeStyle = 'rgba(242, 239, 233, 0.28)';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(920, 120, 420, 400);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(1130, 290, 140, Math.PI, 0, false);
        ctx.lineTo(1270, 480);
        ctx.lineTo(990, 480);
        ctx.closePath();
        ctx.stroke();
      } else if (plate.mode === 'isle-chair') {
        ctx.strokeStyle = accent;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(1130, 310, 135, 0.2, Math.PI - 0.2);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(242, 239, 233, 0.45)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(1130, 270, 95, Math.PI + 0.3, Math.PI * 2 - 0.3);
        ctx.stroke();
        ctx.strokeRect(1015, 320, 230, 140);
      } else {
        ctx.strokeStyle = 'rgba(242, 239, 233, 0.24)';
        ctx.lineWidth = 2;
        ctx.strokeRect(860, 130, 540, 380);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 3;
        ctx.strokeRect(890, 160, 220, 320);
        ctx.strokeRect(1140, 160, 230, 150);
        ctx.strokeRect(1140, 330, 230, 150);
      }
      ctx.restore();

      ctx.fillStyle = accent;
      ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(plate.project, 76, 118);

      ctx.fillStyle = fg;
      ctx.font = '800 64px "Syne", sans-serif';
      ctx.fillText(plate.headline, 76, 326);

      ctx.fillStyle = 'rgba(242, 239, 233, 0.68)';
      ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(plate.spec, 76, 396);

      ctx.fillStyle = 'rgba(242, 239, 233, 0.42)';
      ctx.font = '500 21px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('CLICK TO OPEN PROJECT ↗', 76, 548);

      const tex = new THREE.CanvasTexture(off);
      if (THREE.sRGBEncoding) {
        tex.encoding = THREE.sRGBEncoding;
      }
      tex.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
      tex.needsUpdate = true;
      return tex;
    }

    let TEXTURE_POOLS = [];

    function generateAllTexturePools(themeObj) {
      const fathomTex = FATHOM_PLATES.map(function (plate, idx) {
        return buildHighResPlateTexture(plate, idx, themeObj);
      });
      const showroomTex = SHOWROOM_PLATES.map(function (plate, idx) {
        return buildHighResPlateTexture(plate, idx, themeObj);
      });
      const isleTex = ISLE_THORNE_PLATES.map(function (plate, idx) {
        return buildHighResPlateTexture(plate, idx, themeObj);
      });
      TEXTURE_POOLS = [fathomTex, showroomTex, isleTex];
    }

    generateAllTexturePools(THEMES[0]);

    const panels = [];
    const totalPanels = 12;

    for (let index = 0; index < totalPanels; index++) {
      const slideIdx = index % 3;
      const material = new THREE.MeshBasicMaterial({
        map: TEXTURE_POOLS[0][slideIdx],
        opacity: 0.94,
        side: THREE.DoubleSide,
        toneMapped: false,
        transparent: true
      });

      const panel = new THREE.Mesh(geometry, material);
      panel.position.y = (index - (totalPanels - 1) * 0.5) * 2.15;
      panel.rotation.y = (index / totalPanels) * Math.PI * 4;
      panel.userData = {
        slideIdx: slideIdx,
        baseOpacity: 0.94
      };
      gallery.add(panel);
      panels.push(panel);
    }

    function setHelixProjectPool(projectIdx, forceRefresh) {
      if (galleryState.activeSet === projectIdx && !forceRefresh) return;
      galleryState.activeSet = projectIdx;
      const pool = TEXTURE_POOLS[projectIdx] || TEXTURE_POOLS[0];

      panels.forEach(function (panel) {
        panel.material.map = pool[panel.userData.slideIdx];
        panel.material.needsUpdate = true;
      });

      if (spinFlashOverlay && !forceRefresh) {
        spinFlashOverlay.style.opacity = '1';
        setTimeout(function () {
          spinFlashOverlay.style.opacity = '0';
        }, 220);
      }
    }

    rebuildGalleryPlatesForTheme = function (themeObj) {
      scene.fog.color.setHex(themeObj.fogHex);
      generateAllTexturePools(themeObj);
      setHelixProjectPool(galleryState.activeSet, true);
    };

    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2(-99, -99);
    let isDragging = false;
    let lastDragX = 0;
    let lastDragY = 0;
    let dragDistance = 0;

    galleryCanvas.addEventListener('pointerdown', function (e) {
      isDragging = true;
      lastDragX = e.clientX;
      lastDragY = e.clientY;
      dragDistance = 0;
      galleryState.dragVelocityY = 0;
    });

    window.addEventListener('pointermove', function (e) {
      const rect = galleryCanvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      }

      if (!isDragging) return;
      const dx = e.clientX - lastDragX;
      const dy = e.clientY - lastDragY;
      lastDragX = e.clientX;
      lastDragY = e.clientY;
      dragDistance += Math.hypot(dx, dy);

      galleryState.dragRotY += dx * 0.0055;
      galleryState.dragVelocityY = dx * 0.0055;
      galleryState.dragPosY = clamp(galleryState.dragPosY - dy * 0.012, -3.5, 3.5);
    });

    window.addEventListener('pointerup', function (e) {
      if (isDragging && dragDistance < 7) {
        const rect = galleryCanvas.getBoundingClientRect();
        pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointerNdc, camera);
        const hits = raycaster.intersectObjects(panels, false);
        if (hits.length > 0) {
          const activeCase = CASES[galleryState.activeSet] || CASES[0];
          window.open(activeCase.liveUrl, '_blank', 'noopener,noreferrer');
        }
      }
      isDragging = false;
    });

    let ambientSpin = 0;
    let prevTime = 0;

    function resizeGallery() {
      const bounds = workStickyViewport.getBoundingClientRect();
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      const aspect = width / height;
      camera.aspect = aspect;

      if (aspect < 1.2) {
        const narrowFactor = clamp((1.2 - aspect) / 0.75, 0, 1);
        camera.fov = lerp(34, 44, narrowFactor);
        galleryState.responsiveZOffset = lerp(0, 5.2, narrowFactor);
      } else {
        camera.fov = 34;
        galleryState.responsiveZOffset = 0;
      }

      camera.updateProjectionMatrix();
    }

    if (window.ResizeObserver) {
      const ro = new ResizeObserver(resizeGallery);
      ro.observe(workStickyViewport);
    } else {
      window.addEventListener('resize', resizeGallery);
    }
    resizeGallery();

    function renderGalleryLoop(now) {
      requestAnimationFrame(renderGalleryLoop);
      const dt = prevTime ? Math.min((now - prevTime) / 1000, 0.05) : 0.016;
      prevTime = now;

      ambientSpin += dt * 0.14;

      if (!isDragging) {
        galleryState.dragRotY += galleryState.dragVelocityY;
        galleryState.dragVelocityY *= 0.92;
        galleryState.dragPosY = lerp(galleryState.dragPosY, 0, 0.05);
      }

      galleryState.smoothPinProgress = lerp(galleryState.smoothPinProgress, galleryState.pinProgress, 0.1);
      const p = galleryState.smoothPinProgress;
      const entry = galleryState.entryProgress;

      const whipCurve1 = smoothstep(0.28, 0.39, p);
      const whipCurve2 = smoothstep(0.62, 0.73, p);
      const whipSpin = (whipCurve1 + whipCurve2) * Math.PI * 1.8;
      const whipPulse = Math.max(Math.sin(whipCurve1 * Math.PI), Math.sin(whipCurve2 * Math.PI));

      if (p >= 0.67) {
        setHelixProjectPool(2, false);
        applyActiveCaseHUD(2);
      } else if (p >= 0.33) {
        setHelixProjectPool(1, false);
        applyActiveCaseHUD(1);
      } else {
        setHelixProjectPool(0, false);
        applyActiveCaseHUD(0);
      }

      const exitPhase = clamp((p - 0.86) / 0.14, 0, 1);
      const baseTargetZ = 13.8 + galleryState.responsiveZOffset;
      const entryZ = lerp(24.5 + galleryState.responsiveZOffset, baseTargetZ, entry);
      const zoomOutZ = lerp(entryZ - whipPulse * 1.3, 5.4, exitPhase * exitPhase);
      camera.position.z = zoomOutZ;

      const scrollRotY = p * Math.PI * 2.8 + whipSpin;
      gallery.rotation.y = ambientSpin + scrollRotY + galleryState.dragRotY;

      const helicalTravelY = lerp(-3.6, 3.8, p);
      gallery.position.y = helicalTravelY + Math.sin(ambientSpin * 2.2) * 0.25 + galleryState.dragPosY;

      const baseScale = lerp(0.84, 1.0, entry) + exitPhase * 0.22;
      gallery.scale.setScalar(baseScale);

      raycaster.setFromCamera(pointerNdc, camera);
      const hoveredHits = raycaster.intersectObjects(panels, false);
      const hoveredObj = hoveredHits.length > 0 ? hoveredHits[0].object : null;

      if (hoveredObj && !isDragging) {
        galleryCanvas.style.cursor = 'pointer';
      } else if (!isDragging) {
        galleryCanvas.style.cursor = 'grab';
      }

      panels.forEach(function (panel) {
        const isHovered = panel === hoveredObj;
        const targetOp = (1 - exitPhase * 0.85) * (isHovered ? 1.0 : 0.9);
        panel.material.opacity = lerp(panel.material.opacity, targetOp, 0.14);
      });

      renderer.render(scene, camera);
    }

    requestAnimationFrame(renderGalleryLoop);
  })();

  /* ============================================================== */
  /* MINIMAL THEME TOGGLE CONTROLLER                                */
  /* ============================================================== */
  const themeToggleBtn = document.getElementById('themeToggleBtn');

  function applySiteTheme(themeIndex) {
    currentThemeIdx = themeIndex % THEMES.length;
    const t = THEMES[currentThemeIdx];
    const root = document.documentElement;

    root.style.setProperty('--bg-dark', t.bgDark);
    root.style.setProperty('--bg-light', t.bgLight);
    root.style.setProperty('--text-light', t.textLight);
    root.style.setProperty('--text-dark', t.textDark);
    root.style.setProperty('--accent-primary', t.accentPrimary);
    root.style.setProperty('--accent-secondary', t.accentSecondary);
    root.style.setProperty('--accent-rgb', t.accentRgb);
    root.style.setProperty('--chroma-r', t.chromaR);
    root.style.setProperty('--chroma-b', t.chromaB);

    if (statementRibbonPath) {
      statementRibbonPath.setAttribute('stroke', t.accentPrimary);
    }
    if (statementRibbonPathMobile) {
      statementRibbonPathMobile.setAttribute('stroke', t.accentPrimary);
    }
    if (bridgeRibbonPath) {
      bridgeRibbonPath.setAttribute('stroke', t.accentPrimary);
    }

    document.querySelectorAll('.svg-accent-fill').forEach(function (el) {
      el.setAttribute('fill', t.accentPrimary);
    });
    document.querySelectorAll('.svg-accent-stroke').forEach(function (el) {
      el.setAttribute('stroke', t.accentPrimary);
    });

    applyPillarSlideColors(activePillarIdx);
    syncFluidSplatColor();

    if (typeof rebuildGalleryPlatesForTheme === 'function') {
      rebuildGalleryPlatesForTheme(t);
    }
    if (typeof applyLightSpeedPreset === 'function') {
      applyLightSpeedPreset(t.lightPreset);
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      applySiteTheme(currentThemeIdx + 1);
    });
  }

  const menuDrawerBtn = document.getElementById('menuDrawerBtn');
  const menuBtnLine1 = document.getElementById('menuBtnLine1');
  const menuBtnLine2 = document.getElementById('menuBtnLine2');
  const menuOverlay = document.getElementById('menuOverlay');
  const closeMenuOverlayBtn = document.getElementById('closeMenuOverlayBtn');
  const menuNavLinks = document.querySelectorAll('.menu-nav-link');

  let menuOpen = false;

  function setMenuState(shouldOpen) {
    if (menuOpen === shouldOpen) return;
    menuOpen = shouldOpen;

    menuDrawerBtn.setAttribute('aria-expanded', menuOpen ? 'true' : 'false');
    menuOverlay.setAttribute('aria-hidden', menuOpen ? 'false' : 'true');
    menuBtnLine1.textContent = menuOpen ? 'CLOSE' : 'MENU';
    menuBtnLine2.textContent = menuOpen ? 'CLOSE' : 'MENU';

    if (menuOpen) {
      menuOverlay.classList.add('menu-active');
      document.body.style.overflow = 'hidden';
    } else {
      menuOverlay.classList.remove('menu-active');
      document.body.style.overflow = '';
    }
  }

  menuDrawerBtn.addEventListener('click', function () {
    setMenuState(!menuOpen);
  });

  closeMenuOverlayBtn.addEventListener('click', function () {
    setMenuState(false);
  });

  menuOverlay.addEventListener('click', function (e) {
    if (e.target === menuOverlay) {
      setMenuState(false);
    }
  });

  menuNavLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      setMenuState(false);
    });
  });

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuOpen) {
      setMenuState(false);
    }
  });

  document.querySelectorAll('.magnetic-el').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      if (!window.gsap || window.innerWidth <= 1024) return;
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.25;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.25;
      gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: 'power3.out' });
    });
    el.addEventListener('pointerleave', function () {
      if (!window.gsap) return;
      gsap.to(el, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1, 0.35)' });
    });
  });

  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const toastBanner = document.getElementById('toastBanner');
  copyEmailBtn.addEventListener('click', function () {
    const email = 'ajoyprasad4116@gmail.com';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).catch(function () {});
    }
    toastBanner.textContent = 'Copied ' + email;
    toastBanner.classList.remove('opacity-0', 'translate-y-3');
    toastBanner.classList.add('opacity-100', 'translate-y-0');
    setTimeout(function () {
      toastBanner.classList.remove('opacity-100', 'translate-y-0');
      toastBanner.classList.add('opacity-0', 'translate-y-3');
    }, 2200);
  });

  if (window.gsap && window.ScrollTrigger) {
    gsap.from('.hero-word', {
      yPercent: 105,
      opacity: 0,
      duration: 1.1,
      stagger: 0.12,
      ease: 'power4.out'
    });

    const chars = gsap.utils.toArray('.scrub-char');
    if (chars.length) {
      gsap.to(chars, {
        opacity: 1,
        stagger: 0.03,
        ease: 'none',
        scrollTrigger: {
          trigger: '#scrubHeadline',
          start: 'top 80%',
          end: 'bottom 45%',
          scrub: true
        }
      });
    }

    const playedWithChars = gsap.utils.toArray('.played-with-char');
    [statementRibbonPath, statementRibbonPathMobile].forEach(function (rPath) {
      if (!rPath) return;
      const pathLen = rPath.getTotalLength ? rPath.getTotalLength() : 2200;
      rPath.style.strokeDasharray = pathLen;
      rPath.style.strokeDashoffset = pathLen;

      gsap.to(rPath, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#statementScrollTrack',
          start: 'top 75%',
          end: 'bottom bottom',
          scrub: 0.4
        }
      });
    });

    ScrollTrigger.create({
      trigger: '#statementScrollTrack',
      start: 'top 55%',
      end: 'bottom 45%',
      onEnter: function () {
        currentSurfaceMode = 'light';
        syncFluidSplatColor();
      },
      onLeave: function () {
        currentSurfaceMode = 'dark';
        syncFluidSplatColor();
      },
      onEnterBack: function () {
        currentSurfaceMode = 'light';
        syncFluidSplatColor();
      },
      onLeaveBack: function () {
        currentSurfaceMode = 'dark';
        syncFluidSplatColor();
      }
    });

    if (playedWithChars.length) {
      gsap.to(playedWithChars, {
        opacity: 1,
        stagger: 0.04,
        ease: 'none',
        scrollTrigger: {
          trigger: '#statementScrollTrack',
          start: 'top 25%',
          end: 'bottom 85%',
          scrub: true
        }
      });
    }

    if (chameleonRibbonPath) {
      const chamLen = chameleonRibbonPath.getTotalLength ? chameleonRibbonPath.getTotalLength() : 2400;
      chameleonRibbonPath.style.strokeDasharray = chamLen;
      chameleonRibbonPath.style.strokeDashoffset = chamLen * 0.65;

      gsap.to(chameleonRibbonPath, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#whatIDoScrollTrack',
          start: 'top 60%',
          end: 'bottom bottom',
          scrub: 0.5
        }
      });
    }

    if (whatIDoScrollTrack) {
      ScrollTrigger.create({
        trigger: '#whatIDoScrollTrack',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onEnter: function () {
          isInsideWhatIDoTrack = true;
          applyPillarSlideColors(activePillarIdx);
        },
        onEnterBack: function () {
          isInsideWhatIDoTrack = true;
          applyPillarSlideColors(activePillarIdx);
        },
        onUpdate: function (self) {
          isInsideWhatIDoTrack = true;
          const p = self.progress;
          if (p < 0.34) {
            setWhatIDoSlide(0, false);
          } else if (p < 0.68) {
            setWhatIDoSlide(1, false);
          } else {
            setWhatIDoSlide(2, false);
          }
        },
        onLeave: function () {
          isInsideWhatIDoTrack = false;
          currentSurfaceMode = 'dark';
          syncFluidSplatColor();
        },
        onLeaveBack: function () {
          isInsideWhatIDoTrack = false;
          currentSurfaceMode = 'dark';
          syncFluidSplatColor();
        }
      });
    }

    ScrollTrigger.create({
      trigger: '#workSection',
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      onUpdate: function (self) {
        const p = self.progress;
        galleryState.entryProgress = p;
        const scaleVal = lerp(0.84, 1, p);
        const opacityVal = lerp(0.22, 1, p);
        workStickyViewport.style.transform = 'scale(' + scaleVal.toFixed(4) + ')';
        workStickyViewport.style.opacity = opacityVal.toFixed(4);
      }
    });

    ScrollTrigger.create({
      trigger: '#workSection',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.45,
      snap: {
        snapTo: [0, 0.16, 0.50, 0.82, 1],
        duration: { min: 0.3, max: 0.7 },
        delay: 0.12,
        ease: 'power3.inOut'
      },
      onUpdate: function (self) {
        const p = self.progress;
        galleryState.pinProgress = p;
        if (workProgressFill) {
          workProgressFill.style.width = (p * 100).toFixed(2) + '%';
        }

        const exitP = clamp((p - 0.86) / 0.14, 0, 1);
        if (exitP > 0) {
          const exitScale = lerp(1, 0.91, exitP);
          const exitOpacity = lerp(1, 0.18, exitP);
          workStickyViewport.style.transform = 'scale(' + exitScale.toFixed(4) + ')';
          workStickyViewport.style.opacity = exitOpacity.toFixed(4);
        } else {
          workStickyViewport.style.transform = 'scale(1)';
          workStickyViewport.style.opacity = '1';
        }
      }
    });

    if (contactSection) {
      gsap.fromTo(
        contactSection,
        {
          scale: 0.92,
          yPercent: 5,
          opacity: 0.35
        },
        {
          scale: 1,
          yPercent: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#contactSection',
            start: 'top 98%',
            end: 'top 8%',
            scrub: true
          }
        }
      );
    }
  }

  /* ============================================================== */
  /* REAL-TIME INVERTED FLUID TRAIL (WEBGL + MIX-BLEND-DIFFERENCE)  */
  /* ============================================================== */
  (function initFluidCursor() {
    const fluidCanvas = document.getElementById('fluidCursorCanvas');
    if (!fluidCanvas) return;

    const config = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 512,
      DENSITY_DISSIPATION: 3.8,
      VELOCITY_DISSIPATION: 2.5,
      PRESSURE: 0.1,
      PRESSURE_ITERATIONS: 14,
      CURL: 3,
      SPLAT_RADIUS: 0.15,
      SPLAT_FORCE: 2800,
      TRANSPARENT: true
    };

    const glParams = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
    let gl = fluidCanvas.getContext('webgl2', glParams);
    const isWebGL2 = !!gl;
    if (!isWebGL2) {
      gl = fluidCanvas.getContext('webgl', glParams) || fluidCanvas.getContext('experimental-webgl', glParams);
    }
    if (!gl) return;

    let halfFloatExt = null;
    let supportLinearFiltering = null;
    if (isWebGL2) {
      gl.getExtension('EXT_color_buffer_float');
      supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
    } else {
      halfFloatExt = gl.getExtension('OES_texture_half_float');
      supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
    }

    const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : (halfFloatExt && halfFloatExt.HALF_FLOAT_OES) || gl.UNSIGNED_BYTE;

    function getSupportedFormat(internalFormat, format, type) {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
      gl.deleteTexture(tex);
      gl.deleteFramebuffer(fbo);
      if (status !== gl.FRAMEBUFFER_COMPLETE) {
        return { internalFormat: gl.RGBA, format: gl.RGBA, texType: gl.UNSIGNED_BYTE };
      }
      return { internalFormat: internalFormat, format: format, texType: type };
    }

    const rgbaFmt = isWebGL2
      ? getSupportedFormat(gl.RGBA16F, gl.RGBA, halfFloatTexType)
      : { internalFormat: gl.RGBA, format: gl.RGBA, texType: halfFloatTexType };

    function compileShader(type, source) {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, source);
      gl.compileShader(sh);
      return sh;
    }

    function createProgram(vsSource, fsSource) {
      const prog = gl.createProgram();
      gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vsSource));
      gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fsSource));
      gl.linkProgram(prog);
      const uniforms = {};
      const count = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const name = gl.getActiveUniform(prog, i).name;
        uniforms[name] = gl.getUniformLocation(prog, name);
      }
      return { program: prog, uniforms: uniforms };
    }

    const baseVs = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const clearFs = `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
      }
    `;

    const splatFs = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `;

    const advectionFs = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;
      void main () {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        vec4 result = texture2D(uSource, coord);
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
      }
    `;

    const divergenceFs = `
      precision mediump float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `;

    const curlFs = `
      precision mediump float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `;

    const vorticityFs = `
      precision highp float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
      }
    `;

    const pressureFs = `
      precision mediump float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `;

    const gradSubtractFs = `
      precision mediump float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `;

    const displayFs = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c * 1.45, clamp(a * 0.95, 0.0, 1.0));
      }
    `;

    const clearProg = createProgram(baseVs, clearFs);
    const splatProg = createProgram(baseVs, splatFs);
    const advectionProg = createProgram(baseVs, advectionFs);
    const divergenceProg = createProgram(baseVs, divergenceFs);
    const curlProg = createProgram(baseVs, curlFs);
    const vorticityProg = createProgram(baseVs, vorticityFs);
    const pressureProg = createProgram(baseVs, pressureFs);
    const gradSubtractProg = createProgram(baseVs, gradSubtractFs);
    const displayProg = createProgram(baseVs, displayFs);

    const quadBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const idxBuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    function blit(targetFbo) {
      if (targetFbo == null) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, targetFbo.width, targetFbo.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, targetFbo.fbo);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    function createFBO(w, h, filterParam) {
      gl.activeTexture(gl.TEXTURE0);
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterParam);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filterParam);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, rgbaFmt.internalFormat, w, h, 0, rgbaFmt.format, rgbaFmt.texType, null);

      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return {
        texture: tex,
        fbo: fbo,
        width: w,
        height: h,
        texelSizeX: 1.0 / w,
        texelSizeY: 1.0 / h,
        attach: function (id) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, tex);
          return id;
        }
      };
    }

    function createDoubleFBO(w, h, filterParam) {
      let fbo1 = createFBO(w, h, filterParam);
      let fbo2 = createFBO(w, h, filterParam);
      return {
        width: w,
        height: h,
        texelSizeX: fbo1.texelSizeX,
        texelSizeY: fbo1.texelSizeY,
        get read() { return fbo1; },
        set read(v) { fbo1 = v; },
        get write() { return fbo2; },
        set write(v) { fbo2 = v; },
        swap: function () {
          const temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        }
      };
    }

    const filterMode = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
    let dye = createDoubleFBO(config.DYE_RESOLUTION, config.DYE_RESOLUTION, filterMode);
    let velocity = createDoubleFBO(config.SIM_RESOLUTION, config.SIM_RESOLUTION, filterMode);
    let divergence = createFBO(config.SIM_RESOLUTION, config.SIM_RESOLUTION, gl.NEAREST);
    let curlFbo = createFBO(config.SIM_RESOLUTION, config.SIM_RESOLUTION, gl.NEAREST);
    let pressureFbo = createDoubleFBO(config.SIM_RESOLUTION, config.SIM_RESOLUTION, gl.NEAREST);

    function resizeFluidCanvas() {
      fluidCanvas.width = window.innerWidth;
      fluidCanvas.height = window.innerHeight;
    }
    resizeFluidCanvas();
    window.addEventListener('resize', resizeFluidCanvas);

    function splat(x, y, dx, dy, color) {
      gl.useProgram(splatProg.program);
      gl.uniform1i(splatProg.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(splatProg.uniforms.aspectRatio, fluidCanvas.width / fluidCanvas.height);
      gl.uniform2f(splatProg.uniforms.point, x, y);
      gl.uniform3f(splatProg.uniforms.color, dx, dy, 0.0);
      gl.uniform1f(splatProg.uniforms.radius, (config.SPLAT_RADIUS / 100.0));
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(splatProg.uniforms.uTarget, dye.read.attach(0));
      gl.uniform3f(splatProg.uniforms.color, color.r, color.g, color.b);
      blit(dye.write);
      dye.swap();
    }

    let lastX = 0.5;
    let lastY = 0.5;
    let initializedPointer = false;

    function handleInputMove(clientX, clientY) {
      const x = clientX / fluidCanvas.width;
      const y = 1.0 - (clientY / fluidCanvas.height);
      if (!initializedPointer) {
        lastX = x;
        lastY = y;
        initializedPointer = true;
      }
      const dx = (x - lastX) * config.SPLAT_FORCE;
      const dy = (y - lastY) * config.SPLAT_FORCE;
      lastX = x;
      lastY = y;

      if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
        splat(x, y, dx, dy, window.__fluidSplatColor || { r: 0.92, g: 0.25, b: 0.08 });
      }
    }

    window.addEventListener('pointermove', function (e) {
      handleInputMove(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener('touchmove', function (e) {
      if (e.touches && e.touches.length > 0) {
        handleInputMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    let lastTime = performance.now();
    function stepFluid(now) {
      requestAnimationFrame(stepFluid);
      const dt = Math.min((now - lastTime) / 1000, 0.0166);
      lastTime = now;

      gl.disable(gl.BLEND);

      gl.useProgram(curlProg.program);
      gl.uniform2f(curlProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(curlProg.uniforms.uVelocity, velocity.read.attach(0));
      blit(curlFbo);

      gl.useProgram(vorticityProg.program);
      gl.uniform2f(vorticityProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(vorticityProg.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(vorticityProg.uniforms.uCurl, curlFbo.attach(1));
      gl.uniform1f(vorticityProg.uniforms.curl, config.CURL);
      gl.uniform1f(vorticityProg.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      gl.useProgram(divergenceProg.program);
      gl.uniform2f(divergenceProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(divergenceProg.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      gl.useProgram(clearProg.program);
      gl.uniform1i(clearProg.uniforms.uTexture, pressureFbo.read.attach(0));
      gl.uniform1f(clearProg.uniforms.value, config.PRESSURE);
      blit(pressureFbo.write);
      pressureFbo.swap();

      gl.useProgram(pressureProg.program);
      gl.uniform2f(pressureProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(pressureProg.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureProg.uniforms.uPressure, pressureFbo.read.attach(1));
        blit(pressureFbo.write);
        pressureFbo.swap();
      }

      gl.useProgram(gradSubtractProg.program);
      gl.uniform2f(gradSubtractProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(gradSubtractProg.uniforms.uPressure, pressureFbo.read.attach(0));
      gl.uniform1i(gradSubtractProg.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      gl.useProgram(advectionProg.program);
      gl.uniform2f(advectionProg.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(advectionProg.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProg.uniforms.uSource, velocity.read.attach(0));
      gl.uniform1f(advectionProg.uniforms.dt, dt);
      gl.uniform1f(advectionProg.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      gl.uniform2f(advectionProg.uniforms.texelSize, dye.texelSizeX, dye.texelSizeY);
      gl.uniform1i(advectionProg.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(advectionProg.uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(advectionProg.uniforms.dissipation, config.DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();

      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(displayProg.program);
      gl.uniform1i(displayProg.uniforms.uTexture, dye.read.attach(0));
      blit(null);
    }

    requestAnimationFrame(stepFluid);
  })();

  const footerMarquee = document.getElementById('footerMarquee');
  let marqueeX = 0;

  function animateMarquee() {
    requestAnimationFrame(animateMarquee);
    marqueeX -= 1.1;
    if (marqueeX < -1400) marqueeX = 0;
    if (footerMarquee) {
      footerMarquee.style.transform = 'translate3d(' + marqueeX + 'px, 0, 0)';
    }
  }

  requestAnimationFrame(animateMarquee);
})();
