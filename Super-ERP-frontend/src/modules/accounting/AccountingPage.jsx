import { useEffect, useMemo, useState } from 'react';
import API from '../../services/api';

const emptyAccount = { accountCode: '', name: '', nameAr: '', accountType: 'Asset', normalBalance: 'Debit' };
const emptyCenter = { code: '', name: '', type: 'Cost Center', department: 'General', branch: 'Cairo Branch', annualBudgetEgp: 0 };

export default function AccountingPage() {
  const [tab, setTab] = useState('accounts');
  const [accounts, setAccounts] = useState([]);
  const [centers, setCenters] = useState([]);
  const [journals, setJournals] = useState([]);
  const [account, setAccount] = useState(emptyAccount);
  const [center, setCenter] = useState(emptyCenter);
  const [journal, setJournal] = useState({ journalNumber: '', description: '', lines: [{ account: '', debit: '', credit: '' }, { account: '', debit: '', credit: '' }] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [a, c, j] = await Promise.all([
        API.get('/accounting/accounts'),
        API.get('/accounting/cost-centers'),
        API.get('/accounting/journals'),
      ]);
      setAccounts(a.data.data || []);
      setCenters(c.data.data || []);
      const journalData = j.data.data;
      setJournals(journalData?.items || journalData || []);
    } catch (e) { setError(e.response?.data?.message || 'Failed to load accounting data'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const totals = useMemo(() => ({ accounts: accounts.length, centers: centers.length, journals: journals.length }), [accounts, centers, journals]);
  const submit = async (fn) => { setSaving(true); setError(''); setSuccess(''); try { await fn(); await load(); setSuccess('Saved successfully'); } catch (e) { setError(e.response?.data?.message || e.response?.data?.errors?.join(', ') || 'Save failed'); } finally { setSaving(false); } };

  const createJournal = () => submit(async () => {
    const lines = journal.lines.map(l => ({ account: l.account, debit: Number(l.debit || 0), credit: Number(l.credit || 0), baseAmountEgp: Number(l.debit || l.credit || 0) }));
    await API.post('/accounting/journals', { ...journal, lines });
    setJournal({ journalNumber: '', description: '', lines: [{ account: '', debit: '', credit: '' }, { account: '', debit: '', credit: '' }] });
  });

  if (loading) return <div className="loading-state">Loading accounting…</div>;
  return <div className="page-container">
    <div className="page-header"><div><h1>Accounting</h1><p>Chart of accounts, cost centers and balanced journal entries.</p></div></div>
    {error && <div className="alert alert-error">{error}</div>}{success && <div className="alert alert-success">{success}</div>}
    <div className="stats-grid">
      <div className="stat-card"><strong>{totals.accounts}</strong><span>Accounts</span></div>
      <div className="stat-card"><strong>{totals.centers}</strong><span>Cost Centers</span></div>
      <div className="stat-card"><strong>{totals.journals}</strong><span>Journal Entries</span></div>
    </div>
    <div className="tabs" style={{display:'flex',gap:8,margin:'20px 0'}}>
      {['accounts','cost-centers','journals'].map(t => <button key={t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t.replace('-', ' ')}</button>)}
    </div>
    {tab === 'accounts' && <section className="card"><h2>Chart of Accounts</h2><form onSubmit={e=>{e.preventDefault();submit(async()=>{await API.post('/accounting/accounts',account);setAccount(emptyAccount);});}} style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
      <input placeholder="Account code" value={account.accountCode} onChange={e=>setAccount({...account,accountCode:e.target.value})} required/><input placeholder="Name" value={account.name} onChange={e=>setAccount({...account,name:e.target.value})} required/><input placeholder="Arabic name" value={account.nameAr} onChange={e=>setAccount({...account,nameAr:e.target.value})}/><select value={account.accountType} onChange={e=>setAccount({...account,accountType:e.target.value})}>{['Asset','Liability','Equity','Revenue','Cost of Goods Sold','Expense','Other Income','Other Expense'].map(x=><option key={x}>{x}</option>)}</select><select value={account.normalBalance} onChange={e=>setAccount({...account,normalBalance:e.target.value})}><option>Debit</option><option>Credit</option></select><button disabled={saving}>Add account</button></form><div className="table-container"><table><thead><tr><th>Code</th><th>Name</th><th>Type</th><th>Balance</th><th>Status</th></tr></thead><tbody>{accounts.map(a=><tr key={a._id}><td>{a.accountCode}</td><td>{a.name}</td><td>{a.accountType}</td><td>{Number(a.currentBalanceEgp||0).toLocaleString()} EGP</td><td>{a.status}</td></tr>)}</tbody></table></div></section>}
    {tab === 'cost-centers' && <section className="card"><h2>Cost Centers</h2><form onSubmit={e=>{e.preventDefault();submit(async()=>{await API.post('/accounting/cost-centers',center);setCenter(emptyCenter);});}} style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}><input placeholder="Code" value={center.code} onChange={e=>setCenter({...center,code:e.target.value})} required/><input placeholder="Name" value={center.name} onChange={e=>setCenter({...center,name:e.target.value})} required/><input placeholder="Department" value={center.department} onChange={e=>setCenter({...center,department:e.target.value})}/><input type="number" placeholder="Annual budget" value={center.annualBudgetEgp} onChange={e=>setCenter({...center,annualBudgetEgp:e.target.value})}/><button disabled={saving}>Add cost center</button></form><div className="table-container"><table><thead><tr><th>Code</th><th>Name</th><th>Type</th><th>Department</th><th>Budget</th></tr></thead><tbody>{centers.map(c=><tr key={c._id}><td>{c.code}</td><td>{c.name}</td><td>{c.type}</td><td>{c.department}</td><td>{Number(c.annualBudgetEgp||0).toLocaleString()} EGP</td></tr>)}</tbody></table></div></section>}
    {tab === 'journals' && <section className="card"><h2>Journal Entries</h2><form onSubmit={e=>{e.preventDefault();createJournal();}}><div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:10}}><input placeholder="Journal number" value={journal.journalNumber} onChange={e=>setJournal({...journal,journalNumber:e.target.value})} required/><input placeholder="Description" value={journal.description} onChange={e=>setJournal({...journal,description:e.target.value})} required/></div>{journal.lines.map((line,i)=><div key={i} style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:10,marginTop:10}}><select value={line.account} onChange={e=>{const lines=[...journal.lines];lines[i]={...line,account:e.target.value};setJournal({...journal,lines});}} required><option value="">Select account</option>{accounts.map(a=><option key={a._id} value={a._id}>{a.accountCode} — {a.name}</option>)}</select><input type="number" min="0" placeholder="Debit" value={line.debit} onChange={e=>{const lines=[...journal.lines];lines[i]={...line,debit:e.target.value,credit:''};setJournal({...journal,lines});}}/><input type="number" min="0" placeholder="Credit" value={line.credit} onChange={e=>{const lines=[...journal.lines];lines[i]={...line,credit:e.target.value,debit:''};setJournal({...journal,lines});}}/></div>)}<button type="button" onClick={()=>setJournal({...journal,lines:[...journal.lines,{account:'',debit:'',credit:''}]})}>Add line</button> <button disabled={saving}>Create balanced journal</button></form><div className="table-container"><table><thead><tr><th>Number</th><th>Date</th><th>Description</th><th>Debit</th><th>Credit</th><th>Status</th></tr></thead><tbody>{journals.map(j=><tr key={j._id}><td>{j.journalNumber}</td><td>{j.date ? new Date(j.date).toLocaleDateString() : '-'}</td><td>{j.description}</td><td>{j.totalDebit}</td><td>{j.totalCredit}</td><td>{j.status}</td></tr>)}</tbody></table></div></section>}
  </div>;
}
