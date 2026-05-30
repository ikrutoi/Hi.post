import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from '../domain/types/auth.types'
import type { AuthRepository } from './authRepository'

const MOCK_USERS_KEY = 'hi.post.mockAuth.users'

type MockStoredUser = {
  id: string
  name: string
  email: string
  password: string
}

const DEV_USER: MockStoredUser = {
  id: 'dev-user',
  name: 'Dev User',
  email: 'dev@hi.com',
  password: 'dev123456',
}

function delay(ms = 350): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/** Dev account is always available with known credentials. */
function upsertDevUser(users: MockStoredUser[]): MockStoredUser[] {
  const devEmail = normalizeEmail(DEV_USER.email)
  const rest = users.filter(
    (user) => normalizeEmail(user.email) !== devEmail,
  )
  return [DEV_USER, ...rest]
}

function readMockUsers(): MockStoredUser[] {
  const raw = window.localStorage.getItem(MOCK_USERS_KEY)
  let users: MockStoredUser[]

  if (!raw) {
    users = upsertDevUser([])
  } else {
    try {
      const parsed = JSON.parse(raw) as MockStoredUser[]
      users = upsertDevUser(Array.isArray(parsed) ? parsed : [])
    } catch {
      users = upsertDevUser([])
    }
  }

  const serialized = JSON.stringify(users)
  if (raw !== serialized) {
    window.localStorage.setItem(MOCK_USERS_KEY, serialized)
  }

  return users
}

function writeMockUsers(users: MockStoredUser[]): void {
  window.localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
}

function toAuthResponse(user: MockStoredUser): AuthResponse {
  const profile: User = {
    id: user.id,
    name: user.name,
    email: user.email,
  }
  return {
    user: profile,
    token: `mock.${user.id}.${Date.now()}`,
  }
}

function findUser(email: string): MockStoredUser | undefined {
  const normalized = normalizeEmail(email)
  return readMockUsers().find(
    (user) => normalizeEmail(user.email) === normalized,
  )
}

export const mockAuthRepository: AuthRepository = {
  async login(payload) {
    await delay()
    const user = findUser(payload.email)
    const password = payload.password.trim()
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password')
    }
    return toAuthResponse(user)
  },

  async register(payload) {
    await delay()
    if (findUser(payload.email)) {
      throw new Error('Email is already registered')
    }

    const name =
      'name' in payload && typeof payload.name === 'string'
        ? payload.name
        : 'username' in payload && typeof payload.username === 'string'
          ? payload.username
          : payload.email.split('@')[0] ?? 'User'

    const nextUser: MockStoredUser = {
      id: `user-${Date.now()}`,
      name,
      email: payload.email.trim(),
      password: payload.password,
    }

    writeMockUsers([...readMockUsers(), nextUser])
    return toAuthResponse(nextUser)
  },
}
