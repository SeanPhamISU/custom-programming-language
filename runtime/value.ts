export type ValueTypes = "null" | "number" | "boolean" | "object" | "function";

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