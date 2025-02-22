import { IHttpClient } from '../application/IHTTPClient.js';
import { ResourceNotFoundError, UnauthorizedError } from '../domain/Exceptions.js';

export class FetchHttpClient implements IHttpClient {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) throw new ResourceNotFoundError()
      if (response.status === 401) throw new UnauthorizedError()

      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  async post<T>(url: string, body: any): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  async delete<T>(url: string): Promise<T>  {
    const response = await fetch(url, {method: 'DELETE'})

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
  }
}
