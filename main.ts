import Parser from "./frontend/parser.ts";
import Environment from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { NumberVal, NullVal, BooleanVal } from "./runtime/value.ts";

repl();

async function repl () {
    const parser = new Parser();
    const env = new Environment();
    env.declareVar("true", {value: true, type: "boolean"} as BooleanVal);
    env.declareVar("false", {value: false, type: "boolean" as BooleanVal});
    env.declareVar("null", {value: "null", type: "null"} as NullVal);
    console.log("Test Test");
    while (true) {
        const input = prompt("> ");
        if( !input || input.includes("exit")){
            Deno.exit(1);
        }
        const program = parser.produceAST(input, env);
        console.log(program);

        const result = evaluate(program, env);
        console.log(result);
    }
}