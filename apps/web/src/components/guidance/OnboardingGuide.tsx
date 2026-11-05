import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gamepad2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Building2,
  CreditCard,
  Database,
  BarChart3,
  Layers,
  Zap,
  Play
} from 'lucide-react';

interface Step {
  id: string;
  questNumber: number;
  title: string;
  subtitle: string;
  description: string;
  actionText: string;
  targetPath?: string;
  icon: any;
  hint: string;
}

const ONBOARDING_QUESTS: Step[] = [
  {
    id: 'welcome',
    questNumber: 1,
    title: 'Welcome to ZUNO ERP Command Center',
    subtitle: 'Mission 1: Initialize Your Business Operations',
    description:
      'Zuno ERP is an enterprise multi-tenant platform managing your entire company from sales, purchases, inventory, to payroll and compliance in one unified system.',
    actionText: 'Next Mission: Explore 19 Modules',
    targetPath: '/dashboard',
    icon: Gamepad2,
    hint: 'Use the left sidebar anytime to navigate between modules.',
  },
  {
    id: '19-modules',
    questNumber: 2,
    title: 'The 19-Module Business Matrix',
    subtitle: 'Mission 2: Discover All 19 Departments',
    description:
      'Click on "19-Module Matrix" in the sidebar to view all 19 integrated departments: Core Setup, Product Master, Sales, Purchase, Production, HR, Payroll, Banking, and Government Integration.',
    actionText: 'Open 19-Module Matrix',
    targetPath: '/modules',
    icon: Sparkles,
    hint: 'Each card shows smart submodules and database table counts.',
  },
  {
    id: 'multi-company',
    questNumber: 3,
    title: 'Company & Branch Teleporter',
    subtitle: 'Mission 3: Multi-Entity Management',
    description:
      'Look at the top bar. You can switch between holding companies, sister entities, and regional branches in one click. Every transaction is isolated with strict tenant security.',
    actionText: 'Next Mission: Data Grids',
    targetPath: '/modules/company',
    icon: Building2,
    hint: 'Use the top-left dropdown to switch active companies or branches.',
  },
  {
    id: 'data-grid',
    questNumber: 4,
    title: 'Enterprise Data Grid & 243 Tables',
    subtitle: 'Mission 4: Search, Sort & Export Records',
    description:
      'Every module comes equipped with server-side pagination, fast search, column toggles, and instant CSV export. You can add, edit, and audit records with full data integrity.',
    actionText: 'Explore Subscriptions',
    targetPath: '/modules/products',
    icon: Database,
    hint: 'Click "+ Add Record" on any table to insert live operational entries.',
  },
  {
    id: 'subscriptions-qr',
    questNumber: 5,
    title: 'Scan & Pay QR Subscriptions',
    subtitle: 'Mission 5: Flexible Modular Licensing',
    description:
      'Activate only the modules your business needs. Pay securely by scanning the UPI QR code, enter your transaction UTR, and your administrator verifies and activates your plan instantly.',
    actionText: 'Next Mission: Sample Data',
    targetPath: '/modules/subscriptions',
    icon: CreditCard,
    hint: 'Support both automated and manual offline payment verifications.',
  },
  {
    id: 'demo-data',
    questNumber: 6,
    title: 'Sample Data & Clean Slate Playground',
    subtitle: 'Mission 6: Experiment and Clear Anytime',
    description:
      'Starting a new company? You can populate realistic sample products, invoices, and employees to test workflows, or clear all operational data with one click to go live.',
    actionText: 'Finish Mission & Start Operating',
    targetPath: '/dashboard',
    icon: Zap,
    hint: 'Access "Sample Data" in the top bar to populate or clear data anytime.',
  },
];

interface OnboardingGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ isOpen, onClose }) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const navigate = useNavigate();

  const quest = ONBOARDING_QUESTS[currentStepIdx];
  const IconComponent = quest.icon;

  const handleNext = () => {
    if (quest.targetPath) {
      navigate(quest.targetPath);
    }
    if (currentStepIdx < ONBOARDING_QUESTS.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      localStorage.setItem('zuno_tour_completed', 'true');
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      const prevQuest = ONBOARDING_QUESTS[currentStepIdx - 1];
      if (prevQuest.targetPath) {
        navigate(prevQuest.targetPath);
      }
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-lg w-full bg-slate-900 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-500/10 text-white overflow-hidden">
        {/* Futuristic Grid & Glow Backdrop */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header Bar: HUD Controller Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-inner">
                <Gamepad2 className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-cyan-400">
                  Zuno HUD Guide • Level {quest.questNumber} of {ONBOARDING_QUESTS.length}
                </span>
                <p className="text-xs text-slate-400 font-medium">Interactive Walkthrough</p>
              </div>
            </div>

            <button
              onClick={() => {
                localStorage.setItem('zuno_tour_completed', 'true');
                onClose();
              }}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar (6 segments) */}
          <div className="grid grid-cols-6 gap-1.5 pt-1">
            {ONBOARDING_QUESTS.map((q, idx) => (
              <div
                key={q.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx <= currentStepIdx
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-sm shadow-cyan-400/50'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>

          {/* Quest Content Card */}
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-cyan-300 shrink-0">
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider">
                  {quest.subtitle}
                </span>
                <h3 className="text-lg font-black text-white leading-snug">{quest.title}</h3>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{quest.description}</p>

            <div className="pt-2 flex items-center gap-2 text-xs text-amber-300/90 font-medium bg-amber-950/30 p-2.5 rounded-xl border border-amber-800/40">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Pro Tip: {quest.hint}</span>
            </div>
          </div>

          {/* Controller Pad Navigation Footer */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              disabled={currentStepIdx === 0}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                currentStepIdx === 0
                  ? 'opacity-40 cursor-not-allowed text-slate-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  localStorage.setItem('zuno_tour_completed', 'true');
                  onClose();
                }}
                className="text-xs text-slate-400 hover:text-slate-200 px-3 py-2 font-medium"
              >
                Skip Tour
              </button>

              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{quest.actionText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
