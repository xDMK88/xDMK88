<template>
  <div
    id="Board"
  >
    <BoardModalBoxDelete
      v-show="showDeleteColumn"
      title="Удалить колонку"
      text="Вы действительно хотите удалить колонку?"
      @cancel="showDeleteColumn = false"
      @yes="onDeleteColumn"
    />
    <BoardModalBoxRename
      v-show="showAddColumn"
      :show="showAddColumn"
      title="Добавить колонку"
      @cancel="showAddColumn = false"
      @save="onAddNewColumn"
    />
    <BoardModalBoxRename
      v-show="showRenameColumn"
      :show="showRenameColumn"
      title="Название колонки"
      :value="selectedColumnName"
      @cancel="showRenameColumn = false"
      @save="onRenameColumn"
    />
    <BoardModalBoxColor
      v-show="showColorColumn"
      :color="selectedColumnColor"
      @cancel="showColorColumn = false"
      @changeColor="onChangeColumnColor"
    />
    <BoardModalBoxMove
      v-show="showMoveColumn"
      :show="showMoveColumn"
      :position="selectedColumnOrder"
      :count-all="usersColumnsCount"
      @cancel="showMoveColumn = false"
      @changePosition="onChangeColumnPosition"
    />
    <div class="flex items-start">
      <template
        v-for="column in storeCards"
        :key="column.UID"
      >
        <div
          v-if="isColumnVisible(column)"
          class="flex-none bg-white rounded-xl px-3 py-4 w-[280px] mr-[10px]"
          :style="{ background: column.Color }"
        >
          <!--заголовок -->
          <div class="px-1 flex justify-between items-start">
            <p
              class="text-[#424242] font-['Roboto'] font-bold text-[16px] leading-[19px]"
              :style="{ color: getContrastYIQ(column.Color) }"
            >
              {{ column.Name }}
            </p>
            <!-- Три точки -->
            <div
              v-if="column.CanEditStage"
              class="flex-none h-[18px] w-[18px] cursor-pointer"
            >
              <Popper
                arrow
                class="light"
                placement="bottom"
              >
                <div
                  class="hover:-m-px hover:border hover:rounded-sm"
                  :style="{ 'border-color': getContrastYIQ(column.Color) ?? '#7e7e80'}"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9.35524 16.6055C8.37421 16.6055 7.57892 15.8102 7.57892 14.8291C7.57892 13.8481 8.37421 13.0528 9.35524 13.0528C10.3363 13.0528 11.1316 13.8481 11.1316 14.8291C11.1316 15.8102 10.3363 16.6055 9.35524 16.6055ZM9.35524 11.2765C8.37421 11.2765 7.57892 10.4812 7.57892 9.50016C7.57892 8.51912 8.37421 7.72383 9.35524 7.72383C10.3363 7.72383 11.1316 8.51912 11.1316 9.50016C11.1316 10.4812 10.3363 11.2765 9.35524 11.2765ZM7.57892 4.17118C7.57892 5.15222 8.37421 5.9475 9.35524 5.9475C10.3363 5.9475 11.1316 5.15222 11.1316 4.17118C11.1316 3.19015 10.3363 2.39486 9.35524 2.39486C8.37421 2.39486 7.57892 3.19015 7.57892 4.17118Z"
                      :fill="getContrastYIQ(column.Color) ?? '#7e7e80'"
                    />
                  </svg>
                </div>
                <template #content="{ close }">
                  <div
                    class="flex flex-col"
                    @click="close"
                  >
                    <div
                      class="flex items-center py-0.5 px-2 cursor-pointer hover:text-[#ebaa40] rounded text-sm font-['Tahoma']"
                      @click="clickRenameColumn(column, $event)"
                    >
                      Переименовать
                    </div>
                    <div
                      class="mt-2 flex items-center py-0.5 px-2 cursor-pointer hover:text-[#ebaa40] rounded text-sm font-['Tahoma']"
                      @click="clickColorColumn(column, $event)"
                    >
                      Выбрать цвет
                    </div>
                    <div
                      class="mt-2 flex items-center py-0.5 px-2 cursor-pointer hover:text-[#ebaa40] rounded text-sm font-['Tahoma']"
                      @click="clickMoveColumn(column, $event)"
                    >
                      Переместить
                    </div>
                    <div class="mt-2 flex h-px bg-[#dddddd]" />
                    <div
                      class="mt-2 flex items-center py-0.5 px-2 cursor-pointer hover:text-[#ebaa40] rounded text-sm font-['Tahoma']"
                      @click="clickDeleteColumn(column, $event)"
                    >
                      Удалить
                    </div>
                  </div>
                </template>
              </Popper>
            </div>
          </div>
          <!--под заголовок стат-колонки -->
          <div
            class="px-1 text-[#7e7e80] font-['Roboto'] mt-[6px]"
            :style="{ color: getContrastYIQ(column.Color) }"
          >
            <div
              v-if="column.cards.length"
              class="flex items-center justify-between h-[16px]"
            >
              <p class="text-[12px] leading-[14px]">
                Карточек: {{ column.cards.length }}
              </p>
              <div
                v-if="totalItem(column.cards)"
                class="flex items-center"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M3.25924 4.44448C3.10208 4.44448 2.95135 4.50691 2.84021 4.61805C2.72908 4.72918 2.66665 4.87991 2.66665 5.03707V10.963C2.66665 11.1202 2.72908 11.2709 2.84021 11.382C2.95135 11.4932 3.10208 11.5556 3.25924 11.5556H12.7407C12.8979 11.5556 13.0486 11.4932 13.1597 11.382C13.2709 11.2709 13.3333 11.1202 13.3333 10.963V5.03707C13.3333 4.87991 13.2709 4.72918 13.1597 4.61805C13.0486 4.50691 12.8979 4.44448 12.7407 4.44448H3.25924ZM2.00216 3.77999C2.33556 3.4466 2.78774 3.25929 3.25924 3.25929H12.7407C13.2122 3.25929 13.6644 3.4466 13.9978 3.77999C14.3312 4.11339 14.5185 4.56558 14.5185 5.03707V10.963C14.5185 11.4345 14.3312 11.8867 13.9978 12.2201C13.6644 12.5535 13.2122 12.7408 12.7407 12.7408H3.25924C2.78774 12.7408 2.33556 12.5535 2.00216 12.2201C1.66876 11.8867 1.48146 11.4345 1.48146 10.963V5.03707C1.48146 4.56558 1.66876 4.11339 2.00216 3.77999Z"
                    fill="currentColor"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.99998 6.81485C7.34542 6.81485 6.8148 7.34548 6.8148 8.00004C6.8148 8.6546 7.34542 9.18522 7.99998 9.18522C8.65454 9.18522 9.18517 8.6546 9.18517 8.00004C9.18517 7.34548 8.65454 6.81485 7.99998 6.81485ZM5.62961 8.00004C5.62961 6.69092 6.69086 5.62967 7.99998 5.62967C9.3091 5.62967 10.3704 6.69092 10.3704 8.00004C10.3704 9.30916 9.3091 10.3704 7.99998 10.3704C6.69086 10.3704 5.62961 9.30916 5.62961 8.00004Z"
                    fill="currentColor"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4.6712 3.3044C4.89264 3.39613 5.03702 3.61221 5.03702 3.85189C5.03702 4.63771 4.72485 5.39136 4.16919 5.94702C3.61352 6.50268 2.85988 6.81485 2.07406 6.81485C1.83437 6.81485 1.61829 6.67047 1.52657 6.44903C1.43485 6.2276 1.48555 5.97271 1.65503 5.80323L4.0254 3.43286C4.19488 3.26338 4.44976 3.21268 4.6712 3.3044ZM13.9259 10.3704C13.4544 10.3704 13.0022 10.5577 12.6688 10.8911C12.3354 11.2245 12.1481 11.6767 12.1481 12.1482C12.1481 12.4755 11.8828 12.7408 11.5555 12.7408C11.2283 12.7408 10.9629 12.4755 10.9629 12.1482C10.9629 11.3624 11.2751 10.6087 11.8308 10.0531C12.3864 9.49739 13.1401 9.18522 13.9259 9.18522C14.2532 9.18522 14.5185 9.45053 14.5185 9.77781C14.5185 10.1051 14.2532 10.3704 13.9259 10.3704Z"
                    fill="currentColor"
                  />
                </svg>
                <p class="ml-1 text-[10px] leading-[12px]">
                  {{ totalItem(column.cards) }}
                </p>
              </div>
            </div>
            <div
              v-else
              class="h-[16px]"
            >
                <!--делаем неразрывный пробел - чтобы не скрыло и остался правильный отступ -->
                &nbsp;
            </div>
          </div>
          <!--карточки -->
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
                :show-date="board?.show_date !== 0 ?? false"
                :read-only="!board || board.type_access === 0"
                class="mt-2"
              />
            </template>
          </draggable>
          <!--кнопка добавить карточку -->
          <div
            v-if="column.AddCard"
            class="mt-2 h-[40px]"
          >
            <button
              class="flex justify-center items-center h-full w-full font-['Roboto'] text-[#7e7e80]"
              :style="{ color: getContrastYIQ(column.Color) }"
              @click="addCard(column)"
            >
              <p
                class="text-sm"
              >
                Добавить карточку
              </p>
              <svg
                class="ml-[5px]"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.935 5.00389L10 5C10.1361 5.00002 10.2674 5.04998 10.3691 5.1404C10.4708 5.23082 10.5357 5.35542 10.5517 5.49056L10.5556 5.55556V9.44444H14.4444C14.5805 9.44446 14.7119 9.49442 14.8135 9.58484C14.9152 9.67526 14.9802 9.79986 14.9961 9.935L15 10C15 10.1361 14.95 10.2674 14.8596 10.3691C14.7692 10.4708 14.6446 10.5357 14.5094 10.5517L14.4444 10.5556H10.5556V14.4444C10.5555 14.5805 10.5056 14.7119 10.4152 14.8135C10.3247 14.9152 10.2001 14.9802 10.065 14.9961L10 15C9.86393 15 9.73259 14.95 9.6309 14.8596C9.52922 14.7692 9.46425 14.6446 9.44833 14.5094L9.44444 14.4444V10.5556H5.55556C5.41948 10.5555 5.28815 10.5056 5.18646 10.4152C5.08477 10.3247 5.01981 10.2001 5.00389 10.065L5 10C5.00002 9.86393 5.04998 9.73259 5.1404 9.6309C5.23082 9.52922 5.35542 9.46425 5.49056 9.44833L5.55556 9.44444H9.44444V5.55556C9.44446 5.41948 9.49442 5.28815 9.58484 5.18646C9.67526 5.08477 9.79986 5.01981 9.935 5.00389L10 5L9.935 5.00389Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
      </template>
      <!-- кнопка Добавить колонку -->
      <div
        v-if="board.type_access === 1"
        class="flex-none bg-white rounded-xl w-[246px] h-[48px] mr-[10px]"
      >
        <div
          class="flex justify-center items-center h-full w-full cursor-pointer font-['Roboto'] text-[#7e7e80]"
          @click="clickAddColumn"
        >
          <p
            class="text-sm"
          >
            Добавить колонку
          </p>
          <svg
            class="ml-[5px]"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.935 5.00389L10 5C10.1361 5.00002 10.2674 5.04998 10.3691 5.1404C10.4708 5.23082 10.5357 5.35542 10.5517 5.49056L10.5556 5.55556V9.44444H14.4444C14.5805 9.44446 14.7119 9.49442 14.8135 9.58484C14.9152 9.67526 14.9802 9.79986 14.9961 9.935L15 10C15 10.1361 14.95 10.2674 14.8596 10.3691C14.7692 10.4708 14.6446 10.5357 14.5094 10.5517L14.4444 10.5556H10.5556V14.4444C10.5555 14.5805 10.5056 14.7119 10.4152 14.8135C10.3247 14.9152 10.2001 14.9802 10.065 14.9961L10 15C9.86393 15 9.73259 14.95 9.6309 14.8596C9.52922 14.7692 9.46425 14.6446 9.44833 14.5094L9.44444 14.4444V10.5556H5.55556C5.41948 10.5555 5.28815 10.5056 5.18646 10.4152C5.08477 10.3247 5.01981 10.2001 5.00389 10.065L5 10C5.00002 9.86393 5.04998 9.73259 5.1404 9.6309C5.23082 9.52922 5.35542 9.46425 5.49056 9.44833L5.55556 9.44444H9.44444V5.55556C9.44446 5.41948 9.49442 5.28815 9.58484 5.18646C9.67526 5.08477 9.79986 5.01981 9.935 5.00389L10 5L9.935 5.00389Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Popper from 'vue3-popper'
import draggable from 'vuedraggable'
import BoardCard from '@/components/Board/BoardCard.vue'
import BoardModalBoxRename from '@/components/Board/BoardModalBoxRename.vue'
import BoardModalBoxDelete from '@/components/Board/BoardModalBoxDelete.vue'
import BoardModalBoxColor from '@/components/Board/BoardModalBoxColor.vue'
import BoardModalBoxMove from '@/components/Board/BoardModalBoxMove.vue'
import * as BOARD from '@/store/actions/boards'
import * as CARD from '@/store/actions/cards'

export default {
  components: {
    Popper,
    BoardModalBoxRename,
    BoardModalBoxDelete,
    BoardModalBoxColor,
    BoardModalBoxMove,
    BoardCard,
    draggable
  },
  props: {
    storeCards: {
      type: Array,
      default: () => []
    },
    board: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      isShowArchive: false,
      showAddColumn: false,
      showRenameColumn: false,
      selectedColumn: null,
      showDeleteColumn: false,
      showColorColumn: false,
      showMoveColumn: false
    }
  },
  computed: {
    selectedColumnName () {
      return this.selectedColumn?.Name ?? ''
    },
    selectedColumnColor () {
      return this.selectedColumn?.Color ?? ''
    },
    selectedColumnOrder () {
      return this.selectedColumn?.Order ?? 0
    },
    usersColumnsCount () {
      return this.storeCards.filter(stage => stage.UserStage === true).length
    }
  },
  methods: {
    print (val) {
      console.log(val)
    },
    getContrastYIQ (hexcolor) {
      if (!hexcolor) return null
      hexcolor = hexcolor.replace('#', '')
      const r = parseInt(hexcolor.substr(0, 2), 16)
      const g = parseInt(hexcolor.substr(2, 2), 16)
      const b = parseInt(hexcolor.substr(4, 2), 16)
      const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000
      return (yiq >= 128) ? 'black' : 'white'
    },
    isColumnVisible (column) {
      if (this.isShowArchive) {
        // показываем только архив
        return column.Archive
      }
      // скрываем архив
      if (column.Archive) return false
      // скрываем пустое неразобранное
      if (column.Unsorted && column.cards.length === 0) return false
      return true
    },
    totalItem (cards) {
      const cost = cards.reduce((sum, card) => sum + card.cost, 0)
      if (cost > 0) {
        const fractional = cost % 100
        const value = Math.floor(cost / 100)
        let valString = ''
        let valueString = value.toString()
        while (valueString) {
          valString = valueString.slice(-3) + ' ' + valString
          valueString = valueString.slice(0, -3)
        }
        valString = valString.trim()
        if (fractional > 0) {
          const frString = (fractional < 10 ? '0' : '') + fractional
          return `${valString}.${frString}`
        }
        return valString
      }
      return ''
    },
    addCard (column) {
      // TODO: Здесь сделать добавление карточек
      console.log('addCard', column)
    },
    clickAddColumn (e) {
      this.showAddColumn = true
    },
    onAddNewColumn (name) {
      this.showAddColumn = false
      const title = name.trim()
      if (title) {
        this.$store.dispatch(BOARD.ADD_STAGE_BOARD_REQUEST, {
          boardUid: this.board.uid,
          newStageTitle: title
        })
          .then((resp) => {
            this.$store.dispatch(CARD.BOARD_CARDS_ADDSTAGE, resp)
          })
      }
    },
    clickRenameColumn (column, e) {
      this.selectedColumn = column
      this.showRenameColumn = true
    },
    onRenameColumn (name) {
      this.showRenameColumn = false
      const title = name.trim()
      if (title) {
        this.$store.dispatch(BOARD.RENAME_STAGE_BOARD_REQUEST, {
          boardUid: this.board.uid,
          stageUid: this.selectedColumn.UID,
          newStageTitle: title
        })
          .then((resp) => {
            this.$store.dispatch(CARD.BOARD_CARDS_RENAME_STAGE, resp)
          })
      }
    },
    clickDeleteColumn (column, e) {
      this.selectedColumn = column
      this.showDeleteColumn = true
    },
    onDeleteColumn () {
      this.showDeleteColumn = false
      if (this.selectedColumn) {
        const data = {
          boardUid: this.board.uid,
          stageUid: this.selectedColumn.UID
        }
        this.$store.dispatch(BOARD.DELETE_STAGE_BOARD_REQUEST, data)
          .then((resp) => {
            this.$store.dispatch(CARD.BOARD_CARDS_DELETE_STAGE, data)
          })
      }
    },
    clickColorColumn (column, e) {
      this.selectedColumn = column
      this.showColorColumn = true
    },
    onChangeColumnColor (color) {
      this.showColorColumn = false
      if (this.selectedColumn) {
        this.$store.dispatch(BOARD.CHANGE_COLOR_STAGE_BOARD_REQUEST, {
          boardUid: this.board.uid,
          stageUid: this.selectedColumn.UID,
          newColor: color
        })
          .then((resp) => {
            this.$store.dispatch(CARD.BOARD_CARDS_CHANGE_COLOR_STAGE, resp)
          })
      }
    },
    clickMoveColumn (column, e) {
      this.selectedColumn = column
      this.showMoveColumn = true
    },
    onChangeColumnPosition (order) {
      this.showMoveColumn = false
      if (this.selectedColumn) {
        this.$store.dispatch(BOARD.CHANGE_ORDER_STAGE_BOARD_REQUEST, {
          boardUid: this.board.uid,
          stageUid: this.selectedColumn.UID,
          newOrder: order
        })
          .then((resp) => {
            this.$store.dispatch(CARD.BOARD_CARDS_CHANGE_ORDER_STAGE, resp.data)
          })
      }
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
.margin-auto {
  margin: 0 auto;
}
.margin-auto-4 {
  margin: 0.9rem auto 1px auto;
}
.light {
  --popper-theme-background-color: #ffffff;
  --popper-theme-background-color-hover: #ffffff;
  --popper-theme-text-color: #444444;
  --popper-theme-border-width: 1px;
  --popper-theme-border-style: solid;
  --popper-theme-border-color: rgba(0, 0, 0, 0.12);
  --popper-theme-border-radius: 10px;
  --popper-theme-padding: 17px 15px;
  --popper-theme-box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25);
}
</style>
