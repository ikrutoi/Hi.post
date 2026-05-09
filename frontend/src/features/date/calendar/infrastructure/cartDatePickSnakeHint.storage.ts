/**
 * Один раз за загрузку страницы (in-memory): любая перезагрузка/новая вкладка снова покажет змейку.
 * Поведение «один раз навсегда» (`localStorage`) или «один раз за сессию» (`sessionStorage`)
 * можно вернуть, заменив реализацию ниже.
 */
let cartDatePickSnakeHintDone = false

export function readCartDatePickSnakeHintDone(): boolean {
  return cartDatePickSnakeHintDone
}

export function markCartDatePickSnakeHintDone(): void {
  cartDatePickSnakeHintDone = true
}
