import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock3, FileCheck2, Search, ShieldCheck, Sparkles } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { getDashboardPathForRole } from '../../utils/statusLabels';

const features = [
  { icon: FileCheck2, title: 'A clear place to start', desc: 'Share what happened, add supporting files, and get a private code to follow progress.' },
  { icon: Clock3, title: 'Know what happens next', desc: 'See every update and the team responsible as your complaint moves forward.' },
  { icon: ShieldCheck, title: 'Handled with care', desc: 'Role-based access keeps each complaint visible to the people who need to act.' },
  { icon: CheckCircle2, title: 'Accountable resolution', desc: 'A complete activity history makes decisions and outcomes easy to understand.' },
];

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trackNum, setTrackNum] = useState('');

  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackNum.trim()) return;
    navigate(`/track?token=${encodeURIComponent(trackNum.trim())}`);
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] pb-12">
      <Navbar />
      <main className="mx-auto w-full max-w-[1480px] px-3 pt-3 sm:px-6 sm:pt-6">
        <section className="resolve-landing-hero grid min-h-[620px] items-center gap-8 px-6 py-14 sm:px-12 lg:grid-cols-[1.02fr_.98fr] lg:px-20 lg:py-20">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white">
              <span className="h-2 w-2 rounded-full bg-[#a8ff53]" /> A clearer way to be heard
            </div>
            <h1 className="max-w-[680px] text-5xl font-extrabold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Your voice deserves a clear path to <span className="text-[#b5ff72]">resolution.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-blue-50 sm:text-lg sm:leading-8">
              Raise a concern, follow every update, and see who is working on it. ResolveIt keeps the process clear from first report to final response.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {user ? (
                <Link to={getDashboardPathForRole(user.role)}>
                  <Button size="lg" className="hero-white-cta px-7 py-3 shadow-none">
                    Open your dashboard <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="hero-white-cta px-7 py-3 shadow-none">
                      Submit a complaint <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/login" className="inline-flex items-center rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                    Staff sign in
                  </Link>
                </>
              )}
            </div>
            <form onSubmit={handleTrack} className="mt-10 max-w-xl rounded-[22px] bg-white p-2 shadow-[0_18px_48px_rgba(0,38,128,.22)] sm:flex sm:items-center">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={trackNum}
                  onChange={(e) => setTrackNum(e.target.value)}
                  placeholder="Enter your tracking code"
                  aria-label="Complaint tracking code"
                  className="w-full rounded-2xl border-0 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
                />
              </div>
              <Button type="submit" size="md" className="resolve-button w-full px-6 py-3 font-semibold sm:w-auto">Track complaint</Button>
            </form>
          </div>

          <div className="relative mx-auto w-full max-w-[520px] py-5 lg:py-0">
            <div className="absolute -right-3 top-4 flex h-16 w-16 rotate-12 items-center justify-center rounded-[22px] bg-[#b5ff72] text-blue-800 shadow-lg sm:-right-1 sm:top-0">
              <Sparkles className="h-8 w-8" />
            </div>
            <div className="relative rounded-[32px] border border-white/60 bg-white p-5 text-slate-900 shadow-[0_30px_80px_rgba(0,35,115,.28)] sm:p-7">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-brand-600"><ShieldCheck className="h-5 w-5" /></div>
                  <div><p className="text-sm font-bold">Complaint update</p><p className="mt-0.5 text-xs text-slate-500">Your private activity timeline</p></div>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">In progress</span>
              </div>
              <div className="py-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center"><span className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-white"><CheckCircle2 className="h-4 w-4" /></span><span className="my-1 h-12 w-px bg-blue-200" /><span className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-white"><CheckCircle2 className="h-4 w-4" /></span><span className="my-1 h-12 w-px bg-slate-200" /><span className="h-8 w-8 rounded-full border-2 border-slate-200 bg-white" /></div>
                  <div className="flex-1 space-y-7 pt-0.5">
                    <div><p className="text-sm font-semibold">Complaint received</p><p className="mt-1 text-xs text-slate-500">Your report is safely recorded</p></div>
                    <div><p className="text-sm font-semibold">Assigned to a team</p><p className="mt-1 text-xs text-slate-500">The right department is reviewing it</p></div>
                    <div><p className="text-sm font-semibold text-slate-400">Resolution</p><p className="mt-1 text-xs text-slate-400">We’ll let you know when there’s an update</p></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-[#f5f8ff] px-4 py-3.5">
                <div><p className="text-[11px] font-medium text-slate-500">TRACKING CODE</p><p className="mt-1 font-mono text-sm font-bold tracking-wide">RI-••••-••••</p></div>
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">Private to you</span>
              </div>
            </div>
            <div className="absolute -bottom-2 -left-5 rounded-full bg-[#b5ff72] px-5 py-2.5 text-sm font-bold text-slate-900 shadow-md sm:bottom-5 sm:-left-10">Clear updates, all the way</div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-2 pb-8 pt-16 sm:px-4 sm:pt-20">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-[-0.045em] text-slate-900 sm:text-4xl">A process you can follow.</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">From your first report to the final response, the next step stays visible.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, desc }, index) => (
              <article key={title} className="resolve-feature-card">
                <div className={`mb-5 grid h-12 w-12 place-items-center rounded-[17px] ${index === 1 ? 'bg-[#e8ffdc] text-[#12842d]' : 'bg-blue-50 text-brand-600'}`}><Icon className="h-5 w-5" /></div>
                <h3 className="text-base font-bold tracking-tight text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
