export const useRuLabels = () => {
  const bookingStatusMap: Record<string, string> = {
    pending: 'В ожидании',
    approved: 'Одобрено',
    rejected: 'Отклонено',
    cancelled: 'Отменено',
    arrived: 'Прибыл',
    left: 'Выехал',
    completed: 'Завершено'
  }

  const roleMap: Record<string, string> = {
    admin: 'Администратор',
    guard: 'Охрана',
    tenant: 'Арендатор'
  }

  const actionMap: Record<string, string> = {
    INSERT: 'Создание',
    UPDATE: 'Обновление',
    DELETE: 'Удаление'
  }

  const tableMap: Record<string, string> = {
    bookings: 'Бронирования',
    zones: 'Зоны',
    profiles: 'Профили',
    settings: 'Настройки',
    notifications: 'Уведомления',
    closures: 'Ограничения'
  }

  const bookingStatusLabel = (value?: string | null) => {
    if (!value) {
      return ''
    }
    return bookingStatusMap[value] || value
  }

  const roleLabel = (value?: string | null) => {
    if (!value) {
      return ''
    }
    return roleMap[value] || value
  }

  const actionLabel = (value?: string | null) => {
    if (!value) {
      return ''
    }
    return actionMap[value] || value
  }

  const tableLabel = (value?: string | null) => {
    if (!value) {
      return ''
    }
    return tableMap[value] || value
  }

  return {
    bookingStatusLabel,
    roleLabel,
    actionLabel,
    tableLabel
  }
}
