import { createInterface } from "node:readline";
import { styleText } from "node:util";
import { generateSqlObject } from "./ai.js";
import { createDb } from "./db.js";
import { DB_NAME } from "./constants.js";

// Parei faltando -11:05 para acabar

const db = createDb(DB_NAME);

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

function prompt(text) {
  return new Promise((resolve) => r.question(text, resolve));
}

rl.on("close", () => {
  db.close();
  console.log(styleText("gray", "Encerrando o agent, ate a proxima!"));
  process.exit(0);
});

console.log(
  styleText(
    ["bold", "cyan"],
    "Bem-vindo ao SQL Terminal Agent! Precione o CTRL + C para sair",
  ),
);
while (true) {
  const question = await prompt(styleText(["bold", "magenta", "Pergunta: "]));

  if (!question.trim()) {
    continue;
  }

  try {
    const sqlObject = await generateSqlObject(question);
    const { sql, explanation } = sqlObject;

    console.log(styleText("cyan", "\nSQL Sugerido: "));
    console.log(styleText("red", sql));
    console.log(styleText("cyan", "\nExplicacao: "));
    console.log(styleText("yellow", explanation));

    const confirm = await prompt(
      styleText(["bold", "green"], "\nDeseja executar? "),
    );
    if (confirm.toLowerCase() === "s") {
      const result = await db.query(sql);
      console.log(styleText("green", "\nResultado:"));
      console.table(result);
    } else {
      console.log(styleText("yellow", "SQL nao executado."));
    }
  } catch (error) {
    console.error(
      styleText("red", "Erro ao processar a solicitacao"),
      error.message,
    );
  }
}
