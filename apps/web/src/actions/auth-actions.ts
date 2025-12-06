'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return {
      error: 'Email e senha são obrigatórios',
      success: false,
    };
  }

  try {
    // Usa 127.0.0.1 em vez de localhost para evitar problemas de DNS no servidor
    const apiUrl = process.env.API_URL || 'http://127.0.0.1:3333';
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout

    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = 'Credenciais inválidas';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // Se não conseguir ler JSON, usa a mensagem padrão
        if (response.status === 401) {
          errorMessage = 'Email ou senha incorretos';
        } else if (response.status === 400) {
          errorMessage = 'Dados inválidos. Verifique os campos.';
        } else {
          errorMessage = `Erro do servidor: ${response.status} ${response.statusText}`;
        }
      }

      return {
        error: errorMessage,
        success: false,
      };
    }

    const data = await response.json();
    const accessToken = data.access_token;

    if (!accessToken) {
      return {
        error: 'Token não recebido do servidor',
        success: false,
      };
    }

    // Define o cookie de sessão
    const cookieStore = await cookies();
    cookieStore.set('session', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 horas
      sameSite: 'lax',
    });

    // Redireciona para a home
    // redirect() lança uma exceção especial que não deve ser capturada
    redirect('/');
  } catch (error) {
    // NEXT_REDIRECT é uma exceção especial do Next.js que não deve ser tratada como erro
    if (error && typeof error === 'object' && 'digest' in error && error.digest?.includes('NEXT_REDIRECT')) {
      throw error; // Re-lança o redirect para que o Next.js o processe corretamente
    }

    console.error('Erro ao fazer login:', error);
    
    let errorMessage = 'Erro ao conectar com o servidor. Verifique se o backend está rodando.';
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = 'Timeout: O servidor demorou muito para responder. Tente novamente.';
      } else if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:3333';
      } else {
        errorMessage = `Erro: ${error.message}`;
      }
    }

    return {
      error: errorMessage,
      success: false,
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/login');
}

