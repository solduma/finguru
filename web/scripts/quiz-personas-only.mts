import { scoreQuiz } from "../lib/quiz.ts";
// reuse persona answers inline (subset is enough to confirm scoring intact)
const personas: [string,Record<string,string>,string[]][] = [
  ["Retiree income", {q1:"d",q2:"a",q3:"a",q4:"b",q5:"a",q6:"a",q7:"b",q8:"a",q9:"a",q10:"a",q11:"d",q12:"c"}, ["index-passive","dividend-income"]],
  ["Qualified day trader", {q1:"a",q2:"d",q3:"d",q4:"c",q5:"d",q6:"c",q7:"d",q8:"d",q9:"d",q10:"c",q11:"d",q12:"d"}, ["day-trading","swing-trading","trend-momentum"]],
  ["Value", {q1:"c",q2:"b",q3:"c",q4:"b",q5:"b",q6:"a",q7:"c",q8:"c",q9:"b",q10:"b",q11:"c",q12:"c"}, ["value","growth"]],
  ["Macro", {q1:"c",q2:"c",q3:"c",q4:"d",q5:"d",q6:"b",q7:"c",q8:"c",q9:"c",q10:"c",q11:"d",q12:"d"}, ["global-macro","event-driven","trend-momentum"]],
  ["Quant", {q1:"c",q2:"b",q3:"c",q4:"a",q5:"b",q6:"b",q7:"c",q8:"b",q9:"c",q10:"b",q11:"d",q12:"c"}, ["factor-quant","value","growth"]],
  ["Fragile aggressive (must floor)", {q1:"a",q2:"d",q3:"d",q4:"c",q5:"d",q6:"c",q7:"d",q8:"d",q9:"d",q10:"c",q11:"a",q12:"a"}, ["index-passive","dividend-income"]],
];
let pass=0;
for (const [n,a,exp] of personas){const r=scoreQuiz(a);const ok=exp.includes(r.primary);if(ok)pass++;else console.log(`FAIL ${n}: got ${r.primary}, expected ${exp.join("/")}`);}
console.log(`personas: ${pass}/${personas.length}`);
