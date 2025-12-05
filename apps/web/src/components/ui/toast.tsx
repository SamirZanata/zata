'use client';

// Função simples para mostrar toast (usa alert por enquanto)
export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  // Por enquanto, usa um alert simples
  // Em produção, pode ser substituído por uma biblioteca como sonner ou react-hot-toast
  if (type === 'error') {
    window.alert(`❌ ${message}`);
  } else if (type === 'success') {
    window.alert(`✅ ${message}`);
  } else {
    window.alert(`ℹ️ ${message}`);
  }
}

