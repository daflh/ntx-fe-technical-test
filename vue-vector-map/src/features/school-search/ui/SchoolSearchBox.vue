<script setup lang="ts">
import { useSchoolSearch } from '../model/useSchoolSearch'

const { query, results, hasQuery, pickResult } = useSchoolSearch()
</script>

<template>
  <div class="school-search">
    <input
      v-model="query"
      type="search"
      class="school-search__input"
      placeholder="Search school name or NPSN..."
      aria-label="Search school"
    />

    <ul v-if="hasQuery" class="school-search__results">
      <li v-if="results.length === 0" class="school-search__empty">No matching schools.</li>
      <li v-for="school in results" :key="school.id">
        <button type="button" class="school-search__result" @click="pickResult(school.id)">
          <span class="school-search__result-name">{{ school.name }}</span>
          <span class="school-search__result-meta">{{ school.city.name }} &middot; {{ school.stage }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.school-search {
  position: relative;
  width: 100%;
}

.school-search__input {
  width: 100%;
  padding: 0.55rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.school-search__results {
  position: absolute;
  z-index: 20;
  top: calc(100% + 0.35rem);
  left: 0;
  right: 0;
  max-height: 16rem;
  overflow-y: auto;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
  list-style: none;
  margin: 0;
  padding: 0.25rem;
}

.school-search__empty {
  padding: 0.5rem 0.6rem;
  font-size: 0.85rem;
  color: #64748b;
}

.school-search__result {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.1rem;
  padding: 0.5rem 0.6rem;
  border: none;
  background: transparent;
  border-radius: 0.375rem;
  cursor: pointer;
  text-align: left;
}

.school-search__result:hover {
  background: #f1f5f9;
}

.school-search__result-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: #0f172a;
}

.school-search__result-meta {
  font-size: 0.78rem;
  color: #64748b;
}
</style>
