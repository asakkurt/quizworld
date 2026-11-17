const $ = (id) => document.getElementById(id);
const home = $("home"), quiz = $("quiz"), result = $("result");
let category = "", questions = [], index = 0, score = 0, correctCount = 0, timerId = null, seconds = 15, locked = false;
const bestKey = "quizworld-best-score-v1";
$("best-score").textContent = localStorage.getItem(bestKey) || "0";

function show(section){[home,quiz,result].forEach(el=>el.classList.add("hidden"));section.classList.remove("hidden");}
function renderCategories(){
  const wrap=$("categories");
  Object.entries(QUIZ_DATA).forEach(([name,data])=>{
    const btn=document.createElement("button");btn.className="category";
    btn.innerHTML=`<span>${data.icon}</span>${name}`;
    btn.addEventListener("click",()=>startQuiz(name));wrap.appendChild(btn);
  });
}
function startQuiz(name){
  category=name;questions=QUIZ_DATA[name].questions;index=0;score=0;correctCount=0;
  $("category-label").textContent=name;show(quiz);renderQuestion();
}
function renderQuestion(){
  locked=false;seconds=15;$("timer").textContent=seconds;$("feedback").textContent="";
  $("next-btn").classList.add("hidden");
  $("progress").textContent=`${index+1} / ${questions.length}`;
  $("progress-bar").style.width=`${(index/questions.length)*100}%`;
  const [q,answers]=questions[index];$("question").textContent=q;
  const wrap=$("answers");wrap.innerHTML="";
  answers.forEach((answer,i)=>{
    const btn=document.createElement("button");btn.className="answer";btn.textContent=`${String.fromCharCode(65+i)}. ${answer}`;
    btn.addEventListener("click",()=>chooseAnswer(i));wrap.appendChild(btn);
  });
  clearInterval(timerId);timerId=setInterval(()=>{seconds--; $("timer").textContent=seconds;if(seconds<=0){clearInterval(timerId);chooseAnswer(-1);}},1000);
}
function chooseAnswer(choice){
  if(locked)return;locked=true;clearInterval(timerId);
  const correct=questions[index][2],buttons=[...$("answers").children];
  buttons.forEach((b,i)=>{b.disabled=true;if(i===correct)b.classList.add("correct");else if(i===choice)b.classList.add("wrong");});
  if(choice===correct){score+=10;correctCount++;$("feedback").textContent="🎉 Doğru cevap! +10 puan";$("feedback").style.color="#159b65";}
  else{$("feedback").textContent=choice===-1?"⏰ Süre doldu!":"🙂 Bu kez olmadı. Doğru cevabı öğrenmiş oldun!";$("feedback").style.color="#e05b7c";}
  $("progress-bar").style.width=`${((index+1)/questions.length)*100}%`;
  $("next-btn").textContent=index===questions.length-1?"Sonucu gör →":"Sonraki soru →";
  $("next-btn").classList.remove("hidden");
}
$("next-btn").addEventListener("click",()=>{if(index<questions.length-1){index++;renderQuestion();}else finishQuiz();});
function finishQuiz(){
  clearInterval(timerId);const best=Number(localStorage.getItem(bestKey)||0);
  if(score>best){localStorage.setItem(bestKey,String(score));$("best-score").textContent=score;}
  $("final-score").textContent=score;
  $("result-detail").textContent=`${questions.length} soruda ${correctCount} doğru cevap verdin. ${category} kategorisindeki performansın için tebrikler!`;
  show(result);
}
$("again-btn").addEventListener("click",()=>startQuiz(category));
$("home-btn").addEventListener("click",()=>show(home));
renderCategories();
