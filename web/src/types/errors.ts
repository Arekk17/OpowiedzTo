export interface ApiErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public error: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Mapowanie statusów HTTP na domyślne komunikaty po polsku
export const ERROR_MESSAGES: Record<number, string> = {
  400: "Nieprawidłowe dane wejściowe",
  401: "Nieprawidłowy email lub hasło",
  403: "Brak dostępu",
  404: "Nie znaleziono",
  409: "Email już istnieje w systemie",
  500: "Błąd serwera. Spróbuj ponownie później",
};
