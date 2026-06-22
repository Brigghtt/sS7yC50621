'use client';

import Link from 'next/link';
import { players, teams, type TournamentRegion, getHeroAvatar } from '@/lib/data/esports';
import { useState, useMemo } from 'react';
import Breadcrumb from '@/components/esports/Breadcrumb';
import PageHeader from '@/components/esports/PageHeader';
import FilterPill from '@/components/esports/FilterPill';
import StatCard from '@/components/esports/StatCard';

const REGION_LABELS: Record<string, string> = {
  '欧洲': '🇪🇺 欧洲赛区',
  '东亚': '🌏 东亚赛区',
  '大陆': '🇨🇳 大陆赛区',
};

export default function PlayersPage() {
  const [region, setRegion] = useState<TournamentRegion | '全部'>('全部');
  const regions: (TournamentRegion | '全部')[] = ['全部', '欧洲', '东亚', '大陆'];

  const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || id;

  const filtered = useMemo(() => {
    if (region === '全部') return players;
    return players.filter(p => p.region === region);
  }, [region]);

  return (
    <main className="min-h-screen pt-28 pb-20">
      {/* 背景 — 与首页同款模糊海报图 */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/PromoArt/image4.png)', filter: 'blur(12px) brightness(0.25) saturate(0.5)', transform: 'scale(1.1)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-[#1E90FF]/[0.04] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <Breadcrumb items={[{ label: '选手档案' }]} />
        <PageHeader title="选手档案" subtitle="职业选手数据与擅长英雄" icon="👤" />

        {/* 赛区筛选 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {regions.map(r => (
            <FilterPill
              key={r}
              label={r === '全部' ? '全部赛区' : REGION_LABELS[r] || r}
              active={region === r}
              onClick={() => setRegion(r)}
            />
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4 opacity-30">👀</div>
            <div className="text-white/45 font-bold text-lg">该赛区暂无选手数据</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {filtered.map((p, idx) => (
              <Link
                key={p.id}
                href={`/events/players/${p.id}`}
                className="group relative overflow-hidden rounded-2xl bg-black/35 backdrop-blur-2xl border border-white/[0.1] p-5 hover:border-[#FFD500]/30 hover:bg-black/45 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
                style={{ animationDelay: `${idx * 60}ms`, animation: 'fadeInUp 0.4s cubic-bezier(0.22,0.61,0.36,1) forwards', opacity: 0 }}
              >
                {/* 悬浮光效 */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#FFD500]/0 to-[#FFD500]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative">
                  {/* 头像 */}
                  <div className="w-18 h-18 mx-auto mb-4 rounded-full bg-gradient-to-br from-white/[0.1] to-white/[0.04] border-2 border-white/[0.08] flex items-center justify-center text-3xl font-black text-white/25 group-hover:border-[#FFD500]/30 group-hover:text-[#FFD500]/50 transition-all duration-500 shadow-inner">
                    {p.name[0]}
                  </div>

                  {/* 基本信息 */}
                  <h3 className="text-lg font-black text-white text-center group-hover:text-[#FFD500] transition-colors duration-300 mb-1">
                    {p.name}
                  </h3>
                  {p.realName && (
                    <p className="text-[10px] text-white/40 text-center font-medium mb-1">
                      {p.realName}
                    </p>
                  )}
                  <p className="text-xs text-white/50 text-center font-medium mb-1">
                    {getTeamName(p.teamId)}
                    {p.role ? ` · ${p.role}` : ''}
                  </p>
                  <p className="text-[10px] text-[#FFD500]/60 text-center font-bold mb-3 uppercase tracking-wider">
                    {p.region} 赛区
                  </p>

                  {/* 社交链接 */}
                  {p.links && p.links.length > 0 && (
                    <div className="flex items-center justify-center gap-2 mb-3">
                      {p.links.slice(0, 4).map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center text-xs hover:bg-[#FFD500]/20 hover:border-[#FFD500]/40 hover:text-[#FFD500] text-white/60 transition-all"
                          title={link.platform}
                        >
                          {link.platform === 'twitter' && '🐦'}
                          {link.platform === 'youtube' && '▶'}
                          {link.platform === 'twitch' && '📺'}
                          {link.platform === 'tiktok' && '🎵'}
                          {link.platform === 'bilibili' && 'B'}
                          {link.platform === 'douyin' && '抖'}
                          {link.platform === 'douyu' && '🐟'}
                          {link.platform === 'huya' && '🐯'}
                          {link.platform === 'instagram' && '📷'}
                          {link.platform === 'discord' && '💬'}
                          {link.platform === 'other' && '🔗'}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* 擅长英雄 */}
                  {p.topHeroes && p.topHeroes.length > 0 && (
                    <div className="mb-4">
                      <div className="text-[10px] font-bold text-white/45 mb-2 uppercase tracking-wider">擅长英雄</div>
                      <div className="flex flex-wrap gap-1">
                        {p.topHeroes.map(h => {
                          const avatar = getHeroAvatar(h);
                          return avatar ? (
                            <img key={h} src={avatar} alt={h} title={h} className="w-7 h-7 rounded-md border border-white/10 object-cover bg-black/20" />
                          ) : (
                            <span key={h} className="px-2 py-0.5 rounded-md bg-white/[0.06] text-[11px] font-bold text-white/70 border border-white/[0.05] group-hover:border-white/[0.1] transition-all">
                              {h}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 数据卡片 */}
                  {p.stats && p.stats.matches > 0 && (
                    <div className="grid grid-cols-3 gap-1.5">
                      <StatCard
                        value={`${(p.stats.winRate * 100).toFixed(0)}%`}
                        label="胜率"
                        highlight
                      />
                      <StatCard
                        value={String(p.stats.totalKills)}
                        label="击杀"
                      />
                      <StatCard
                        value={String(p.stats.matches)}
                        label="场次"
                      />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
