import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import type { Task, TaskPriority } from '@/types';
import { toggleTask, deleteTask } from '@/utils/storage';

interface TasksProps {
  tasks: Task[];
  onRefresh: () => void;
  onAddTask: () => void;
}

function Tasks({ tasks, onRefresh, onAddTask }: TasksProps) {
  const [taskDate, setTaskDate] = useState(new Date());

  const handlePrevDay = () => {
    const newDate = new Date(taskDate);
    newDate.setDate(newDate.getDate() - 1);
    setTaskDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(taskDate);
    newDate.setDate(newDate.getDate() + 1);
    setTaskDate(newDate);
  };

  const today = new Date();
  const isToday = taskDate.toDateString() === today.toDateString();
  const isTomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString() === taskDate.toDateString();
  const isYesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000).toDateString() === taskDate.toDateString();

  const dateLabel = isToday ? '今天' : isTomorrow ? '明天' : isYesterday ? '昨天' : '';
  const dateInfo = taskDate.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', weekday: 'short' });

  const dateStr = taskDate.toDateString();
  const dayTasks = tasks.filter(t => new Date(t.dueDate).toDateString() === dateStr);
  
  const completed = dayTasks.filter(t => t.completed).length;
  const total = dayTasks.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleToggle = (id: string) => {
    toggleTask(id);
    onRefresh();
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个任务吗？')) {
      deleteTask(id);
      onRefresh();
    }
  };

  const getPriorityClass = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/20';
      case 'medium':
        return 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/20';
      default:
        return 'bg-[#27272A] text-[#94A3B8]';
    }
  };

  const sortedTasks = [...dayTasks].sort((a, b) => {
    const priorityOrder: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="p-4 space-y-6">
      <div className="bg-[#1A1A1F] rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
        <div className="flex justify-between items-center">
          <button onClick={handlePrevDay} className="w-10 h-10 rounded-full bg-[#0B0B0F] flex items-center justify-center text-[#F8FAFC] hover:bg-[#27272A] transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-[#F8FAFC]">
              {dateLabel && `${dateLabel} `}{dateInfo}
            </h2>
          </div>
          <button onClick={handleNextDay} className="w-10 h-10 rounded-full bg-[#0B0B0F] flex items-center justify-center text-[#F8FAFC] hover:bg-[#27272A] transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#94A3B8] text-sm">今日进度</span>
            <span className="text-[#10B981] text-sm font-medium">{completed}/{total} ({percentage}%)</span>
          </div>
          <div className="h-2 bg-[#0B0B0F] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#10B981] transition-all duration-500 ease-out" 
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-[#F8FAFC]">任务列表</h3>
          <span className="bg-[#10B981]/10 text-[#10B981] px-3 py-1 rounded-full text-xs font-medium">
            {total - completed} 进行中
          </span>
        </div>
        <div className="space-y-3">
          {sortedTasks.length === 0 ? (
            <div className="bg-[#1A1A1F] rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center gap-3">
              <Calendar size={48} className="text-[#27272A]" />
              <span className="text-[#94A3B8] text-center">今日暂无任务，点击+添加</span>
            </div>
          ) : (
            sortedTasks.map(task => (
              <div
                key={task.id}
                className="bg-[#1A1A1F] rounded-2xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex items-center gap-4 group"
              >
                <button
                  onClick={() => handleToggle(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    task.completed
                      ? 'bg-[#10B981] border-[#10B981] scale-110'
                      : 'border-[#4B5563] hover:border-[#10B981] hover:scale-105'
                  }`}
                >
                  {task.completed && (
                    <CheckCircle2 size={14} className="text-[#003824] animate-check" />
                  )}
                </button>
                <div className="flex-grow">
                  <h4 className={`text-[#F8FAFC] font-medium transition-all duration-300 ${
                    task.completed ? 'line-through opacity-50' : ''
                  }`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-medium border ${getPriorityClass(task.priority)}`}>
                      {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                    </span>
                    <span className="flex items-center gap-1 text-[#94A3B8] text-xs">
                      <Calendar size={12} />
                      {new Date(task.dueDate).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-[#27272A] transition-all"
                >
                  <Trash2 size={16} className="text-[#EF4444]" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-[#1A1A1F] rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
        <p className="text-[#10B981] text-xs font-medium tracking-widest uppercase mb-2">Stay Focused</p>
        <h3 className="text-xl font-semibold text-[#F8FAFC]">专注结果，而非障碍。</h3>
      </div>

      <button
        onClick={onAddTask}
        className="fixed bottom-24 right-4 w-14 h-14 bg-[#10B981] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#059669] hover:scale-110 transition-all duration-300"
      >
        <Plus size={28} />
      </button>

      <style>{`
        @keyframes check {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-check {
          animation: check 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Tasks;
