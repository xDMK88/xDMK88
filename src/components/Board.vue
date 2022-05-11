<template>
  <div
    id="Board"
    :print="print(storeCards)"
  >
    <div class="flex justify-start">
      <div class="max-h-[100%] flex overflow-x-scroll">
        <div
          v-for="column in storeCards"
          :key="column.UID"
          class="bg-gray-50 rounded-lg p-3 column-width mr-3"
        >
          <p
            class="text-gray-700 font-semibold font-sans tracking-wide text-sm"
          >
            {{ column.Name }}
          </p>
          <draggable
            :list="column.cards"
            ghost-class="ghost-card"
            item-key="uid"
            group="cards"
            :animation="100"
            @start="drag = true"
            @end="drag = false"
          >
            <template #item="{ element }">
              <BoardCard
                :card="element"
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
import BoardCard from '@/components/Board/BoardCard.vue'
export default {
  components: {
    BoardCard,
    draggable
  },
  props: {
    storeCards: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    print (val) {
      console.log(val)
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
