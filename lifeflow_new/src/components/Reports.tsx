import { useState } from 'react';
import { TrendingUp, BarChart3, TrendingDown, Download, PieChart } from 'lucide-react';
import { formatCurrency, getMonthlyStats, getTaskStats, getTransactions, getTasks } from '@/utils/storage';

function Reports() {
  const [activeTab, setActiveTab] = useState<'finance' | 'tasks'>('finance');
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const stats = getMonthlyStats(currentMonth, currentYear);
  const taskStats = getTaskStats();

  const taskPercentage = taskStats.total > 0 ? ((taskStats.completed / taskStats.total) * 100).toFixed(0) : '0';

  const balance = stats.income - stats.expense;
  const savingsRate = stats.income > 0 ? (((stats.income - stats.expense) / stats.income) * 100).toFixed(1) : '0';

  const sortedCategories = Object.entries(stats.categoryStats)
    .sort((a, b) => b[1] - a[1]);
  const totalExpense = sortedCategories.reduce((sum, [, amount]) => sum + amount, 0);

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
    Education: '教育',
    Other: '其他',
  };

  const last7DaysData = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toDateString();
    const transactions = getTransactions().filter(t => new Date(t.date).toDateString() === dateStr);
    const dayIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const dayExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    last7DaysData.push({
      day: date.toLocaleDateString('zh-CN', { weekday: 'short' }),
      date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      income: dayIncome,
      expense: dayExpense,
    });
  }

  const maxAmount = Math.max(...last7DaysData.map(d => Math.max(d.income, d.expense)), 1);

  const tasks = getTasks();
  const priorityDistribution = {
    high: tasks.filter(t => t.priority === 'high').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    low: tasks.filter(t => t.priority === 'low').length,
  };
  const totalTasks = tasks.length;

  const handleExport = () => {
    const data = {
      transactions: getTransactions(),
      tasks: getTasks(),
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifeflow_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#F8FAFC]">数据报表</h2>
          <p className="text-[#94A3B8] text-sm mt-1">{currentYear}年{currentMonth + 1}月</p>
        </div>
        <button
          onClick={handleExport}
          className="bg-[#1A1A1F] text-[#F8FAFC] rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-[#27272A] transition-colors"
        >
          <Download size={18} />
          <span className="text-sm">导出数据</span>
        </button>
      </div>

      <div className="bg-[#1A1A1F] rounded-full p-1 flex">
        <button
          onClick={() => setActiveTab('finance')}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === 'finance'
              ? 'bg-[#10B981] text-white'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          收支报表
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === 'tasks'
              ? 'bg-[#10B981] text-white'
              : 'text-[#94A3B8] hover:text-[#F8FAFC]'
          }`}
        >
          任务报表
        </button>
      </div>

      {activeTab === 'finance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#1A1A1F] rounded-2xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown size={16} className="text-[#EF4444]" />
                <span className="text-[#94A3B8] text-xs">本月支出</span>
              </div>
              <p className="text-[#EF4444] text-lg font-bold">{formatCurrency(stats.expense)}</p>
            </div>
            <div className="bg-[#1A1A1F] rounded-2xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-[#10B981]" />
                <span className="text-[#94A3B8] text-xs">本月收入</span>
              </div>
              <p className="text-[#10B981] text-lg font-bold">{formatCurrency(stats.income)}</p>
            </div>
            <div className="bg-[#1A1A1F] rounded-2xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 size={16} className="text-[#94A3B8]" />
                <span className="text-[#94A3B8] text-xs">本月结余</span>
              </div>
              <p className={`text-lg font-bold ${balance >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
              </p>
            </div>
          </div>

          <div className="bg-[#1A1A1F] rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#F8FAFC]">分类支出排行</h3>
              <span className="text-[#94A3B8] text-xs">储蓄率 {savingsRate}%</span>
            </div>
            <div className="space-y-4">
              {sortedCategories.length === 0 ? (
                <div className="text-center text-[#94A3B8] text-sm py-4">暂无支出数据</div>
              ) : (
                sortedCategories.map(([name, amount], index) => {
                  const percentage = (amount / totalExpense) * 100;
                  const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
                  const color = colors[index % colors.length];
                  return (
                    <div key={name} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: color }}>
                        {index + 1}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[#F8FAFC] text-sm font-medium">{categoryNames[name] || name}</span>
                          <span className="text-[#94A3B8] text-xs">{formatCurrency(amount)} ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="h-1.5 bg-[#0B0B0F] rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ width: `${percentage}%`, backgroundColor: color }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-[#1A1A1F] rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#F8FAFC]">近7天收支趋势</h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-[#10B981]" />
                  <span className="text-[#94A3B8]">收入</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm bg-[#EF4444]" />
                  <span className="text-[#94A3B8]">支出</span>
                </div>
              </div>
            </div>
            <div className="h-48 flex items-end justify-between px-2 gap-1">
              {last7DaysData.map(d => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center gap-0.5 h-40">
                    <div 
                      className="w-3 bg-[#10B981] rounded-t-sm transition-all duration-500 hover:opacity-80" 
                      style={{ height: `${(d.income / maxAmount) * 100}%`, minHeight: d.income > 0 ? '4px' : '0' }}
                      title={`收入: ${formatCurrency(d.income)}`}
                    />
                    <div 
                      className="w-3 bg-[#EF4444] rounded-t-sm transition-all duration-500 hover:opacity-80" 
                      style={{ height: `${(d.expense / maxAmount) * 100}%`, minHeight: d.expense > 0 ? '4px' : '0' }}
                      title={`支出: ${formatCurrency(d.expense)}`}
                    />
                  </div>
                  <span className="text-[#94A3B8] text-[10px]">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="bg-[#1A1A1F] rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.3)] text-center">
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" fill="transparent" r="60" stroke="#0B0B0F" strokeWidth="8" />
                <circle 
                  cx="64" 
                  cy="64" 
                  fill="transparent" 
                  r="60" 
                  stroke="#10B981" 
                  strokeDasharray={2 * Math.PI * 60} 
                  strokeDashoffset={2 * Math.PI * 60 - (parseInt(taskPercentage, 10) / 100) * 2 * Math.PI * 60} 
                  strokeLinecap="round" 
                  strokeWidth="8" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-[#10B981]">{taskPercentage}%</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-[#F8FAFC] mt-4">本周完成率</h3>
            <p className="text-[#94A3B8] text-sm mt-1">
              已完成 {taskStats.completed} 个任务，共 {taskStats.total} 个
            </p>
          </div>

          <div className="bg-[#1A1A1F] rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-[#F8FAFC]">近7天每日完成数</h3>
            </div>
            <div className="flex items-end justify-between h-40 px-2 gap-2">
              {taskStats.weeklyData.map(d => {
                const maxTasks = Math.max(...taskStats.weeklyData.map(d => d.total), 1);
                return (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-[#0B0B0F] rounded-t-lg relative overflow-hidden" style={{ height: '160px' }}>
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-[#27272A] transition-all" 
                        style={{ height: `${(d.total / maxTasks) * 100}%` }}
                      />
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-[#10B981] transition-all" 
                        style={{ height: d.total > 0 ? `${(d.completed / d.total) * 100}%` : '0%' }}
                      />
                    </div>
                    <span className="text-[#94A3B8] text-[10px]">{d.day}</span>
                    <span className="text-[#F8FAFC] text-xs font-medium">{d.completed}/{d.total}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#1A1A1F] rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#F8FAFC]">优先级分布</h3>
              <PieChart size={20} className="text-[#94A3B8]" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#EF4444]" />
                  <span className="text-[#F8FAFC] text-sm">高优先级</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#94A3B8] text-sm">{priorityDistribution.high}个</span>
                  <span className="text-[#EF4444] text-sm font-medium">
                    {totalTasks > 0 ? ((priorityDistribution.high / totalTasks) * 100).toFixed(0) : 0}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#F59E0B]" />
                  <span className="text-[#F8FAFC] text-sm">中优先级</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#94A3B8] text-sm">{priorityDistribution.medium}个</span>
                  <span className="text-[#F59E0B] text-sm font-medium">
                    {totalTasks > 0 ? ((priorityDistribution.medium / totalTasks) * 100).toFixed(0) : 0}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-[#94A3B8]" />
                  <span className="text-[#F8FAFC] text-sm">低优先级</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#94A3B8] text-sm">{priorityDistribution.low}个</span>
                  <span className="text-[#94A3B8] text-sm font-medium">
                    {totalTasks > 0 ? ((priorityDistribution.low / totalTasks) * 100).toFixed(0) : 0}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-[#0B0B0F] rounded-full mt-4 overflow-hidden">
                <div 
                  className="h-full bg-[#EF4444] transition-all" 
                  style={{ width: `${totalTasks > 0 ? (priorityDistribution.high / totalTasks) * 100 : 0}%` }}
                />
                <div 
                  className="h-full bg-[#F59E0B] transition-all" 
                  style={{ width: `${totalTasks > 0 ? (priorityDistribution.medium / totalTasks) * 100 : 0}%` }}
                />
                <div 
                  className="h-full bg-[#94A3B8] transition-all" 
                  style={{ width: `${totalTasks > 0 ? (priorityDistribution.low / totalTasks) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1A1A1F] rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 size={18} className="text-[#10B981]" />
                <span className="text-[#94A3B8] text-xs">总任务数</span>
              </div>
              <p className="text-[#F8FAFC] text-2xl font-bold">{taskStats.total}</p>
            </div>
            <div className="bg-[#1A1A1F] rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={18} className="text-[#F59E0B]" />
                <span className="text-[#94A3B8] text-xs">待完成</span>
              </div>
              <p className="text-[#F59E0B] text-2xl font-bold">{taskStats.total - taskStats.completed}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
