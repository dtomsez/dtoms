import { create } from 'zustand';
import type { Task, TaskStatus, User } from '../types';
import { MOCK_TASKS, MOCK_USERS } from '../data/mockData';

interface TaskStore {
  tasks: Task[];
  users: User[];
  currentUser: User | null;

  // Auth
  login: (userId: string) => void;
  logout: () => void;

  // Task CRUD
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteTask: (taskId: string) => void;

  // Selectors (computed)
  getTasksByAssignee: (userId: string) => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
  getPersonalTasks: (userId: string) => Task[];
  getUserById: (userId: string) => User | undefined;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: MOCK_TASKS,
  users: MOCK_USERS,
  currentUser: null,

  login: (userId: string) => {
    const user = MOCK_USERS.find((u) => u.id === userId) ?? null;
    set({ currentUser: user });
  },

  logout: () => {
    set({ currentUser: null });
  },

  updateTaskStatus: (taskId: string, status: TaskStatus) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, status, updatedAt: new Date().toISOString() }
          : t
      ),
    }));
  },

  updateTask: (taskId: string, updates: Partial<Task>) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, ...updates, updatedAt: new Date().toISOString() }
          : t
      ),
    }));
  },

  addTask: (task) => {
    const newTask: Task = {
      ...task,
      id: `t${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },

  deleteTask: (taskId: string) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    }));
  },

  getTasksByAssignee: (userId: string) => {
    return get().tasks.filter((t) => t.assigneeIds.includes(userId));
  },

  getTasksByStatus: (status: TaskStatus) => {
    return get().tasks.filter((t) => t.status === status);
  },

  getPersonalTasks: (userId: string) => {
    return get().tasks.filter(
      (t) => t.assigneeIds.includes(userId) && t.status !== 'เสร็จสิ้น'
    );
  },

  getUserById: (userId: string) => {
    return get().users.find((u) => u.id === userId);
  },
}));
