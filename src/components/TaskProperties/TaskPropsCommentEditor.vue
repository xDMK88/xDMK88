<template>
  <div
    class="description-content"
    @click="editComment"
  >
    <div
      v-linkify:options="{ className: 'text-blue-600' }"
      class="dark:text-gray-100"
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
    prevText: ''
  }),
  watch: {
    comment: {
      immediate: true,
      handler: function (val) {
        this.prevText = val
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
      console.log('editComment', this.canEdit, this.comment, this)
      if (!this.canEdit) return
      this.isEditable = true
    },
    removeEditComment (e) {
      if (!this.canEdit) return
      this.isEditable = false
      // чтобы у нас в интерфейсе поменялось
      // потому что на changeComment он только
      // на сервер отправляет и всё
      const message = e.target.innerText.trim()
      this.$emit('endChangeComment', message)
    },
    changeComment (e) {
      if (!this.canEdit) return
      const message = e.target.innerText.trim()
      if (message === this.prevText) return
      this.prevText = message
      this.$emit('changeComment', message)
    }
  }
}
</script>

<style scoped>
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
