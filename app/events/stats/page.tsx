'use client';

import { heroTournamentStats, metaTrends, getHeroAvatar, translateMapName } from '@/lib/data/esports';
import { useState, useMemo } from 'react';
import Breadcrumb from '@/components/esports/Breadcrumb';
import PageHeader from '@/components/esports/PageHeader';
import FilterPill from '@/components/esports/FilterPill';
import StatCard from '@/components/esports/StatCard';

type SortKey = 'bp' | 'pick' | 'ban' | 'win';
type HeroRole = '全部' | '输出' | '射手' | '投弹手' | '坦克' | '辅助' | '控场' | '刺客';

const MONTHS = [
  '2025-05', '2025-10', '2025-11', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06',
];

const ROLE_COLORS: Record<string, string> = {
  '输出': 'bg-red-500/15 text-red-400 border-red-500/20',
  '射手': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  '投弹手': 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  '坦克': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  '辅助': 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  '控场': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  '刺客': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
};

export default function StatsPage() {
  const [tab, setTab] = useState<'hero' | 'trend'>('hero');
  const [month, setMonth] = useState('2026-05');
  const [sort, setSort] = useState<SortKey>('bp');
  const [role, setRole] = useState<HeroRole>('全部');

  const roles: HeroRole[] = ['全部', '输出', '射手', '投弹手', '坦克', '辅助', '控场', '刺客'];

  const monthStats = useMemo(() => heroTournamentStats.filter(h => h.month === month), [month]);
  const hasBanData = useMemo(() => monthStats.some(h => h.banCount > 0 || h.banRate > 0), [monthStats]);

  // 当当前月份没有禁用数据时，BP / Ban 排序无意义，回退到 Pick 率
  const effectiveSort =
    (sort === 'ban' || sort === 'bp') && !hasBanData ? 'pick' : sort;

  const filteredHeroes = useMemo(() => {
    let data = [...monthStats];
    if (role !== '全部') data = data.filter(h => h.role === role);
    return data.sort((a, b) => {
      if (effectiveSort === 'bp') return (b.pickRate + b.banRate) - (a.pickRate + a.banRate);
      if (effectiveSort === 'pick') return b.pickRate - a.pickRate;
      if (effectiveSort === 'ban') return b.banRate - a.banRate;
      if (effectiveSort === 'win') return b.winRate - a.winRate;
      return 0;
    });
  }, [monthStats, effectiveSort, role]);

  const currentTrend = metaTrends.find(m => m.month === month);

  return (
    <main className="min-h-screen pt-28 pb-20">
      {/* 背景 — 与首页同款模糊海报图 */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/PromoArt/image5.png)', filter: 'blur(12px) brightness(0.25) saturate(0.5)', transform: 'scale(1.1)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
        <div className="absolute top-40 left-1/4 w-[500px] h-[500px] bg-[#1E90FF]/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-0 w-[400px] h-[400px] bg-[#FFD500]/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <Breadcrumb items={[{ label: '数据洞察' }]} />
        <PageHeader title="数据洞察" subtitle="英雄BP数据与版本趋势分析" icon="📊" />

        {/* Tab + 月份选择 */}
        <div className="relative overflow-hidden bg-black/35 backdrop-blur-2xl border border-white/[0.12] rounded-2xl p-4 md:p-5 mb-6 space-y-4 shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FFD500]/40 to-transparent" />
          {/* Tab 切换 */}
          <div className="flex gap-2">
            {[
              { key: 'hero', label: '英雄赛事数据' },
              { key: 'trend', label: '版本趋势' },
            ].map(t => (
              <FilterPill
                key={t.key}
                label={t.label}
                active={tab === t.key}
                onClick={() => setTab(t.key as 'hero' | 'trend')}
              />
            ))}
          </div>

          {/* 月份快速选择 */}
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 hide-scrollbar">
            {MONTHS.map(m => (
              <button
                key={m}
                onClick={() => setMonth(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  month === m
                    ? 'bg-[#FFD500] text-[#1A3A8A] shadow-md shadow-[#FFD500]/10'
                    : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/80'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* ===== 英雄赛事数据 Tab ===== */}
        {tab === 'hero' && (
          <>
            {/* 排序 + 分类筛选 */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs font-bold text-[#FFD500]/50 uppercase tracking-wider mr-1">排序</span>
              {([
                ...(hasBanData ? [{ key: 'bp' as SortKey, label: 'BP率' }] : []),
                { key: 'pick' as SortKey, label: 'Pick率' },
                ...(hasBanData ? [{ key: 'ban' as SortKey, label: 'Ban率' }] : []),
                { key: 'win' as SortKey, label: '胜率' },
              ] as { key: SortKey; label: string }[]).map(s => (
                <FilterPill
                  key={s.key}
                  label={s.label}
                  active={sort === s.key}
                  onClick={() => setSort(s.key)}
                  size="sm"
                />
              ))}

              <span className="w-px h-5 bg-white/[0.08] mx-2" />

              <span className="text-xs font-bold text-[#FFD500]/50 uppercase tracking-wider mr-1">分类</span>
              {roles.map(r => (
                <FilterPill
                  key={r}
                  label={r}
                  active={role === r}
                  onClick={() => setRole(r)}
                  size="sm"
                />
              ))}
            </div>

            {/* 英雄数据列表 */}
            <div className="space-y-3">
              {filteredHeroes.length === 0 && (
                <div className="relative text-center py-16 rounded-2xl bg-black/20 border border-white/[0.08]">
                  <div className="text-4xl mb-3 opacity-30">📭</div>
                  <div className="text-white/50 font-bold">
                    暂无 {month} 的英雄选用数据
                  </div>
                  <div className="text-white/30 text-sm mt-1">该月份在 Liquipedia 上未记录详细对局英雄</div>
                </div>
              )}
              {filteredHeroes.map((h, idx) => {
                const roleColor = ROLE_COLORS[h.role] || 'bg-white/10 text-white/60 border-white/20';
                return (
                  <div
                    key={h.heroId}
                    className="group relative overflow-hidden rounded-2xl bg-black/35 backdrop-blur-2xl border border-white/[0.1] p-5 md:p-6 hover:border-white/[0.16] shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300"
                    style={{ animationDelay: `${idx * 50}ms`, animation: 'fadeInUp 0.35s cubic-bezier(0.22,0.61,0.36,1) forwards', opacity: 0 }}
                  >
                    {/* 头部 */}
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        {getHeroAvatar(h.heroId) && (
                          <img src={getHeroAvatar(h.heroId)} alt={h.heroId} className="w-10 h-10 rounded-lg border border-white/10 object-cover bg-black/20" />
                        )}
                        <h3 className="text-lg md:text-xl font-black text-white">{h.heroId}</h3>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${roleColor}`}>
                          {h.role}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-[#FFD500]">
                        胜率 {(h.winRate * 100).toFixed(0)}%
                      </span>
                    </div>

                    {/* 数据卡片：无禁用数据时只保留 Pick/出场率、场次、胜率 */}
                    <div className={`grid gap-2 mb-4 ${hasBanData ? 'grid-cols-2 sm:grid-cols-5' : 'grid-cols-2 sm:grid-cols-3'}`}>
                      {hasBanData && (
                        <StatCard
                          value={`${((h.pickRate + h.banRate) * 100).toFixed(0)}%`}
                          label="BP率"
                          highlight
                        />
                      )}
                      <StatCard
                        value={`${(h.pickRate * 100).toFixed(0)}%`}
                        label={hasBanData ? 'Pick率' : '出场率'}
                        highlight={!hasBanData}
                      />
                      {hasBanData && (
                        <StatCard
                          value={`${(h.banRate * 100).toFixed(0)}%`}
                          label="Ban率"
                        />
                      )}
                      <StatCard
                        value={String(h.pickCount)}
                        label="选用场次"
                      />
                      {hasBanData && (
                        <StatCard
                          value={String(h.banCount)}
                          label="禁用场次"
                        />
                      )}
                      <StatCard
                        value={`${(h.winRate * 100).toFixed(0)}%`}
                        label="胜率"
                      />
                    </div>

                    {/* 地图出场率 */}
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(h.mapRates).map(([map, rate]) => (
                        <span key={map} className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.05] text-[10px] font-bold text-white/60 group-hover:border-white/[0.1] transition-all">
                          {translateMapName(map)}: {(rate * 100).toFixed(0)}%
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ===== 版本趋势 Tab ===== */}
        {tab === 'trend' && currentTrend && (
          <div className="space-y-6">
            {/* BP率前十 */}
            <div className="relative overflow-hidden rounded-3xl bg-black/35 backdrop-blur-2xl border border-white/[0.1] p-6 md:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
              <h3 className="text-xl font-black text-[#FFD500] mb-6 flex items-center gap-2">
                <span className="inline-block w-1.5 h-5 bg-[#FFD500] rounded-full" />
                {hasBanData ? 'BP率前十英雄' : 'Pick率前十英雄'}
              </h3>
              <div className="space-y-3">
                {currentTrend.topHeroes.map((h, i) => (
                  <div
                    key={h.heroId}
                    className="flex items-center gap-3 md:gap-4 group"
                    style={{ animationDelay: `${i * 80}ms`, animation: 'fadeInUp 0.3s cubic-bezier(0.22,0.61,0.36,1) forwards', opacity: 0 }}
                  >
                    {/* 排名 */}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 ${
                      i === 0 ? 'bg-gradient-to-br from-[#FFD500] to-[#FFA000] text-[#1A3A8A] shadow-lg shadow-[#FFD500]/15' :
                      i === 1 ? 'bg-white/12 text-white/70' :
                      i === 2 ? 'bg-white/8 text-white/55' :
                      'bg-white/[0.06] text-white/40'
                    }`}>
                      {i + 1}
                    </div>

                    {/* 英雄名 */}
                    <div className="w-28 flex-shrink-0 flex items-center gap-2">
                      {getHeroAvatar(h.heroId) && (
                        <img src={getHeroAvatar(h.heroId)} alt={h.heroId} className="w-7 h-7 rounded-md border border-white/10 object-cover bg-black/20" />
                      )}
                      <span className="font-bold text-white text-sm truncate">{h.heroId}</span>
                    </div>

                    {/* BP率进度条 */}
                    <div className="flex-1 min-w-0">
                      <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#FFD500] to-[#FFA000] transition-all duration-700 animate-bar-fill"
                          style={{ '--bar-target': `${h.pickRate * 100}%` } as React.CSSProperties}
                        />
                      </div>
                    </div>

                    {/* Pick率数值 */}
                    <div className="w-16 text-right font-black text-[#FFD500] text-sm tabular-nums flex-shrink-0">
                      {(h.pickRate * 100).toFixed(1)}%
                    </div>

                    {/* Ban率：有数据才显示 */}
                    {h.banRate > 0 && (
                      <div className="w-16 text-right font-bold text-white/50 text-xs flex-shrink-0">
                        Ban {(h.banRate * 100).toFixed(1)}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 未被选用的英雄 */}
            <div className="relative overflow-hidden rounded-3xl bg-black/35 backdrop-blur-2xl border border-white/[0.1] p-6 md:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
              <h3 className="text-lg font-black text-white/50 mb-4 flex items-center gap-2">
                <span className="inline-block w-1.5 h-4 bg-white/20 rounded-full" />
                本月未被选用的英雄
              </h3>
              <div className="flex flex-wrap gap-3">
                {currentTrend.unusedHeroes.map(h => {
                  const avatar = getHeroAvatar(h);
                  return (
                    <div key={h} className="flex flex-col items-center gap-1 group">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={h}
                          className="w-11 h-11 rounded-lg border border-white/10 object-cover bg-black/20 grayscale opacity-45 group-hover:opacity-70 transition-opacity duration-200"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-xs font-bold text-white/40">
                          {h[0]}
                        </div>
                      )}
                      <span className="text-[10px] font-medium text-white/30">{h}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 无趋势数据 */}
        {tab === 'trend' && !currentTrend && (
          <div className="relative text-center py-24">
            <div className="text-5xl mb-4 opacity-30">📉</div>
            <div className="text-white/45 font-bold text-lg">暂无该月份的趋势数据</div>
          </div>
        )}
      </div>
    </main>
  );
}
