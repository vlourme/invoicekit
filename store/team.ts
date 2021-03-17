import { ActionTree, GetterTree, MutationTree } from 'vuex/types/index'
import RootState from '~/store'
import { MemberPermission, Team } from '~/types/team'

export const state = () => ({
  teams: null as { [key: string]: Team } | null,
  team: null as Team | null,
})

export type TeamModuleState = ReturnType<typeof state>

export const getters: GetterTree<TeamModuleState, RootState> = {
  isOwner(state, _getters, rootState): boolean {
    return state.team?.owner === rootState.auth.auth?.uid
  },

  isAdmin(state, _getters, rootState): boolean {
    return (
      state.team?.owner === rootState.auth.auth?.uid ||
      state.team?.members[rootState.auth.auth?.uid!] === 2
    )
  },

  role(state, _getters, rootState): MemberPermission | undefined {
    const uid = rootState.auth.auth?.uid
    return state.team?.members[uid ?? '']
  },
}

export const mutations: MutationTree<TeamModuleState> = {
  SET_TEAM: (state, team: Team) => {
    state.team = team
  },

  SET_TEAMS: (state, teams: Record<string, Team>) => {
    state.teams = teams
  },
}

export const actions: ActionTree<TeamModuleState, RootState> = {
  /**
   * Get teams user belong to
   */
  async getTeams({ commit, dispatch, rootState }): Promise<void> {
    const uid = rootState.auth.auth?.uid

    const ref = this.$fire.firestore
      .collection('teams')
      .where(`members.${uid}`, '>=', 0)

    const doc = await ref.get()

    const teams = doc.docs.reduce(
      (ac, a) => ({ ...ac, [a.id]: a.data() }),
      {}
    ) as { [key: string]: Team }

    if (rootState.auth.user && rootState.auth.user.team) {
      if (teams[rootState.auth.user.team]) {
        commit('SET_TEAM', teams[rootState.auth.user.team])
      } else {
        dispatch('switchTeam', null)
      }
    }

    commit('SET_TEAMS', teams)
  },

  async switchTeam({ rootState }, id: string | null): Promise<void> {
    await this.$fire.firestore
      .collection('users')
      .doc(rootState.auth.auth?.uid)
      .update({
        ...rootState.auth.user,
        team: id,
      })

    this.$router.go(0)
  },
}
