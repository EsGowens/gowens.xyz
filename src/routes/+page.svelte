<script lang="ts">
  import ResumeModal from './ResumeModal.svelte';
  import { fade, scale, slide } from 'svelte/transition';
  import { 
    Tv, 
    BookOpen, 
    Film, 
    Music, 
    Gamepad2, 
    Utensils, 
    Briefcase, 
    GraduationCap, 
    Clock, 
    ArrowUpRight, 
    X, 
    FileText, 
    Terminal, 
    Code, 
    Sparkles, 
    ChevronRight,
    MapPin,
    Mail,
    Globe,
    Layers,
    Archive,
    CornerUpLeft,
    Settings,
    Palette
  } from 'lucide-svelte';

  // 1. Destructure file-system data loaded from page.server.ts using Svelte 5 Runes
  let { data } = $props();
  const blogPosts = data?.blogPosts || [];
  const inputData = data?.inputData || {};

  // 2. Icon lookup mapping for modular input categories
  const iconMap: Record<string, any> = {
    tv: Tv,
    books: BookOpen,
    movies: Film,
    music: Music,
    games: Gamepad2,
    meals: Utensils
  };

  // 3. FIDGET THEME CONTROLLER STATE (Svelte 5 Runes)
  let theme = $state({
    mode: 'light',           // Defaulting to light for real-time sandbox tuning
    texture: 'ripstop',     // 'ripstop' | 'matrix-dots' | 'none'
    accentColor: '#00ffcc', // Hex value picker
    radius: '0px'           // '0px' | '10px' | '24px'
  });

  // Theme Preset Map (Game Worlds)
  const themePresets = [
    { name: 'TOTK', color: '#00ffcc', label: 'Tears of the Kingdom' },
    { name: 'CYBER', color: '#ff0055', label: 'Cyberpunk' },
    { name: 'MK8', color: '#ffcc00', label: 'Mario Kart' },
    { name: 'SPLATP', color: '#99ff00', label: 'Splatoon' },
    { name: 'ELDEN', color: '#d4af37', label: 'Elden Ring' }
  ];

  // 4. UI Layout Managers
  let isResumeOpen = $state(false);
  let activeTab = $state('books'); 
  let selectedPostId = $state(blogPosts[0]?.id || 1);
  let currentView = $state('post');
  let rightPanelMode = $state('logs');     // NEW: Manages right panel view ('logs' | 'archive') 

  // NEW: Reset the panel layout to live logs whenever the user changes category tabs
  function handleTabChange(tabKey: string) {
    activeTab = tabKey;
    rightPanelMode = 'logs';
  }

  // 5. Dynamic Derived States
  let activePost = $derived(blogPosts.find((p: any) => p.id === selectedPostId) || blogPosts[0]);
  let olderPosts = $derived(blogPosts.filter((p: any) => p.id !== selectedPostId));

  function handleSelectPost(id: number) {
    selectedPostId = id;
    currentView = 'post';
  }

  // Lightweight mouse coordinate tracking state for background warping
  let mouseX = $state(0);
  let mouseY = $state(0);

  function handleMouseMove(event: MouseEvent) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }
</script>

<div 
  onmousemove={handleMouseMove}
  class="min-h-screen font-sans transition-colors duration-300 relative pb-16 overflow-x-hidden"
  style="
    --accent: {theme.accentColor};
    --mouse-x: {mouseX}px;
    --mouse-y: {mouseY}px;
    --bg-main: {theme.mode === 'dark' ? '#121212' : '#f0f0f0'};
    --text-main: {theme.mode === 'dark' ? '#f7f7f7' : '#121212'};
    --text-muted: {theme.mode === 'dark' ? '#a1a1aa' : '#4b5563'};
    --card-bg: {theme.mode === 'dark' ? '#1a1a1a' : '#ffffff'};
    --header-bg: {theme.mode === 'dark' ? '#121212' : '#ffffff'};
    --badge-bg: {theme.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#e5e7eb'};
    
    --grid-color: {theme.mode === 'dark' 
      ? 'color-mix(in srgb, var(--accent) 4%, transparent)' 
      : 'color-mix(in srgb, var(--accent) 8%, #d4d4d8)'};
    --grid-heavy: {theme.mode === 'dark' 
      ? 'color-mix(in srgb, var(--accent) 12%, transparent)' 
      : 'color-mix(in srgb, var(--accent) 25%, #a1a1aa)'};
    
    --radius: {theme.radius};
    background-color: var(--bg-main);
    color: var(--text-main);
  "
>
  
  {#if theme.texture === 'ripstop'}
    <div 
      class="canvas-grid-layer interactive-backdrop-mesh opacity-50"
      style="background-size: 100% 100%, 12px 12px, 12px 12px;"
    ></div>
  {:else if theme.texture === 'matrix-dots'}
    <div 
      class="canvas-grid-layer interactive-dot-matrix opacity-60"
    ></div>
  {/if}

  <header 
    class="sticky top-0 z-40 border-b-3 border-black py-4 px-6 md:px-12 flex justify-between items-center shadow-[0_4px_0px_#000] transition-colors duration-300"
    style="background-color: var(--header-bg);"
  >
    <div class="flex items-center gap-3">
      <div 
        class="text-black p-2 border-3 border-black shadow-[3px_3px_0px_#000] font-bold flex items-center gap-2 transition-all duration-300"
        style="
          border-radius: var(--radius); 
          background-color: var(--accent);
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: -0.05em;
        "
      >
        <Terminal class="w-5 h-5 stroke-[2.5]" />
        <span class="tracking-normal font-extrabold text-sm uppercase">
          gowens<span class="text-white bg-black px-1.5 py-0.5 ml-1 select-all" style="border-radius: calc(var(--radius) / 3)">.xyz</span>
        </span>
      </div>
    </div>
    
    <nav class="flex items-center gap-6">
      <button 
        onclick={() => isResumeOpen = true}
        class="bg-[var(--card-bg)] text-var(--text-main) border-3 border-black px-5 py-2 text-sm flex items-center gap-2 cursor-pointer font-bold shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-300"
        style="border-radius: var(--radius);"
      >
        <FileText class="w-4 h-4 text-[var(--text-main)]" />
        RESUME
      </button>
    </nav>
  </header>

  <section class="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-8">
    
    <div 
      class="border-3 border-t-8 border-black border-t-[var(--accent)] bg-[var(--card-bg)] p-8 md:p-12 mb-8 relative shadow-[6px_6px_0px_#000] transition-all duration-300" 
      style="border-radius: var(--radius)"
    >
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div class="space-y-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-black text-[var(--accent)] border-2 border-black font-mono text-xs font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase tracking-wider transition-colors">
            <Sparkles class="w-4 h-4 text-[var(--accent)] animate-pulse" />
            ENGINEERING THE MODERN WEB
          </div>
          
          <h1 class="text-4xl md:text-6xl font-black tracking-tighter leading-none">
            Hi, I'm Garrett.
          </h1>
          
          <p class="text-lg md:text-xl font-medium font-sans max-w-3xl leading-relaxed opacity-95">
            I craft revenue-grade reactive platforms and optimized frontend systems. Specialized in <span class="text-[var(--accent)] bg-black/90 dark:bg-transparent dark:text-[var(--accent)] px-1.5 py-0.5 dark:p-0 font-mono font-bold transition-colors">Svelte 5</span>, developer experience infrastructure, and clean systems-level architecture.
          </p>

          <div class="flex flex-wrap gap-3 font-mono text-xs font-bold pt-2">
            <span class="flex items-center gap-1.5 px-3 py-1.5 border-2 border-black text-[var(--text-main)] bg-[var(--badge-bg)] shadow-[2px_2px_0px_#000]" style="border-radius: calc(var(--radius) / 2)">
              <MapPin class="w-3.5 h-3.5 text-[var(--accent)] dark:text-[var(--accent)] bg-black dark:bg-transparent p-0.5 dark:p-0" /> Harrisburg, PA
            </span>
            <span class="flex items-center gap-1.5 px-3 py-1.5 border-2 border-black text-[var(--text-main)] bg-[var(--badge-bg)] shadow-[2px_2px_0px_#000]" style="border-radius: calc(var(--radius) / 2)">
              <Code class="w-3.5 h-3.5 text-[var(--accent)] dark:text-[var(--accent)] bg-black dark:bg-transparent p-0.5 dark:p-0" /> Full-Stack Architect
            </span>
            <span class="flex items-center gap-1.5 px-3 py-1.5 border-2 border-black text-[var(--text-main)] bg-[var(--badge-bg)] shadow-[2px_2px_0px_#000]" style="border-radius: calc(var(--radius) / 2)">
              <Layers class="w-3.5 h-3.5 text-[var(--accent)] dark:text-[var(--accent)] bg-black dark:bg-transparent p-0.5 dark:p-0" /> Svelte 5 Core Expert
            </span>
          </div>
        </div>

        <div class="flex flex-col gap-4 self-stretch justify-center md:min-w-[220px]">
          <a 
            href="mailto:garrett@gowens.xyz" 
            class="bg-[var(--accent)] text-black border-3 border-black text-center py-3 text-sm flex items-center justify-center gap-2 cursor-pointer font-bold shadow-[4px_4px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
            style="border-radius: var(--radius)"
          >
            <Mail class="w-4 h-4" /> REACH OUT
          </a>
        </div>
      </div>
    </div>

    <div 
      class="border-3 border-t-8 border-black border-t-[var(--accent)] bg-[var(--card-bg)] p-6 mb-12 shadow-[4px_4px_0px_#000] relative overflow-hidden transition-all duration-300" 
      style="border-radius: var(--radius)"
    >
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        <div class="flex items-center gap-2 font-black uppercase tracking-wider font-mono">
          <Settings class="w-4 h-4 text-[var(--accent)] bg-black p-0.5" />
          <span>SYSTEM_CONFIG.EXE</span>
        </div>
        
        <div class="flex flex-wrap items-center gap-6 lg:gap-8 font-mono text-[11px] font-bold">
          
          <div class="flex flex-col gap-1.5">
            <span class="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">01. ENGINE_MODE</span>
            <div class="flex items-center border border-black p-0.5 bg-black/5 dark:bg-white/5" style="border-radius: calc(var(--radius) / 2)">
              <button 
                onclick={() => theme.mode = 'dark'} 
                class="px-2 py-0.5 font-bold transition-all {theme.mode === 'dark' ? 'bg-black text-white' : 'text-zinc-600 dark:text-zinc-400 hover:text-[var(--text-main)]'}"
                style="border-radius: calc(var(--radius) / 3)"
              >DARK</button>
              <button 
                onclick={() => theme.mode = 'light'} 
                class="px-2 py-0.5 font-bold transition-all {theme.mode === 'light' ? 'bg-white text-black border border-black shadow-[1px_1px_0px_#000]' : 'text-zinc-600 dark:text-zinc-400 hover:text-[var(--text-main)]'}"
                style="border-radius: calc(var(--radius) / 3)"
              >LIGHT</button>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <span class="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">02. CANVAS_TEXTURE</span>
            <div class="flex items-center border border-black p-0.5 bg-black/5 dark:bg-white/5" style="border-radius: calc(var(--radius) / 2)">
              <button onclick={() => theme.texture = 'ripstop'} class="px-2 py-0.5 transition-all {theme.texture === 'ripstop' ? 'bg-[var(--accent)] text-black border border-black shadow-[1px_1px_0px_#000]' : 'text-zinc-600 dark:text-zinc-400 hover:text-[var(--text-main)]'}" style="border-radius: calc(var(--radius) / 3)">RIPSTOP</button>
              <button onclick={() => theme.texture = 'matrix-dots'} class="px-2 py-0.5 transition-all {theme.texture === 'matrix-dots' ? 'bg-[var(--accent)] text-black border border-black shadow-[1px_1px_0px_#000]' : 'text-zinc-600 dark:text-zinc-400 hover:text-[var(--text-main)]'}" style="border-radius: calc(var(--radius) / 3)">DOTS</button>
              <button onclick={() => theme.texture = 'none'} class="px-2 py-0.5 transition-all {theme.texture === 'none' ? 'bg-[var(--accent)] text-black border border-black shadow-[1px_1px_0px_#000]' : 'text-zinc-600 dark:text-zinc-400 hover:text-[var(--text-main)]'}" style="border-radius: calc(var(--radius) / 3)">NONE</button>
            </div>
          </div>

          <div class="flex flex-col gap-1.5">
            <span class="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">03. GEOMETRY_RADIUS</span>
            <div class="flex items-center border border-black p-0.5 bg-black/5 dark:bg-white/5" style="border-radius: calc(var(--radius) / 2)">
              <button onclick={() => theme.radius = '0px'} class="px-2 py-0.5 transition-all {theme.radius === '0px' ? 'bg-[var(--accent)] text-black border border-black shadow-[1px_1px_0px_#000]' : 'text-zinc-600 dark:text-zinc-400 hover:text-[var(--text-main)]'}" style="border-radius: calc(var(--radius) / 3)">SHARP</button>
              <button onclick={() => theme.radius = '10px'} class="px-2 py-0.5 transition-all {theme.radius === '10px' ? 'bg-[var(--accent)] text-black border border-black shadow-[1px_1px_0px_#000]' : 'text-zinc-600 dark:text-zinc-400 hover:text-[var(--text-main)]'}" style="border-radius: calc(var(--radius) / 3)">SMOOTH</button>
              <button onclick={() => theme.radius = '24px'} class="px-2 py-0.5 transition-all {theme.radius === '24px' ? 'bg-[var(--accent)] text-black border border-black shadow-[1px_1px_0px_#000]' : 'text-zinc-600 dark:text-zinc-400 hover:text-[var(--text-main)]'}" style="border-radius: calc(var(--radius) / 3)">PILL</button>
            </div>
          </div>

          <!-- REFACTORED COLOR PALETTE MODULE -->
          <div class="flex flex-col gap-1.5 relative select-none">
            <span class="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">04. SYSTEM_PALETTE</span>
            <div class="group/palette flex items-center gap-2 relative h-[26px]">
              
              <!-- Trigger Base Toggle Node -->
              <div class="flex items-center gap-1.5 bg-black text-[var(--accent)] px-2 py-1 border border-black font-bold shadow-[2px_2px_0px_#000] z-20 cursor-pointer" style="border-radius: calc(var(--radius) / 2)">
                <Palette class="w-3.5 h-3.5 text-[var(--accent)]" />
                <span class="text-[10px]">PRESETS</span>
              </div>

              <!-- Refactored Drawer: Slides up on mobile/small viewports, drops normal row line on large viewports -->
              <div class="flex items-center gap-1.5 p-2 bg-[var(--card-bg)] border-2 border-black md:border-0 md:p-0 shadow-[4px_4px_0px_#000] md:shadow-none transition-all duration-300 ease-out origin-bottom md:origin-left scale-0 opacity-0 pointer-events-none group-hover/palette:scale-100 group-hover/palette:opacity-100 group-hover/palette:pointer-events-auto absolute bottom-[32px] md:bottom-auto left-0 md:left-auto md:relative z-30" style="border-radius: var(--radius)">
                {#each themePresets as preset}
                  <button 
                    onclick={() => theme.accentColor = preset.color}
                    title={preset.label}
                    class="w-5 h-5 border-2 border-black shadow-[1px_1px_0px_#000] hover:scale-110 active:scale-95 transition-all shrink-0 cursor-pointer"
                    style="background-color: {preset.color}; {theme.accentColor === preset.color ? 'outline: 2px dashed var(--text-main); outline-offset: 1px;' : ''}; border-radius: calc(var(--radius) / 4)"
                  ></button>
                {/each}
                
                <label class="w-5 h-5 border-2 border-black shadow-[1px_1px_0px_#000] flex items-center justify-center bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 cursor-pointer relative hover:scale-110 transition-transform shrink-0" style="border-radius: calc(var(--radius) / 4)">
                  <input 
                    type="color" 
                    bind:value={theme.accentColor} 
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </label>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
      
      <section class="lg:col-span-7 flex flex-col gap-6" aria-label="Gowens Blog Widget">
        
        <div 
          class="border-3 border-t-8 border-black border-t-[var(--accent)] bg-[var(--card-bg)] p-6 md:p-8 flex-1 flex flex-col justify-between relative shadow-[4px_4px_0px_#000] transition-all duration-300" 
          style="border-radius: var(--radius)"
        >
          <div>
            <div class="border-b-3 border-black pb-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 class="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                <Terminal class="w-6 h-6 text-[var(--accent)] bg-black p-0.5" />
                THOUGHTS.md
              </h2>
              <span class="text-xs font-mono bg-black text-[var(--accent)] px-2.5 py-1 border border-zinc-800">
                {currentView === 'archive' ? 'MAIN_ARCHIVE_VIEW' : 'READING_MODE'}
              </span>
            </div>

            <div class="min-h-[350px]">
              {#if currentView === 'post'}
                {#if activePost}
                  {#key selectedPostId}
                    <div in:fade={{ duration: 200 }} class="space-y-4">
                      {@render renderBlogPost(activePost, theme.mode)}
                    </div>
                  {/key}
                {/if}
              {:else if currentView === 'archive'}
                <div in:fade={{ duration: 200 }} class="space-y-4 font-mono">
                  <div class="flex justify-between items-center border-b border-black/20 dark:border-zinc-800 pb-2 mb-4">
                    <span class="text-xs font-bold text-[var(--accent)] dark:text-black dark:bg-[var(--accent)] dark:px-1.5 tracking-wider">// MAIN_ARCHIVE.LOG ({blogPosts.length} entries)</span>
                    <button 
                      onclick={() => currentView = 'post'} 
                      class="text-xs font-bold text-white flex items-center gap-1 border border-black px-2 py-0.5 bg-black cursor-pointer transition-all shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px]"
                    >
                      <CornerUpLeft class="w-3 h-3" /> RETURN
                    </button>
                  </div>
                  
                  <div class="flex flex-col gap-2.5 max-h-[400px] overflow-y-auto pr-1">
                    {#each blogPosts as post}
                      <button 
                        onclick={() => { handleSelectPost(post.id); currentView = 'post'; }}
                        class="w-full text-left p-2.5 border-2 border-black hover:border-[var(--accent)] bg-black/10 dark:bg-black/30 hover:bg-black/50 transition-all flex justify-between items-center group cursor-pointer shadow-[2px_2px_0px_#000]"
                        style="border-radius: calc(var(--radius) / 2)"
                      >
                        <span class="group-hover:text-[var(--accent)] dark:group-hover:text-[var(--accent)] group-hover:bg-black group-hover:px-1.5 transition-all truncate pr-4 text-sm font-sans font-bold">
                          {post.title}
                        </span>
                        <span class="text-xs text-[var(--text-muted)] font-bold whitespace-nowrap shrink-0">{post.date}</span>
                      </button>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          </div>

          <div class="mt-8 pt-4 border-t-2 border-dashed border-black/20 dark:border-zinc-800 flex justify-between items-center text-xs font-mono text-[var(--text-muted)] font-bold">
            <span>UUID: {activePost?.id || 1}0F9X-2026</span>
            <span>ENG_JOURNAL</span>
          </div>
        </div>

        {#if currentView === 'post'}
          <div 
            class="border-3 border-black bg-[var(--card-bg)] p-5 relative shadow-[4px_4px_0px_#000] transition-all duration-300" 
            style="border-radius: var(--radius)"
          >
            <div class="flex justify-between items-center border-b border-black/10 dark:border-zinc-800 pb-3 mb-3 font-mono text-xs font-bold text-[var(--text-muted)] uppercase">
              <span class="flex items-center gap-1.5"><Archive class="w-4 h-4 text-[var(--accent)]" /> // HISTORICAL_JOURNAL_ROLL</span>
              <button 
                onclick={() => currentView = 'archive'}
                class="text-[11px] font-bold text-[var(--text-main)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 cursor-pointer"
              >
                [ EXPLORE FULL INDEX ]
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {#each blogPosts.slice(0, 3) as post}
                <button
                  onclick={() => handleSelectPost(post.id)}
                  class="text-left p-3 border-2 border-black flex flex-col justify-between gap-2.5 transition-all cursor-pointer relative group
                    {selectedPostId === post.id 
                      ? 'bg-[var(--accent)] text-black shadow-[2px_2px_0px_#000] translate-x-[-1px] translate-y-[-1px]' 
                      : 'bg-black/5 dark:bg-black/20 hover:bg-black/10 dark:hover:bg-black/40 hover:translate-y-[-1px]'}"
                  style="border-radius: calc(var(--radius) / 2)"
                >
                  <span class="text-[9px] font-mono font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                    {post.date}
                  </span>
                  <span class="text-xs font-black font-sans uppercase line-clamp-2 tracking-tight leading-snug flex-1">
                    {post.title}
                  </span>
                </button>
              {/each}
            </div>
          </div>
        {/if}

      </section>

     <section class="lg:col-span-5 flex flex-col h-full" aria-label="Media and Meals logs">
        <div class="border-3 border-t-8 border-black border-t-transparent bg-[var(--card-bg)] p-6 md:p-8 flex-1 flex flex-col justify-between relative shadow-[4px_4px_0px_#000] transition-all duration-300" style="border-radius: var(--radius)">
          
          <div>
            <div class="border-b-3 border-black pb-4 mb-6 flex justify-between items-center">
              <h2 class="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
                <Layers class="w-6 h-6 text-[var(--accent)] bg-black p-0.5" />
                SIGNAL_INPUT
              </h2>
              <span class="text-xs font-mono bg-[var(--accent)] border-2 border-black px-2 py-0.5 font-bold text-black shadow-[2px_2px_0px_#000]">
                {rightPanelMode === 'archive' ? 'HISTORICAL_ARCHIVE' : 'REACTIVE_LOGS'}
              </span>
            </div>

            <div class="grid grid-cols-3 gap-2 mb-6 font-mono font-bold">
              {#each Object.keys(inputData) as tabKey}
                {@const Icon = iconMap[tabKey] || Tv}
                <button
                  onclick={() => handleTabChange(tabKey)}
                  class="tab-hover-target flex flex-col items-center justify-center p-2 border-2 border-black text-xs font-black transition-all cursor-pointer relative uppercase
                    {activeTab === tabKey 
                      ? 'bg-[var(--accent)] text-black shadow-[2px_2px_0px_#000] translate-x-[-1px] translate-y-[-1px]' 
                      : 'bg-[var(--card-bg)] hover:bg-black/5 dark:hover:bg-white/5 hover:translate-y-[-1px]'}"
                  style="border-radius: calc(var(--radius) / 2)"
                >
                  <Icon class="w-4 h-4 mb-1 transition-transform duration-200" />
                  {tabKey}
                </button>
              {/each}
            </div>

            {#key [activeTab, rightPanelMode]}
              {@const currentTabInfo = inputData[activeTab]}
              {#if currentTabInfo}
                <div in:fade={{ duration: 200 }} class="space-y-4">
                  
                  {#if rightPanelMode === 'logs'}
                    <div class="bg-black text-[var(--accent)] border-2 border-black p-3 shadow-[3px_3px_0px_#000] flex items-center gap-3 overflow-hidden relative" style="border-radius: calc(var(--radius) / 2)">
                      <div class="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-transparent via-[var(--accent)]/15 to-transparent opacity-40 pointer-events-none animate-scan"></div>
                      <div class="w-2.5 h-2.5 bg-[var(--accent)] rounded-full animate-ping shrink-0"></div>
                      <div class="font-mono text-xs font-bold tracking-tight truncate relative z-10">
                        {currentTabInfo.status}
                      </div>
                    </div>

                    <div class="space-y-4 pt-2">
                      {#each currentTabInfo.items as item}
                        <div class="p-4 bg-black/5 dark:bg-black/20 border-2 border-black shadow-[3px_3px_0px_#000] flex flex-col gap-2 transition-all" style="border-radius: calc(var(--radius) / 2)">
                          <div class="flex justify-between items-start gap-4">
                            <h4 class="font-black text-base tracking-tight">{item.title}</h4>
                            <span class="shrink-0 bg-black text-white text-xs font-mono font-bold px-2 py-0.5 border border-black">{item.score}</span>
                          </div>
                          <p class="text-xs opacity-80 font-sans leading-relaxed">{item.desc}</p>
                        </div>
                      {/each}
                    </div>

                    <div class="pt-4 flex justify-end">
                      <button 
                        onclick={() => rightPanelMode = 'archive'}
                        class="text-xs font-mono font-bold text-[var(--text-main)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Archive class="w-3.5 h-3.5" /> [ VIEW MAIN_{activeTab.toUpperCase()}_ARCHIVE ]
                      </button>
                    </div>

                  {:else if rightPanelMode === 'archive'}
                    <div class="space-y-4 font-mono">
                      <div class="flex justify-between items-center border-b border-black/20 dark:border-zinc-800 pb-2 mb-2">
                        <span class="text-xs font-bold text-[var(--text-muted)] tracking-wider">// ALL_INDEXED_ENTRIES ({currentTabInfo.items.length})</span>
                        <button 
                          onclick={() => rightPanelMode = 'logs'} 
                          class="text-xs font-black text-white flex items-center gap-1 border border-black px-2 py-0.5 bg-black cursor-pointer transition-all shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px]"
                        >
                          <CornerUpLeft class="w-3 h-3" /> RETURN_TO_FEED
                        </button>
                      </div>
                      
                      <div class="flex flex-col gap-2.5 max-h-[400px] overflow-y-auto pr-1">
                        {#each currentTabInfo.items as item}
                          <div 
                            class="p-3 border-2 border-black bg-black/5 dark:bg-black/30 flex justify-between items-center gap-4 shadow-[2px_2px_0px_#000]"
                            style="border-radius: calc(var(--radius) / 2)"
                          >
                            <span class="text-sm font-sans font-bold text-[var(--text-main)] truncate">{item.title}</span>
                            <span class="shrink-0 bg-black text-[var(--accent)] text-xs font-bold px-1.5 py-0.5 border border-zinc-800">{item.score}</span>
                          </div>
                        {/each}
                      </div>
                    </div>
                  {/if}

                </div>
              {/if}
            {/key}
          </div>

          <div class="mt-8 pt-4 border-t-2 border-dashed border-black/20 dark:border-zinc-800 flex justify-between items-center text-xs font-mono text-[var(--text-muted)] font-bold">
            <span>SVELTE 5 ENGINE RENDER</span>
            <span>SECURE_CONTAINER</span>
          </div>
        </div>
      </section>

    </div>
  </section>

  <ResumeModal bind:isOpen={isResumeOpen} />
  <footer class="w-full mt-16 border-t-3 border-black py-4 px-6 md:px-12 flex justify-between items-center font-mono text-[10px] uppercase font-bold text-[var(--text-muted)] bg-[var(--header-bg)] shadow-[0_-4px_0px_#000]">
    <div class="flex items-center gap-4">
      <span>SYS_STATUS: ONLINE</span>
      <span class="hidden sm:inline text-zinc-500">//</span>
      <span class="hidden sm:inline">LOC_NODE: 40.2636° N, 76.8808° W</span>
    </div>
    <div>
      <span>GOWENS.XYZ // VER_2026.07</span>
    </div>
  </footer>

</div>

{#snippet renderBlogPost(post, activeMode)}
  <article class="space-y-4">
    <div class="flex items-center gap-3 border-b-2 border-dashed border-black/20 dark:border-zinc-800 pb-3">
      <span class="px-2.5 py-0.5 text-xs font-bold font-mono uppercase bg-[var(--accent)] text-black border-2 border-black shadow-[2px_2px_0px_#000] transition-colors">
        {post.date}
      </span>
      <span class="text-xs font-mono font-bold text-[var(--text-muted)] flex items-center gap-1.5">
        <Clock class="w-3.5 h-3.5 text-[var(--accent)] dark:text-[var(--accent)] bg-black dark:bg-transparent p-0.5 dark:p-0" /> {post.readTime}
      </span>
    </div>
    
    <h3 class="text-2xl md:text-3xl font-black font-sans tracking-tight hover:text-[var(--accent)] transition-colors leading-tight">
      {post.title}
    </h3>
    
    <div class="font-sans font-medium leading-relaxed text-sm md:text-base whitespace-pre-line pt-2 {activeMode === 'dark' ? 'text-zinc-300' : 'text-zinc-600'}">
      {post.content}
    </div>
  </article>
{/snippet}