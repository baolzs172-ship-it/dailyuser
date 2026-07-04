import { useState, useEffect, useRef } from 'react';
import { TrendingDown, TrendingUp, CheckCircle, Wallet, Plus, ShoppingCart, Utensils, Car, Gamepad2, ShoppingBag, Heart, Receipt, MoreHorizontal, Wallet as WalletIcon, Briefcase } from 'lucide-react';
import type { Transaction, Task } from '@/types';
import { formatCurrency, formatDate, getDailyQuote, saveDailyQuote } from '@/utils/storage';
import { expenseCategories, incomeCategories } from '@/utils/storage';

interface DashboardProps {
  transactions: Transaction[];
  tasks: Task[];
  onAddTransaction: () => void;
  onAddTask: () => void;
}

function Dashboard({ transactions, tasks, onAddTransaction, onAddTask }: DashboardProps) {
  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [quoteText, setQuoteText] = useState('');
  const [savedQuote, setSavedQuote] = useState(getDailyQuote());
  const quoteRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setSavedQuote(getDailyQuote());
  }, []);

  const handleStartEdit = () => {
    setQuoteText(savedQuote.quote);
    setIsEditingQuote(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSaveQuote = () => {
    const result = saveDailyQuote(quoteText);
    setSavedQuote(result);
    setIsEditingQuote(false);
  };

  const handleCancelEdit = () => {
    setIsEditingQuote(false);
    setQuoteText(savedQuote.quote);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveQuote();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (quoteRef.current && !quoteRef.current.contains(e.target as Node)) {
        setIsEditingQuote(false);
      }
    };

    if (isEditingQuote) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditingQuote]);

  const today = new Date().toDateString();
  
  const todayTransactions = transactions.filter(t => new Date(t.date).toDateString() === today);
  const todayIncome = todayTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const todayExpense = todayTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const todayTasks = tasks.filter(t => new Date(t.dueDate).toDateString() === today);
  const completedTasks = todayTasks.filter(t => t.completed).length;
  const taskProgress = todayTasks.length > 0 ? Math.round((completedTasks / todayTasks.length) * 100) : 0;

  const recentTransactions = transactions.slice(0, 3);

  const getCategoryIcon = (categoryName: string) => {
    const allCategories = [...expenseCategories, ...incomeCategories];
    const cat = allCategories.find(c => c.name === categoryName);
    const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
      ShoppingCart,
      Utensils,
      Car,
      Gamepad2,
      ShoppingBag,
      Heart,
      Receipt,
      MoreHorizontal,
      Wallet: WalletIcon,
      Gift: GiftIcon,
      TrendingUp,
      Briefcase,
    };
    const DefaultIcon = iconMap[cat?.icon || 'MoreHorizontal'] || MoreHorizontal;
    return <DefaultIcon size={20} />;
  };

  const GiftIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="12" height="8" x="6" y="8" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12l-7 7-7-7" />
    </svg>
  );

  const greeting = new Date().getHours() < 12 ? '早上好' : 
                   new Date().getHours() < 18 ? '下午好' : '晚上好';

  return (
    <div className="p-4 space-y-6">
      <div className="bg-gradient-to-br from-[#10B981]/20 via-[#1A1A1F] to-[#0B0B0F] rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
        <p className="text-[#10B981] text-xs font-medium tracking-widest uppercase mb-2">Personal Engine</p>
        <h2 className="text-2xl font-bold text-[#F8FAFC]">{greeting}</h2>
        <p className="text-[#94A3B8] text-sm mt-1">今日状态良好</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#1A1A1F] rounded-2xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center text-center">
          <TrendingDown size={24} className="text-[#EF4444] mb-2" />
          <p className="text-[#94A3B8] text-xs">今日支出</p>
          <p className="text-[#F8FAFC] text-lg font-bold mt-1">{formatCurrency(todayExpense)}</p>
        </div>
        <div className="bg-[#1A1A1F] rounded-2xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center text-center">
          <TrendingUp size={24} className="text-[#10B981] mb-2" />
          <p className="text-[#94A3B8] text-xs">今日收入</p>
          <p className="text-[#F8FAFC] text-lg font-bold mt-1">{formatCurrency(todayIncome)}</p>
        </div>
        <div className="bg-[#1A1A1F] rounded-2xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center text-center">
          <CheckCircle size={24} className="text-[#94A3B8] mb-2" />
          <p className="text-[#94A3B8] text-xs">任务进度</p>
          <p className="text-[#F8FAFC] text-lg font-bold mt-1">{completedTasks}/{todayTasks.length}</p>
        </div>
      </div>

      <div className="bg-[#1A1A1F] rounded-2xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[#94A3B8] text-sm">今日任务进度</span>
          <span className="text-[#10B981] text-sm font-medium">{taskProgress}%</span>
        </div>
        <div className="h-2 bg-[#0B0B0F] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#10B981] transition-all duration-500 ease-out" 
            style={{ width: `${taskProgress}%` }}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-[#F8FAFC] mb-3">快捷添加</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onAddTransaction}
            className="bg-[#10B981] text-white rounded-full px-6 py-4 font-medium hover:bg-[#059669] transition-colors flex items-center justify-center gap-2"
          >
            <Wallet size={24} />
            <span>记一笔</span>
          </button>
          <button
            onClick={onAddTask}
            className="bg-[#1A1A1F] text-[#F8FAFC] rounded-full px-6 py-4 border border-[#27272A] flex items-center justify-center gap-2 hover:bg-[#27272A] transition-colors"
          >
            <Plus size={24} />
            <span>+任务</span>
          </button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-[#F8FAFC]">最近动态</h3>
        </div>
        <div className="space-y-3">
          {recentTransactions.length === 0 ? (
            <div className="bg-[#1A1A1F] rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex items-center justify-center">
              <span className="text-[#94A3B8]">暂无记录</span>
            </div>
          ) : (
            recentTransactions.map((t) => (
              <div
                key={t.id}
                className="bg-[#1A1A1F] rounded-2xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0B0B0F] flex items-center justify-center text-[#10B981]">
                    {getCategoryIcon(t.category)}
                  </div>
                  <div>
                    <p className="text-[#F8FAFC] font-medium">{t.category}</p>
                    <p className="text-[#94A3B8] text-xs">{t.note || t.category} • {formatDate(t.date)}</p>
                  </div>
                </div>
                <p className={`text-lg font-bold ${t.type === 'expense' ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
                  {t.type === 'expense' ? '-' : '+'}{formatCurrency(t.amount)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div 
        ref={quoteRef}
        onClick={isEditingQuote ? undefined : handleStartEdit}
        className={`bg-[#1A1A1F] rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all ${
          !isEditingQuote ? 'cursor-pointer hover:bg-[#27272A]' : ''
        }`}
      >
        {isEditingQuote ? (
          <div className="space-y-3">
            <textarea
              ref={inputRef}
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入每日格言..."
              maxLength={50}
              className="bg-[#1A1A1F] border border-[#27272A] rounded-xl p-3 text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#10B981] w-full text-lg italic resize-none"
              rows={2}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelEdit}
                className="bg-transparent border border-[#27272A] rounded-full px-4 py-1 text-[#94A3B8] text-sm hover:bg-[#27272A] transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveQuote}
                className="bg-[#10B981] text-white rounded-full px-4 py-1 text-sm hover:bg-[#059669] transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-[#10B981] text-lg font-semibold italic">"{savedQuote.quote}"</p>
            <p className="text-[#94A3B8] text-sm mt-2">{savedQuote.subquote}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
