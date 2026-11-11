<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCal, CalButton, CalEmbed } from 'calcom-vue';

const calLink = ref('john-doe/30min'); // Public Cal.com test link
const showInline = ref(true);
const logs = ref<string[]>([]);

const { openModal, preload, on } = useCal();

function addLog(message: string) {
  const timestamp = new Date().toLocaleTimeString();
  logs.value.unshift(`[${timestamp}] ${message}`);
}

function handleProgrammaticOpen() {
  addLog(`Opening modal programmatically for "${calLink.value}"`);
  openModal({
    calLink: calLink.value,
    config: {
      layout: 'month_view',
      theme: 'light',
      cssVarsPerTheme: {
        light: {
          'cal-brand': '#FF53C7'
        }
      }
    }
  });
}

function handlePreload() {
  addLog(`Preloading calendar for "${calLink.value}"`);
  preload({ calLink: calLink.value });
}

onMounted(() => {
  // Listen to booking events
  on({
    action: 'bookingSuccessful',
    callback: (e) => {
      addLog(`Event "bookingSuccessful" received!`);
      console.log('Booking details:', e.detail);
    }
  });

  on({
    action: 'linkReady',
    callback: () => {
      addLog('Cal modal/embed iframe is ready.');
    }
  });
});
</script>

<template>
  <main class="max-w-4xl mx-auto py-12 px-6">
    <header class="mb-8 border-b border-slate-800 pb-6">
      <h1 class="text-3xl font-bold tracking-tight text-white mb-2">
        Cal.com Vue Playground
      </h1>
      <p class="text-slate-400">
        Test integration modes live against Cal.com's embed loader: Modals, Directive, Composable, and Inline Embeds.
      </p>
    </header>

    <!-- Cal Link Target Config -->
    <section class="mb-8 bg-slate-800/60 p-4 rounded-xl border border-slate-700">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex-1">
          <label class="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Cal.com Username/Event Slug
          </label>
          <input
            v-model="calLink"
            type="text"
            placeholder="username/event"
            class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
        </div>
        <div class="flex items-end gap-2">
          <button
            @click="handlePreload"
            class="py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-white font-medium text-xs rounded-lg transition"
          >
            Preload Link
          </button>
          <button
            @click="showInline = !showInline"
            class="py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-white font-medium text-xs rounded-lg transition"
          >
            {{ showInline ? 'Hide Inline' : 'Show Inline' }}
          </button>
        </div>
      </div>
    </section>

    <!-- Action Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <!-- 1. Directive Card -->
      <div class="bg-slate-800/40 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <h2 class="font-semibold text-white mb-1">1. Directive</h2>
          <p class="text-xs text-slate-400 mb-4">Using <code>v-cal</code> on any native tag.</p>
        </div>
        <button
          v-cal="calLink"
          class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg transition"
        >
          v-cal Directive
        </button>
      </div>

      <!-- 2. Component Card -->
      <div class="bg-slate-800/40 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <h2 class="font-semibold text-white mb-1">2. Component</h2>
          <p class="text-xs text-slate-400 mb-4">Using the pre-built <code>&lt;CalButton /&gt;</code>.</p>
        </div>
        <CalButton
          :calLink="calLink"
          class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg transition"
        >
          &lt;CalButton /&gt;
        </CalButton>
      </div>

      <!-- 3. Composable Card -->
      <div class="bg-slate-800/40 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <h2 class="font-semibold text-white mb-1">3. Composable</h2>
          <p class="text-xs text-slate-400 mb-4">Using <code>useCal().openModal()</code>.</p>
        </div>
        <button
          @click="handleProgrammaticOpen"
          class="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition"
        >
          useCal Composable
        </button>
      </div>
    </div>

    <!-- Inline Embed Section -->
    <section v-if="showInline" class="mb-8 bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 class="font-semibold text-white">4. Inline Embed Component (&lt;CalEmbed /&gt; or &lt;Cal /&gt;)</h2>
          <p class="text-xs text-slate-400">Renders the scheduling interface directly in your layout.</p>
        </div>
      </div>
      <div class="border border-slate-800 rounded-lg overflow-hidden h-[600px] bg-slate-950">
        <CalEmbed
          :calLink="calLink"
          :config="{ layout: 'month_view' }"
          style="width: 100%; height: 100%; overflow: scroll;"
        />
      </div>
    </section>

    <!-- Event Logging Terminal -->
    <section class="bg-slate-950 border border-slate-800 rounded-xl p-5">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Cal.com Event Log
        </h3>
        <button 
          @click="logs = []" 
          class="text-xs text-slate-500 hover:text-slate-300"
        >
          Clear
        </button>
      </div>
      <div class="font-mono text-xs text-slate-300 space-y-1.5 h-36 overflow-y-auto">
        <div v-if="logs.length === 0" class="text-slate-600 italic">
          No events captured yet. Click one of the buttons above or interact with the inline embed to trigger actions.
        </div>
        <div v-for="(log, idx) in logs" :key="idx" class="text-emerald-400">
          {{ log }}
        </div>
      </div>
    </section>
  </main>
</template>
