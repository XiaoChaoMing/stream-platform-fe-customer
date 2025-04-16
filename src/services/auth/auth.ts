import type { User } from "@/store/types";
import { BaseService } from "../base/base";
import { PATH } from "@/constants/path";

interface AuthResponse {
  user: User;
  access_token: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  role_id: number;
}

class AuthService extends BaseService {
  private apiUrl: string;

  constructor() {
    super();
    this.apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  }

  async login(username: string, password: string): Promise<User> {
    try {
      const response = await this.post<AuthResponse>("/auth/login", {
        username,
        password
      } as LoginRequest);

      // Store token
      localStorage.setItem("token", response.access_token);
      return response.user;
    } catch (error) {
      // For development/testing, return mock user if API is not available
      if (username === "john" && password === "123456") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          role: "admin"
        };
      }
      throw error;
    }
  }

  async register(
    username: string,
    password: string,
    email: string,
    role_id: number = 1
  ): Promise<User> {
    try {
      const response = await this.post<AuthResponse>("/auth/register", {
        username,
        password,
        email,
        role_id
      } as RegisterRequest);

      // Store token
      localStorage.setItem("token", response.access_token);
      return response.user;
    } catch (error) {
      throw error;
    }
  }

  async loginWithGoogle(): Promise<void> {
    const callbackUrl = `${window.location.origin}${PATH.OAUTH_CALLBACK}`;
    window.location.href = `${this.apiUrl}/auth/google?callback=${encodeURIComponent(callbackUrl)}`;
  }

  async logout(): Promise<void> {
    localStorage.removeItem("token");
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      return await this.get<User>("/auth/me");
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
