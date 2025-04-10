import type { User } from "@/store/types";
import { BaseService } from "../base/base";

interface LoginResponse {
  user: User;
  token: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

class AuthService extends BaseService {
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await this.post<LoginResponse>("/auth/login", {
        email,
        password
      } as LoginRequest);

      // Store token
      localStorage.setItem("token", response.token);
      return response.user;
    } catch (error) {
      // For development/testing, return mock user if API is not available
      if (email === "john@example.com" && password === "123456") {
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
