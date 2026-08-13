<script setup lang="ts">
import { computed } from 'vue'
import { useSchools, useSchoolSelection } from '@/entities/school'

const { schools } = useSchools()
const { selectedSchoolId, clearSelection } = useSchoolSelection()

const school = computed(() => schools.value.find((s) => s.id === selectedSchoolId.value) ?? null)
</script>

<template>
  <aside class="detail-panel" :class="{ 'detail-panel--open': !!school }">
    <template v-if="school">
      <div class="detail-panel__header">
        <h2>{{ school.name }}</h2>
        <button type="button" class="detail-panel__close" aria-label="Close" @click="clearSelection">&times;</button>
      </div>

      <dl class="detail-panel__list">
        <div class="detail-panel__row">
          <dt>NPSN</dt>
          <dd>{{ school.npsn }}</dd>
        </div>
        <div class="detail-panel__row">
          <dt>Stage</dt>
          <dd>{{ school.stage }}</dd>
        </div>
        <div class="detail-panel__row">
          <dt>Status</dt>
          <dd>{{ school.status }}</dd>
        </div>
        <div class="detail-panel__row">
          <dt>Province</dt>
          <dd>{{ school.province.name }}</dd>
        </div>
        <div class="detail-panel__row">
          <dt>City/Regency</dt>
          <dd>{{ school.city.name }}</dd>
        </div>
        <div class="detail-panel__row">
          <dt>District</dt>
          <dd>{{ school.district.name }}</dd>
        </div>
        <div class="detail-panel__row">
          <dt>Address</dt>
          <dd>{{ school.street }}</dd>
        </div>
        <div class="detail-panel__row">
          <dt>Coordinates</dt>
          <dd>{{ school.lat.toFixed(6) }}, {{ school.long.toFixed(6) }}</dd>
        </div>
      </dl>
    </template>

    <p v-else class="detail-panel__placeholder">Click a school marker, or search above, to see its details here.</p>
  </aside>
</template>

<style scoped>
.detail-panel {
  width: 320px;
  flex-shrink: 0;
  background: white;
  border-left: 1px solid #e2e8f0;
  padding: 1rem;
  overflow-y: auto;
  box-sizing: border-box;
}

.detail-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.detail-panel__header h2 {
  font-size: 1.05rem;
  margin: 0;
  color: #0f172a;
}

.detail-panel__close {
  border: none;
  background: transparent;
  font-size: 1.3rem;
  line-height: 1;
  cursor: pointer;
  color: #64748b;
}

.detail-panel__list {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.detail-panel__row dt {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #94a3b8;
  margin-bottom: 0.1rem;
}

.detail-panel__row dd {
  margin: 0;
  font-size: 0.9rem;
  color: #1e293b;
}

.detail-panel__placeholder {
  font-size: 0.85rem;
  color: #94a3b8;
}

@media (max-width: 768px) {
  .detail-panel {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: auto;
    max-height: 45vh;
    border-left: none;
    border-top: 1px solid #e2e8f0;
    border-radius: 0.75rem 0.75rem 0 0;
    box-shadow: 0 -6px 20px rgba(15, 23, 42, 0.15);
    transform: translateY(100%);
    transition: transform 0.2s ease;
    z-index: 15;
  }

  .detail-panel--open {
    transform: translateY(0);
  }

  .detail-panel__placeholder {
    display: none;
  }
}
</style>
