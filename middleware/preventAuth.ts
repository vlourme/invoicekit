import { Middleware } from '@nuxt/types'

const preventAuthMiddleware: Middleware = ({ store, redirect }) => {
  if (store.state.auth.auth) {
    redirect('/dashboard')
  }
}

export default preventAuthMiddleware
