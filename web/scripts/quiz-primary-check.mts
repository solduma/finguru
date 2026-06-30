// Confirms every strategy can be the PRIMARY (top pick), and shows how often.
import { QUESTIONS, scoreQuiz, ALL_STRATEGY_IDS, type StrategyId } from "../lib/quiz.ts";
type Ans = Record<string,string>;
function* allCombos(): Generator<Ans> {
  const opts = QUESTIONS.map((q) => q.options.map((o) => o.id));
  const idx = new Array(QUESTIONS.length).fill(0);
  while (true) { const a:Ans={}; for(let i=0;i<QUESTIONS.length;i++) a[QUESTIONS[i].id]=opts[i][idx[i]];
    yield a; let k=QUESTIONS.length-1; while(k>=0){idx[k]++;if(idx[k]<opts[k].length)break;idx[k]=0;k--;} if(k<0)break; }
}
const asPrimary:Record<string,number>={};
const inTop3:Record<string,number>={};
let total=0;
for (const a of allCombos()) {
  const r = scoreQuiz(a); total++;
  asPrimary[r.primary]=(asPrimary[r.primary]||0)+1;
  for(const t of r.ranked) inTop3[t.id]=(inTop3[t.id]||0)+1;
}
console.log(`total answer paths: ${total.toLocaleString()}\n`);
console.log("strategy          PRIMARY%      in-TOP3%");
let everPrimary=0;
for (const s of ALL_STRATEGY_IDS) {
  const p=asPrimary[s]||0, t=inTop3[s]||0;
  if(p>0) everPrimary++;
  const flag = p===0 ? "  <-- NEVER PRIMARY" : "";
  console.log(`${s.padEnd(16)} ${(p/total*100).toFixed(3).padStart(8)}%   ${(t/total*100).toFixed(2).padStart(7)}%${flag}`);
}
console.log(`\nstrategies that CAN be primary: ${everPrimary}/${ALL_STRATEGY_IDS.length}`);
