import {RuntimeVal} from "./value.ts";

export default class Environment {
    private parent?: Environment;
    private variables: Map<string, RuntimeVal>;

    constructor(parentEnv?: Environment){
        this.parent = parentEnv;
        this.variables = new Map();
    }

    public declareVar (varName : string, value : RuntimeVal) : RuntimeVal {
        if( this.variables.has(varName)){
            throw `Cannot declare variable ${varname} as it's already defined`
        }
        this.variables.set(varName, value);
        return value;
    }

    public assignVar (varName: string, value: RuntimeVal) : RuntimeVal {
        const env = this.findVarEnvironment(varName);
        if( env == undefined ){
            throw `Variable ${varname} doesn't exist`
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