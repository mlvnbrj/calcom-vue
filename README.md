# calcom-vue

A lightweight, type-safe Vue 3 and Nuxt 3 plugin for seamless Cal.com scheduling popup modals and embeds.

---

## Features

* **Vue 3 & Nuxt 3 Ready**: Full SSR-safe client initialization out of the box.
* **Multiple Integration Styles**: Use the declarative `v-cal` directive, the `<CalButton/>` component, or the programmatic `useCal()` composable.
* **Self-Hosting Support**: Configurable origin for self-hosted Cal instances.
* **Lazy Loaded**: Dynamically injects Cal.com's embed script only when needed on the client.
* **Fully Typed**: Written in TypeScript with complete type definitions.

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
import { createCal } from 'calcom-vue';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(
    createCal({
      // Optional default options
      theme: 'auto',
      layout: 'month_view',
      styles: {
        branding: {
          brandColor: '#2563eb'
        }
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
    layout: 'month_view'
  })
);

app.mount('#app');

```

---

## Usage

### Option 1: Directive (`v-cal`)

Add the `v-cal` directive to any clickable element. Pass either your link string or an object with configuration options.

```vue
<template>
  <!-- Simple string (username/event-slug) -->
  <button v-cal="'john-doe/30min'">
    Book a Call
  </button>

  <!-- Object with custom configuration -->
  <button 
    v-cal="{
      link: 'john-doe/discovery',
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
</template>

```

---

### Option 2: Component (`<CalButton/>`)

The component renders a button that triggers the Cal.com modal on click.

```vue
<template>
  <!-- Basic usage -->
  <CalButton calLink="john-doe/30min">
    Schedule 30-min Call
  </CalButton>

  <!-- Custom tag and configuration -->
  <CalButton 
    tag="a"
    calLink="john-doe/strategy" 
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

#### `<CalButton/>` Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `calLink` | `string` | **Required** | The Cal.com link (e.g., `username/event-slug`). |
| `config` | `Record<string, any>` | `{}` | Optional modal config (layout, theme, prefill inputs). |
| `tag` | `string` | `'button'` | The HTML tag to render. |

---

### Option 3: Composable (`useCal`)

Use the composable for programmatic triggers, dynamic logic, and booking lifecycle callbacks.

```vue
<script setup lang="ts">
import { onMounted } from 'vue';
import { useCal } from 'calcom-vue';

const { openModal, on } = useCal();

function handleCustomClick() {
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

onMounted(() => {
  // Listen for Cal.com events (e.g. analytics or conversion tracking)
  on({
    action: 'bookingSuccessful',
    callback: (event) => {
      console.log('Meeting confirmed:', event.detail.data);
    }
  });
});
</script>

<template>
  <button @click="handleCustomClick">
    Book via Composable
  </button>
</template>

```

---

## Configuration Reference

### `createCal(options)` Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `origin` | `string` | `'[https://app.cal.com](https://app.cal.com)'` | Cal origin URL (override for self-hosted instances). |
| `theme` | `'light' | 'dark' | 'auto'` | `undefined` | Theme setting for the embed popup. |
| `layout` | `'month_view' | 'week_view' | 'column_view'` | `undefined` | Calendar layout type. |
| `styles` | `Record<string, any>` | `undefined` | Custom branding styles, such as `{ branding: { brandColor: '#000000' } }`. |
| `hideEventTypeDetails` | `boolean` | `false` | Hide event header details in the modal. |

---

## Self-Hosted Cal.com Instances

To point to your self-hosted instance, update the `origin` setting during initialization:

```ts
app.use(createCal({
  origin: 'https://cal.yourdomain.com'
}));

```

---

## Publishing Checklist (For Maintainers)

1. Ensure the package name in `package.json` matches `"calcom-vue"`.
2. Build the distribution assets:
```bash
npm run build

```


3. Publish to npm under public scope:
```bash
npm publish --access public

```



---

## License

[MIT](https://github.com/mlvnbrj/calcom-vue/blob/main/LICENSE) © [Melvin Morato Borja](https://github.com/mlvnbrj)