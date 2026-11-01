import React, { useState, useEffect } from 'react';
import { store } from '../../services/store';
import { AuditLog } from '../../types';
import { ScrollText, ShieldCheck, Clock, User, Filter } from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>(() => store.getAuditLogs());

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setLogs(store.getAuditLogs());
    });
    return unsub;
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Security & Operational Audit Trail
        </h1>
        <p className="text-xs text-slate-500">
          Immutable log of all financial transactions, ticket cancellations, and administrative adjustments.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-teal-600" />
            <span>Audit Trail Entries ({logs.length})</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">PostgreSQL WAL Protected</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Timestamp</th>
                <th className="px-5 py-3">Operator / Actor</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Action Type</th>
                <th className="px-5 py-3">Details & Audit Parameters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">{log.user_name}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-100 text-slate-700 font-bold uppercase">
                      {log.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-teal-800">{log.action}</td>
                  <td className="px-5 py-3.5 text-slate-600 font-sans">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
