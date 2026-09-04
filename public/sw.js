self.addEventListener('push', (event) => {
  let data = {
    title: 'Agenda Familiar',
    body: 'Tienes una nueva notificación',
    url: '/'
  }

  if (event.data) {
    try {
      data = {
        ...data,
        ...event.data.json()
      }
    } catch {
      data.body = event.data.text()
    }
  }

  const options = {
    body: data.body,
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    data: {
      url: data.url || '/'
    },
    vibrate: [200, 100, 200]
  }

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'Agenda Familiar',
      options
    )
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const url = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(url)
          return client.focus()
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})