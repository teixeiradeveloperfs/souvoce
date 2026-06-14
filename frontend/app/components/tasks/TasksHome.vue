<template>
  <div class="tasks-workspace">
    <section class="tasks-board">
      <header class="tasks-board__header">
        <div class="tasks-board__title-area">
          <div class="tasks-board__heading">
            <p class="tasks-board__org">
              <span class="tasks-board__org-dot" :style="{ background: activeOrganization.color }" />
              {{ activeOrganization.label }}
            </p>
            <h1 class="tasks-board__title">{{ activeProject.label }}</h1>
          </div>
          <TasksViewSwitcher v-model="activeView" />
        </div>
      </header>

      <div class="tasks-board__body">
        <TasksListView
          v-if="activeView === 'list'"
          :tasks="tasks"
          :selected-task-id="selectedTaskId"
          :get-column-title="getColumnTitle"
          :get-column-color="getColumnColor"
          @select="selectTask"
        />

        <KanbanBoard
          v-else-if="activeView === 'kanban'"
          :columns="columns"
          :selected-task-id="selectedTaskId"
          :get-tasks-by-column="getTasksByColumn"
          @select="selectTask"
        />

        <TasksTimelineView
          v-else-if="activeView === 'timeline'"
          :tasks="tasks"
          :selected-task-id="selectedTaskId"
          :get-column-title="getColumnTitle"
          :get-column-color="getColumnColor"
          @select="selectTask"
        />

        <TasksGanttView
          v-else
          :tasks="tasks"
          :selected-task-id="selectedTaskId"
          :get-column-color="getColumnColor"
          @select="selectTask"
        />
      </div>
    </section>

    <Transition name="panel">
      <TaskDetailPanel
        v-if="selectedTask"
        :task="selectedTask"
        class="tasks-workspace__panel"
        @close="selectedTaskId = ''"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
const {
  tasks,
  columns,
  selectedTaskId,
  selectedTask,
  selectTask,
  getTasksByColumn,
  getColumnTitle,
  getColumnColor,
  activeView,
} = useProjectData()
const { activeOrganization, activeProject } = useOrganization()
</script>

<style scoped>
.tasks-workspace {
  display: flex;
  flex: 1;
  min-width: 0;
  min-height: 0;
  width: 100%;
  overflow: hidden;
}

.tasks-board {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 0;
}

.tasks-board__header {
  padding: 20px 24px 16px;
  flex-shrink: 0;
}

.tasks-board__title-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.tasks-board__heading {
  min-width: 0;
}

.tasks-board__org {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.tasks-board__org-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.tasks-board__title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.tasks-board__body {
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.tasks-workspace__panel {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .tasks-board__header {
    padding: 12px 16px 10px;
  }

  .tasks-board__title {
    font-size: 17px;
  }

  .tasks-board__title-area {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .tasks-workspace__panel {
    position: fixed;
    inset: 0;
    z-index: 90;
    width: 100%;
  }
}
</style>
