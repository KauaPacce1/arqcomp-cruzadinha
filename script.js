const entries = [
  {
    "word": "MICROCONTROLADOR",
    "clue": "Chip que reúne processador, armazenamento e periféricos para comandar dispositivos embarcados.",
    "x": 0,
    "y": 4,
    "d": 0
  },
  {
    "word": "MEMORIADEMASSA",
    "clue": "Guarda grandes volumes de arquivos mesmo com o computador desligado.",
    "x": 4,
    "y": 1,
    "d": 1
  },
  {
    "word": "REGISTRADORES",
    "clue": "Pequenos espaços internos ao processador guardam operandos e resultados imediatos.",
    "x": 1,
    "y": 6,
    "d": 0
  },
  {
    "word": "ADDRESSBUS",
    "clue": "Conjunto de linhas que indica qual posição será acessada numa leitura ou escrita.",
    "x": 8,
    "y": 6,
    "d": 1
  },
  {
    "word": "DUALCORE",
    "clue": "Processador com dois núcleos físicos de execução.",
    "x": 8,
    "y": 8,
    "d": 0
  },
  {
    "word": "CPU",
    "clue": "Componente principal que busca, interpreta e executa as instruções dos programas.",
    "x": 12,
    "y": 8,
    "d": 1
  },
  {
    "word": "CACHE",
    "clue": "Mantém cópias próximas ao processador para acelerar acessos repetidos.",
    "x": 0,
    "y": 2,
    "d": 0
  },
  {
    "word": "EEPROM",
    "clue": "Tecnologia não volátil que permite apagar e regravar eletricamente bytes individuais.",
    "x": 14,
    "y": 0,
    "d": 1
  },
  {
    "word": "QUADCORE",
    "clue": "Processador com quatro núcleos físicos de execução.",
    "x": 7,
    "y": 0,
    "d": 0
  },
  {
    "word": "DATABUS",
    "clue": "Conjunto de linhas que transporta o conteúdo lido ou escrito entre componentes.",
    "x": 3,
    "y": 14,
    "d": 0
  },
  {
    "word": "FLASH",
    "clue": "Tecnologia não volátil usada em pendrives, com apagamento por blocos.",
    "x": 6,
    "y": 12,
    "d": 1
  },
  {
    "word": "ULA",
    "clue": "Circuito que realiza somas, comparações e operações lógicas no processador.",
    "x": 8,
    "y": 0,
    "d": 1
  },
  {
    "word": "ROM",
    "clue": "Na versão clássica, guarda instruções gravadas na fabricação para consulta permanente.",
    "x": 14,
    "y": 8,
    "d": 1
  },
  {
    "word": "RAM",
    "clue": "Área volátil que abriga programas e informações enquanto estão em uso.",
    "x": 1,
    "y": 6,
    "d": 1
  },
  {
    "word": "UC",
    "clue": "Decodifica instruções e emite sinais que coordenam as etapas de execução.",
    "x": 0,
    "y": 1,
    "d": 1
  },
  {
    "word": "DMA",
    "clue": "Permite transferências entre periféricos e memória sem o processador copiar cada item.",
    "x": 10,
    "y": 0,
    "d": 1
  }
];

const byId = id => document.getElementById(id);
const board = byId("board");
const cells = new Map();
const starts = new Map();
entries.sort((a,b) => a.y-b.y || a.x-b.x || a.d-b.d);
let current = entries[0];
let checked = false;
let columns = 0;
for (const entry of entries) {
  const origin = [entry.x,entry.y].join();
  if (!starts.has(origin)) starts.set(origin, starts.size+1);
  entry.number = starts.get(origin);
  entry.direction = entry.d ? "Vertical" : "Horizontal";
  entry.cells = [];
  for (let i=0; i<entry.word.length; i++) {
    const x = entry.x + (entry.d ? 0 : i);
    const y = entry.y + (entry.d ? i : 0);
    const key = [x,y].join();
    if (!cells.has(key)) cells.set(key,{x,y,entries:[]});
    const cell = cells.get(key);
    cell.entries.push(entry);
    entry.cells.push(cell);
    columns = Math.max(columns,x+1);
  }
}
board.style.setProperty("--cols",columns);
board.style.gridTemplateColumns = "repeat("+columns+", 1fr)";
function select(entry) {
  current = entry;
  for (const cell of cells.values()) cell.box.classList.toggle("sel",cell.entries.includes(entry));
  for (const item of entries) item.button.classList.toggle("chosen",item===entry);
  byId("active").textContent = entry.number+" · "+entry.direction+" — "+entry.clue;
}
for (const cell of cells.values()) {
  const box = document.createElement("div");
  box.className = "cell";
  box.style.gridArea = (cell.y+1)+" / "+(cell.x+1);
  const input = document.createElement("input");
  input.autocomplete = "off";
  input.spellcheck = false;
  input.setAttribute("autocapitalize","characters");
  input.setAttribute("aria-label","Linha "+(cell.y+1)+", coluna "+(cell.x+1)+". "+cell.entries.map(e=>e.number+" "+e.direction).join(", "));
  box.append(input);
  const number = starts.get([cell.x,cell.y].join());
  if (number) {
    const label = document.createElement("small");
    label.textContent = number;
    box.append(label);
  }
  cell.input = input;
  cell.box = box;
  board.append(box);
  input.onfocus = () => {
    if (!cell.entries.includes(current)) select(cell.entries[0]);
    input.select();
  };
  input.onclick = () => input.select();
  input.oninput = () => {
    input.value = input.value.toUpperCase().normalize("NFD").replace(/[^A-Z]/g,"").slice(-1);
    const next = current.cells[current.cells.indexOf(cell)+1];
    if (input.value && next) next.input.focus();
    if (checked) evaluate();
  };
  input.onkeydown = event => {
    const arrows = {ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]};
    if (arrows[event.key]) {
      event.preventDefault();
      const [dx,dy] = arrows[event.key];
      const target = cells.get([cell.x+dx,cell.y+dy].join());
      const entry = cell.entries.find(e=>e.d===Math.abs(dy));
      if (entry && target && entry.cells.includes(target)) {select(entry);target.input.focus();}
    } else if (event.key==="Backspace" && !input.value) {
      event.preventDefault();
      const prev = current.cells[current.cells.indexOf(cell)-1];
      if (prev) {prev.input.value="";prev.input.focus();if(checked) evaluate();}
    }
  };
}
for (const direction of [0,1]) {
  const heading = document.createElement("h3");
  heading.textContent = direction ? "Verticais" : "Horizontais";
  byId("clues").append(heading);
  for (const entry of entries.filter(e=>e.d===direction)) {
    const button = document.createElement("button");
    button.className = "hint";
    const number = document.createElement("b");
    number.textContent = String(entry.number).padStart(2,"0");
    const line = document.createElement("span");
    line.textContent = entry.clue+" ";
    entry.status = document.createElement("em");
    line.append(entry.status);
    button.append(number,line);
    button.onclick = () => {select(entry);entry.cells[0].input.focus();entry.cells[0].input.select();};
    entry.button = button;
    byId("clues").append(button);
  }
}
function evaluate() {
  checked = true;
  let correct = 0;
  let incomplete = 0;
  for (const entry of entries) {
    const value = entry.cells.map(c=>c.input.value).join("");
    if (value===entry.word) {correct++;entry.status.textContent="✓ Correta";}
    else if (value.length<entry.word.length) {incomplete++;entry.status.textContent="• Incompleta";}
    else entry.status.textContent="✗ Incorreta";
  }
  byId("progress").value = correct;
  byId("score").textContent = correct+" de 16 palavras";
  byId("result").textContent = correct===16 ? "Missão cumprida! Você passou no Exame Chunin." : correct+" corretas · "+(16-incomplete-correct)+" incorretas · "+incomplete+" incompletas";
}
byId("check").onclick = evaluate;
byId("reset").onclick = () => {
  checked = false;
  for (const cell of cells.values()) cell.input.value="";
  for (const entry of entries) entry.status.textContent="";
  byId("progress").value=0;
  byId("score").textContent="0 de 16 palavras";
  byId("result").textContent="Tabuleiro reiniciado.";
  select(entries[0]);
  current.cells[0].input.focus();
};
select(current);
