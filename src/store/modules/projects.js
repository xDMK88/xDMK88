import {
  PUSH_PROJECT
} from '../actions/projects'

const state = {
  projects: {}
}

const getters = {
}

const actions = {
}

const mutations = {
  [PUSH_PROJECT]: (state, projects) => {
    for (const project of projects) {
      state.projects[project.uid] = project
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
