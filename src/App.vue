<script setup lang="ts">
import { ref } from 'vue'
import { TreeManager } from './components'
import { INITIAL_DATA } from './data'
</script>

<template>
  <TreeManager :initial-data="INITIAL_DATA" />
</template>

<style>
body {
  background-color: antiquewhite;
}
</style>
