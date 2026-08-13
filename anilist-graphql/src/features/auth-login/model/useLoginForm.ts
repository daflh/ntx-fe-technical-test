import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { sessionApi, useSessionStore } from '@/entities/session'
import { ApiError } from '@/shared/api/apiError'
import { loginSchema } from './loginSchema'

export function useLoginForm() {
  const router = useRouter()
  const route = useRoute()
  const session = useSessionStore()

  const username = ref('')
  const password = ref('')
  const submitting = ref(false)
  const submitError = ref<string | null>(null)

  async function submit(): Promise<void> {
    submitError.value = null

    const parsed = loginSchema.safeParse({ username: username.value, password: password.value })
    if (!parsed.success) {
      submitError.value = parsed.error.issues[0]?.message ?? 'Invalid input.'
      return
    }

    submitting.value = true
    try {
      const user = await sessionApi.login(parsed.data)
      session.setUser(user)
      const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
      await router.push(redirect)
    } catch (err) {
      submitError.value = err instanceof ApiError ? err.message : 'Unable to reach server.'
    } finally {
      submitting.value = false
    }
  }

  function fillDemoUser(role: 'admin' | 'viewer'): void {
    username.value = role
    password.value = role === 'admin' ? 'admin123' : 'viewer123'
  }

  return { username, password, submitting, submitError, submit, fillDemoUser }
}
