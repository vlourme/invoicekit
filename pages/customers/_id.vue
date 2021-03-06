<template>
  <form @submit.prevent="updateCustomer">
    <Header>
      {{ title }}

      <template v-if="role > 0" #actions>
        <base-nav-button type="submit" :disabled="!hasChanges">
          Mettre à jour
        </base-nav-button>
      </template>
    </Header>

    <FormBox>
      <template #description>
        <FormDescription>
          <template #title>Mettre à jour un nouveau client</template>
          <template #description>
            Mettre à jour un client pour lui assigner des adresses, factures et
            contrats.
          </template>
          <template v-if="role > 0" #actions>
            <base-button-inline danger icon="minus" @click.prevent="askDelete">
              Supprimer le client
            </base-button-inline>
          </template>
        </FormDescription>
      </template>

      <extensions-inputs
        :fields="team.extensions.customers.fields"
        :state.sync="customer"
      />
    </FormBox>

    <div v-if="!$fetchState.pending">
      <customers-addresses class="my-4"></customers-addresses>

      <customers-invoices class="my-4"></customers-invoices>

      <customers-contracts class="my-4"> </customers-contracts>
    </div>
  </form>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useContext,
  useFetch,
  useMeta,
  useRoute,
  useStore,
} from '@nuxtjs/composition-api'
import { DialogType } from '~/types/dialog'
import { NotificationType } from '~/types/notification'
import useCustomer from '~/composables/useCustomer'
import { FieldType } from '~/types/team'
import RootState from '~/store'
import {
  getPrimaryKey,
  getInputType,
  getFormattedField,
} from '~/composables/useExtensibleField'
import { Address } from '~/types/address'

export default defineComponent({
  layout: 'dashboard',
  setup() {
    // Context
    const ctx = useContext()
    const meta = useMeta()
    const route = useRoute()
    const store = useStore<RootState>()

    // Data
    const {
      state,
      role,
      hasChanges,
      loadCustomer,
      loadCollection,
      saveCustomer,
      deleteCustomer,
    } = useCustomer()

    // Computed
    const team = computed(() => store.state.team.team!)
    const primary = getPrimaryKey(team.value, 'customers')
    const title = computed(() =>
      getFormattedField(team.value, state.customer.value, 'customers')
    )

    // Fetch data
    useFetch(async () => {
      const id = route.value.params.id
      await loadCustomer(id)
      loadCollection<Address>('addresses', true)

      meta.title.value = `${state.customer.value[primary.value]} — Fiche client`
    })

    const askDelete = (): void => {
      ctx.$dialog({
        title: 'Supprimer cette fiche client',
        message:
          'Tout le contenu associé sera supprimé (factures, contrats, etc.) et irrécuperable.',
        type: DialogType.Error,
        callback: async () => {
          await deleteCustomer()
          ctx.$notify('Le client a été supprimé.', NotificationType.SUCCESS)
        },
        showCancel: true,
        actionMessage: 'Supprimer',
      })
    }

    const updateCustomer = async () => {
      await saveCustomer(true)
      ctx.$notify(
        'Les changements ont étés sauvegardés',
        NotificationType.SUCCESS
      )
    }

    return {
      ...state,
      deleteCustomer,
      updateCustomer,
      hasChanges,
      askDelete,
      primary,
      team,
      FieldType,
      role,
      getInputType,
      title,
    }
  },
  head: {
    title: 'Fiche client',
  },
})
</script>
