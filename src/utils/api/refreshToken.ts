import { API } from './client';

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

type TRefreshResult = { ok: true } | { ok: false; error?: FetchBaseQueryError };

let pendingRefresh: {
  token: string;
  request: Promise<TRefreshResult>;
} | null = null;

async function requestTokens(token: string): Promise<TRefreshResult> {
  const url = `${API.url.replace(/\/$/, '')}/auth/token`;

  let response: Response;

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
  } catch (error) {
    return {
      ok: false,
      error: { status: 'FETCH_ERROR', error: String(error) },
    };
  }

  const data: unknown = await response.json().catch(() => null);

  // Пока выполнялся запрос, пользователь мог выйти или войти заново.
  if (localStorage.getItem('refreshToken') !== token) {
    return { ok: false };
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }

    return { ok: false, error: { status: response.status, data } };
  }

  if (
    typeof data !== 'object' ||
    data === null ||
    !('success' in data) ||
    data.success !== true ||
    !('accessToken' in data) ||
    typeof data.accessToken !== 'string' ||
    !data.accessToken ||
    !('refreshToken' in data) ||
    typeof data.refreshToken !== 'string' ||
    !data.refreshToken
  ) {
    return { ok: false };
  }

  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);

  return { ok: true };
}

export async function refreshToken(): Promise<TRefreshResult> {
  const token = localStorage.getItem('refreshToken');

  if (!token) {
    return { ok: false };
  }

  if (pendingRefresh?.token === token) {
    return pendingRefresh.request;
  }

  const request = requestTokens(token);
  pendingRefresh = { token, request };

  try {
    return await request;
  } finally {
    if (pendingRefresh?.request === request) {
      pendingRefresh = null;
    }
  }
}
