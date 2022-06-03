<template>
  <Popper
    class="popper-project light"
    arrow
    trigger="hover"
    placement="bottom"
    :options="{
      placement: 'top',
      modifiers: { offset: { offset: '0,10px' } }
    }"
    :disabled="!canEdit"
    @open:popper="onShowSelectProject"
  >
    <template
      #content="{ close }"
      class="bottom"
    >
      <div
        class="popper"
        @click="close"
      >
        <div class="text-white body-popover-custom">
          <div class="container-project-popover">
            <TaskPropsButtonProjectItem
              v-for="(project, index) in myProjects"
              :key="index"
              :check-project="currProject"
              :collapsed-project="collapsedProject"
              :project="project"
              @collapseProject="onCollapseProject"
              @checkProject="onCheckProject"
            />
            <div
              v-if="sharedProjects?.length"
              class="mt-4"
            >
              <TaskPropsButtonProjectItem
                v-for="(project, index) in sharedProjects"
                :key="index"
                :check-project="currProject"
                :collapsed-project="collapsedProject"
                :project="project"
                @collapseProject="onCollapseProject"
                @checkProject="onCheckProject"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
    <div
      v-if="selectedProject !== '00000000-0000-0000-0000-000000000000'"
      class="mt-3 tags-custom-project dark:bg-gray-800 dark:text-gray-100 project-hover-close"
      :class="{ 'cursor-pointer': canEdit, 'cursor-default': !canEdit }"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 90 81"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          v-if="
            projects[selectedProject] &&
              projects[selectedProject].color !== '#A998B6' && projects[selectedProject].color !== ''
          "
          d="M81.8999 17.1334V12.1427C81.8999 7.51337 78.1159 3.74215 73.4708 3.74215H38.7349L37.6926 2.02591C37.0581 1.03229 35.9478 0.399994 34.7696 0.399994H9.02918C4.38412 0.399994 0.600098 4.17121 0.600098 8.80056V72.1661C0.600098 76.7954 4.38412 80.5667 9.02918 80.5667H80.9709C85.616 80.5667 89.4 76.7954 89.4 72.1661V25.4888C89.4226 21.153 86.1144 17.585 81.8999 17.1334ZM7.44306 8.80056C7.44306 7.91985 8.16814 7.19722 9.05183 7.19722H32.8662L42.111 22.2369C42.7228 23.2306 43.8331 23.8629 45.034 23.8629H81.0162C81.8999 23.8629 82.625 24.5855 82.625 25.4662V72.1661C82.625 73.0468 81.8999 73.7694 81.0162 73.7694H9.02918C8.14548 73.7694 7.4204 73.0468 7.4204 72.1661V8.80056H7.44306ZM75.0569 17.0656H46.9147L42.9041 10.5394H73.4482C74.3319 10.5394 75.0569 11.262 75.0569 12.1427V17.0656Z"
          :fill="projects[selectedProject].color"
          fill-opacity="1"
        />
        <path
          v-else
          d="M81.8999 17.1334V12.1427C81.8999 7.51337 78.1159 3.74215 73.4708 3.74215H38.7349L37.6926 2.02591C37.0581 1.03229 35.9478 0.399994 34.7696 0.399994H9.02918C4.38412 0.399994 0.600098 4.17121 0.600098 8.80056V72.1661C0.600098 76.7954 4.38412 80.5667 9.02918 80.5667H80.9709C85.616 80.5667 89.4 76.7954 89.4 72.1661V25.4888C89.4226 21.153 86.1144 17.585 81.8999 17.1334ZM7.44306 8.80056C7.44306 7.91985 8.16814 7.19722 9.05183 7.19722H32.8662L42.111 22.2369C42.7228 23.2306 43.8331 23.8629 45.034 23.8629H81.0162C81.8999 23.8629 82.625 24.5855 82.625 25.4662V72.1661C82.625 73.0468 81.8999 73.7694 81.0162 73.7694H9.02918C8.14548 73.7694 7.4204 73.0468 7.4204 72.1661V8.80056H7.44306ZM75.0569 17.0656H46.9147L42.9041 10.5394H73.4482C74.3319 10.5394 75.0569 11.262 75.0569 12.1427V17.0656Z"
          fill="black"
          fill-opacity="0.5"
        />
      </svg>
      {{ projects[selectedProject]?.name ?? '???' }}
      <button
        v-if="canEdit"
        class="btn-close-popover"
        @click.stop="removeProject"
      >
        <svg
          width="5"
          height="5"
          viewBox="0 0 16 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.8483 2.34833C15.317 1.8797 15.317 1.11991 14.8483 0.651277C14.3797 0.182647 13.6199 0.182647 13.1513 0.651277L7.99981 5.80275L2.84833 0.651277C2.3797 0.182647 1.61991 0.182647 1.15128 0.651277C0.682647 1.11991 0.682647 1.8797 1.15128 2.34833L6.30275 7.4998L1.15128 12.6513C0.682647 13.1199 0.682647 13.8797 1.15128 14.3483C1.61991 14.817 2.3797 14.817 2.84833 14.3483L7.99981 9.19686L13.1513 14.3483C13.6199 14.817 14.3797 14.817 14.8483 14.3483C15.317 13.8797 15.317 13.1199 14.8483 12.6513L9.69686 7.4998L14.8483 2.34833Z"
            fill="black"
            fill-opacity="0.5"
          />
        </svg>
      </button>
    </div>
    <div
      v-else
      class="mt-3 tags-custom-project dark:bg-gray-800 dark:text-gray-100"
      :class="{ 'cursor-pointer': canEdit, 'cursor-default': !canEdit }"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 90 81"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M81.8999 17.1334V12.1427C81.8999 7.51337 78.1159 3.74215 73.4708 3.74215H38.7349L37.6926 2.02591C37.0581 1.03229 35.9478 0.399994 34.7696 0.399994H9.02918C4.38412 0.399994 0.600098 4.17121 0.600098 8.80056V72.1661C0.600098 76.7954 4.38412 80.5667 9.02918 80.5667H80.9709C85.616 80.5667 89.4 76.7954 89.4 72.1661V25.4888C89.4226 21.153 86.1144 17.585 81.8999 17.1334ZM7.44306 8.80056C7.44306 7.91985 8.16814 7.19722 9.05183 7.19722H32.8662L42.111 22.2369C42.7228 23.2306 43.8331 23.8629 45.034 23.8629H81.0162C81.8999 23.8629 82.625 24.5855 82.625 25.4662V72.1661C82.625 73.0468 81.8999 73.7694 81.0162 73.7694H9.02918C8.14548 73.7694 7.4204 73.0468 7.4204 72.1661V8.80056H7.44306ZM75.0569 17.0656H46.9147L42.9041 10.5394H73.4482C74.3319 10.5394 75.0569 11.262 75.0569 12.1427V17.0656Z"
          fill="black"
          fill-opacity="0.5"
        />
      </svg>
      <span class="rounded">Проект</span>
    </div>
  </Popper>
</template>

<script>
import Popper from 'vue3-popper'
import TaskPropsButtonProjectItem from '@/components/TaskProperties/TaskPropsButtonProjectItem.vue'

export default {
  components: {
    Popper,
    TaskPropsButtonProjectItem
  },
  props: {
    selectedProject: {
      type: String,
      default: ''
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['changeProject'],
  data: () => ({
    currProject: '00000000-0000-0000-0000-000000000000',
    collapsedProject: []
  }),
  computed: {
    projects () {
      return this.$store.state.projects.projects
    },
    myProjects () {
      return Object.values(this.$store.state.projects.projects).filter(
        (project) =>
          project.uid_parent === '00000000-0000-0000-0000-000000000000' &&
          project.email_creator === this.currUserEmail
      )
    },
    sharedProjects () {
      return Object.values(this.$store.state.projects.projects).filter(
        (project) =>
          project.uid_parent === '00000000-0000-0000-0000-000000000000' &&
          project.email_creator !== this.currUserEmail
      )
    },
    currUserEmail () {
      return this.$store.state.user.user.current_user_email
    }
  },
  methods: {
    print (val) {
      console.log(val)
    },
    onShowSelectProject () {
      this.currProject = this.selectedProject
      this.collapsedProject = []
    },
    isCheckedProject (projectUid) {
      return this.currProject === projectUid
    },
    onCheckProject (projectUid) {
      if (this.currProject !== projectUid) {
        this.currProject = projectUid
        this.onSave()
      }
    },
    onCollapseProject (projectUid) {
      const index = this.collapsedProject.findIndex((uid) => uid === projectUid)
      if (index === -1) {
        this.collapsedProject.push(projectUid)
      } else {
        this.collapsedProject.splice(index, 1)
      }
    },
    onSave () {
      this.$emit('changeProject', this.currProject)
    },
    removeProject () {
      if (this.currProject !== '00000000-0000-0000-0000-000000000000') {
        this.currProject = '00000000-0000-0000-0000-000000000000'
        this.onSave()
      }
    }
  }
}
</script>

<style scoped>
.tags-custom-project {
  padding: 4px 6px 4px 4px;
  border-radius: 5px;
  margin: 2px 2px 2px 2px;
  font-size: 12px;
  float: left;
  position: relative;
  display: flex;
  background: #f4f5f7;
}
.tags-custom-project svg {
  position: relative;
  top: 3px;
  float: left;
  display: flex;
  font-size: 18px;
  width: 17px;
  height: 17px;
  margin-right: 5px;
  color: #9e9e9e;
}
.btn-close-popover
{
  color: gray;
  margin-right: 5px;
  margin-left: 5px;
  font-size: 11px;
  display: none;
  position: absolute;
  right: 0;
  width: 15px;
  height: 15px;
  top: 7px;
  border-radius: 25px;
  -webkit-transition: all 0.7s ease;
  -moz-transition: all 0.7s ease;
  -o-transition: all 0.7s ease;
  transition: all 0.7s ease;
  background: #F4F5F7;
  animation-delay: -2s;
  opacity: 0;
  z-index: 9999;
  animation: ani 2.5s forwards;
}
.btn-close-popover svg
{
  width: 15px;
  height: 15px;
  left: 0;
  top: 0;
  padding: 2px;
  border-radius: 25px;
  border: 1px solid gray;
}
</style>
