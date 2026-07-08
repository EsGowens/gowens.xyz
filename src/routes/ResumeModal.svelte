<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { X, Briefcase, GraduationCap, Terminal, MapPin, Mail, Globe } from 'lucide-svelte';

  // Svelte 5 props declaration for dual bind control
  let { isOpen = $bindable() } = $props();

  const resumeData = {
    name: "Garrett Saxon",
    title: "Senior Full-Stack Engineer / Creative Developer",
    location: "Harrisburg, PA",
    email: "garrett@gowens.xyz",
    website: "gowens.xyz",
    summary: "Senior Full-Stack Engineer specialized in designing high-performance reactive web platforms, compiler tooling, and high-contrast creative frontends. Expert in Svelte 5, TypeScript, and systems-level programming in Rust.",
    experience: [
      {
        role: "Lead Platform Engineer",
        company: "Antigravity Labs",
        period: "2024 - Present",
        bullets: [
          "Pioneered next-generation reactive dev-tools and sandboxed client container environments.",
          "Architected real-time isolated preview systems, achieving a 45% reduction in warm-start compilation latency.",
          "Led development of core framework packages used by over 50,000 active developers worldwide."
        ]
      },
      {
        role: "Senior Svelte Platform Developer",
        company: "Vercel",
        period: "2022 - 2024",
        bullets: [
          "Engineered core routing modules and adapter plugins for SvelteKit, optimizing serverless hydration speeds.",
          "Collaborated directly with core maintainers on Svelte 5 Runes design system, ensuring backward compatibility.",
          "Optimized edge rendering frameworks, slashing Time-To-Interactive (TTI) by 120ms on enterprise sites."
        ]
      },
      {
        role: "Frontend Systems Architect",
        company: "NeoCraft Solutions",
        period: "2020 - 2022",
        bullets: [
          "Authored a bespoke, ultra-high contrast WebGL dashboard for cloud container cluster metrics.",
          "Created a shared enterprise design system, reducing design-to-code iteration loops by 35%.",
          "Implemented strict automated accessibility (a11y) pipelines conforming to WCAG AA standard."
        ]
      }
    ],
    education: [
      {
        degree: "B.S. in Computer Science & Engineering",
        school: "The University of Texas at Austin",
        year: "2016 - 2020",
        notes: "Focus on Compilers and Reactive Systems Architecture."
      }
    ],
    skills: [
      "Svelte 5 / SvelteKit",
      "React / Next.js",
      "TypeScript & ESBuild",
      "Rust (WASM & Axum)",
      "Node.js / Express",
      "Tailwind CSS (v4)",
      "PostgreSQL / Cloud SQL",
      "Docker & Kubernetes",
      "Real-Time WebSockets"
    ]
  };
</script>

{#if isOpen}
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-md bg-black/60"
    transition:fade={{ duration: 250 }}
    onclick={() => isOpen = false}
    onkeydown={(e) => e.key === 'Escape' && (isOpen = false)}
    role="button"
    tabindex="0"
  >
    <div 
      class="bg-white text-black w-full max-w-4xl max-h-[90vh] overflow-y-auto border-4 border-black shadow-[8px_8px_0px_#000] p-6 md:p-10 relative flex flex-col rounded-none scrollbar-thin"
      transition:scale={{ duration: 200, start: 0.95 }}
      onclick={(e) => e.stopPropagation()}
      role="document"
      tabindex="-1"
    >
      <button 
        onclick={() => isOpen = false}
        class="absolute top-4 right-4 md:top-6 md:right-6 bg-red-400 text-black border-3 border-black p-2 shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-pointer"
        aria-label="Close Resume"
      >
        <X class="w-5 h-5 font-black" />
      </button>

      <div class="space-y-8 font-sans">
        <div class="border-b-4 border-black pb-6 space-y-3">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span class="bg-[var(--accent)] text-black text-xs font-bold font-mono px-2 py-0.5 border border-black mb-2 inline-block shadow-[1px_1px_0px_#000]">
                GOWENS_CURRICULUM_VITAE
              </span>
              <h2 class="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none text-black">
                {resumeData.name}
              </h2>
              <p class="text-md md:text-lg font-bold text-gray-700 font-sans mt-1">
                {resumeData.title}
              </p>
            </div>
            <div class="font-mono text-xs text-gray-600 space-y-1 bg-gray-100 p-3 border-2 border-black shadow-[2px_2px_0px_#000]">
              <p class="flex items-center gap-1.5"><MapPin class="w-3.5 h-3.5 text-black shrink-0" /> {resumeData.location}</p>
              <p class="flex items-center gap-1.5"><Mail class="w-3.5 h-3.5 text-black shrink-0" /> {resumeData.email}</p>
              <p class="flex items-center gap-1.5"><Globe class="w-3.5 h-3.5 text-black shrink-0" /> {resumeData.website}</p>
            </div>
          </div>
          <p class="text-sm md:text-base text-gray-800 leading-relaxed font-sans pt-2 italic">
            "{resumeData.summary}"
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div class="md:col-span-8 space-y-8">
            <section class="space-y-4">
              <h3 class="text-xl font-bold uppercase tracking-tight flex items-center gap-2 border-b-2 border-black pb-1.5 text-black">
                <Briefcase class="w-5 h-5" /> Professional History
              </h3>
              <div class="space-y-6">
                {#each resumeData.experience as job}
                  <div class="space-y-2 border-l-3 border-black pl-4 py-1">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-1">
                      <div>
                        <h4 class="font-bold text-base text-black">{job.role}</h4>
                        <span class="text-sm font-semibold text-gray-600">{job.company}</span>
                      </div>
                      <span class="font-mono text-xs bg-black text-white px-2 py-0.5 font-bold border border-black shrink-0">
                        {job.period}
                      </span>
                    </div>
                    <ul class="list-disc list-inside text-xs md:text-sm text-gray-700 space-y-1.5 font-sans">
                      {#each job.bullets as bullet}
                        <li class="leading-relaxed">{bullet}</li>
                      {/each}
                    </ul>
                  </div>
                {/each}
              </div>
            </section>

            <section class="space-y-4">
              <h3 class="text-xl font-bold uppercase tracking-tight flex items-center gap-2 border-b-2 border-black pb-1.5 text-black">
                <GraduationCap class="w-5 h-5" /> Education
              </h3>
              <div class="space-y-4">
                {#each resumeData.education as edu}
                  <div class="border-l-3 border-black pl-4">
                    <div class="flex justify-between items-start gap-4">
                      <h4 class="font-bold text-sm md:text-base text-black">{edu.degree}</h4>
                      <span class="font-mono text-xs bg-gray-100 border border-black px-2 py-0.5 shrink-0">{edu.year}</span>
                    </div>
                    <p class="text-xs text-gray-600 font-medium">{edu.school}</p>
                    <p class="text-xs text-gray-700 font-sans mt-1">{edu.notes}</p>
                  </div>
                {/each}
              </div>
            </section>
          </div>

          <div class="md:col-span-4 space-y-6">
            <section class="space-y-4 bg-gray-50 border-3 border-black p-5 shadow-[3px_3px_0px_#000]">
              <h3 class="text-lg font-bold uppercase tracking-tight flex items-center gap-2 border-b-2 border-black pb-1.5 text-black">
                <Terminal class="w-4 h-4" /> Core Competencies
              </h3>
              <div class="flex flex-wrap gap-2">
                {#each resumeData.skills as skill}
                  <span class="bg-white text-black text-xs font-bold font-mono px-2 py-1.5 border-2 border-black shadow-[1px_1px_0px_#000]">
                    {skill}
                  </span>
                {/each}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}