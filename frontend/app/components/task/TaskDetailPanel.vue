<template>
  <aside v-if="task" class="detail-panel glass">
    <div class="detail-panel__header">
      <div class="detail-panel__category">
        {{ task.labels[0]?.name?.toUpperCase() ?? 'TAREFA' }}
      </div>
      <button class="close-btn" aria-label="Fechar" @click="emit('close')">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <h2 class="detail-panel__title">{{ task.title }}</h2>

    <div class="detail-panel__meta-grid">
      <div class="meta-block">
        <span class="meta-block__label">Responsáveis</span>
        <div class="meta-block__value">
          <UiAvatarStack :users="task.assignees" :max="4" />
        </div>
      </div>
      <div class="meta-block">
        <span class="meta-block__label">Prazo</span>
        <span class="meta-block__value">{{ task.dueDate }}</span>
      </div>
      <div class="meta-block">
        <span class="meta-block__label">Prioridade</span>
        <span class="meta-block__value">
          <UiPriorityBadge :priority="task.priority" />
        </span>
      </div>
    </div>

    <div class="detail-panel__progress">
      <div class="progress-header">
        <span>{{ completedSubtasks }}/{{ task.subtasks.length }} tarefas</span>
        <span>{{ task.progress }}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-bar__fill" :style="{ width: `${task.progress}%` }" />
      </div>
    </div>

    <div class="detail-panel__scroll">
      <section class="section">
        <h3 class="section__title">Descrição</h3>
        <p class="section__text">{{ task.description }}</p>
      </section>

      <section v-if="task.subtasks.length" class="section">
        <h3 class="section__title">Subtarefas</h3>
        <ul class="subtask-list">
          <li v-for="sub in task.subtasks" :key="sub.id" class="subtask">
            <button class="subtask__check" :class="{ done: sub.completed }">
              <svg v-if="sub.completed" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <span :class="{ 'subtask__done': sub.completed }">{{ sub.title }}</span>
          </li>
        </ul>
      </section>

      <section v-if="task.attachments.length" class="section">
        <h3 class="section__title">Anexos</h3>
        <div class="attachments">
          <div v-for="file in task.attachments" :key="file.id" class="attachment">
            <div class="attachment__icon" :class="`attachment__icon--${file.type}`">
              <svg v-if="file.type === 'figma'" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="12" height="12" rx="3" fill="#A259FF" />
                <path d="M8 2V14M5 6H11M5 10H11" stroke="white" stroke-width="1" />
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 2H10L13 5V14H4V2Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" />
              </svg>
            </div>
            <div class="attachment__info">
              <span class="attachment__name">{{ file.name }}</span>
              <span class="attachment__size">{{ file.size }}</span>
            </div>
          </div>
        </div>
      </section>

      <section v-if="task.activity.length" class="section">
        <h3 class="section__title">Atividade</h3>
        <div class="timeline">
          <div v-for="item in task.activity" :key="item.id" class="timeline__item">
            <div class="timeline__avatar" :style="{ backgroundColor: item.user.color }">
              {{ item.user.avatar }}
            </div>
            <div class="timeline__content">
              <div class="timeline__header">
                <span class="timeline__user">{{ item.user.name }}</span>
                <span class="timeline__action">{{ item.action }}</span>
                <span class="timeline__time">{{ item.timestamp }}</span>
              </div>

              <p v-if="item.detail && item.type === 'comment'" class="timeline__comment">
                {{ item.detail }}
              </p>

              <div v-if="item.type === 'attachment' && item.attachment" class="timeline__attachment">
                <div class="attachment attachment--inline">
                  <div class="attachment__icon attachment__icon--figma">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <rect x="2" y="2" width="12" height="12" rx="3" fill="#A259FF" />
                    </svg>
                  </div>
                  <span class="attachment__name">{{ item.attachment.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="detail-panel__comment">
      <input type="text" placeholder="Comentar..." />
      <span class="comment-hint">/</span>
      <button class="send-btn" aria-label="Enviar">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8L13 3L8 13L7 9L3 8Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { Task } from '~/types/project'

const props = defineProps<{
  task: Task | null
}>()

const emit = defineEmits<{
  close: []
}>()

const completedSubtasks = computed(() =>
  props.task?.subtasks.filter(s => s.completed).length ?? 0,
)
</script>

<style scoped>
.detail-panel {
  width: var(--panel-width);
  height: 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border-subtle);
  flex-shrink: 0;
}

.detail-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 0;
}

.detail-panel__category {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--accent-to);
}

.close-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: var(--text-muted);
  transition: all var(--transition);
}

.close-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.detail-panel__title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
  padding: 12px 20px 20px;
  line-height: 1.35;
}

.detail-panel__meta-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 0 20px 20px;
  border-bottom: 1px solid var(--border-subtle);
}

.meta-block__label {
  display: block;
  font-size: 10px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
}

.meta-block__value {
  font-size: 13px;
  font-weight: 500;
}

.detail-panel__progress {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-subtle);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.progress-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-from), var(--accent-to));
  border-radius: 999px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.detail-panel__scroll {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.section {
  margin-bottom: 24px;
}

.section__title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.section__text {
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.subtask-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.subtask {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.subtask__check {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 1.5px solid var(--border-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--transition);
}

.subtask__check.done {
  background: var(--accent-from);
  border-color: var(--accent-from);
}

.subtask__done {
  text-decoration: line-through;
  color: var(--text-muted);
}

.attachments {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attachment {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  transition: border-color var(--transition);
  cursor: pointer;
}

.attachment:hover {
  border-color: var(--border-medium);
}

.attachment--inline {
  padding: 8px 10px;
}

.attachment__icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-surface);
  flex-shrink: 0;
}

.attachment__icon--figma {
  background: rgba(162, 89, 255, 0.15);
}

.attachment__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.attachment__name {
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.attachment__size {
  font-size: 10px;
  color: var(--text-muted);
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.timeline__item {
  display: flex;
  gap: 10px;
}

.timeline__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.timeline__content {
  flex: 1;
  min-width: 0;
}

.timeline__header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 6px;
}

.timeline__user {
  font-size: 12px;
  font-weight: 600;
}

.timeline__action {
  font-size: 12px;
  color: var(--text-muted);
}

.timeline__time {
  font-size: 11px;
  color: var(--text-muted);
  margin-left: auto;
}

.timeline__comment {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-secondary);
  padding: 10px 12px;
  background: var(--bg-elevated);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
}

.timeline__attachment {
  margin-top: 6px;
}

.detail-panel__comment {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--border-subtle);
  background: rgba(6, 11, 26, 0.6);
}

.detail-panel__comment input {
  flex: 1;
  font-size: 13px;
  padding: 8px 0;
}

.detail-panel__comment input::placeholder {
  color: var(--text-muted);
}

.comment-hint {
  font-size: 12px;
  color: var(--text-muted);
  background: var(--bg-surface);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid var(--border-subtle);
}

.send-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: var(--text-muted);
  transition: all var(--transition);
}

.send-btn:hover {
  background: var(--bg-hover);
  color: var(--accent-to);
}

@media (max-width: 768px) {
  .detail-panel {
    border-left: none;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }

  .detail-panel__meta-grid {
    grid-template-columns: 1fr 1fr;
  }

  .detail-panel__meta-grid .meta-block:last-child {
    grid-column: span 2;
  }
}
</style>
