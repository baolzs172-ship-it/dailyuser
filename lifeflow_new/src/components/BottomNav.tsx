import { Home, Wallet, CheckCircle, BarChart3 } from 'lucide-react';

type ViewType = 'dashboard' | 'accounting' | 'tasks' | 'reports';

interface BottomNavProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

function BottomNav({ currentView, onViewChange }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard' as ViewType, icon: Home, label: '首页' },
    { id: 'accounting' as ViewType, icon: Wallet, label: '记账' },
    { id: 'tasks' as ViewType, icon: CheckCircle, label: '任务' },
    { id: 'reports' as ViewType, icon: BarChart3, label: '报表' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0B0B0F]/90 backdrop-blur-md border-t border-[#27272A] z-50">
      <div className="max-w-md mx-auto flex justify-around py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-full transition-all ${
                isActive
                  ? 'bg-[#10B981]/10 text-[#10B981]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <Icon size={22} fill={isActive ? 'currentColor' : 'none'} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;