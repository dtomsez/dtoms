export type TaskStatus = 'ยังไม่เริ่ม' | 'กำลังทำ' | 'เสร็จสิ้น';
export type TaskPriority = 'สูง' | 'กลาง' | 'ต่ำ';
export type UserRole = 'employee' | 'manager';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  position: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeIds: string[];
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export const STATUS_COLUMNS: TaskStatus[] = ['ยังไม่เริ่ม', 'กำลังทำ', 'เสร็จสิ้น'];

export const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string; border: string }> = {
  'ยังไม่เริ่ม': {
    label: 'ยังไม่เริ่ม',
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    border: 'border-slate-300',
  },
  'กำลังทำ': {
    label: 'กำลังทำ',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
  },
  'เสร็จสิ้น': {
    label: 'เสร็จสิ้น',
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-300',
  },
};

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; bg: string; dot: string }> = {
  'สูง': { label: 'สูง', color: 'text-red-700', bg: 'bg-red-100', dot: 'bg-red-500' },
  'กลาง': { label: 'กลาง', color: 'text-orange-700', bg: 'bg-orange-100', dot: 'bg-orange-500' },
  'ต่ำ': { label: 'ต่ำ', color: 'text-blue-700', bg: 'bg-blue-100', dot: 'bg-blue-400' },
};
