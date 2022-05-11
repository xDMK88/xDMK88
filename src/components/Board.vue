<template>
  <div id="Board">
    <div class="flex justify-start">
      <div class="max-h-[100%] flex overflow-x-scroll">
        <div
          v-for="column in storeCards"
          :key="column.Name"
          class="bg-gray-50 rounded-lg p-3 column-width mr-3"
        >
          <p
            class="text-gray-700 font-semibold font-sans tracking-wide text-sm"
          >
            {{ column.Name }}
          </p>
          <draggable
            :list="column.tasks"
            ghost-class="ghost-card"
            item-key="id"
            group="cards"
            :animation="100"
            @start="drag = true"
            @end="drag = false"
          >
            <template #item="{ element }">
              <task-card
                :task="element"
                class="mt-2 cursor-move"
              />
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import TaskCard from './TaskCard.vue'
export default {
  props: {
    storeCards: Array
  },
  components: {
    TaskCard,
    draggable
  },
  data () {
    return {
      columns: [
        {
          title: 'Backlog',
          tasks: [
            {
              id: 1,
              title: 'Add discount code to checkout page',
              date: 'Sep 14',
              type: 'Feature Request'
            },
            {
              id: 2,
              title: 'Provide documentation on integrations',
              date: 'Sep 12'
            },
            {
              id: 3,
              title: 'Design shopping cart dropdown',
              date: 'Sep 9',
              type: 'Design'
            },
            {
              id: 4,
              title: 'Add discount code to checkout page',
              date: 'Sep 14',
              type: 'Feature Request'
            },
            {
              id: 5,
              title: 'Test checkout flow',
              date: 'Sep 15',
              type: 'QA'
            }
          ]
        },
        {
          title: 'In Progress',
          tasks: [
            {
              id: 6,
              title: 'Design shopping cart dropdown',
              date: 'Sep 9',
              type: 'Design'
            },
            {
              id: 7,
              title: 'Add discount code to checkout page',
              date: 'Sep 14',
              type: 'Feature Request'
            },
            {
              id: 8,
              title: 'Provide documentation on integrations',
              date: 'Sep 12',
              type: 'Backend'
            }
          ]
        },
        {
          title: 'In Progress',
          tasks: [
            {
              id: 6,
              title: 'Design shopping cart dropdown',
              date: 'Sep 9',
              type: 'Design'
            },
            {
              id: 7,
              title: 'Add discount code to checkout page',
              date: 'Sep 14',
              type: 'Feature Request'
            },
            {
              id: 8,
              title: 'Provide documentation on integrations',
              date: 'Sep 12',
              type: 'Backend'
            }
          ]
        },
        {
          title: 'Review',
          tasks: [
            {
              id: 9,
              title: 'Provide documentation on integrations',
              date: 'Sep 12'
            },
            {
              id: 10,
              title: 'Design shopping cart dropdown',
              date: 'Sep 9',
              type: 'Design'
            },
            {
              id: 11,
              title: 'Add discount code to checkout page',
              date: 'Sep 14',
              type: 'Feature Request'
            },
            {
              id: 12,
              title: 'Design shopping cart dropdown',
              date: 'Sep 9',
              type: 'Design'
            },
            {
              id: 13,
              title: 'Add discount code to checkout page',
              date: 'Sep 14',
              type: 'Feature Request'
            }
          ]
        },
        {
          title: 'Done',
          tasks: [
            {
              id: 14,
              title: 'Add discount code to checkout page',
              date: 'Sep 14',
              type: 'Feature Request'
            },
            {
              id: 15,
              title: 'Design shopping cart dropdown',
              date: 'Sep 9',
              type: 'Design'
            },
            {
              id: 16,
              title: 'Add discount code to checkout page',
              date: 'Sep 14',
              type: 'Feature Request'
            }
          ]
        }
      ]
    }
  }
}
</script>

<style scoped>
.column-width {
  min-width: 320px;
  width: 320px;
}
.ghost-card {
  opacity: 0.5;
  background: #f7fafc;
  border: 1px solid #4299e1;
}
</style>
