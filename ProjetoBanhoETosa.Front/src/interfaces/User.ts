export interface User {
    id?: number;
    name: string;
    email: string;
    password?: string;
    role?: string;
    created_at?: string;
    updated_at?: string;
}

// DTO usado em formulários (login/registro) e nas chamadas à API
export interface UserDTO {
    id?: number;
    name?: string;
    email: string;
    password: string;
    confirmPassword?: string;
}
