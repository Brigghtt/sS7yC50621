'use client';

import Link from 'next/link';
import { teams, type TournamentRegion } from '@/lib/data/esports';
import { useState, useMemo } from 'react';
import Breadcrumb from '@/components/esports/Breadcrumb';
import PageHeader from '@/components/esports/PageHeader';
import FilterPill from '@/components/esports/FilterPill';
import TeamLogo from '@/components/esports/TeamLogo';


const REGION_LABELS: Record<string, string> = {
  '欧洲': '🇪🇺 欧洲赛区',
  '东亚': '🌏 东亚赛区',
  '大陆': '🇨🇳 大陆赛区',
};

export default function TeamsPage() {
  const [region, setRegion] = useState<TournamentRegion | '全部'>('全部');
  const regions: (TournamentRegion | '全部')[] = ['全部', '欧洲', '东亚', '大陆'];

  const filtered = useMemo(() => {
    if (region === '全部') return teams;
    return teams.filter(t => t.region === region);
  }, [region]);

  return (
    <main className="min-h-screen pt-28 pb-20">
      {/* 背景 — 与首页同款模糊海报图 */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/PromoArt/image6.png)', filter: 'blur(12px) brightness(0.25) saturate(0.5)', transform: 'scale(1.1)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-[#FFD500]/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <Breadcrumb items={[{ label: '战队档案' }]} />
        <PageHeader title="战队档案" subtitle="职业战队战绩与选手阵容" icon="🛡️" />

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
            <div className="text-white/45 font-bold text-lg">该赛区暂无战队数据</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {filtered.map((team, idx) => (
              <Link
                key={team.id}
                href={`/events/teams/${team.id}`}
                className="group relative overflow-hidden rounded-2xl bg-black/35 backdrop-blur-2xl border border-white/[0.1] p-5 hover:border-[#FFD500]/30 hover:bg-black/45 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
                style={{ animationDelay: `${idx * 80}ms`, animation: 'fadeInUp 0.4s cubic-bezier(0.22,0.61,0.36,1) forwards', opacity: 0 }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#FFD500]/0 to-[#FFD500]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative">
                  {/* 头部：Logo + 名称 */}
                  <div className="flex items-center gap-4 mb-4">
                    <TeamLogo src={team.logo} alt={team.name} size="md" />
                    <div className="min-w-0">
                      <h3 className="text-lg font-black text-white group-hover:text-[#FFD500] transition-colors duration-300 truncate">
                        {team.name}
                      </h3>
                      <p className="text-xs text-white/45 font-medium">{team.nameEn}</p>
                      <p className="text-[10px] text-[#FFD500]/50 font-bold mt-0.5 uppercase tracking-wider">
                        {team.region || '未知'} 赛区
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
