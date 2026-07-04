import { useState } from 'react';
import BottomNav from '@/components/BottomNav';
import Dashboard from '@/components/Dashboard';
import Accounting from '@/components/Accounting';
import Tasks from '@/components/Tasks';
import Reports from '@/components/Reports';
import AddTransactionModal from '@/components/AddTransactionModal';
import AddTaskModal from '@/components/AddTaskModal';
import { getTransactions, getTasks } from '@/utils/storage';
import type { Transaction, Task } from '@/types';
import useReminder from '@/hooks/useReminder';

type ViewType = 'dashboard' | 'accounting' | 'tasks' | 'reports';

function App() {
  useReminder();

  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(getTransactions());
  const [tasks, setTasks] = useState<Task[]>(getTasks());
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const handleRefresh = () => {
    setTransactions(getTransactions());
    setTasks(getTasks());
  };

  const handleAddTransaction = () => {
    setShowTransactionModal(true);
  };

  const handleAddTask = () => {
    setShowTaskModal(true);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            transactions={transactions}
            tasks={tasks}
            onAddTransaction={handleAddTransaction}
            onAddTask={handleAddTask}
          />
        );
      case 'accounting':
        return (
          <Accounting
            transactions={transactions}
            onRefresh={handleRefresh}
            onAddTransaction={handleAddTransaction}
          />
        );
      case 'tasks':
        return (
          <Tasks
            tasks={tasks}
            onRefresh={handleRefresh}
            onAddTask={handleAddTask}
          />
        );
      case 'reports':
        return <Reports />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F8FAFC]">
      <div className="max-w-md mx-auto min-h-screen relative pb-20">
        {renderView()}
      </div>
      <BottomNav currentView={currentView} onViewChange={setCurrentView} />
      
      <AddTransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        onSave={handleRefresh}
      />
      <AddTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSave={handleRefresh}
      />
    </div>
  );
}

export default App;