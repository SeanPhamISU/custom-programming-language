import { ValueTypes, RuntimeVal, NumberVal, NullVal, ObjectVal } from "./value.ts";
import { AssignmentExpr, BinaryExpr, Identifier, NodeType, NumericLiteral, ObjectLiteral, Program, Stmt, VarDeclaration } from "../frontend/ast.ts";
import Environment from "./environment.ts";

function evaluateBinaryExpr ( binop : BinaryExpr, env : Environment) : RuntimeVal {
    const left = evaluate(binop.left, env);
    const right = evaluate(binop.right, env);
    if(left.type == "number" && right.type == "number"){
        return evaluateNumericBinaryExpr(left as NumberVal, right as NumberVal, binop.operator, env);
    }
    return {type: "null", value: "null"} as NullVal;
}
function evaluateNumericBinaryExpr(left: NumberVal, right: NumberVal, operator: string, env : Environment) : NumberVal{
    let result = 0;
    if( operator == "+")
        result = left.value + right.value;
    else if( operator == "-")
        result = left.value - right.value;
    else if( operator == "*")
        result = left.value * right.value;
    else if( operator == "/")
        result = left.value / right.value;
    return { value: result, type: "number"} as NumberVal;
}
function evaluateProgram (program : Program, env : Environment) : RuntimeVal {
    let lastEvaluated: RuntimeVal = { type: "null", value: "null"} as NullVal;

    for(const stmt of program.body){
        lastEvaluated = evaluate(stmt, env);
    }

    return lastEvaluated;
}

function evaluateIdentifier( ident : Identifier, env: Environment) : RuntimeVal {
    const val = env.getVar(ident.symbol);
    return val;
}

function evaluateVarDeclaration(declaration :VarDeclaration, env: Environment) : RuntimeVal{
    const value = declaration.value ? evaluate(declaration.value, env) : {value: "null", type: "null"} as NullVal;
    return env.declareVar(declaration.identifier, value);
}

function evaluateAssignmentExpr( assignmentExpr : AssignmentExpr, env: Environment) : RuntimeVal{
    if( assignmentExpr.assigne.kind != "Identifier"){
        console.error( `Invalid assigne`);
    }
    const value = assignmentExpr.value ? evaluate(assignmentExpr.value, env) : {value: "null", type: "null"} as NullVal;
    return env.assignVar( (assignmentExpr.assigne as Identifier).symbol, value);
}

function evaluateObjectLiteral( object: ObjectLiteral, env: Environment) : RuntimeVal
{
    const objMap = new Map<string, RuntimeVal>();
    for(const {key, value} of object.properties){
        const runtimeVal = (value == undefined) ? env.getVar(key) : evaluate(value, env);
        objMap.set(key, runtimeVal);
    }   
    return {type: "object", value: objMap} as ObjectVal;
}

export function evaluate(astNode: Stmt, env : Environment) : RuntimeVal{
    switch (astNode.kind) {
        case "NumericLiteral":
            return { value: (astNode as NumericLiteral).value, type: "number" } as NumberVal;
        case "VarDeclaration":
            return evaluateVarDeclaration(astNode as VarDeclaration, env);
        case "NullLiteral":
            return {value: "null", type: "null"} as NullVal;
        case "ObjectLiteral":
            return evaluateObjectLiteral(astNode as ObjectLiteral, env);
        case "BinaryExpr":
            return evaluateBinaryExpr(astNode as BinaryExpr, env);
        case "Program":
            return evaluateProgram( astNode as Program, env );
        case "Identifier":
            return evaluateIdentifier( astNode as Identifier, env);
        case "AssignmentExpr":
            return evaluateAssignmentExpr( astNode as AssignmentExpr, env);
        default:
            console.error("This AST Node has not yet been setup for interpretation: ", astNode);
            Deno.exit(0); 
    }
}