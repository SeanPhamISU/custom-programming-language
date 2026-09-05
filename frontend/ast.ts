export type NodeType =
// STATEMENTS
"Program" 
| "VarDeclaration"

// EXPRESSIONS
| "AssignmentExpr"
| "Identifier" 
| "BinaryExpr" 
| "CallExpr" 
| "UnaryExpr" 
| "FunctionDeclaration"
| "CallExpr"
| "MemberExpr"

// LITERALS
| "NumericLiteral" 
| "NullLiteral"
| "ObjectLiteral"
| "PropertyLiteral";


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

export interface VarDeclaration extends Stmt{
    kind: "VarDeclaration",
    constant: boolean,
    identifier: string,
    value?: Expr;
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

export interface AssignmentExpr extends Expr {
    kind: "AssignmentExpr";
    assigne: Expr,
    value: Expr,
}

export interface CallExpr extends Expr {
    kind: "CallExpr";
    caller: Expr;
    arguments: Expr[];
}

export interface ObjectLiteral extends Expr {
    kind: "ObjectLiteral";
    properties: PropertyLiteral[];
}

export interface PropertyLiteral extends Expr {
    kind: "PropertyLiteral";
    key: string;
    value?: Expr;
}

export interface MemberExpr extends Expr {
    kind: "MemberExpr";
    object: Expr;
    property: Expr;
    computed: boolean;
}
