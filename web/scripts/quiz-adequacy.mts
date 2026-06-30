// Adequate-reachability: a SAFE-CORE recommendation is never a harm (it's the
// defensible default), so we only flag the asymmetric harm direction — a RISKY
// strategy matched to a user who shouldn't get it. We also report, per strategy,
// the AVERAGE winning profile so each strategy's "typical winner" can be eyeballed.
import { QUESTIONS, scoreQuiz, ALL_STRATEGY_IDS, type StrategyId } from "../lib/quiz.ts";
type Ans = Record<string,string>;
function* allCombos(): Generator<Ans> {
  const opts = QUESTIONS.map((q) => q.options.map((o) => o.id));
  const idx = new Array(QUESTIONS.length).fill(0);
  while (true) { const a:Ans={}; for(let i=0;i<QUESTIONS.length;i++) a[QUESTIONS[i].id]=opts[i][idx[i]];
    yield a; let k=QUESTIONS.length-1; while(k>=0){idx[k]++;if(idx[k]<opts[k].length)break;idx[k]=0;k--;} if(k<0)break; }
}
const DIM_MAX:any={H:95,E:95,R:185,X:95,C:200};
function dimsOf(a:Ans){const d:any={H:0,E:0,R:0,X:0,C:0};
  for(const q of QUESTIONS){const o=q.options.find(o=>o.id===a[q.id]); if(o?.dims) for(const[k,v] of Object.entries(o.dims)) d[k]+=v;}
  return {H:d.H/DIM_MAX.H*100,E:d.E/DIM_MAX.E*100,R:d.R/DIM_MAX.R*100,X:d.X/DIM_MAX.X*100,C:d.C/DIM_MAX.C*100};}

// HARM predicate: returns a reason string if this primary is an UNSAFE match.
// Safe core is never harmful. Each risky strategy must meet a minimum bar.
const SAFE = new Set(["index-passive","lifecycle","diversified","dividend-income"]);
function harm(p:StrategyId,d:any):string|null{
  if(SAFE.has(p)) return null;                          // safe default — never harm
  if(d.C<35) return "low-capacity into risky";          // should've been floored
  switch(p){
    case "value": case "event-driven": return d.X<25?"too inexperienced":null;
    case "growth": return d.R<25?"too risk-averse for growth":null;
    case "real-assets": return null;                    // moderate, broadly suitable
    case "factor-quant": return d.X<25?"too inexperienced for quant":null;
    case "global-macro": return d.X<25?"too inexperienced for macro":null;
    case "trend-momentum": return (d.R<40)?"too risk-averse for momentum":null;
    case "options-income": return (d.X<40||d.R<25)?"unsuitable for options":null;
    case "active-trading": return !(d.R>=65&&d.E>=65&&d.X>=60&&d.C>=65)?"failed active gate":null;
  }
  return null;
}
const wins:Record<string,number>={}, harms:Record<string,number>={};
const sum:Record<string,any>={};
for(const a of allCombos()){const r=scoreQuiz(a); const p=r.primary; const d=dimsOf(a);
  wins[p]=(wins[p]||0)+1;
  if(!sum[p])sum[p]={H:0,E:0,R:0,X:0,C:0,n:0}; for(const k of ["H","E","R","X","C"])sum[p][k]+=d[k]; sum[p].n++;
  const h=harm(p,d); if(h)harms[p]=(harms[p]||0)+1;
}
console.log("strategy          wins     HARM%   avg winner profile (H/E/R/X/C)");
for(const s of ALL_STRATEGY_IDS){const w=wins[s]||0,h=harms[s]||0,a=sum[s];
  const prof=a?`${(a.H/a.n)|0}/${(a.E/a.n)|0}/${(a.R/a.n)|0}/${(a.X/a.n)|0}/${(a.C/a.n)|0}`:"-";
  console.log(`${s.padEnd(16)} ${String(w).padStart(8)}  ${(w?h/w*100:0).toFixed(2).padStart(6)}%  ${prof}`);}
const tot=Object.values(harms).reduce((a,b)=>a+b,0);
console.log(`\nUNSAFE matches (risky strategy to unsuitable user): ${tot}`);
