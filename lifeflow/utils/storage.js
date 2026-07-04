/** @typedef {'expense' | 'income'} TransactionType */
/** @typedef {'high' | 'medium' | 'low'} TaskPriority */

/**
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {number} amount
 * @property {TransactionType} type
 * @property {string} category
 * @property {string} note
 * @property {string} date
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {boolean} completed
 * @property {TaskPriority} priority
 * @property {string} dueDate
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Category
 * @property {string} name
 * @property {string} icon
 * @property {TransactionType} type
 */

const TRANSACTIONS_KEY = 'lifeflow_transactions';
const TASKS_KEY = 'lifeflow_tasks';

export const expenseCategories = [
  { name: 'Groceries', icon: 'shopping_bag', type: 'expense' },
  { name: 'Dining', icon: 'restaurant', type: 'expense' },
  { name: 'Transport', icon: 'directions_bus', type: 'expense' },
  { name: 'Entertainment', icon: 'movie', type: 'expense' },
  { name: 'Shopping', icon: 'shopping_cart', type: 'expense' },
  { name: 'Health', icon: 'fitness_center', type: 'expense' },
  { name: 'Bills', icon: 'receipt_long', type: 'expense' },
  { name: 'Other', icon: 'more_horiz', type: 'expense' },
];

export const incomeCategories = [
  { name: 'Salary', icon: 'payments', type: 'income' },
  { name: 'Bonus', icon: 'celebration', type: 'income' },
  { name: 'Investment', icon: 'trending_up', type: 'income' },
  { name: 'Freelance', icon: 'work', type: 'income' },
  { name: 'Other', icon: 'more_horiz', type: 'income' },
];

export function getTransactions() {
  try {
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTransaction(transaction) {
  const transactions = getTransactions();
  const exists = transactions.find(t => t.id === transaction.id);
  if (exists) {
    const index = transactions.indexOf(exists);
    transactions[index] = transaction;
  } else {
    transactions.unshift(transaction);
  }
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  return transactions;
}

export function deleteTransaction(id) {
  const transactions = getTransactions();
  const filtered = transactions.filter(t => t.id !== id);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(filtered));
  return filtered;
}

export function getTasks() {
  try {
    const data = localStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTask(task) {
  const tasks = getTasks();
  const exists = tasks.find(t => t.id === task.id);
  if (exists) {
    const index = tasks.indexOf(exists);
    tasks[index] = task;
  } else {
    tasks.unshift(task);
  }
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  return tasks;
}

export function toggleTask(id) {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }
  return tasks;
}

export function deleteTask(id) {
  const tasks = getTasks();
  const filtered = tasks.filter(t => t.id !== id);
  localStorage.setItem(TASKS_KEY, JSON.stringify(filtered));
  return filtered;
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

export function getTodayTransactions() {
  const transactions = getTransactions();
  const today = new Date().toDateString();
  return transactions.filter(t => new Date(t.date).toDateString() === today);
}

export function getTodayTasks() {
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

  const categoryStats = {};
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