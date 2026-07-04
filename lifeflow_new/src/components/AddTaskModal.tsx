import { useState, useEffect } from 'react';
import { Flag } from 'lucide-react';
import type { TaskPriority } from '@/types';
import { saveTask } from '@/utils/storage';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

function AddTaskModal({ isOpen, onClose, onSave }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setPriority('medium');
      setDueDate(new Date().toISOString().split('T')[0]);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('请输入任务名称');
      return;
    }
    if (!dueDate) {
      alert('请选择截止日期');
      return;
    }

    saveTask({
      title: title.trim(),
      completed: false,
      priority,
      dueDate,
    });

    onSave();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1A1A1F] w-full max-w-md rounded-t-3xl p-6 pb-12 animate-slide-up">
        <div className="w-12 h-1.5 bg-[#27272A] rounded-full mx-auto mb-6" />
        <h2 className="text-xl font-bold text-[#F8FAFC] mb-6 text-center">新建任务</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-[#94A3B8] text-xs font-medium tracking-widest uppercase mb-2 block">任务名称</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入任务名称..."
              className="bg-[#0B0B0F] border border-[#27272A] rounded-xl px-4 py-3 text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#10B981] w-full text-lg font-semibold"
            />
          </div>

          <div>
            <label className="text-[#94A3B8] text-xs font-medium tracking-widest uppercase mb-3 block">优先级</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setPriority('high')}
                className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-all ${
                  priority === 'high'
                    ? 'bg-[#EF4444]/10 border-2 border-[#EF4444]/50'
                    : 'bg-[#0B0B0F] border-2 border-transparent hover:opacity-80'
                }`}
              >
                <Flag size={24} className="text-[#EF4444]" />
                <span className="text-[#EF4444] text-xs font-bold">高</span>
              </button>
              <button
                onClick={() => setPriority('medium')}
                className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-all ${
                  priority === 'medium'
                    ? 'bg-[#F59E0B]/10 border-2 border-[#F59E0B]/50'
                    : 'bg-[#0B0B0F] border-2 border-transparent hover:opacity-80'
                }`}
              >
                <Flag size={24} className="text-[#F59E0B]" />
                <span className="text-[#F59E0B] text-xs font-bold">中</span>
              </button>
              <button
                onClick={() => setPriority('low')}
                className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-all ${
                  priority === 'low'
                    ? 'bg-[#27272A] border-2 border-[#94A3B8]/50'
                    : 'bg-[#0B0B0F] border-2 border-transparent hover:opacity-80'
                }`}
              >
                <Flag size={24} className="text-[#94A3B8]" />
                <span className="text-[#94A3B8] text-xs font-bold">低</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-[#94A3B8] text-xs font-medium tracking-widest uppercase mb-2 block">截止日期</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-[#0B0B0F] border border-[#27272A] rounded-xl px-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#10B981] w-full"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-[#10B981] text-white rounded-full px-6 py-4 font-medium hover:bg-[#059669] transition-colors w-full mt-4 text-lg"
          >
            创建任务
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default AddTaskModal;
