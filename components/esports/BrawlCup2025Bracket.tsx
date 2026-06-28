'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import type { Tournament } from '@/lib/data/esports';
import TeamLogo from './TeamLogo';

interface Props {
  matches: Tournament[];
  currentId?: string;
}

const BRAWL_CUP_2025 = {
  groupA: {
    name: 'Group A',
    round1: ['202505-gl-qf-1', '202505-gl-qf-2'],
    winnersFinal: '202505-gl-qf-3',
    losersRound1: ['202505-gl-qf-4'],
    losersFinal: '202505-gl-qf-5',
  },
  groupB: {
    name: 'Group B',
    round1: ['202505-gl-qf-6', '202505-gl-qf-7'],
    winnersFinal: '202505-gl-qf-8',
    losersRound1: ['202505-gl-qf-9'],
    losersFinal: '202505-gl-qf-10',
  },
  playoffs: {
    name: 'Playoffs',
    semi: ['202505-gl-qf-11', '202505-gl-sf-12'],
    final: '202505-gl-final-13',
    thirdPlace: '202505-gl-sf-14',
  },
};

function getMatch(matches: Tournament[], id?: string) {
  return id ? matches.find(m => m.id === id) : undefined;
}

function winnerTeam(match?: Tournament) {
  if (!match) return undefined;
  return match.winner === 'A' ? match.teamA : match.teamB;
}

function MatchCard({
  match,
  currentId,
  label,
}: {
  match?: Tournament;
  currentId?: string;
  label?: string;
}) {
  if (!match) {
    return (
      <div className="w-40 md:w-48 rounded-xl border border-white/[0.08] bg-white/[0.04] p-2.5 text-center text-xs font-bold text-white/30">
        {label || 'TBD'}
      </div>
    );
  }
  const active = match.id === currentId;
  const [scoreA, scoreB] = match.score.split(':');
  return (
    <Link
      href={`/events/${match.id}`}
      className={`relative block w-40 md:w-48 rounded-xl border p-2.5 transition-all duration-300 ${
        active
          ? 'bg-[#FFD500]/15 border-[#FFD500]/50 shadow-[0_0_20px_rgba(255,213,0,0.15)]'
          : 'bg-black/30 border-white/[0.08] hover:border-white/20 hover:bg-black/40'
      }`}
    >
      {label && <div className="text-[9px] font-black text-[#FFD500]/60 uppercase tracking-wider mb-1.5">{label}</div>}
      <div className="flex items-center justify-between text-[11px] font-bold mb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <TeamLogo src={match.teamA.logo} alt={match.teamA.name} size="sm" className="w-4 h-4 rounded-md" />
          <span className={`truncate ${match.winner === 'A' ? 'text-[#FFD500]' : 'text-white/70'}`}>{match.teamA.name}</span>
        </div>
        <span className={match.winner === 'A' ? 'text-[#FFD500]' : 'text-white/50'}>{scoreA}</span>
      </div>
      <div className="flex items-center justify-between text-[11px] font-bold">
        <div className="flex items-center gap-1.5 min-w-0">
          <TeamLogo src={match.teamB.logo} alt={match.teamB.name} size="sm" className="w-4 h-4 rounded-md" />
          <span className={`truncate ${match.winner === 'B' ? 'text-[#FFD500]' : 'text-white/70'}`}>{match.teamB.name}</span>
        </div>
        <span className={match.winner === 'B' ? 'text-[#FFD500]' : 'text-white/50'}>{scoreB}</span>
      </div>
      {active && (
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#FFD500] text-[#1A3A8A] text-[9px] font-black flex items-center justify-center">
          ★
        </div>
      )}
    </Link>
  );
}

function AdvCard({ team, label }: { team?: { name: string; logo: string }; label?: string }) {
  if (!team) {
    return (
      <div className="w-36 md:w-40 rounded-xl border border-dashed border-white/[0.08] bg-white/[0.03] p-2.5 text-center text-xs font-bold text-white/30">
        {label || '待定'}
      </div>
    );
  }
  return (
    <div className="w-36 md:w-40 rounded-xl border border-[#FFD500]/20 bg-[#FFD500]/[0.06] p-2.5">
      <div className="text-[9px] font-black text-[#FFD500]/60 uppercase tracking-wider mb-1.5">{label || '晋级'}</div>
      <div className="flex items-center gap-2">
        <TeamLogo src={team.logo} alt={team.name} size="sm" className="w-5 h-5 rounded-md" />
        <span className="text-xs font-black text-[#FFD500] truncate">{team.name}</span>
      </div>
    </div>
  );
}

function GroupBracket({
  config,
  matches,
  currentId,
}: {
  config: typeof BRAWL_CUP_2025.groupA;
  matches: Tournament[];
  currentId?: string;
}) {
  const round1 = config.round1.map(id => getMatch(matches, id));
  const winnersFinal = getMatch(matches, config.winnersFinal);
  const losersRound1 = config.losersRound1.map(id => getMatch(matches, id));
  const losersFinal = getMatch(matches, config.losersFinal);

  return (
    <div className="relative rounded-2xl bg-black/30 border border-white/[0.08] p-4 md:p-5">
      <div className="text-sm font-black text-[#FFD500] mb-4 tracking-wide">{config.name}</div>
      <div className="flex items-stretch gap-2 md:gap-4 overflow-x-auto pb-2">
        {/* Round 1 */}
        <div className="flex flex-col justify-around gap-4">
          <div className="text-[9px] font-black text-white/30 uppercase tracking-wider text-center">Round 1</div>
          {round1.map((m, i) => (
            <MatchCard key={m?.id || i} match={m} currentId={currentId} label={`Match ${i === 0 ? 1 : 3}`} />
          ))}
        </div>

        {/* Round 2 */}
        <div className="flex flex-col justify-around gap-4">
          <div className="text-[9px] font-black text-white/30 uppercase tracking-wider text-center">Round 2</div>
          <MatchCard match={winnersFinal} currentId={currentId} label="胜者组决赛" />
          {losersRound1.map((m, i) => (
            <MatchCard key={m?.id || i} match={m} currentId={currentId} label="败者组 R1" />
          ))}
        </div>

        {/* Round 3 */}
        <div className="flex flex-col justify-center gap-4">
          <div className="text-[9px] font-black text-white/30 uppercase tracking-wider text-center">Round 3</div>
          <MatchCard match={losersFinal} currentId={currentId} label="败者组决赛" />
        </div>

        {/* Qualified */}
        <div className="flex flex-col justify-around gap-4">
          <div className="text-[9px] font-black text-[#FFD500]/60 uppercase tracking-wider text-center">晋级</div>
          <AdvCard team={winnerTeam(winnersFinal)} label="小组第一" />
          <AdvCard team={winnerTeam(losersFinal)} label="小组第二" />
        </div>
      </div>
    </div>
  );
}

function PlayoffsBracket({
  matches,
  currentId,
}: {
  matches: Tournament[];
  currentId?: string;
}) {
  const semi = BRAWL_CUP_2025.playoffs.semi.map(id => getMatch(matches, id));
  const final = getMatch(matches, BRAWL_CUP_2025.playoffs.final);
  const thirdPlace = getMatch(matches, BRAWL_CUP_2025.playoffs.thirdPlace);

  return (
    <div className="relative rounded-2xl bg-black/30 border border-white/[0.08] p-4 md:p-5">
      <div className="text-sm font-black text-[#FFD500] mb-4 tracking-wide">{BRAWL_CUP_2025.playoffs.name}</div>
      <div className="flex items-stretch gap-2 md:gap-4 overflow-x-auto pb-2">
        {/* Semifinals */}
        <div className="flex flex-col justify-around gap-4">
          <div className="text-[9px] font-black text-white/30 uppercase tracking-wider text-center">半决赛</div>
          {semi.map((m, i) => (
            <MatchCard key={m?.id || i} match={m} currentId={currentId} label={`半决赛 ${i + 1}`} />
          ))}
        </div>

        {/* Finals */}
        <div className="flex flex-col justify-around gap-4">
          <div className="text-[9px] font-black text-white/30 uppercase tracking-wider text-center">决赛</div>
          <MatchCard match={final} currentId={currentId} label="总决赛" />
          <MatchCard match={thirdPlace} currentId={currentId} label="季军赛" />
        </div>
      </div>
    </div>
  );
}

export default function BrawlCup2025Bracket({ matches, currentId }: Props) {
  const isApplicable = useMemo(() => {
    return matches.some(m => m.id.startsWith('202505-gl-'));
  }, [matches]);

  if (!isApplicable) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-black/35 backdrop-blur-2xl border border-white/[0.1] p-6 md:p-10 mb-6 shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
      <h2 className="text-xl md:text-2xl font-black text-white mb-6 flex items-center gap-2">
        <span className="inline-block w-1.5 h-6 bg-[#FFD500] rounded-full" />
        2025 Brawl Cup 淘汰赛进程
      </h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <GroupBracket config={BRAWL_CUP_2025.groupA} matches={matches} currentId={currentId} />
          <GroupBracket config={BRAWL_CUP_2025.groupB} matches={matches} currentId={currentId} />
        </div>
        <PlayoffsBracket matches={matches} currentId={currentId} />
      </div>
    </div>
  );
}
