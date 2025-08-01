import { useState } from 'react'
import type { RegisterPayload } from './authTypes'
import { registerUser } from './api'

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
    try {
      await registerUser(form)
      alert('Registration successful')

      const response = await registerUser(form)
      localStorage.setItem('token', response.token)
    } catch {
      alert('Registration error')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={form.username}
        onChange={handleChange}
        placeholder="Name"
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
