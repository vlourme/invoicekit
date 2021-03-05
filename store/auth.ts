import { ActionTree, MutationTree } from 'vuex/types/index'
import firebase from 'firebase'
import Auth from '~/types/auth'
import User from '~/types/user'
import { mapDocument } from '~/helpers/DocumentMapper'

export const state = () => ({
  auth: null as Auth | null,
  user: null as User | null,
})

export type AuthModuleState = ReturnType<typeof state>

export const mutations: MutationTree<AuthModuleState> = {
  SET_AUTH_USER: (state, authUser: firebase.User) => {
    state.auth = {
      uid: authUser.uid,
      email: authUser.email,
    }
  },

  SET_USER: (state, user: User) => {
    state.user = user
  },
}

export const actions: ActionTree<AuthModuleState, AuthModuleState> = {
  async onAuthStateChanged(
    { commit, dispatch },
    { authUser }: { authUser: firebase.User }
  ): Promise<void> {
    if (!authUser) {
      commit('RESET_STORE')
      return
    }

    // Refresh token

    try {
      await authUser.getIdToken(false)
    } catch (e) {
      console.error(e)
    }

    // Commit
    commit('SET_AUTH_USER', authUser)

    // Get user
    await dispatch('getUser')

    // Get teams
    await dispatch('team/getTeams', authUser.uid, { root: true })
  },

  getUser({ commit, state }): void {
    this.$fire.firestore
      .collection('users')
      .doc(state.auth?.uid)
      .onSnapshot((snapshot) => {
        commit('SET_USER', mapDocument<User>(snapshot))
      })
  },
}