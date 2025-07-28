import { useState } from 'react'
import type { RegisterPayload } from './types'
import { registerUser } from '../../api/auth'

export default function RegisterForm() {
  const [form, setForm] = useState<RegisterPayload>({
    email: '',
    password: '',
    name: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await registerUser(form)
      alert('Регистрация успешна')
    } catch {
      alert('Ошибка регистрации')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Имя"
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
        placeholder="Пароль"
        type="password"
      />
      <button type="submit">Зарегистрироваться</button>
    </form>
  )
}
