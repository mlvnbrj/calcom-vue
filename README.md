# calcom-vue

A lightweight, type-safe Vue 3 and Nuxt 3 plugin for seamless Cal.com scheduling popup modals and inline embeds.

---

## Features

* **Vue 3 & Nuxt 3 Ready**: Full SSR-safe client initialization out of the box with `getSSRProps()`.
* **Multiple Integration Styles**: Declarative `v-cal` directive, pre-built `<CalButton />` for modals, `<CalEmbed />` (or `<Cal />`) for inline calendar layouts, and programmatic `useCal()` composable.
* **Inline & Modal Embeds**: Full support for both Cal.com popup modals and inline calendar containers.
* **Modern Theming**: Supports `cssVarsPerTheme` for custom light/dark brand colors, `theme`, and custom layouts.
* **Self-Hosting Support**: Configurable `origin` and `embedJsUrl` for self-hosted Cal instances.
* **Lazy Loaded & Idempotent**: Injects Cal.com's loader script only when needed on the client, preserving namespace isolation and avoiding settings overwrite.
* **Fully Typed**: Written in TypeScript with complete type definitions (`.d.ts`).

---

## Installation

```bash
# npm
npm install calcom-vue

# pnpm
pnpm add calcom-vue

# yarn
yarn add calcom-vue

# bun
bun add calcom-vue
```

---

## Setup

### 1. Nuxt 3

Create a client-only plugin at `plugins/cal.client.ts`:

```ts
// plugins/cal.client.ts
import { defineNuxtPlugin } from '#app';
import { createCal } from 'calcom-vue';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(
    createCal({
      origin: 'https://app.cal.com',
      namespace: 'my-team',
      theme: 'auto',
      layout: 'month_view',
      cssVarsPerTheme: {
        light: { 'cal-brand': '#2563eb' },
        dark: { 'cal-brand': '#3b82f6' }
      }
    })
  );
});
```

### 2. Vue 3 (Vite / SPA)

Register the plugin in your entry file (`main.ts` or `main.js`):

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import { createCal } from 'calcom-vue';

const app = createApp(App);

app.use(
  createCal({
    theme: 'auto',
    layout: 'month_view',
    forwardQueryParams: true
  })
);

app.mount('#app');
```

---

## Usage

### 1. Inline Embed (`<CalEmbed />` / `<Cal />`)

Render the interactive Cal.com scheduler directly inside your page layout:

```vue
<script setup lang="ts">
import { CalEmbed } from 'calcom-vue';
</script>

<template>
  <div class="calendar-wrapper">
    <!-- Using <CalEmbed /> or alias <Cal /> -->
    <CalEmbed
      calLink="john-doe/30min"
      :config="{ layout: 'month_view', theme: 'light' }"
      style="width: 100%; height: 650px; overflow: scroll;"
    />
  </div>
</template>
```

#### `<CalEmbed />` Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `calLink` | `string` | **Required** | The Cal.com link (e.g., `username/event-slug`). |
| `namespace` | `string` | `undefined` | Optional Cal namespace for multi-calendar pages. |
| `config` | `Record<string, any>` | `{}` | Optional embed config (prefill inputs, layout, theme). |

---

### 2. Directive (`v-cal`)

Add `v-cal` to any native button, link, or clickable element to trigger the booking popup modal.

```vue
<script setup lang="ts">
import { ref } from 'vue';

const activeLink = ref('john-doe/30min');
</script>

<template>
  <!-- Simple string (reactive) -->
  <button v-cal="activeLink">
    Book a Call
  </button>

  <!-- Object with custom configuration -->
  <button 
    v-cal="{
      link: 'john-doe/discovery',
      namespace: 'sales',
      config: {
        theme: 'dark',
        layout: 'week_view',
        name: 'Jane Doe',
        email: 'jane@example.com'
      }
    }"
  >
    Book Discovery Call
  </button>

  <!-- Using Cal.com data attributes fallback -->
  <button v-cal data-cal-link="john-doe/quick-chat" data-cal-namespace="support">
    Quick Chat
  </button>
</template>
```

---

### 3. Modal Button (`<CalButton />`)

A pre-built component for opening booking popups:

```vue
<script setup lang="ts">
import { CalButton } from 'calcom-vue';
</script>

<template>
  <!-- Basic usage -->
  <CalButton calLink="john-doe/30min">
    Schedule 30-min Call
  </CalButton>

  <!-- Custom tag and configuration -->
  <CalButton 
    tag="a"
    calLink="john-doe/strategy" 
    namespace="custom-namespace"
    :config="{
      theme: 'light',
      notes: 'Strategy Session'
    }"
    class="custom-btn"
  >
    Book Strategy Session
  </CalButton>
</template>
```

---

### 4. Programmatic Composable (`useCal`)

Use `useCal` for custom workflows, modals, inline mounting, asset preloading, and event tracking:

```vue
<script setup lang="ts">
import { onMounted } from 'vue';
import { useCal } from 'calcom-vue';

// Optionally specify default namespace: useCal('my-namespace')
const { openModal, preload, on, off, setUI, getApi } = useCal();

function openBooking() {
  openModal({
    calLink: 'john-doe/30min',
    config: {
      theme: 'dark',
      layout: 'month_view',
      name: 'Client Name',
      email: 'client@example.com'
    }
  });
}

function handleHover() {
  preload({ calLink: 'john-doe/30min' });
}

onMounted(() => {
  // Listen for Cal.com events (e.g. conversion tracking)
  // Passing autoCleanup = true unsubscribes on scope disposal
  on(
    {
      action: 'bookingSuccessful',
      callback: (event) => {
        console.log('Meeting confirmed:', event.detail);
      }
    },
    true
  );
});
</script>

<template>
  <button @mouseenter="handleHover" @click="openBooking">
    Book via Composable
  </button>
</template>
```

#### `useCal()` Methods

* **`openModal({ calLink, namespace?, config? })`**: Opens the booking modal popup.
* **`inline({ elementOrSelector, calLink, namespace?, config? })`**: Mounts an inline calendar into an element or CSS selector.
* **`preload({ calLink, namespace? })`**: Preloads calendar assets for snappy responsiveness.
* **`on({ action, namespace?, callback }, autoCleanup?)`**: Subscribes to events (`bookingSuccessful`, `linkReady`, etc.).
* **`off({ action, namespace?, callback? })`**: Unsubscribes from events.
* **`setUI(uiOptions, namespace?)`**: Dynamically adjusts UI options for a namespace.
* **`getApi(namespace?)`**: Returns a Promise resolving to the raw `Cal` API queue function.

---

## Configuration Reference

### `createCal(options)` Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `origin` | `string` | `'https://app.cal.com'` | Cal origin URL (override for self-hosted instances). |
| `embedJsUrl` | `string` | `'{origin}/embed/embed.js'` | Direct URL to `embed.js` script. |
| `namespace` | `string` | `undefined` | Default global namespace. |
| `forwardQueryParams` | `boolean` | `true` | Forward current URL query parameters to the Cal iframe. |
| `cssVarsPerTheme` | `CalCssVarsPerTheme` | `undefined` | Brand colors per theme (e.g. `{ light: { 'cal-brand': '#2563eb' } }`). |
| `theme` | `'light' \| 'dark' \| 'auto'` | `undefined` | Default theme setting. |
| `layout` | `'month_view' \| 'week_view' \| 'column_view'` | `'month_view'` | Calendar layout style. |
| `hideEventTypeDetails`| `boolean` | `false` | Hide event header details in the modal. |
| `useSlotsViewOnSmallScreen` | `boolean \| string` | `undefined` | Responsive slots view for mobile viewports. |

---

## Self-Hosted Cal.com Instances

For self-hosted instances, specify `origin` (and optionally `embedJsUrl`):

```ts
app.use(
  createCal({
    origin: 'https://cal.yourdomain.com',
    embedJsUrl: 'https://cal.yourdomain.com/embed/embed.js'
  })
);
```

---

## License

[MIT](https://github.com/mlvnbrj/calcom-vue/blob/main/LICENSE) © [Melvin Morato Borja](https://github.com/mlvnbrj)
