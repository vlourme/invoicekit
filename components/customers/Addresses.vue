<template>
  <Card no-body>
    <template #title>Adresses</template>

    <template #actions>
      <v-btn color="success" text @click="dialog = true">
        <v-icon left>mdi-plus</v-icon>
        Ajouter
      </v-btn>
    </template>

    <v-data-table :items="addresses" :headers="addressHeaders">
      <template #item.actions="{ item }">
        <v-btn color="warning" icon @click="editAddress(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>

        <v-btn color="error" icon @click="deleteAddress(item.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title> Ajouter une adresse </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="address.street"
            label="Numéro et rue"
            placeholder="12 rue des lilas"
          />

          <v-row>
            <v-col>
              <v-text-field
                v-model="address.city"
                label="Ville"
                placeholder="Lille"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="address.zip"
                label="Code postal"
                placeholder="59000"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="address.country"
                label="Pays"
                placeholder="France"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="warning" text @click="dialog = false">Annuler</v-btn>
          <v-btn color="success" text @click="addAddress">Ajouter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Card>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { Address, AddressHeaders } from '@/types/address'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'Addresses',
  props: {
    id: {
      type: String,
      required: true,
    } as PropOptions<string>,
  },
  data: () => ({
    addressHeaders: AddressHeaders,
    addresses: [] as Address[],
    address: {} as Address,
    dialog: false,
    update: false,
  }),
  fetch() {
    this.$fire.firestore
      .collection('teams')
      .doc(this.user.team)
      .collection('customers')
      .doc(this.id)
      .collection('addresses')
      .onSnapshot((snapshot) => {
        this.addresses = snapshot.docs.map(
          (d) =>
            ({
              ...d.data(),
              id: d.id,
            } as Address)
        )
      })
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    async addAddress() {
      if (this.update && this.address.id) {
        await this.$fire.firestore
          .collection('teams')
          .doc(this.user.team)
          .collection('customers')
          .doc(this.id)
          .collection('addresses')
          .doc(this.address.id)
          .update(this.address)
      } else {
        await this.$fire.firestore
          .collection('teams')
          .doc(this.user.team)
          .collection('customers')
          .doc(this.id)
          .collection('addresses')
          .add(this.address)
      }

      this.address = {} as Address
      this.dialog = false
    },

    editAddress(address: Address) {
      this.address = address
      this.update = true
      this.dialog = true
    },

    async deleteAddress(id: string) {
      await this.$fire.firestore
        .collection('teams')
        .doc(this.user.team)
        .collection('customers')
        .doc(this.id)
        .collection('addresses')
        .doc(id)
        .delete()
    },
  },
})
</script>