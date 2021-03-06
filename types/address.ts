import { Model } from './model'

export interface Address extends Model {
  street: string
  zip: string
  city: string
  country: string
}

export const defaultAddress = (): Address => ({
  street: '',
  zip: '',
  city: '',
  country: '',
})
