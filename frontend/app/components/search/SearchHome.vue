<template>
  <div class="search-page">
    <header class="search-page__header">
      <h1 class="search-page__title">Busca</h1>
      <p class="search-page__subtitle">
        Encontre tarefas, conversas, eventos, fluxos e pessoas em toda a plataforma.
      </p>
    </header>

    <div class="search-page__input-wrap glass-card">
      <svg width="18" height="18" viewBox="0 0 16 16" fill="none" class="search-page__icon">
        <circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.3" />
        <path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
      </svg>
      <input
        ref="inputRef"
        v-model="localQuery"
        type="search"
        class="search-page__input"
        placeholder="Buscar tarefas, conversas, eventos..."
        enterkeyhint="search"
        @keydown.enter="onSubmit"
      />
      <kbd v-if="!localQuery" class="search-page__kbd">⌘ K</kbd>
      <button
        v-else
        type="button"
        class="search-page__clear"
        aria-label="Limpar busca"
        @click="clearQuery"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <div class="search-page__filters">
      <button
        v-for="filter in filters"
        :key="filter.id"
        type="button"
        class="search-page__filter"
        :class="{ active: activeFilter === filter.id }"
        @click="activeFilter = filter.id"
      >
        {{ filter.label }}
        <span v-if="filter.count" class="search-page__filter-count">{{ filter.count }}</span>
      </button>
    </div>

    <div v-if="!localQuery" class="search-page__empty">
      <section v-if="recentSearches.length" class="search-section">
        <div class="search-section__head">
          <h2 class="search-section__title">Buscas recentes</h2>
          <button type="button" class="search-section__action" @click="clearRecentSearches">
            Limpar
          </button>
        </div>
        <div class="search-chips">
          <button
            v-for="term in recentSearches"
            :key="term"
            type="button"
            class="search-chip"
            @click="applySuggestion(term)"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1.5V7M7 7L10 4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.2" />
            </svg>
            {{ term }}
          </button>
        </div>
      </section>

      <section class="search-section">
        <h2 class="search-section__title">Sugestões</h2>
        <div class="search-chips">
          <button
            v-for="term in suggestions"
            :key="term"
            type="button"
            class="search-chip search-chip--suggestion"
            @click="applySuggestion(term)"
          >
            {{ term }}
          </button>
        </div>
      </section>
    </div>

    <div v-else-if="!filteredResults.length" class="search-page__no-results glass-card">
      <p>Nenhum resultado para <strong>{{ localQuery }}</strong></p>
      <span>Tente outro termo ou remova filtros.</span>
    </div>

    <div v-else class="search-page__results">
      <section
        v-for="group in groupedResults"
        :key="group.kind"
        class="search-section glass-card"
      >
        <h2 class="search-section__title">{{ searchKindLabels[group.kind] }}s</h2>
        <ul class="result-list">
          <li v-for="item in group.items" :key="item.id">
            <button type="button" class="result-item" @click="selectResult(item)">
              <span class="result-item__dot" :style="{ background: item.color }" />
              <div class="result-item__body">
                <p class="result-item__title">{{ item.title }}</p>
                <p v-if="item.subtitle" class="result-item__subtitle">{{ item.subtitle }}</p>
                <p v-if="item.meta" class="result-item__meta">{{ item.meta }}</p>
              </div>
              <span class="result-item__kind">{{ searchKindLabels[item.kind] }}</span>
            </button>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { searchKindLabels } from '~/types/search'

const inputRef = ref<HTMLInputElement | null>(null)
const localQuery = ref('')

const {
  query,
  activeFilter,
  recentSearches,
  filteredResults,
  groupedResults,
  filters,
  suggestions,
  setQuery,
  saveRecentSearch,
  loadRecentSearches,
  clearRecentSearches,
  selectResult,
} = useGlobalSearch()

let debounceTimer: ReturnType<typeof setTimeout> | undefined

watch(
  () => query.value,
  (value) => {
    localQuery.value = value
  },
  { immediate: true },
)

watch(localQuery, (value) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    setQuery(value)
  }, 200)
})

onMounted(() => {
  loadRecentSearches()
  nextTick(() => inputRef.value?.focus())
})

function onSubmit() {
  saveRecentSearch(localQuery.value)
}

function clearQuery() {
  localQuery.value = ''
  setQuery('')
  inputRef.value?.focus()
}

function applySuggestion(term: string) {
  localQuery.value = term
  setQuery(term)
  saveRecentSearch(term)
  inputRef.value?.focus()
}
</script>

<style scoped>
.search-page {
  flex: 1;
  min-width: 0;
  width: 100%;
  overflow-y: auto;
  padding: 28px 28px 32px;
}

.search-page__header {
  margin-bottom: 24px;
}

.search-page__title {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.03em;
  margin-bottom: 6px;
}

.search-page__subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.search-page__input-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  margin-bottom: 20px;
}

.search-page__icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-page__input {
  flex: 1;
  font-size: 15px;
  background: transparent;
}

.search-page__input::placeholder {
  color: var(--text-muted);
}

.search-page__kbd {
  font-size: 11px;
  color: var(--text-muted);
  background: var(--bg-elevated);
  padding: 3px 7px;
  border-radius: 6px;
  border: 1px solid var(--border-subtle);
  font-family: inherit;
  flex-shrink: 0;
}

.search-page__clear {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: var(--text-muted);
  flex-shrink: 0;
  transition: all var(--transition);
}

.search-page__clear:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.search-page__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.search-page__filter {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  border: 1px solid transparent;
  transition: all var(--transition);
}

.search-page__filter.active {
  color: var(--text-primary);
  background: var(--bg-elevated);
  border-color: var(--border-subtle);
}

.search-page__filter-count {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 999px;
  background: rgba(139, 92, 246, 0.15);
  color: var(--accent-to);
}

.search-page__empty {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.search-section {
  padding: 20px;
}

.search-section__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.search-section__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 14px;
}

.search-section__head .search-section__title {
  margin-bottom: 0;
}

.search-section__action {
  font-size: 12px;
  color: var(--text-muted);
  transition: color var(--transition);
}

.search-section__action:hover {
  color: var(--accent-to);
}

.search-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.search-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  color: var(--text-secondary);
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  transition: all var(--transition);
}

.search-chip:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
  border-color: var(--border-medium);
}

.search-chip--suggestion {
  color: var(--accent-to);
  background: rgba(139, 92, 246, 0.08);
  border-color: rgba(139, 92, 246, 0.2);
}

.search-page__no-results {
  padding: 40px 24px;
  text-align: center;
  color: var(--text-secondary);
}

.search-page__no-results p {
  font-size: 15px;
  margin-bottom: 6px;
}

.search-page__no-results span {
  font-size: 13px;
  color: var(--text-muted);
}

.search-page__results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.result-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  text-align: left;
  transition: background var(--transition);
}

.result-item:hover {
  background: var(--bg-hover);
}

.result-item__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.result-item__body {
  flex: 1;
  min-width: 0;
}

.result-item__title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 3px;
}

.result-item__subtitle {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.result-item__meta {
  font-size: 11px;
  color: var(--text-muted);
}

.result-item__kind {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  padding: 4px 8px;
  border-radius: 6px;
  background: var(--bg-elevated);
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .search-page {
    padding: 20px 20px 16px;
  }
}
</style>

<style>
.glass-card {
  background: var(--glass-card);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
}
</style>
