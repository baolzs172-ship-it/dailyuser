import type { Transaction, Task, Category } from '@/types';

const TRANSACTIONS_KEY = 'lifeflow_transactions';
const TASKS_KEY = 'lifeflow_tasks';
const DAILY_QUOTE_KEY = 'lifeflow_daily_quote';

const DEFAULT_QUOTE = '掌控你的生活节奏';
const DEFAULT_SUBQUOTE = '坚持记账，财务自由';

const mockTransactions: Transaction[] = [
  {
    id: 'tx_001',
    amount: 8500,
    type: 'income',
    category: 'Salary',
    note: '七月工资',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx_002',
    amount: 156,
    type: 'expense',
    category: 'Groceries',
    note: '超市购物',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tx_003',
    amount: 45,
    type: 'expense',
    category: 'Dining',
    note: '午餐',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  },
];

const mockTasks: Task[] = [
  {
    id: 'task_001',
    title: '完成项目周报',
    completed: false,
    priority: 'high',
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task_002',
    title: '回复客户邮件',
    completed: true,
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task_003',
    title: '整理桌面文件',
    completed: false,
    priority: 'low',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  },
];

export const expenseCategories: Category[] = [
  { id: 'cat_001', name: 'Groceries', icon: 'ShoppingCart', type: 'expense' },
  { id: 'cat_002', name: 'Dining', icon: 'Utensils', type: 'expense' },
  { id: 'cat_003', name: 'Transport', icon: 'Car', type: 'expense' },
  { id: 'cat_004', name: 'Entertainment', icon: 'Gamepad2', type: 'expense' },
  { id: 'cat_005', name: 'Shopping', icon: 'ShoppingBag', type: 'expense' },
  { id: 'cat_006', name: 'Health', icon: 'Heart', type: 'expense' },
  { id: 'cat_007', name: 'Bills', icon: 'Receipt', type: 'expense' },
  { id: 'cat_008', name: 'Other', icon: 'MoreHorizontal', type: 'expense' },
];

export const incomeCategories: Category[] = [
  { id: 'cat_009', name: 'Salary', icon: 'Wallet', type: 'income' },
  { id: 'cat_010', name: 'Bonus', icon: 'Gift', type: 'income' },
  { id: 'cat_011', name: 'Investment', icon: 'TrendingUp', type: 'income' },
  { id: 'cat_012', name: 'Freelance', icon: 'Briefcase', type: 'income' },
  { id: 'cat_013', name: 'Other', icon: 'MoreHorizontal', type: 'income' },
];

function initMockData(): void {
  if (!localStorage.getItem(TRANSACTIONS_KEY)) {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(mockTransactions));
  }
  if (!localStorage.getItem(TASKS_KEY)) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(mockTasks));
  }
}

initMockData();

export function getTransactions(): Transaction[] {
  try {
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction[] {
  const transactions = getTransactions();
  const newTransaction: Transaction = {
    ...transaction,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  transactions.unshift(newTransaction);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  return transactions;
}

export function deleteTransaction(id: string): Transaction[] {
  const transactions = getTransactions();
  const filtered = transactions.filter(t => t.id !== id);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(filtered));
  return filtered;
}

export function getTasks(): Task[] {
  try {
    const data = localStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTask(task: Omit<Task, 'id' | 'createdAt'>): Task[] {
  const tasks = getTasks();
  const newTask: Task = {
    ...task,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  tasks.unshift(newTask);
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  return tasks;
}

export function toggleTask(id: string): Task[] {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }
  return tasks;
}

export function deleteTask(id: string): Task[] {
  const tasks = getTasks();
  const filtered = tasks.filter(t => t.id !== id);
  localStorage.setItem(TASKS_KEY, JSON.stringify(filtered));
  return filtered;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return '今天';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return '昨天';
  }
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

export function getTodayTransactions(): Transaction[] {
  const transactions = getTransactions();
  const today = new Date().toDateString();
  return transactions.filter(t => new Date(t.date).toDateString() === today);
}

export function getTodayTasks(): Task[] {
  const tasks = getTasks();
  const today = new Date().toDateString();
  return tasks.filter(t => new Date(t.dueDate).toDateString() === today);
}

export function getMonthlyStats(month = new Date().getMonth(), year = new Date().getFullYear()) {
  const transactions = getTransactions();
  const filtered = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });

  const income = filtered
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = filtered
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const categoryStats: Record<string, number> = {};
  filtered.filter(t => t.type === 'expense').forEach(t => {
    categoryStats[t.category] = (categoryStats[t.category] || 0) + t.amount;
  });

  return { income, expense, balance: income - expense, categoryStats, total: filtered.length };
}

export function getTaskStats() {
  const tasks = getTasks();
  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed).length;
  
  const weeklyData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toDateString();
    const dayTasks = tasks.filter(t => new Date(t.dueDate).toDateString() === dateStr);
    const completedCount = dayTasks.filter(t => t.completed).length;
    weeklyData.push({
      day: date.toLocaleDateString('zh-CN', { weekday: 'short' }),
      total: dayTasks.length,
      completed: completedCount,
    });
  }

  return { completed, total, highPriority, weeklyData };
}

export function getDailyQuote(): { quote: string; subquote: string } {
  try {
    const data = localStorage.getItem(DAILY_QUOTE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    console.error('Failed to read daily quote');
  }
  return { quote: DEFAULT_QUOTE, subquote: DEFAULT_SUBQUOTE };
}

export function saveDailyQuote(quote: string): { quote: string; subquote: string } {
  const trimmed = quote.trim().slice(0, 50);
  const finalQuote = trimmed || DEFAULT_QUOTE;
  const data = { quote: finalQuote, subquote: DEFAULT_SUBQUOTE };
  localStorage.setItem(DAILY_QUOTE_KEY, JSON.stringify(data));
  return data;
}
