import { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingDown, TrendingUp, Plus, ShoppingCart, Utensils, Car, Gamepad2, ShoppingBag, Heart, Receipt, MoreHorizontal, Wallet as WalletIcon, Trash2, Briefcase, Home, BookOpen, GraduationCap } from 'lucide-react';
import type { Transaction, TransactionType } from '@/types';
import { formatCurrency, deleteTransaction } from '@/utils/storage';
import { expenseCategories, incomeCategories } from '@/utils/storage';

interface AccountingProps {
  transactions: Transaction[];
  onRefresh: () => void;
  onAddTransaction: () => void;
}

type FilterType = 'all' | TransactionType;

function Accounting({ transactions, onRefresh, onAddTransaction }: AccountingProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [filter, setFilter] = useState<FilterType>('all');

  const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    const monthMatch = date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    const filterMatch = filter === 'all' || t.type === filter;
    return monthMatch && filterMatch;
  });

  const allMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const income = allMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = allMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  const categoryNames: Record<string, string> = {
    Groceries: '购物',
    Dining: '餐饮',
    Transport: '交通',
    Entertainment: '娱乐',
    Shopping: '购物',
    Health: '医疗',
    Bills: '住房',
    Salary: '工资',
    Bonus: '奖金',
    Investment: '投资',
    Freelance: '副业',
    Other: '其他',
  };

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
      Home,
      GraduationCap,
      BookOpen,
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

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      deleteTransaction(id);
      onRefresh();
    }
  };

  const groupedTransactions = filteredTransactions.reduce((acc, t) => {
    const dateKey = new Date(t.date).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(t);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={handlePrevMonth} className="w-10 h-10 rounded-full bg-[#1A1A1F] flex items-center justify-center text-[#F8FAFC] hover:bg-[#27272A] transition-colors">
          <ChevronLeft size={24} />
        </button>
        <button className="bg-[#10B981]/10 text-[#10B981] rounded-full px-6 py-2 font-medium">
          {months[currentMonth]} {currentYear}
        </button>
        <button onClick={handleNextMonth} className="w-10 h-10 rounded-full bg-[#1A1A1F] flex items-center justify-center text-[#F8FAFC] hover:bg-[#27272A] transition-colors">
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="bg-[#1A1A1F] rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
        <p className="text-[#94A3B8] text-xs font-medium tracking-widest uppercase mb-2">总余额</p>
        <h2 className="text-3xl font-bold text-[#F8FAFC]">{formatCurrency(balance)}</h2>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-[#0B0B0F] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={18} className="text-[#10B981]" />
              <span className="text-[#94A3B8] text-xs">收入</span>
            </div>
            <p className="text-[#10B981] text-xl font-bold">{formatCurrency(income)}</p>
          </div>
          <div className="bg-[#0B0B0F] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} className="text-[#EF4444]" />
              <span className="text-[#94A3B8] text-xs">支出</span>
            </div>
            <p className="text-[#EF4444] text-xl font-bold">{formatCurrency(expense)}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
            filter === 'all'
              ? 'bg-[#10B981] text-white'
              : 'bg-[#1A1A1F] text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          全部
        </button>
        <button
          onClick={() => setFilter('income')}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
            filter === 'income'
              ? 'bg-[#10B981] text-white'
              : 'bg-[#1A1A1F] text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          收入
        </button>
        <button
          onClick={() => setFilter('expense')}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
            filter === 'expense'
              ? 'bg-[#EF4444] text-white'
              : 'bg-[#1A1A1F] text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          支出
        </button>
      </div>

      <div className="space-y-6 pb-24">
        {sortedDates.length === 0 ? (
          <div className="bg-[#1A1A1F] rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex items-center justify-center">
            <span className="text-[#94A3B8]">暂无记录</span>
          </div>
        ) : (
          sortedDates.map(dateKey => {
            const date = new Date(dateKey);
            const dateLabel = date.toLocaleDateString('zh-CN', { weekday: 'long', month: 'short', day: 'numeric' });
            return (
              <div key={dateKey}>
                <h3 className="text-[#94A3B8] text-xs font-medium mb-3 sticky top-0 bg-[#0B0B0F] py-2">
                  {dateLabel}
                </h3>
                <div className="space-y-2">
                  {groupedTransactions[dateKey].map(t => (
                    <div
                      key={t.id}
                      className="bg-[#1A1A1F] rounded-2xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.3)] flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0B0B0F] flex items-center justify-center text-[#10B981]">
                          {getCategoryIcon(t.category)}
                        </div>
                        <div>
                          <p className="text-[#F8FAFC] font-medium">{categoryNames[t.category] || t.category}</p>
                          <p className="text-[#94A3B8] text-xs">
                            {t.note || t.category} • {new Date(t.date).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className={`text-lg font-bold ${t.type === 'expense' ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
                          {t.type === 'expense' ? '-' : '+'}{formatCurrency(t.amount)}
                        </p>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 rounded-full hover:bg-[#27272A] transition-all"
                        >
                          <Trash2 size={16} className="text-[#EF4444]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      <button
        onClick={onAddTransaction}
        className="fixed bottom-24 right-4 w-14 h-14 bg-[#10B981] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#059669] transition-colors"
      >
        <Plus size={28} />
      </button>
    </div>
  );
}

export default Accounting;
