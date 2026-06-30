import { QUESTIONS, scoreQuiz, ALL_STRATEGY_IDS } from "../lib/quiz.ts";
type Ans = Record<string,string>;
function* allCombos(): Generator<Ans> {
  const opts = QUESTIONS.map((q) => q.options.map((o) => o.id));
  const idx = new Array(QUESTIONS.length).fill(0);
  while (true) {
    const a: Ans = {}; for (let i=0;i<QUESTIONS.length;i++) a[QUESTIONS[i].id]=opts[i][idx[i]];
    yield a; let k=QUESTIONS.length-1;
    while(k>=0){idx[k]++;if(idx[k]<opts[k].length)break;idx[k]=0;k--;} if(k<0)break;
  }
}
const ACTIVE=["value","growth","factor-quant","global-macro","trend-momentum","event-driven","options-income","active-trading"];
let fragile=0, fragileActive=0, fragileFoundFlag=0;
for (const a of allCombos()) {
  const isFragile = a.q11==="a"||a.q11==="b"||a.q12==="a";
  if(!isFragile) continue;
  fragile++;
  const r=scoreQuiz(a);
  if(ACTIVE.includes(r.primary)) fragileActive++;
  if(r.buildFoundationFirst) fragileFoundFlag++;
}
console.log(`fragile paths: ${fragile.toLocaleString()}`);
console.log(`  recommended ACTIVE (should be 0): ${fragileActive}`);
console.log(`  showed foundation note (should be all): ${fragileFoundFlag} (${((fragileFoundFlag/fragile)*100).toFixed(1)}%)`);
