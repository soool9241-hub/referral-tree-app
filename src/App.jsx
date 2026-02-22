import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "referral-tree-data-v4"; // GitHub-Vercel auto deploy test

const DEFAULT_DATA = {
  members: [
    { id: "root", name: "나", phone: "", parentId: null, joinDate: "", memo: "" },
    { id: "a1", name: "임솔", phone: "", parentId: "root", joinDate: "", memo: "전화번호 확인 필요" },
    { id: "a2", name: "홍선미", phone: "010-6911-9452", parentId: "root", joinDate: "", memo: "" },
    { id: "a3", name: "임경순", phone: "010-1260-1266", parentId: "root", joinDate: "", memo: "" },
    { id: "a4", name: "임세진", phone: "010-4664-4411", parentId: "root", joinDate: "", memo: "" },
    { id: "b1", name: "홍순자", phone: "010-1260-6337", parentId: "a2", joinDate: "", memo: "" },
    { id: "b2", name: "김나은", phone: "010-1260-8844", parentId: "a2", joinDate: "", memo: "" },
    { id: "b3", name: "조병화", phone: "010-1250-1622", parentId: "a2", joinDate: "", memo: "" },
    { id: "b4", name: "김정응", phone: "010-1160-1177", parentId: "a2", joinDate: "", memo: "" },
    { id: "b5", name: "황천현", phone: "010-1482-0611", parentId: "a2", joinDate: "", memo: "" },
    { id: "b6", name: "조근숙", phone: "010-9666-0077", parentId: "a2", joinDate: "", memo: "" },
    { id: "c1", name: "안미나", phone: "010-7369-0101", parentId: "b1", joinDate: "", memo: "" },
    { id: "c2", name: "임천미", phone: "010-1537-3272", parentId: "b1", joinDate: "", memo: "" },
    { id: "c3", name: "박현하", phone: "010-6894-0704", parentId: "b1", joinDate: "", memo: "" },
    { id: "c4", name: "윤달천", phone: "010-8101-2688", parentId: "b2", joinDate: "", memo: "" },
    { id: "c5", name: "천현리", phone: "010-8210-6244", parentId: "b2", joinDate: "", memo: "" },
    { id: "c6", name: "김수경", phone: "010-8366-0199", parentId: "b2", joinDate: "", memo: "" },
    { id: "c7", name: "김병욱", phone: "010-8655-6891", parentId: "b2", joinDate: "", memo: "" },
    { id: "c8", name: "김지은", phone: "010-8655-6891", parentId: "b2", joinDate: "", memo: "" },
    { id: "c9", name: "전병경", phone: "010-8100-6050", parentId: "b2", joinDate: "", memo: "" },
    { id: "c10", name: "이인열", phone: "010-8601-7848", parentId: "b6", joinDate: "", memo: "" },
    { id: "c11", name: "이원례", phone: "010-8911-1455", parentId: "b6", joinDate: "", memo: "" },
    { id: "c12", name: "정선하", phone: "010-8913-2644", parentId: "b6", joinDate: "", memo: "" },
    { id: "d1", name: "김혜란", phone: "010-1482-9822", parentId: "c9", joinDate: "", memo: "" },
    { id: "d2", name: "안향숙", phone: "010-8889-1233", parentId: "c9", joinDate: "", memo: "" },
    { id: "d3", name: "이미원", phone: "010-1048-1944", parentId: "c9", joinDate: "", memo: "" },
    { id: "d4", name: "임미주", phone: "010-1965-2333", parentId: "c9", joinDate: "", memo: "" },
    { id: "d5", name: "안정기", phone: "010-4935-0011", parentId: "c9", joinDate: "", memo: "" },
    { id: "d6", name: "강선도", phone: "010-0643-2977", parentId: "c9", joinDate: "", memo: "" },
    { id: "e1", name: "전미정", phone: "010-1964-4411", parentId: "d6", joinDate: "", memo: "" },
    { id: "e2", name: "김혜은", phone: "010-8160-2177", parentId: "d6", joinDate: "", memo: "" },
    { id: "e3", name: "황은배", phone: "010-8216-1455", parentId: "d6", joinDate: "", memo: "" },
    { id: "e4", name: "이의우", phone: "010-1899-4119", parentId: "d6", joinDate: "", memo: "" },
    { id: "e5", name: "김충강", phone: "010-8810-6844", parentId: "d6", joinDate: "", memo: "" },
    { id: "f1", name: "전이면", phone: "010-8881-3344", parentId: "e5", joinDate: "", memo: "" },
    { id: "f2", name: "박희란", phone: "010-8206-3044", parentId: "e5", joinDate: "", memo: "" },
    { id: "f3", name: "김종환", phone: "010-8124-8055", parentId: "e5", joinDate: "", memo: "" },
    { id: "g1", name: "조제연", phone: "010-8885-4488", parentId: "f3", joinDate: "", memo: "" },
  ],
};

const LEVEL_COLORS = ["#FF6B35","#E8430A","#D4A017","#2E86AB","#A23B72","#F18F01","#C73E1D","#3B1F2B","#44BBA4","#E94F37"];
const LEVEL_LABELS = ["본부","1단계","2단계","3단계","4단계","5단계","6단계","7단계","8단계","9단계"];

/* ═══════════════════════════════════════════
   직급 시스템
   ═══════════════════════════════════════════ */
const RANK_LEVELS = [
  { name: "사원", minDirect: 0, minTotal: 0, color: "#888", bg: "rgba(136,136,136,0.12)", icon: "○" },
  { name: "주임", minDirect: 1, minTotal: 2, color: "#44BBA4", bg: "rgba(68,187,164,0.15)", icon: "●" },
  { name: "대리", minDirect: 3, minTotal: 7, color: "#2E86AB", bg: "rgba(46,134,171,0.15)", icon: "◆" },
  { name: "과장", minDirect: 5, minTotal: 15, color: "#A23B72", bg: "rgba(162,59,114,0.15)", icon: "★" },
  { name: "차장", minDirect: 8, minTotal: 25, color: "#D4A017", bg: "rgba(212,160,23,0.15)", icon: "★★" },
  { name: "부장", minDirect: 12, minTotal: 40, color: "#FF6B35", bg: "rgba(255,107,53,0.15)", icon: "★★★" },
  { name: "본부장", minDirect: 15, minTotal: 60, color: "#E8430A", bg: "rgba(232,67,10,0.15)", icon: "♛" },
];

function generateId() { return "m_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5); }
function getChildren(members, parentId) { return members.filter((m) => m.parentId === parentId); }
function getLevel(members, memberId) { let l = 0; let c = members.find((m) => m.id === memberId); while (c && c.parentId) { l++; c = members.find((m) => m.id === c.parentId); } return l; }
function getDescendants(members, memberId) { const r = []; const q = [memberId]; while (q.length) { const cur = q.shift(); getChildren(members, cur).forEach((ch) => { r.push(ch); q.push(ch.id); }); } return r; }
function getAncestorPath(members, memberId) { const p = []; let c = members.find((m) => m.id === memberId); while (c) { p.unshift(c); c = c.parentId ? members.find((m) => m.id === c.parentId) : null; } return p; }

function getRank(members, memberId) {
  const dc = getChildren(members, memberId).length;
  const tc = getDescendants(members, memberId).length;
  let rank = RANK_LEVELS[0];
  for (let i = RANK_LEVELS.length - 1; i >= 0; i--) {
    if (dc >= RANK_LEVELS[i].minDirect || tc >= RANK_LEVELS[i].minTotal) { rank = RANK_LEVELS[i]; break; }
  }
  return { ...rank, dc, tc };
}

function getNextRank(members, memberId) {
  const cur = getRank(members, memberId);
  const idx = RANK_LEVELS.findIndex(r => r.name === cur.name);
  if (idx >= RANK_LEVELS.length - 1) return null;
  const next = RANK_LEVELS[idx + 1];
  return { ...next, directNeeded: Math.max(0, next.minDirect - cur.dc), totalNeeded: Math.max(0, next.minTotal - cur.tc) };
}

/* ═══════════════════════════════════════════
   VISUAL TREE
   ═══════════════════════════════════════════ */
const NODE_H = 30, NODE_GAP = 3, NODE_W = 76, COL_GAP = 28, DOT_R = 4.5;

function measureSubtree(members, nodeId) {
  const ch = getChildren(members, nodeId);
  if (!ch.length) return NODE_H;
  let t = 0;
  ch.forEach((c, i) => { if (i > 0) t += NODE_GAP; t += measureSubtree(members, c.id); });
  return Math.max(NODE_H, t);
}

function VisualTreeNode({ member, members, x, y, height, level, onNodeClick, selectedId }) {
  const children = getChildren(members, member.id);
  const isSelected = selectedId === member.id;
  const lc = LEVEL_COLORS[level % LEVEL_COLORS.length];
  const nodeY = y + height / 2 - NODE_H / 2;
  const cy = y + height / 2;
  const nx = x + NODE_W + COL_GAP;
  let cps = [];
  if (children.length) { let oy = y; children.forEach((ch) => { const chH = measureSubtree(members, ch.id); cps.push({ child: ch, cy: oy, ch: chH }); oy += chH + NODE_GAP; }); }

  return (
    <g>
      {children.length > 0 && (<>
        <line x1={x + NODE_W} y1={cy} x2={x + NODE_W + COL_GAP / 2} y2={cy} stroke="#4a4a5a" strokeWidth={1.2} />
        <circle cx={x + NODE_W + COL_GAP / 2} cy={cy} r={DOT_R} fill="#2a2a3a" stroke="#5a5a6a" strokeWidth={1} />
        {cps.length > 1 && <line x1={x + NODE_W + COL_GAP / 2} y1={cps[0].cy + cps[0].ch / 2} x2={x + NODE_W + COL_GAP / 2} y2={cps[cps.length - 1].cy + cps[cps.length - 1].ch / 2} stroke="#4a4a5a" strokeWidth={1.2} />}
        {cps.map(({ child, cy: ccy, ch: cch }) => <line key={child.id + "l"} x1={x + NODE_W + COL_GAP / 2} y1={ccy + cch / 2} x2={nx} y2={ccy + cch / 2} stroke="#4a4a5a" strokeWidth={1.2} />)}
      </>)}
      <g onClick={() => onNodeClick(member.id)} style={{ cursor: "pointer" }}>
        <rect x={x + 1} y={nodeY + 1} width={NODE_W} height={NODE_H} rx={level === 0 ? 8 : 5} fill="rgba(0,0,0,0.3)" />
        <rect x={x} y={nodeY} width={NODE_W} height={NODE_H} rx={level === 0 ? 8 : 5}
          fill={isSelected ? lc : level === 0 ? "#3a3a3a" : "#222230"}
          stroke={isSelected ? "#fff" : level === 0 ? "#555" : "#3a3a4a"}
          strokeWidth={isSelected ? 2 : 1} />
        <text x={x + NODE_W / 2} y={nodeY + NODE_H / 2 + 1} textAnchor="middle" dominantBaseline="middle"
          fill={isSelected || level === 0 ? "#fff" : "#c8c8d0"} fontSize={11.5}
          fontWeight={level === 0 || isSelected ? 700 : 500} fontFamily="'Noto Sans KR', sans-serif">
          {member.name}
        </text>
      </g>
      {cps.map(({ child, cy: ccy, ch: cch }) => (
        <VisualTreeNode key={child.id} member={child} members={members} x={nx} y={ccy} height={cch} level={level + 1} onNodeClick={onNodeClick} selectedId={selectedId} />
      ))}
    </g>
  );
}

function VisualTree({ members, onNodeClick, selectedId }) {
  const [scale, setScale] = useState(0.7);
  const [pan, setPan] = useState({ x: 30, y: 30 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOff, setPanOff] = useState({ x: 0, y: 0 });
  const [lastDist, setLastDist] = useState(null);
  const root = members.find((m) => !m.parentId);
  if (!root) return null;
  function maxDepth(id, d) { const ch = getChildren(members, id); if (!ch.length) return d; return Math.max(...ch.map((c) => maxDepth(c.id, d + 1))); }
  const md = maxDepth(root.id, 0);
  const totalH = measureSubtree(members, root.id);
  const totalW = (md + 1) * (NODE_W + COL_GAP) + 60;
  const onWheel = (e) => { e.preventDefault(); setScale((s) => Math.max(0.12, Math.min(3, s + (e.deltaY > 0 ? -0.06 : 0.06)))); };
  const onPD = (e) => { setIsPanning(true); setPanStart({ x: e.clientX - panOff.x, y: e.clientY - panOff.y }); };
  const onPM = (e) => { if (!isPanning) return; const o = { x: e.clientX - panStart.x, y: e.clientY - panStart.y }; setPanOff(o); setPan({ x: 30 + o.x, y: 30 + o.y }); };
  const onPU = () => setIsPanning(false);
  const onTS = (e) => {
    if (e.touches.length === 2) { const dx = e.touches[0].clientX - e.touches[1].clientX; const dy = e.touches[0].clientY - e.touches[1].clientY; setLastDist(Math.sqrt(dx*dx+dy*dy)); }
    else if (e.touches.length === 1) { setIsPanning(true); setPanStart({ x: e.touches[0].clientX - panOff.x, y: e.touches[0].clientY - panOff.y }); }
  };
  const onTM = (e) => {
    if (e.touches.length === 2 && lastDist) { const dx = e.touches[0].clientX - e.touches[1].clientX; const dy = e.touches[0].clientY - e.touches[1].clientY; const d = Math.sqrt(dx*dx+dy*dy); setScale((s) => Math.max(0.12, Math.min(3, s + (d - lastDist) * 0.004))); setLastDist(d); }
    else if (e.touches.length === 1 && isPanning) { const o = { x: e.touches[0].clientX - panStart.x, y: e.touches[0].clientY - panStart.y }; setPanOff(o); setPan({ x: 30 + o.x, y: 30 + o.y }); }
  };
  const onTE = () => { setIsPanning(false); setLastDist(null); };
  const reset = () => { setScale(0.7); setPan({ x: 30, y: 30 }); setPanOff({ x: 0, y: 0 }); };
  const zbtn = { width: 34, height: 34, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(20,20,35,0.92)", color: "#ccc", fontSize: 17, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 10, display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
        <button onClick={() => setScale((s) => Math.min(3, s + 0.15))} style={zbtn}>+</button>
        <div style={{ fontSize: 10, color: "#666", padding: "1px 0" }}>{Math.round(scale * 100)}%</div>
        <button onClick={() => setScale((s) => Math.max(0.12, s - 0.15))} style={zbtn}>-</button>
        <button onClick={reset} style={{ ...zbtn, fontSize: 11, marginTop: 4 }}>R</button>
      </div>
      <div style={{ position: "absolute", bottom: 10, left: 10, zIndex: 10, fontSize: 10, color: "#444", background: "rgba(13,13,26,0.8)", padding: "4px 8px", borderRadius: 6 }}>
        드래그: 이동 / 스크롤: 확대축소
      </div>
      <div style={{ width: "100%", height: "100%", overflow: "hidden", cursor: isPanning ? "grabbing" : "grab", touchAction: "none" }}
        onWheel={onWheel} onPointerDown={onPD} onPointerMove={onPM} onPointerUp={onPU} onPointerLeave={onPU}
        onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE}>
        <svg width={totalW * scale + Math.abs(pan.x) + 300} height={totalH * scale + Math.abs(pan.y) + 300} style={{ minWidth: "100%", minHeight: "100%" }}>
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}>
            <VisualTreeNode member={root} members={members} x={0} y={0} height={totalH} level={0} onNodeClick={onNodeClick} selectedId={selectedId} />
          </g>
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LIST TREE (더블클릭 → 직급 팝업)
   ═══════════════════════════════════════════ */
function TreeNode({ member, members, level, onSelect, onDoubleClick, selectedId, expandedNodes, toggleExpand, searchHighlight }) {
  const children = getChildren(members, member.id);
  const isExpanded = expandedNodes.has(member.id);
  const isSelected = selectedId === member.id;
  const hasChildren = children.length > 0;
  const desc = getDescendants(members, member.id).length;
  const isHL = searchHighlight === member.id;
  const lc = LEVEL_COLORS[level % LEVEL_COLORS.length];
  const rank = getRank(members, member.id);
  return (
    <div style={{ marginLeft: level === 0 ? 0 : 24 }}>
      <div onClick={() => onSelect(member.id)}
        onDoubleClick={(e) => { e.preventDefault(); onDoubleClick(member.id); }}
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", margin: "2px 0", borderRadius: 10, cursor: "pointer", background: isSelected ? "linear-gradient(135deg, #1a1a2e, #16213e)" : isHL ? "rgba(255,107,53,0.15)" : "transparent", border: isHL ? "1.5px solid #FF6B35" : isSelected ? "1.5px solid #FF6B35" : "1.5px solid transparent", transition: "all 0.2s", userSelect: "none" }}>
        {hasChildren ? <div onClick={(e) => { e.stopPropagation(); toggleExpand(member.id); }} style={{ width: 22, height: 22, borderRadius: 6, background: isExpanded ? "rgba(255,107,53,0.15)" : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: isExpanded ? "#FF6B35" : "#888", flexShrink: 0, cursor: "pointer" }}>{isExpanded ? "▼" : "▶"}</div> : <div style={{ width: 22, flexShrink: 0 }} />}
        <div style={{ background: lc, color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 5, flexShrink: 0 }}>L{level}</div>
        <div style={{ fontWeight: 600, color: isSelected ? "#FF6B35" : "#e8e8e8", fontSize: 14, flex: 1 }}>{member.name}</div>
        <div style={{ fontSize: 9, color: rank.color, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: rank.bg, flexShrink: 0 }}>{rank.icon} {rank.name}</div>
        {desc > 0 && <div style={{ background: "rgba(255,255,255,0.06)", color: "#999", fontSize: 10, padding: "2px 7px", borderRadius: 10 }}>{desc}명</div>}
      </div>
      {isExpanded && hasChildren && <div style={{ borderLeft: `2px solid ${lc}33`, marginLeft: 11 }}>{children.map((ch) => <TreeNode key={ch.id} member={ch} members={members} level={level + 1} onSelect={onSelect} onDoubleClick={onDoubleClick} selectedId={selectedId} expandedNodes={expandedNodes} toggleExpand={toggleExpand} searchHighlight={searchHighlight} />)}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   직급 상세 팝업 (더블클릭)
   ═══════════════════════════════════════════ */
function RankPopup({ member, members, onClose }) {
  const rank = getRank(members, member.id);
  const next = getNextRank(members, member.id);
  const level = getLevel(members, member.id);
  const parent = members.find(m => m.id === member.parentId);
  const directProg = next ? Math.min(100, (rank.dc / next.minDirect) * 100) : 100;
  const totalProg = next ? Math.min(100, (rank.tc / next.minTotal) * 100) : 100;

  return (
    <div onClick={onClose} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1002, backdropFilter: "blur(4px)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "linear-gradient(135deg, #1a1a2e, #0d0d1a)", borderRadius: 20, padding: 28, width: 340, maxWidth: "90vw", border: `1.5px solid ${rank.color}44`, boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${rank.color}22` }}>
        {/* 직급 배지 */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 36, color: rank.color, fontWeight: 900, letterSpacing: 2 }}>{rank.icon}</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: rank.color, marginTop: 4 }}>{rank.name}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#e0e0e0", marginTop: 6 }}>{member.name}</div>
          <div style={{ fontSize: 12, color: "#777", marginTop: 2 }}>{LEVEL_LABELS[level] || level + "단계"} {parent ? `| 추천인: ${parent.name}` : ""}</div>
        </div>

        {/* 실적 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#888", marginBottom: 4 }}>직추천</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#FF6B35" }}>{rank.dc}명</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#888", marginBottom: 4 }}>전체 하위</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#2E86AB" }}>{rank.tc}명</div>
          </div>
        </div>

        {/* 다음 직급 진행도 */}
        {next ? (
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#aaa", marginBottom: 10 }}>다음 직급: <span style={{ color: next.color }}>{next.name}</span></div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888", marginBottom: 4 }}>
                <span>직추천 {rank.dc}/{next.minDirect}명</span>
                <span>{next.directNeeded > 0 ? `${next.directNeeded}명 더 필요` : "달성!"}</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${directProg}%`, height: "100%", background: `linear-gradient(90deg, ${next.color}, ${next.color}88)`, borderRadius: 3, transition: "width 0.5s" }} />
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#888", marginBottom: 4 }}>
                <span>전체 하위 {rank.tc}/{next.minTotal}명</span>
                <span>{next.totalNeeded > 0 ? `${next.totalNeeded}명 더 필요` : "달성!"}</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${totalProg}%`, height: "100%", background: `linear-gradient(90deg, ${next.color}, ${next.color}88)`, borderRadius: 3, transition: "width 0.5s" }} />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "12px 0", marginBottom: 16, fontSize: 13, color: "#FFD700", fontWeight: 700 }}>최고 직급 달성!</div>
        )}

        <button onClick={onClose} style={{ width: "100%", padding: "12px 0", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${rank.color}, ${rank.color}88)`, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>닫기</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   STATS DASHBOARD (대시보드)
   ═══════════════════════════════════════════ */
function StatsPanel({ members }) {
  const total = members.length;
  const maxLvl = Math.max(...members.map((m) => getLevel(members, m.id)));

  // 단계별 분포
  const lc = {}; members.forEach((m) => { const l = getLevel(members, m.id); lc[l] = (lc[l] || 0) + 1; });

  // 월별 가입
  const mj = {}; const now = new Date();
  for (let i = 5; i >= 0; i--) { const d = new Date(now.getFullYear(), now.getMonth() - i, 1); mj[`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`] = 0; }
  members.forEach((m) => { if (m.joinDate) { const k = m.joinDate.substring(0, 7); if (mj.hasOwnProperty(k)) mj[k]++; } });
  const mm = Math.max(...Object.values(mj), 1);

  // 추천 실적 TOP 5
  const rc = {}; members.forEach((m) => { if (m.parentId) rc[m.parentId] = (rc[m.parentId] || 0) + 1; });
  const top = Object.entries(rc).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id, cnt]) => ({ member: members.find((m) => m.id === id), dc: cnt, tc: getDescendants(members, id).length }));

  // 직급 분포
  const rankDist = {}; RANK_LEVELS.forEach(r => { rankDist[r.name] = 0; });
  members.forEach(m => { const r = getRank(members, m.id); rankDist[r.name]++; });
  const maxRankCnt = Math.max(...Object.values(rankDist), 1);

  // 비활동 회원 (직추천 0명인 회원)
  const leafMembers = members.filter(m => m.parentId && getChildren(members, m.id).length === 0);

  // 팀 규모 TOP (루트 직하위 기준)
  const root = members.find(m => !m.parentId);
  const branchStats = root ? getChildren(members, root.id).map(ch => ({
    member: ch,
    direct: getChildren(members, ch.id).length,
    total: getDescendants(members, ch.id).length,
    depth: (function md(id, d) { const c = getChildren(members, id); if (!c.length) return d; return Math.max(...c.map(x => md(x.id, d+1))); })(ch.id, 0)
  })).sort((a,b) => b.total - a.total) : [];

  // 평균 직추천
  const avgDirect = total > 1 ? ((members.reduce((s, m) => s + getChildren(members, m.id).length, 0)) / total).toFixed(1) : "0";

  // 네트워크 깊이
  const maxNetDepth = root ? (function md(id, d) { const c = getChildren(members, id); if (!c.length) return d; return Math.max(...c.map(x => md(x.id, d+1))); })(root.id, 0) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22, padding: "0 4px" }}>
      {/* 핵심 지표 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { l: "총 회원", v: total + "명", c: "#FF6B35" },
          { l: "최대 깊이", v: maxNetDepth + "단계", c: "#2E86AB" },
          { l: "평균 직추천", v: avgDirect + "명", c: "#44BBA4" },
          { l: "비활동 회원", v: leafMembers.length + "명", c: "#A23B72" },
        ].map((cd, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#777", marginBottom: 4, letterSpacing: 1 }}>{cd.l}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: cd.c }}>{cd.v}</div>
          </div>
        ))}
      </div>

      {/* 직급 분포 */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#aaa", marginBottom: 10 }}>직급 분포</div>
        {RANK_LEVELS.map((rl) => (
          <div key={rl.name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
            <div style={{ width: 50, fontSize: 11, color: rl.color, fontWeight: 700, textAlign: "right" }}>{rl.icon} {rl.name}</div>
            <div style={{ flex: 1, height: 18, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${(rankDist[rl.name] / maxRankCnt) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${rl.color}cc, ${rl.color}44)`, borderRadius: 4, minWidth: rankDist[rl.name] > 0 ? 16 : 0 }} />
            </div>
            <div style={{ width: 32, fontSize: 12, color: "#ccc", fontWeight: 600, textAlign: "right" }}>{rankDist[rl.name]}</div>
          </div>
        ))}
      </div>

      {/* 단계별 분포 */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#aaa", marginBottom: 10 }}>단계별 분포</div>
        {Object.entries(lc).sort((a, b) => +a[0] - +b[0]).map(([lvl, cnt]) => (
          <div key={lvl} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{ width: 48, fontSize: 11, color: LEVEL_COLORS[+lvl % LEVEL_COLORS.length], fontWeight: 700, textAlign: "right" }}>{LEVEL_LABELS[+lvl] || lvl + "단계"}</div>
            <div style={{ flex: 1, height: 20, background: "rgba(255,255,255,0.04)", borderRadius: 5, overflow: "hidden" }}><div style={{ width: `${(cnt / total) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${LEVEL_COLORS[+lvl % LEVEL_COLORS.length]}cc, ${LEVEL_COLORS[+lvl % LEVEL_COLORS.length]}66)`, borderRadius: 5, minWidth: 20 }} /></div>
            <div style={{ width: 36, fontSize: 12, color: "#ccc", fontWeight: 600, textAlign: "right" }}>{cnt}명</div>
          </div>
        ))}
      </div>

      {/* 팀 규모 분석 (루트 직하위) */}
      {branchStats.length > 0 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#aaa", marginBottom: 10 }}>팀 규모 분석</div>
          {branchStats.map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 6, background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: getRank(members, b.member.id).bg, border: `1px solid ${getRank(members, b.member.id).color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: getRank(members, b.member.id).color }}>{getRank(members, b.member.id).icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e0e0e0" }}>{b.member.name} <span style={{ fontSize: 10, color: getRank(members, b.member.id).color }}>({getRank(members, b.member.id).name})</span></div>
                <div style={{ fontSize: 10, color: "#777" }}>직추천 {b.direct}명 / 전체 {b.total}명 / 깊이 {b.depth}단계</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 월별 신규 가입 */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#aaa", marginBottom: 10 }}>월별 신규 가입</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
          {Object.entries(mj).map(([mo, cnt]) => (
            <div key={mo} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ fontSize: 11, color: "#FF6B35", fontWeight: 700 }}>{cnt}</div>
              <div style={{ width: "100%", height: `${Math.max((cnt / mm) * 70, 4)}px`, background: "linear-gradient(180deg, #FF6B35, #FF6B3544)", borderRadius: "4px 4px 0 0" }} />
              <div style={{ fontSize: 9, color: "#666" }}>{mo.substring(5)}월</div>
            </div>
          ))}
        </div>
      </div>

      {/* 추천 실적 TOP 5 */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#aaa", marginBottom: 10 }}>추천 실적 TOP 5</div>
        {top.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", marginBottom: 6, background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: i === 0 ? "#FFD700" : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : "#555", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: i < 3 ? "#000" : "#ccc" }}>{i + 1}</div>
            <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#e0e0e0" }}>{r.member?.name || "?"} <span style={{ fontSize: 10, color: getRank(members, r.member?.id).color }}>({getRank(members, r.member?.id).name})</span></div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 12, fontWeight: 700, color: "#FF6B35" }}>직추천 {r.dc}명</div><div style={{ fontSize: 10, color: "#777" }}>전체 {r.tc}명</div></div>
          </div>
        ))}
        {!top.length && <div style={{ fontSize: 12, color: "#666", padding: 10 }}>추천 실적이 없습니다</div>}
      </div>

      {/* 비활동 회원 */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#aaa", marginBottom: 10 }}>비활동 회원 (추천 0명) — {leafMembers.length}명</div>
        <div style={{ maxHeight: 200, overflowY: "auto", borderRadius: 10, background: "rgba(255,255,255,0.02)", padding: "6px 0" }}>
          {leafMembers.slice(0, 20).map((m, i) => {
            const lvl = getLevel(members, m.id);
            const par = members.find(x => x.id === m.parentId);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", fontSize: 12 }}>
                <div style={{ color: LEVEL_COLORS[lvl % LEVEL_COLORS.length], fontWeight: 700, fontSize: 10, width: 26 }}>L{lvl}</div>
                <div style={{ flex: 1, color: "#ccc" }}>{m.name}</div>
                <div style={{ color: "#666", fontSize: 10 }}>추천인: {par?.name || "-"}</div>
              </div>
            );
          })}
          {leafMembers.length > 20 && <div style={{ textAlign: "center", fontSize: 11, color: "#666", padding: 6 }}>외 {leafMembers.length - 20}명...</div>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MEMBER DETAIL
   ═══════════════════════════════════════════ */
function MemberDetail({ member, members, onClose, onEdit, onDelete, onAddChild }) {
  const level = getLevel(members, member.id);
  const children = getChildren(members, member.id);
  const descendants = getDescendants(members, member.id);
  const path = getAncestorPath(members, member.id);
  const rank = getRank(members, member.id);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#FF6B35" }}>{member.name}</div>
          <div style={{ fontSize: 11, color: rank.color, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: rank.bg }}>{rank.icon} {rank.name}</div>
        </div>
        <div onClick={onClose} style={{ cursor: "pointer", color: "#666", fontSize: 18, padding: "2px 8px" }}>✕</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[{ l: "연락처", v: member.phone || "-" }, { l: "가입일", v: member.joinDate || "-" }, { l: "레벨", v: `${LEVEL_LABELS[level] || level + "단계"} (L${level})`, c: LEVEL_COLORS[level % LEVEL_COLORS.length] }, { l: "직추천", v: children.length + "명" }, { l: "전체 하위", v: descendants.length + "명" }, { l: "메모", v: member.memo || "-" }].map((it, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ fontSize: 12, color: "#777" }}>{it.l}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: it.c || "#ccc" }}>{it.v}</div>
          </div>
        ))}
      </div>
      <div>
        <div style={{ fontSize: 11, color: "#777", marginBottom: 5 }}>추천 경로</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
          {path.map((a, i) => (
            <span key={a.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 5, background: a.id === member.id ? "#FF6B35" : "rgba(255,255,255,0.06)", color: a.id === member.id ? "#fff" : "#aaa", fontWeight: 600 }}>{a.name}</span>
              {i < path.length - 1 && <span style={{ color: "#444", fontSize: 10 }}>→</span>}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
        <button onClick={onAddChild} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #FF6B35, #E8430A)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ 하위 추가</button>
        <button onClick={onEdit} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#ccc", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>수정</button>
        {member.parentId && <button onClick={onDelete} style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(255,60,60,0.2)", background: "rgba(255,60,60,0.08)", color: "#ff5555", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>삭제</button>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MODALS
   ═══════════════════════════════════════════ */
function MemberModal({ mode, member, parentName, onSave, onCancel }) {
  const [name, setName] = useState(member?.name || "");
  const [phone, setPhone] = useState(member?.phone || "");
  const [joinDate, setJoinDate] = useState(member?.joinDate || new Date().toISOString().substring(0, 10));
  const [memo, setMemo] = useState(member?.memo || "");
  const is = { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#e0e0e0", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  return (
    <div onClick={onCancel} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#1a1a2e", borderRadius: 16, padding: 28, width: 360, maxWidth: "90vw", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#FF6B35", marginBottom: 4 }}>{mode === "add" ? "회원 추가" : "회원 수정"}</div>
        {mode === "add" && parentName && <div style={{ fontSize: 12, color: "#777", marginBottom: 16 }}>추천인: {parentName}</div>}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
          <div><label style={{ fontSize: 11, color: "#888", marginBottom: 4, display: "block" }}>이름 *</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="회원 이름" style={is} /></div>
          <div><label style={{ fontSize: 11, color: "#888", marginBottom: 4, display: "block" }}>연락처</label><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" style={is} /></div>
          <div><label style={{ fontSize: 11, color: "#888", marginBottom: 4, display: "block" }}>가입일</label><input type="date" value={joinDate} onChange={(e) => setJoinDate(e.target.value)} style={is} /></div>
          <div><label style={{ fontSize: 11, color: "#888", marginBottom: 4, display: "block" }}>메모</label><textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="메모" rows={2} style={{ ...is, resize: "vertical" }} /></div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "11px 0", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#aaa", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>취소</button>
          <button onClick={() => { if (!name.trim()) return; onSave({ name: name.trim(), phone: phone.trim(), joinDate, memo: memo.trim() }); }} style={{ flex: 1, padding: "11px 0", borderRadius: 8, border: "none", background: name.trim() ? "linear-gradient(135deg, #FF6B35, #E8430A)" : "#333", color: name.trim() ? "#fff" : "#666", fontSize: 13, fontWeight: 700, cursor: name.trim() ? "pointer" : "default" }}>{mode === "add" ? "추가" : "저장"}</button>
        </div>
      </div>
    </div>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div onClick={onCancel} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1001 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#1a1a2e", borderRadius: 16, padding: 28, width: 320, border: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
        <div style={{ fontSize: 14, color: "#ccc", lineHeight: 1.6, marginBottom: 20 }}>{message}</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#aaa", fontSize: 13, cursor: "pointer" }}>취소</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", background: "#ff4444", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>삭제</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */
export default function ReferralTreeApp() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("visual");
  const [showStats, setShowStats] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set(["root"]));
  const [search, setSearch] = useState("");
  const [searchHighlight, setSearchHighlight] = useState(null);
  const [modal, setModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [rankPopupId, setRankPopupId] = useState(null);

  useEffect(() => {
    try { const r = localStorage.getItem(STORAGE_KEY); if (r) setData(JSON.parse(r)); else { setData(DEFAULT_DATA); localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA)); } } catch { setData(DEFAULT_DATA); }
    setLoading(false);
  }, []);

  const saveData = useCallback((nd) => { setData(nd); try { localStorage.setItem(STORAGE_KEY, JSON.stringify(nd)); } catch {} }, []);
  const expandToNode = useCallback((ms, mid) => { const p = getAncestorPath(ms, mid); setExpandedNodes((prev) => { const n = new Set(prev); p.forEach((m) => n.add(m.id)); return n; }); }, []);

  useEffect(() => {
    if (!search.trim() || !data) { setSearchHighlight(null); return; }
    const f = data.members.find((m) => m.name.includes(search.trim()) || (m.phone && m.phone.includes(search.trim())));
    if (f) { setSearchHighlight(f.id); expandToNode(data.members, f.id); } else setSearchHighlight(null);
  }, [search, data, expandToNode]);

  const toggleExpand = useCallback((id) => { setExpandedNodes((p) => { const n = new Set(p); if (n.has(id)) n.delete(id); else n.add(id); return n; }); }, []);
  const expandAll = useCallback(() => { if (data) setExpandedNodes(new Set(data.members.map((m) => m.id))); }, [data]);
  const collapseAll = useCallback(() => setExpandedNodes(new Set(["root"])), []);

  const handleAdd = useCallback((fd) => {
    if (!modal || !data) return;
    const nm = { id: generateId(), name: fd.name, phone: fd.phone, parentId: modal.parentId, joinDate: fd.joinDate, memo: fd.memo };
    const nd = { ...data, members: [...data.members, nm] };
    saveData(nd); expandToNode(nd.members, nm.id); setSelectedId(nm.id); setModal(null);
  }, [modal, data, saveData, expandToNode]);

  const handleEdit = useCallback((fd) => {
    if (!modal || !data) return;
    saveData({ ...data, members: data.members.map((m) => m.id === modal.member.id ? { ...m, name: fd.name, phone: fd.phone, joinDate: fd.joinDate, memo: fd.memo } : m) });
    setModal(null);
  }, [modal, data, saveData]);

  const handleDelete = useCallback((mid) => {
    if (!data) return;
    const rm = new Set([mid, ...getDescendants(data.members, mid).map((d) => d.id)]);
    saveData({ ...data, members: data.members.filter((m) => !rm.has(m.id)) }); setSelectedId(null); setConfirmDelete(null);
  }, [data, saveData]);

  const handleReset = useCallback(() => { saveData(DEFAULT_DATA); setSelectedId(null); setExpandedNodes(new Set(["root"])); }, [saveData]);

  if (loading) return <div style={{ minHeight: "100vh", background: "#0d0d1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF6B35", fontFamily: "'Noto Sans KR', sans-serif" }}>로딩 중...</div>;
  if (!data) return null;

  const rootMember = data.members.find((m) => !m.parentId);
  const selectedMember = data.members.find((m) => m.id === selectedId);
  const rankPopupMember = rankPopupId ? data.members.find((m) => m.id === rankPopupId) : null;

  return (
    <div style={{ minHeight: "100vh", height: "100vh", background: "#0d0d1a", fontFamily: "'Noto Sans KR', 'Pretendard', sans-serif", color: "#e0e0e0", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 20px 12px", flexShrink: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, background: "linear-gradient(135deg, #FF6B35, #FFB347)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>추천인 계보도</div>
            <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>총 {data.members.length}명 · 최대 {Math.max(...data.members.map((m) => getLevel(data.members, m.id)))}단계</div>
          </div>
          <button onClick={handleReset} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#666", fontSize: 11, cursor: "pointer" }}>초기화</button>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1, display: "flex", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 3 }}>
            <button onClick={() => setViewMode("visual")} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", background: viewMode === "visual" ? "linear-gradient(135deg, #FF6B35, #E8430A)" : "transparent", color: viewMode === "visual" ? "#fff" : "#777", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>계보도</button>
            <button onClick={() => setViewMode("tree")} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", background: viewMode === "tree" ? "linear-gradient(135deg, #FF6B35, #E8430A)" : "transparent", color: viewMode === "tree" ? "#fff" : "#777", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>목록</button>
          </div>
          <button onClick={() => setShowStats(!showStats)} style={{ width: 40, height: 40, borderRadius: 10, border: showStats ? "1.5px solid #FF6B35" : "1px solid rgba(255,255,255,0.08)", background: showStats ? "rgba(255,107,53,0.15)" : "rgba(255,255,255,0.03)", color: showStats ? "#FF6B35" : "#777", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s", fontWeight: 700 }}>통계</button>
        </div>
      </div>

      {/* CONTENT */}
      {viewMode === "visual" && !showStats && (
        <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
          <VisualTree members={data.members} onNodeClick={(id) => setSelectedId(id === selectedId ? null : id)} selectedId={selectedId} />
        </div>
      )}

      {viewMode === "tree" && !showStats && (
        <div style={{ flex: 1, overflow: "auto", padding: "12px 12px" }}>
          <div style={{ marginBottom: 8, padding: "8px 12px", background: "rgba(255,107,53,0.06)", borderRadius: 8, border: "1px solid rgba(255,107,53,0.12)", fontSize: 11, color: "#999" }}>
            이름을 더블클릭하면 직급 상세를 볼 수 있습니다
          </div>
          <div style={{ marginBottom: 12, display: "flex", gap: 8 }}>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="이름 또는 연락처 검색..." style={{ flex: 1, padding: "9px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#e0e0e0", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
            <button onClick={expandAll} style={{ padding: "0 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#888", fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }}>전체 펼침</button>
            <button onClick={collapseAll} style={{ padding: "0 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#888", fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }}>접기</button>
          </div>
          <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 14, padding: "8px 4px" }}>
            {rootMember && <TreeNode member={rootMember} members={data.members} level={0} onSelect={setSelectedId} onDoubleClick={setRankPopupId} selectedId={selectedId} expandedNodes={expandedNodes} toggleExpand={toggleExpand} searchHighlight={searchHighlight} />}
          </div>
          <button onClick={() => setModal({ mode: "add", parentId: selectedId || "root" })} style={{ width: "100%", padding: "14px 0", marginTop: 14, borderRadius: 12, border: "2px dashed rgba(255,107,53,0.3)", background: "rgba(255,107,53,0.05)", color: "#FF6B35", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>+ 새 회원 추가</button>
        </div>
      )}

      {showStats && (
        <div style={{ flex: 1, overflow: "auto", padding: "16px 12px", maxWidth: 600, margin: "0 auto", width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#FF6B35" }}>대시보드</div>
            <div onClick={() => setShowStats(false)} style={{ cursor: "pointer", color: "#666", fontSize: 16, padding: "2px 8px" }}>✕</div>
          </div>
          <StatsPanel members={data.members} />
        </div>
      )}

      {/* SELECTED MEMBER DRAWER */}
      {selectedMember && !showStats && (
        <div style={{
          background: "rgba(15,15,30,0.97)", border: "1px solid rgba(255,107,53,0.15)",
          borderRadius: viewMode === "visual" ? "14px 14px 0 0" : 14,
          padding: 18, flexShrink: 0,
          ...(viewMode === "visual" ? { position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, maxHeight: "42vh", overflowY: "auto", boxShadow: "0 -10px 40px rgba(0,0,0,0.5)" } : { margin: "0 12px 12px" }),
        }}>
          <MemberDetail member={selectedMember} members={data.members} onClose={() => setSelectedId(null)}
            onEdit={() => setModal({ mode: "edit", member: selectedMember })}
            onDelete={() => { const d = getDescendants(data.members, selectedMember.id); setConfirmDelete({ id: selectedMember.id, message: d.length ? `"${selectedMember.name}" 및 하위 ${d.length}명을 모두 삭제하시겠습니까?` : `"${selectedMember.name}"을(를) 삭제하시겠습니까?` }); }}
            onAddChild={() => setModal({ mode: "add", parentId: selectedMember.id })}
          />
        </div>
      )}

      {/* 직급 팝업 (더블클릭) */}
      {rankPopupMember && <RankPopup member={rankPopupMember} members={data.members} onClose={() => setRankPopupId(null)} />}

      {modal && <MemberModal mode={modal.mode} member={modal.member} parentName={modal.parentId ? data.members.find((m) => m.id === modal.parentId)?.name : null} onSave={modal.mode === "add" ? handleAdd : handleEdit} onCancel={() => setModal(null)} />}
      {confirmDelete && <ConfirmDialog message={confirmDelete.message} onConfirm={() => handleDelete(confirmDelete.id)} onCancel={() => setConfirmDelete(null)} />}
    </div>
  );
}
