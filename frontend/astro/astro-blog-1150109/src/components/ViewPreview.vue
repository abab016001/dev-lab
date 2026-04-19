<script setup>
  import { useStore } from '@nanostores/vue';
  import { $sharedText } from '../textStore';

  const text = useStore($sharedText);
</script>

<template>
  <div class="p-4 border-2 border-green-500">
    <h3>Vue 元件</h3>
    <p>即時預覽：{{ text }}</p>
  </div>
</template>