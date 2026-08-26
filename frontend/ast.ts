export type NodeType = "Program" 
| "NumericLiteral" 
| "NullLiteral"
| "Identifier" 
| "BinaryExpr" 
| "CallExpr" 
| "UnaryExpr" 
| "FunctionDeclaration";

// Statements don't return a value (e.g: x = 45)
// Expressions return a value (e.g: 45 + 10)
// Statement

export interface Stmt {
    kind: NodeType;
}

export interface Program extends Stmt{
    kind: "Program";
    body: Stmt[];
}

export interface Expr extends Stmt{
    
}

export interface BinaryExpr extends Expr{
    kind: "BinaryExpr"
    left: Expr,
    right: Expr,
    operator: string,
}

export interface Identifier extends Expr {
    kind: "Identifier";
    symbol: string;
}

export interface NumericLiteral extends Expr {
    kind: "NumericLiteral";
    value: number;
}

export interface NullLiteral extends Expr {
    kind: "NullLiteral";
    value: "null";
}