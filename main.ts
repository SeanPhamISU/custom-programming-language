import Parser from "./frontend/parser.ts";
import Environment from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";

repl();

async function repl () {
    const parser = new Parser();
    const env = new Environment();
    env.declareVar("x", {value: 100, type: "number"} as NumberVal);
    console.log("Test Test");
    while (true) {
        const input = prompt("> ");
        if( !input || input.includes("exit")){
            Deno.exit(1);
        }
        const program = parser.produceAST(input);
        console.log(program);

        const result = evaluate(program, env);
        console.log(result);
    }
}