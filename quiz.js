// Cada questão reúne o enunciado, as alternativas, o índice correto e a explicação.
const questions = [
  ["O terminal da vila precisa comparar dois códigos numéricos. Qual circuito do processador faz essa comparação?", ["UC","ULA","Cache","DMA"], 1, "A ULA realiza operações aritméticas e lógicas, incluindo comparações."],
  ["Uma missão foi digitada, mas ainda não foi salva. Qual componente perde seu conteúdo quando a energia é cortada?", ["Flash","ROM","SSD","RAM"], 3, "A RAM é volátil. O arquivo precisa ser gravado em armazenamento persistente para sobreviver ao desligamento."],
  ["O processador consulta repetidamente a mesma posição da RAM. O que pode reduzir o tempo desses acessos?", ["Cache","Barramento de endereço","ROM","DMA"], 0, "A cache mantém cópias de dados e instruções perto dos núcleos. Um acerto evita buscar a informação na RAM."],
  ["Ao ler uma posição da memória, quais linhas indicam o local que deve responder?", ["Data bus","Linhas de alimentação","Address bus","Linhas de relógio"], 2, "O address bus indica o endereço. O data bus transporta o conteúdo lido ou escrito."],
  ["Um sensor precisa transferir um bloco para a RAM sem ocupar a CPU com cada cópia. Qual recurso ajuda?", ["ROM","DMA","Cache","ULA"], 1, "Com DMA, o processador configura a transferência e o controlador movimenta o bloco."],
  ["Após decodificar uma instrução, qual parte da CPU coordena os sinais para executá-la?", ["ULA","Flash","Cache","UC"], 3, "A unidade de controle interpreta a instrução e coordena o movimento dos dados e as operações necessárias."],
  ["Um mecanismo portátil da vila precisa de processador, memória e entradas para sensores no mesmo chip. O que escolher?", ["Registrador","Barramento de dados","Microcontrolador","Memória de massa"], 2, "O microcontrolador integra processamento, memória e periféricos para controlar dispositivos."],
  ["Um dispositivo precisa regravar um único byte de configuração sem apagar um bloco inteiro. Qual tecnologia clássica atende?", ["EEPROM","Flash NAND","ROM de máscara","Cache L1"], 0, "A EEPROM permite regravação elétrica por byte. A Flash apaga conjuntos de células em blocos."],
  ["O processador precisa guardar dois operandos para a próxima soma. Quais espaços internos são adequados?", ["Setores do SSD","Registradores","Blocos de Flash","Portas de entrada"], 1, "Registradores mantêm operandos e resultados imediatamente disponíveis dentro do processador."],
  ["Duas estações têm processadores dual core e quad core. O que esses nomes permitem concluir?", ["A segunda tem o dobro da frequência","A primeira só executa dois programas","A segunda sempre termina em metade do tempo","Elas têm dois e quatro núcleos físicos"], 3, "Os termos indicam a quantidade de núcleos. O ganho depende do trabalho que o programa consegue dividir."]
];
let round = 0;
let points = 0;
let answered = false;
const next = byId("next");
function showQuestion() {
  answered = false;
  const total = questions.length;
  const finished = round === total;
  byId("step").textContent = finished ? "Exame concluído" : "Questão "+(round+1)+" de "+total;
  byId("quiz-score").textContent = points+" de "+total+" acertos";
  byId("quiz-progress").max = total;
  byId("quiz-progress").value = round;
  byId("answers").replaceChildren();
  byId("feedback").textContent = "";
  next.hidden = !finished;
  if (finished) {
    byId("question").textContent = points===total ? "Missão perfeita!" : "Resultado do exame";
    byId("feedback").textContent = "Você acertou "+points+" de "+total+" questões de Arquitetura Computacional.";
    next.textContent = "Refazer quiz";
    return;
  }
  const [prompt,options,correct,explanation] = questions[round];
  byId("question").textContent = prompt;
  options.forEach((option,index) => {
    const button = document.createElement("button");
    button.className = "answer";
    const letter = document.createElement("b");
    letter.textContent = String.fromCharCode(65+index);
    button.append(letter,option);
    button.onclick = () => {
      if (answered) return;
      answered = true;
      if (index===correct) points++;
      const buttons = [...byId("answers").children];
      buttons.forEach(item => item.disabled=true);
      buttons[correct].classList.add("good");
      if (index!==correct) button.classList.add("bad");
      byId("quiz-score").textContent = points+" de "+total+" acertos";
      byId("quiz-progress").value = round+1;
      byId("feedback").textContent = (index===correct ? "Acertou! " : "Resposta correta: "+options[correct]+". ")+explanation;
      next.textContent = round===total-1 ? "Ver resultado" : "Próxima questão";
      next.hidden = false;
      next.focus();
    };
    byId("answers").append(button);
  });
}
next.onclick = () => {
  if (round===questions.length) {round=0;points=0;}
  else if (answered) round++;
  showQuestion();
  byId("question").focus();
};
showQuestion();

function openMission(moveFocus = false) {
  const hash = window.location.hash;
  const route = ["#cruzadinha", "#quiz-kakashi"].includes(hash) ? hash : "#menu";
  byId("missions").hidden = route !== "#menu";
  byId("crossword").hidden = route !== "#cruzadinha";
  byId("quiz").hidden = route !== "#quiz-kakashi";
  for (const link of document.querySelectorAll(".topbar nav a")) {
    if (link.hash === route) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
  if (moveFocus) {
    const heading = route === "#menu" ? "menu-title" : route === "#cruzadinha" ? "board-title" : "question";
    byId(heading).focus({preventScroll:true});
    window.scrollTo(0,0);
  }
}
window.addEventListener("hashchange", () => openMission(true));
openMission();
