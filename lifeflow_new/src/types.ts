export type TransactionType = 'expense' | 'income';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  note: string;
  date: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
}
