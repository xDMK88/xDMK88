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
    <div class="flex items-start">
      <template
        v-for="column in storeCards"
        :key="column.UID"
      >
        <div
          v-if="isColumnVisible(column)"
          class="bg-[#e5e5e5] rounded-lg p-3 column-width mr-3"
          :style="{ background: column.Color }"
        >
          <!--заголовок -->
          <div class="flex justify-between items-start">
            <p
              class="text-[#333333] font-semibold font-['Tahoma'] text-sm"
              :style="{ color: getContrastYIQ(column.Color) }"
            >
              {{ column.Name }}
            </p>
            <!-- Три точки -->
            <div
              v-if="column.CanEditStage"
              class="float-right"
            >
              <Popper
                arrow
                class="light"
                placement="bottom"
              >
                <div
                  class="hover:-m-px hover:border"
                  :style="{ 'border-color': getContrastYIQ(column.Color) ?? '#7f7f7f'}"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9.35445 16.1053C8.37341 16.1053 7.57812 15.31 7.57812 14.3289C7.57812 13.3479 8.37341 12.5526 9.35445 12.5526C10.3355 12.5526 11.1308 13.3479 11.1308 14.3289C11.1308 15.31 10.3355 16.1053 9.35445 16.1053ZM9.35445 10.7763C8.37341 10.7763 7.57812 9.981 7.57812 8.99996C7.57813 8.01892 8.37341 7.22364 9.35445 7.22364C10.3355 7.22364 11.1308 8.01892 11.1308 8.99996C11.1308 9.981 10.3355 10.7763 9.35445 10.7763ZM7.57813 3.67098C7.57813 4.65202 8.37341 5.4473 9.35445 5.4473C10.3355 5.4473 11.1308 4.65202 11.1308 3.67098C11.1308 2.68995 10.3355 1.89466 9.35445 1.89466C8.37341 1.89466 7.57813 2.68995 7.57813 3.67098Z"
                      :fill="getContrastYIQ(column.Color) ?? 'black'"
                      :fill-opacity="column.Color ? 1 : 0.5"
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
                      Цвет
                    </div>
                    <div
                      class="mt-2 flex items-center py-0.5 px-2 cursor-pointer hover:text-[#ebaa40] rounded text-sm font-['Tahoma']"
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
            class="text-[#444444] text-xs font-['Tahoma'] mt-1"
            :style="{ color: getContrastYIQ(column.Color) }"
          >
            <div
              v-if="column.cards.length"
              class="flex justify-between"
            >
              <p>
                Карточек: {{ column.cards.length }}
              </p>
              <p
                v-if="totalItem(column.cards)"
                class="flex items-center"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.6648 2C9.21084 2 6.60227 2.76451 6.60227 4.18182V5.92727C6.60227 6.16815 6.80845 6.36364 7.0625 6.36364C7.31655 6.36364 7.52273 6.16815 7.52273 5.92727V5.47258C8.49933 6.05644 10.112 6.36364 11.6648 6.36364C13.2176 6.36364 14.8302 6.05644 15.8068 5.47258V5.92727C15.8068 6.35404 14.6747 7.03476 12.5466 7.2032C12.2944 7.2224 12.1057 7.43447 12.1268 7.67447C12.1462 7.90225 12.3477 8.07418 12.5843 8.07418C12.5981 8.07418 12.6101 8.07331 12.6239 8.07244C13.8223 7.97731 15.0161 7.6832 15.8068 7.20582V7.67273C15.8068 8.04538 14.9729 8.58124 13.4256 8.84044C13.1762 8.88233 13.0086 9.10924 13.0528 9.34575C13.0924 9.55695 13.2866 9.70618 13.5048 9.70618C13.5315 9.70618 13.5591 9.70444 13.5858 9.6992C14.5219 9.54298 15.2711 9.28727 15.8068 8.96262V9.41818C15.8068 9.79084 14.9729 10.3267 13.4256 10.5859C13.1762 10.6278 13.0086 10.8547 13.0528 11.0912C13.0924 11.3024 13.2866 11.4516 13.5048 11.4516C13.5315 11.4516 13.5591 11.4499 13.5858 11.4447C14.5219 11.2884 15.2711 11.0319 15.8068 10.7081V11.1636C15.8068 11.5363 14.9729 12.0721 13.4256 12.3313C13.1762 12.3732 13.0086 12.6001 13.0528 12.8367C13.0924 13.0479 13.2866 13.1971 13.5048 13.1971C13.5315 13.1971 13.5591 13.1953 13.5858 13.1901C14.5219 13.0339 15.2711 12.7773 15.8068 12.4535V12.9091C15.8068 13.3359 14.6747 14.0166 12.5466 14.185C12.2944 14.2042 12.1057 14.4163 12.1268 14.6563C12.1462 14.8841 12.3477 15.056 12.5843 15.056C12.5981 15.056 12.6101 15.0551 12.6239 15.0543C14.6664 14.8919 16.7273 14.1667 16.7273 12.9091V4.18182C16.7273 2.76451 14.1187 2 11.6648 2ZM11.6648 5.49091C9.13628 5.49091 7.52273 4.71505 7.52273 4.18182C7.52273 3.64858 9.13628 2.87273 11.6648 2.87273C14.1933 2.87273 15.8068 3.64858 15.8068 4.18182C15.8068 4.71505 14.1933 5.49091 11.6648 5.49091Z"
                    fill="currentColor"
                  />
                  <path
                    d="M7.0625 7.23636C4.60857 7.23636 2 8.00087 2 9.41818V12.9091C2 14.3264 4.60857 15.0909 7.0625 15.0909C9.51643 15.0909 12.125 14.3264 12.125 12.9091V9.41818C12.125 8.00087 9.51643 7.23636 7.0625 7.23636ZM11.2045 12.9091C11.2045 13.4423 9.59099 14.2182 7.0625 14.2182C4.53401 14.2182 2.92045 13.4423 2.92045 12.9091V12.4544C3.89706 13.0383 5.50969 13.3455 7.0625 13.3455C8.61531 13.3455 10.2279 13.0383 11.2045 12.4544V12.9091ZM11.2045 11.1636C11.2045 11.6969 9.59099 12.4727 7.0625 12.4727C4.53401 12.4727 2.92045 11.6969 2.92045 11.1636V10.7089C3.89706 11.2928 5.50969 11.6 7.0625 11.6C8.61531 11.6 10.2279 11.2928 11.2045 10.7089V11.1636ZM7.0625 10.7273C4.53401 10.7273 2.92045 9.95142 2.92045 9.41818C2.92045 8.88495 4.53401 8.10909 7.0625 8.10909C9.59099 8.10909 11.2045 8.88495 11.2045 9.41818C11.2045 9.95142 9.59099 10.7273 7.0625 10.7273Z"
                    fill="currentColor"
                  />
                </svg>
                <span class="ml-1">
                  {{ totalItem(column.cards) }}
                </span>
              </p>
            </div>
            <div
              v-else
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
            class="mt-4 text-sm"
          >
            <button
              class="flex justify-center items-center h-full w-full"
              @click="addCard(column)"
            >
              <p
                class="text-[#444444] font-['Tahoma'] text-sm"
                :style="{ color: getContrastYIQ(column.Color) }"
              >
                Добавить карточку
              </p>
              <svg
                class="ml-2"
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.5 0.5C4.84625 0.5 4.31629 1.02997 4.31629 1.68371V4.31629H1.68371C1.02997 4.31629 0.5 4.84625 0.5 5.5C0.5 6.15375 1.02997 6.68371 1.68371 6.68371H4.31629V9.31629C4.31629 9.97003 4.84625 10.5 5.5 10.5C6.15375 10.5 6.68371 9.97003 6.68371 9.31629V6.68371H9.31629C9.97003 6.68371 10.5 6.15375 10.5 5.5C10.5 4.84625 9.97003 4.31629 9.31629 4.31629H6.68371V1.68371C6.68371 1.02997 6.15375 0.5 5.5 0.5Z"
                  :fill="getContrastYIQ(column.Color) ?? 'black'"
                  :fill-opacity="column.Color ? 1 : 0.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </template>
      <!-- кнопка Добавить колонку -->
      <div
        v-if="board.type_access === 1"
        class="bg-[#e5e5e5] rounded-lg p-3 column-width mr-3"
      >
        <div
          class="flex justify-center items-center h-full w-full cursor-pointer"
          @click="clickAddColumn"
        >
          <p
            class="text-[#444444] font-['Tahoma'] text-sm"
          >
            Добавить колонку
          </p>
          <!-- Плюсик -->
          <svg
            class="ml-2"
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.5 0.5C4.84625 0.5 4.31629 1.02997 4.31629 1.68371V4.31629H1.68371C1.02997 4.31629 0.5 4.84625 0.5 5.5C0.5 6.15375 1.02997 6.68371 1.68371 6.68371H4.31629V9.31629C4.31629 9.97003 4.84625 10.5 5.5 10.5C6.15375 10.5 6.68371 9.97003 6.68371 9.31629V6.68371H9.31629C9.97003 6.68371 10.5 6.15375 10.5 5.5C10.5 4.84625 9.97003 4.31629 9.31629 4.31629H6.68371V1.68371C6.68371 1.02997 6.15375 0.5 5.5 0.5Z"
              fill="black"
              fill-opacity="0.5"
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
import * as BOARD from '@/store/actions/boards'
import * as CARD from '@/store/actions/cards'

export default {
  components: {
    Popper,
    BoardModalBoxRename,
    BoardModalBoxDelete,
    BoardModalBoxColor,
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
      showColorColumn: false
    }
  },
  computed: {
    selectedColumnName () {
      return this.selectedColumn?.Name ?? ''
    },
    selectedColumnColor () {
      return this.selectedColumn?.Color ?? ''
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
