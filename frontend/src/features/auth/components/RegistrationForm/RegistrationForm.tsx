import { useState } from 'react'
import type { RegisterPayload } from '../../domain/types/auth.types'
import { registerUserApi } from '@features/auth/api/auth.api'
import { userSchema } from '@schemas/userSchema'

export default function RegisterForm() {
  const [form, setForm] = useState<RegisterPayload>({
    email: '',
    password: '',
    username: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = userSchema.safeParse(form)

    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.message)
      alert(messages.join('\n'))
      return
    }

    try {
      const response = await registerUserApi(form)
      alert('Registration successful')
      localStorage.setItem('token', response.data.token)
    } catch {
      alert('Registration error')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        type="email"
      />
      <input
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
        type="password"
      />
      <button type="submit">Register</button>
    </form>
  )
}
