import Environment from "./environment.ts";

export type ValueTypes = "null" | "number" | "boolean" | "object" | "native-function" | "function";

export interface RuntimeVal {
    type: ValueTypes;
}

export interface BooleanVal extends RuntimeVal {
    type: "boolean",
    value: boolean,
}
export interface NullVal extends RuntimeVal {
    type: "null";
    value: "null";
}

export interface NumberVal extends RuntimeVal {
    type: "number";
    value: number;
}

export interface ObjectVal extends RuntimeVal {
    type: "object";
    value: Map<string, RuntimeVal>;
}

export interface NativeFunctionVal extends RuntimeVal {
    type: "native-function";
    call: FunctionCall;
}

export type FunctionCall = (arguments: RuntimeVal[], env: Environment) => RuntimeVal;

export function HK_NATIVE_FN(call: FunctionCall) {
    return {
        type: "native-function",
        call
    } as NativeFunctionVal;
}