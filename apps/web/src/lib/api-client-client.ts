'use client';

export function getAuthHeadersClient(): HeadersInit {
  // Lê o cookie no cliente
  const cookies = document.cookie.split(';');
  const sessionCookie = cookies.find((cookie) =>
    cookie.trim().startsWith('session=')
  );

  if (!sessionCookie) {
    return {
      'Content-Type': 'application/json',
    };
  }

  const token = sessionCookie.split('=')[1];

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

