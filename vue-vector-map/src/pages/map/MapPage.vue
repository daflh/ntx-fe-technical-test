<script setup lang="ts">
import { MapView } from '@/widgets/map-view'
import { SchoolDetailPanel } from '@/widgets/school-detail-panel'
import SchoolSearchBox from '@/features/school-search/ui/SchoolSearchBox.vue'
</script>

<template>
  <div class="map-page">
    <div class="map-page__body">
      <div class="map-page__search">
        <SchoolSearchBox />
      </div>
      <MapView class="map-page__map" />
      <SchoolDetailPanel />
    </div>
  </div>
</template>

<style scoped>
.map-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.map-page__body {
  position: relative;
  flex: 1;
  display: flex;
  min-height: 0;
}

.map-page__map {
  flex: 1;
  min-width: 0;
}

.map-page__search {
  position: absolute;
  z-index: 15;
  top: 1rem;
  left: 1rem;
  width: min(320px, calc(100% - 2rem));
}

@media (max-width: 768px) {
  .map-page__search {
    right: 1rem;
    width: auto;
  }
}
</style>
