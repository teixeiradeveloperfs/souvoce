<template>
  <label class="auth-field">
    <span class="auth-field__label">{{ label }}</span>
    <div class="auth-field__wrap" :class="{ 'auth-field__wrap--error': error }">
      <span v-if="icon" class="auth-field__icon" aria-hidden="true">
        <svg v-if="icon === 'email'" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="3.5" width="12" height="9" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
          <path d="M2 5L8 9L14 5" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
        </svg>
        <svg v-else-if="icon === 'user'" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" stroke-width="1.3"/>
          <path d="M3.5 13.5C4.2 10.8 5.8 9.5 8 9.5C10.2 9.5 11.8 10.8 12.5 13.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
          <path d="M5 7V5C5 3.3 6.3 2 8 2C9.7 2 11 3.3 11 5V7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
      </span>
      <input
        :value="modelValue"
        :type="inputType"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        class="auth-field__input"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <button
        v-if="type === 'password'"
        type="button"
        class="auth-field__toggle"
        :aria-label="visible ? 'Ocultar senha' : 'Mostrar senha'"
        @click="visible = !visible"
      >
        <svg v-if="visible" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 8C3.5 5 5.5 3.5 8 3.5C10.5 3.5 12.5 5 14 8C12.5 11 10.5 12.5 8 12.5C5.5 12.5 3.5 11 2 8Z" stroke="currentColor" stroke-width="1.3"/>
          <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.3"/>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 2L14 14" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          <path d="M6.5 6.8C6.2 7.2 6 7.6 6 8C6 9.1 6.9 10 8 10C8.4 10 8.8 9.8 9.2 9.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          <path d="M3.5 5.2C4.8 4.1 6.3 3.5 8 3.5C11 3.5 13.2 5.6 14.5 8C13.8 9.3 12.8 10.4 11.6 11.2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    <span v-if="error" class="auth-field__error">{{ error }}</span>
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
  modelValue: string
  type?: string
  placeholder?: string
  autocomplete?: string
  error?: string
  icon?: 'email' | 'user' | 'password'
}>()

defineEmits<{ 'update:modelValue': [value: string] }>()

const visible = ref(false)

const inputType = computed(() => {
  if (props.type !== 'password') return props.type || 'text'
  return visible.value ? 'text' : 'password'
})
</script>

<style scoped>
.auth-field {
  display: block;
  margin-bottom: 18px;
}

.auth-field__label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.auth-field__wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  transition: border-color var(--transition), box-shadow var(--transition);
}

.auth-field__wrap:focus-within {
  border-color: rgba(139, 92, 246, 0.45);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.12);
}

.auth-field__wrap--error {
  border-color: rgba(239, 68, 68, 0.5);
}

.auth-field__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  flex-shrink: 0;
}

.auth-field__wrap:focus-within .auth-field__icon {
  color: var(--accent-to);
}

.auth-field__input {
  flex: 1;
  min-width: 0;
  font-size: 14px;
}

.auth-field__input::placeholder {
  color: var(--text-muted);
}

.auth-field__toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  flex-shrink: 0;
  padding: 2px;
  border-radius: 6px;
  transition: color var(--transition), background var(--transition);
}

.auth-field__toggle:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.auth-field__error {
  display: block;
  margin-top: 6px;
  font-size: 11px;
  color: #f87171;
}
</style>
