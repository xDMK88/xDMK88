<template>
  <div
    class="group task-node flex-col items-center w-full bg-white p-2 rounded-lg dark:bg-gray-900 dark:border-gray-700 border border-gray-300 my-0.5 relative"
    :style="{ backgroundColor: backgroundColor }"
    :class="{
      'bg-gray-200 dark:bg-gray-800':
        isTaskComplete &&
        task.uid_marker == '00000000-0000-0000-0000-000000000000'
    }"
    @click="onClick"
  >
    <div class="flex">
      <div class="flex items-center">
        <div
          class="border-2 relative border-gray-300 rounded-md mr-1 flex items-center justify-center mt-0.5"
          style="min-width: 20px; min-height: 20px"
        >
          <Icon
            v-if="statuses[task.status]"
            :path="statuses[task.status].path"
            :class="statusColor"
            :style="{ color: forecolor }"
            :box="statuses[task.status].viewBox"
            :width="statuses[task.status].width"
            :height="statuses[task.status].height"
          />
          <Icon
            v-if="task.SeriesType !== 0"
            :path="repeat.path"
            class="text-blue-500 bg-white absolute -bottom-1.5 -right-1.5 p-0.5 rounded-full"
            :box="repeat.viewBox"
            :width="repeat.width"
            :height="repeat.height"
          />
        </div>
        <div
          class="taskName p-0.5 ring-0 outline-none max-w-7xl"
          :no-nl="true"
          :no-html="true"
          :class="{
            uppercase: uppercase,
            'text-gray-500': isTaskComplete,
            'line-through': isTaskComplete,
            'font-extrabold': task.readed == 0
          }"
          :style="{ color: forecolor }"
        >
          {{ task.name }}
        </div>
      </div>
    </div>

    <!-- Tags, Overdue, Customer, Performer -->
    <div
      v-if="
        task.uid_customer !== '00000000-0000-0000-0000-000000000000' ||
          task.email_performer ||
          task.is_overdue ||
          task.tags ||
          task.uid_project !== '00000000-0000-0000-0000-000000000000' ||
          task.term_customer ||
          task.checklist ||
          task.has_files ||
          task.has_msgs ||
          task.comment ||
          task.focus
      "
      class="flex items-center mt-1.5"
    >
      <!-- Customer -->
      <TaskListTagLabel
        v-if="task.type !== 1 && task.type !== 2"
        :text="customerName"
        :color-bg-class="{
          'bg-red-500': task.type === 3,
          'bg-gray-400': task.type !== 3,
          'bg-opacity-50': isTaskComplete
        }"
      />
      <!-- Performer -->
      <TaskListTagLabel
        v-if="task.type === 2 || task.type === 4"
        :text="performerName"
        :icon-width="
          task.performerreaded ? performerRead.width : performerNotRead.width
        "
        :icon-height="
          task.performerreaded ? performerRead.height : performerNotRead.height
        "
        :icon-box="
          task.performerreaded
            ? performerRead.viewBox
            : performerNotRead.viewBox
        "
        :icon-path="
          task.performerreaded ? performerRead.path : performerNotRead.path
        "
        :color-bg-class="{
          'bg-gray-400': task.type === 4,
          'bg-green-500': task.type === 2,
          'bg-opacity-50': isTaskComplete
        }"
      />
      <!-- Overdue -->
      <TaskListTagLabel
        v-if="task.is_overdue"
        text="Просрочено"
        color-text-class="text-red-600"
        color-bg-class="bg-red-300 opacity-70"
      />
      <!-- Tags -->
      <template
        v-for="(tag, index) in task.tags"
        :key="index"
      >
        <TaskListTagLabel
          :icon-path="tagIcon.path"
          :icon-box="tagIcon.viewBox"
          :text="tags[tag]?.name ?? '???'"
          :color-bg-style="{ backgroundColor: tags[tag]?.back_color ?? '' }"
        />
      </template>
      <!-- Project -->
      <TaskListTagLabel
        v-if="task.uid_project != '00000000-0000-0000-0000-000000000000'"
        :icon-path="project.path"
        :icon-box="project.viewBox"
        :text="projects[task.uid_project]?.name ?? '???'"
        :color-bg-class="{
          'bg-yellow-400': true,
          'bg-opacity-50': isTaskComplete
        }"
      />
      <!-- Data -->
      <TaskListIconLabel
        v-if="task.term_user"
        :icon-path="clock.path"
        :icon-box="clock.viewBox"
        :text="task.term_user"
      />
      <TaskListIconLabel
        v-if="task.type !== 1 && task.type !== 2 && task.term_customer"
        :icon-path="clock.path"
        :icon-box="clock.viewBox"
        :text="task.term_customer"
        icon-class="text-red-600"
      />
      <!-- Checklist -->
      <TaskListIconLabel
        v-if="task.checklist"
        :icon-path="checklist.path"
        :icon-box="checklist.viewBox"
        :text="checkBoxText"
      />
      <!-- Access -->
      <TaskListIconLabel
        v-if="task.emails"
        :icon-path="inaccess.path"
        :icon-box="inaccess.viewBox"
        icon-width="14"
        icon-height="14"
      />
      <!-- Files -->
      <TaskListIconLabel
        v-if="task.has_files"
        :icon-path="file.path"
        :icon-box="file.viewBox"
      />
      <!-- Messages -->
      <TaskListIconLabel
        v-if="task.has_msgs"
        :icon-path="msgs.path"
        :icon-box="msgs.viewBox"
      />
      <!-- Comment -->
      <TaskListIconLabel
        v-if="task.comment.replace(/\r?\n|\r/g, '')"
        :icon-path="taskcomment.path"
        :icon-box="taskcomment.viewBox"
      />
      <!-- Focus -->
      <TaskListIconLabel
        v-if="task.focus"
        :icon-path="taskfocus.path"
        :icon-box="taskfocus.viewBox"
        icon-class="text-red-600"
      />
    </div>
  </div>
</template>

<script>
import TaskListIconLabel from '@/components/TasksList/TaskListIconLabel.vue'
import TaskListTagLabel from '@/components/TasksList/TaskListTagLabel.vue'
import Icon from '@/components/Icon.vue'

/* Icons */
import file from '@/icons/file.js'
import inaccess from '@/icons/inaccess.js'
import msgs from '@/icons/msgs.js'
import taskcomment from '@/icons/taskcomment.js'
import checklist from '@/icons/checklist.js'
import project from '@/icons/project.js'
import tagIcon from '@/icons/tag.js'
import performerRead from '@/icons/performer-read.js'
import performerNotRead from '@/icons/performer-not-read.js'
import taskfocus from '@/icons/taskfocus.js'
import clock from '@/icons/clock.js'
// Statuses icons
import readyStatus from '@/icons/ready-status.js'
import note from '@/icons/note.js'
import inwork from '@/icons/inwork.js'
import pause from '@/icons/pause.js'
import canceled from '@/icons/canceled.js'
import improve from '@/icons/improve.js'
import repeat from '@/icons/repeat.js'
/* /Icons */

export default {
  components: {
    TaskListIconLabel,
    TaskListTagLabel,
    Icon
  },
  props: {
    task: {
      type: Object,
      default: () => ({})
    },
    colors: {
      type: Object,
      default: () => ({})
    },
    tags: {
      type: Object,
      default: () => ({})
    },
    employees: {
      type: Object,
      default: () => ({})
    },
    projects: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['clickTask'],
  setup () {
    const statuses = [
      undefined, // we don't have 0 status
      readyStatus,
      readyStatus,
      note,
      inwork,
      readyStatus,
      pause,
      canceled,
      canceled,
      improve
    ]
    return {
      statuses,
      file,
      inaccess,
      msgs,
      taskcomment,
      checklist,
      project,
      tagIcon,
      performerRead,
      performerNotRead,
      taskfocus,
      clock,
      readyStatus,
      note,
      inwork,
      pause,
      canceled,
      improve,
      repeat
    }
  },
  computed: {
    statusColor () {
      const statusColor = {
        4: 'text-green-600',
        5: 'text-red-600',
        8: 'text-red-600',
        9: 'text-blue-500'
      }
      return statusColor[this.task.status]
        ? statusColor[this.task.status]
        : 'text-gray-500 dark:text-gray-100'
    },
    performerName () {
      return this.employees[this.task.uid_performer]?.name ?? '???'
    },
    customerName () {
      return this.employees[this.task.uid_customer]?.name ?? '???'
    },
    isTaskComplete () {
      return this.task.status === 1 || this.task.status === 7
    },
    backgroundColor () {
      return this.getValidBackColor(
        this.colors[this.task.uid_marker]?.back_color
      )
    },
    checkBoxText () {
      return `${this.countChecklist(this.task.checklist).done} / ${
        this.countChecklist(this.task.checklist).undone
      }`
    },
    forecolor () {
      return this.getValidForeColor(
        this.colors[this.task.uid_marker]?.fore_color
      )
    },
    uppercase () {
      return this.colors[this.task.uid_marker]?.uppercase ?? false
    }
  },
  methods: {
    getValidForeColor (foreColor) {
      if (foreColor && foreColor !== '#A998B6') return foreColor
      return ''
    },
    getValidBackColor (backColor) {
      if (backColor && backColor !== '#A998B6') return backColor
      return ''
    },
    countChecklist (checklist) {
      const data = { done: 0, undone: 0 }
      for (const line of checklist.split('\r\n\r\n')) {
        data.undone++
        if (+line.split('\r\n')[0] === 1) {
          data.done++
        }
      }
      return data
    },
    onClick () {
      this.$emit('clickTask', this.task)
    }
  }
}
</script>

<style scoped></style>
