import { useEffect, useRef } from 'react';
import { getTasks } from '@/utils/storage';

const REMINDER_KEY = 'lifeflow_reminded_tasks';
const REMINDER_INTERVAL = 60000;
const REMINDER_THRESHOLD = 5 * 60 * 1000;

function getRemindedTasks(): Set<string> {
  try {
    const data = localStorage.getItem(REMINDER_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      const today = new Date().toDateString();
      const expired = Object.keys(parsed).filter(date => date !== today);
      expired.forEach(date => delete parsed[date]);
      localStorage.setItem(REMINDER_KEY, JSON.stringify(parsed));
      return new Set(parsed[today] || []);
    }
  } catch {
    console.error('Failed to read reminded tasks');
  }
  return new Set();
}

function saveRemindedTask(taskId: string): void {
  try {
    const today = new Date().toDateString();
    const data = localStorage.getItem(REMINDER_KEY);
    const parsed = data ? JSON.parse(data) : {};
    if (!parsed[today]) {
      parsed[today] = [];
    }
    if (!parsed[today].includes(taskId)) {
      parsed[today].push(taskId);
      localStorage.setItem(REMINDER_KEY, JSON.stringify(parsed));
    }
  } catch {
    console.error('Failed to save reminded task');
  }
}

function useReminder() {
  const remindedRef = useRef<Set<string>>(getRemindedTasks());
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const requestPermission = async () => {
      if ('Notification' in window && Notification.permission === 'default') {
        try {
          await Notification.requestPermission();
        } catch {
          console.error('Failed to request notification permission');
        }
      }
    };

    requestPermission();

    const checkTasks = () => {
      const now = Date.now();
      const tasks = getTasks();
      const reminded = remindedRef.current;

      tasks.forEach(task => {
        if (task.completed) return;
        if (reminded.has(task.id)) return;

        const dueDate = new Date(task.dueDate).getTime();
        const timeLeft = dueDate - now;

        if (timeLeft > 0 && timeLeft <= REMINDER_THRESHOLD) {
          if ('Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification('任务提醒', {
                body: `${task.title} 即将到期`,
                icon: '/favicon.ico',
                tag: `task-${task.id}`,
              });
              saveRemindedTask(task.id);
              remindedRef.current.add(task.id);
            } catch {
              console.error('Failed to show notification');
            }
          }
        }
      });

      remindedRef.current = getRemindedTasks();
    };

    checkTasks();

    intervalRef.current = window.setInterval(checkTasks, REMINDER_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
}

export default useReminder;
