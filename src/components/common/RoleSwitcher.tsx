import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck, ChevronDown, Check, Bus, Store, Sparkles } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { user, role, loginAs } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const roles: { role: UserRole; label: string; badge: string; color: string; path: string; icon: any }[] = [
    {
      role: 'customer',
      label: 'Customer (Anik Sen)',
      badge: 'Passenger',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      path: '/dashboard',
      icon: UserCheck,
    },
    {
      role: 'counter_staff',
      label: 'Counter Staff (Rafiqul - Gabtoli)',
      badge: 'POS Terminal',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      path: '/counter',
      icon: Store,
    },
    {
      role: 'counter_manager',
      label: 'Counter Manager (Kamal Uddin)',
      badge: 'Supervisor',
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      path: '/counter-manager',
      icon: Store,
    },
    {
      role: 'operator_admin',
      label: 'Operator Admin (Green Line)',
      badge: 'Fleet & Trips',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      path: '/operator',
      icon: Bus,
    },
    {
      role: 'super_admin',
      label: 'Super Admin (Platform Head)',
      badge: 'Full Access',
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      path: '/admin',
      icon: ShieldCheck,
    },
  ];

  const currentRoleObj = roles.find((r) => r.role === role) || roles[0];

  const handleSelectRole = (r: (typeof roles)[0]) => {
    loginAs(r.role);
    setIsOpen(false);
    navigate(r.path);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white/90 hover:bg-white text-slate-800 border border-slate-300 shadow-sm transition-all hover:border-teal-500 focus:outline-none"
        title="Switch user role for testing"
      >
        <span className="flex items-center gap-1 text-teal-600">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-bold">Role:</span>
        </span>
        <span className="max-w-[110px] sm:max-w-[150px] truncate font-medium text-slate-700">
          {currentRoleObj.label.split('(')[0]}
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-100 text-slate-600 border border-slate-200">
          {currentRoleObj.badge}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-2xl ring-1 ring-black/10 z-50 p-2 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-2">
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Switch Demo Role
              </p>
              <p className="text-[11px] text-slate-500">
                Experience Ticketora from different user perspectives:
              </p>
            </div>
            <div className="py-1 space-y-1">
              {roles.map((r) => {
                const isSelected = r.role === role;
                const Icon = r.icon;
                return (
                  <button
                    key={r.role}
                    onClick={() => handleSelectRole(r)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-teal-50 text-teal-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50 font-normal'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1 rounded ${isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 leading-tight">{r.label}</div>
                        <div className="text-[10px] text-slate-500">{r.badge}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-teal-600" />}
                  </button>
                );
              })}
            </div>
            {user && (
              <div className="pt-2 px-3 pb-1">
                <div className="text-[10px] text-slate-400 truncate">
                  Logged in as: <span className="font-mono text-slate-600">{user.email}</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
