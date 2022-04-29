<template>
  <div
    class="description-content"
    @click="editComment"
  >
    <div
      v-linkify:options="{ className: 'text-blue-600' }"
      class="dark:text-gray-100 text-base"
      :contenteditable="isEditable"
      :data-placeholder="placeholderComment()"
      @blur="changeComment($event)"
      @keyup="changeComment($event)"
      @focusout="removeEditComment($event)"
      v-html="getFixedCommentText()"
    />
  </div>
</template>

<script>
import linkify from 'vue-linkify'

export default {
  directives: {
    linkify
  },
  props: {
    canEdit: {
      type: Boolean,
      default: false
    },
    comment: {
      type: String,
      default: ''
    }
  },
  emits: ['changeComment', 'endChangeComment'],
  data: () => ({
    isEditable: false,
    currText: ''
  }),
  watch: {
    comment: {
      immediate: true,
      handler: function (val) {
        this.currText = val
      }
    }
  },
  methods: {
    getFixedCommentText () {
      return this.comment.replaceAll('\n', '<br/>')
    },
    placeholderComment () {
      if (this.canEdit) return 'Добавить заметку...'
      return ''
    },
    editComment () {
      if (!this.canEdit) return
      this.isEditable = true
    },
    /**
     * @param {Element} el
     * @returns {String}
     */
    getElementText (el) {
      // пытаемся достать текст из едита браузера
      // в котором сейчас идет ввод через Selection
      if (typeof window.getSelection !== 'undefined') {
        const sel = window.getSelection()
        const tempRange = sel.getRangeAt(0)
        sel.removeAllRanges()
        const range = document.createRange()
        range.selectNodeContents(el)
        sel.addRange(range)
        const text = sel.toString()
        sel.removeAllRanges()
        sel.addRange(tempRange)
        return text.trim()
      }
      return el.innerText.trim()
    },
    removeEditComment (e) {
      if (!this.canEdit) return
      this.isEditable = false
      // чтобы у нас в интерфейсе поменялось
      // потому что на changeComment он только
      // на сервер отправляет и всё
      this.$emit('endChangeComment', this.currText)
    },
    changeComment (e) {
      if (!this.canEdit) return
      const text = this.getElementText(e.target)
      if (text === this.currText) return
      this.currText = text
      this.$emit('changeComment', text)
    }
  }
}
</script>

<style scoped>
h2{
  font-size: 10px;
}

.description-content {
  width: 100%;
  font-size: 14px;
  padding-right: 5px;
  min-height: 100px;
  display: inline-block;
}
.description-content div:empty:before {
  content: attr(data-placeholder);
  color: gray;
}
</style>
