import { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp, ShoppingCart, Utensils, Car, Gamepad2, ShoppingBag, Heart, Receipt, MoreHorizontal, Wallet as WalletIcon, Briefcase, Home, BookOpen, GraduationCap } from 'lucide-react';
import type { TransactionType } from '@/types';
import { saveTransaction } from '@/utils/storage';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const expenseCategories = [
  { name: 'Dining', label: '餐饮', icon: 'Utensils' },
  { name: 'Transport', label: '交通', icon: 'Car' },
  { name: 'Shopping', label: '购物', icon: 'ShoppingBag' },
  { name: 'Entertainment', label: '娱乐', icon: 'Gamepad2' },
  { name: 'Bills', label: '住房', icon: 'Home' },
  { name: 'Health', label: '医疗', icon: 'Heart' },
  { name: 'Education', label: '教育', icon: 'GraduationCap' },
  { name: 'Groceries', label: '超市', icon: 'ShoppingCart' },
  { name: 'Other', label: '其他', icon: 'MoreHorizontal' },
];

const incomeCategories = [
  { name: 'Salary', label: '工资', icon: 'Wallet' },
  { name: 'Investment', label: '投资', icon: 'TrendingUp' },
  { name: 'Bonus', label: '奖金', icon: 'Gift' },
  { name: 'Freelance', label: '副业', icon: 'Briefcase' },
  { name: 'Other', label: '其他', icon: 'MoreHorizontal' },
];

function AddTransactionModal({ isOpen, onClose, onSave }: AddTransactionModalProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isOpen) {
      setType('expense');
      setAmount('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
    }
  }, [isOpen]);

  const categories = type === 'expense' ? expenseCategories : incomeCategories;

  const getCategoryIcon = (iconName: string) => {
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
    const DefaultIcon = iconMap[iconName] || MoreHorizontal;
    return <DefaultIcon size={24} />;
  };

  const GiftIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="12" height="8" x="6" y="8" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12l-7 7-7-7" />
    </svg>
  );

  const handleSubmit = () => {
    const amountValue = parseFloat(amount);
    if (!amountValue || amountValue <= 0) {
      alert('请输入有效的金额');
      return;
    }
    if (!category) {
      alert('请选择分类');
      return;
    }
    if (!date) {
      alert('请选择日期');
      return;
    }

    saveTransaction({
      amount: amountValue,
      type,
      category,
      note,
      date,
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
        <h2 className="text-xl font-bold text-[#F8FAFC] mb-6 text-center">记一笔</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-[#94A3B8] text-xs font-medium tracking-widest uppercase mb-2 block">金额</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="bg-[#0B0B0F] border border-[#27272A] rounded-xl px-4 py-4 text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#10B981] w-full text-2xl font-bold text-center"
              inputMode="decimal"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setType('income')}
              className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                type === 'income'
                  ? 'bg-[#10B981]/10 border-2 border-[#10B981]/50'
                  : 'bg-[#0B0B0F] border-2 border-transparent opacity-60'
              }`}
            >
              <TrendingDown size={24} className="text-[#10B981]" />
              <span className="text-[#10B981] text-xs font-bold uppercase">收入</span>
            </button>
            <button
              onClick={() => setType('expense')}
              className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                type === 'expense'
                  ? 'bg-[#EF4444]/10 border-2 border-[#EF4444]/50'
                  : 'bg-[#0B0B0F] border-2 border-transparent opacity-60'
              }`}
            >
              <TrendingUp size={24} className="text-[#EF4444]" />
              <span className="text-[#EF4444] text-xs font-bold uppercase">支出</span>
            </button>
          </div>

          <div>
            <label className="text-[#94A3B8] text-xs font-medium tracking-widest uppercase mb-3 block">分类</label>
            <div className="grid grid-cols-5 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                    category === cat.name
                      ? 'bg-[#10B981]/10 border-[#10B981]/50'
                      : 'bg-[#0B0B0F] border-transparent hover:border-[#27272A]'
                  }`}
                >
                  <span className={`${category === cat.name ? 'text-[#10B981]' : 'text-[#94A3B8]'}`}>
                    {getCategoryIcon(cat.icon)}
                  </span>
                  <span className={`text-xs ${category === cat.name ? 'text-[#10B981]' : 'text-[#94A3B8]'}`}>
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[#94A3B8] text-xs font-medium tracking-widest uppercase mb-2 block">日期</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-[#0B0B0F] border border-[#27272A] rounded-xl px-4 py-3 text-[#F8FAFC] focus:outline-none focus:border-[#10B981] w-full"
            />
          </div>

          <div>
            <label className="text-[#94A3B8] text-xs font-medium tracking-widest uppercase mb-2 block">备注</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="添加备注..."
              className="bg-[#0B0B0F] border border-[#27272A] rounded-xl px-4 py-3 text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#10B981] w-full"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-[#10B981] text-white rounded-full px-6 py-4 font-medium hover:bg-[#059669] transition-colors w-full mt-4 text-lg"
          >
            确认记账
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

export default AddTransactionModal;
