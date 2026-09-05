import {BooleanVal, RuntimeVal, NullVal, HK_NATIVE_FN} from "./value.ts";

export function createGlobalEnvironment(){
    const env = new Environment();
    env.declareVar("true", {value: true, type: "boolean"} as BooleanVal);
    env.declareVar("false", {value: false, type: "boolean"} as BooleanVal);
    env.declareVar("null", {value: "null", type: "null"} as NullVal);

    // Define a native built-in function
    env.declareVar("print", HK_NATIVE_FN((args, scope) => {
        console.log(...args);
        return {type: "null", value: "null"} as NullVal;
    }));

    return env;
}
export default class Environment {
    private parent?: Environment;
    private variables: Map<string, RuntimeVal>;

    constructor(parentENV?: Environment){
        const global = parentENV ? true : false;
        this.parent = parentENV;
        this.variables = new Map();
    }

    public declareVar (varName : string, value : RuntimeVal) : RuntimeVal {
        if( this.variables.has(varName)){
            throw `Cannot declare variable ${varName} as it's already defined`
        }
        this.variables.set(varName, value);
        return value;
    }

    public assignVar (varName: string, value: RuntimeVal) : RuntimeVal {
        const env = this.findVarEnvironment(varName);
        if( env == undefined ){
            throw `Variable ${varName} doesn't exist`
        }
        env.variables.set(varName, value);
    }
    public getVar (varName : string) : RuntimeVal {
        const env = this.findVarEnvironment(varName);
        if( env == undefined){
            throw `Variable ${varName} doesn't exist`
        }
        return env.variables.get(varName) as RuntimeVal;
    }
    public findVarEnvironment(varName: string): Environment{
        if(this.variables.has(varName))
            return this;

        if(this.parent == undefined)
            return undefined;
        return this.parent.findVarEnvironment(varName);
    }
} 