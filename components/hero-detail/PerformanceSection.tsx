'use client';

export default function PerformanceSection() {
  return (
    <div className="text-white/80 space-y-4">
      <p>
        模式与地图胜率数据需要接入大规模对战统计接口，当前为占位展示。后续可接入官方或第三方统计 API，展示该英雄在不同模式、不同地图下的表现趋势。
      </p>
      <div className="grid md:grid-cols-3 gap-4">
        {['宝石争霸', '荒野决斗', '乱斗足球'].map((mode) => (
          <div
            key={mode}
            className="bg-white/10 rounded-xl p-4 border border-white/10 text-center hover:bg-white/15 transition-all"
          >
            <p className="text-white/70 text-sm mb-1">{mode}</p>
            <p className="text-2xl font-black text-[#FFD500]">-</p>
          </div>
        ))}
      </div>
    </div>
  );
}
