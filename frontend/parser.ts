import { Stmt, Program, Expr, BinaryExpr, Identifier, NumericLiteral, NullLiteral, VarDeclaration, AssignmentExpr} from "../frontend/ast.ts";
import { tokenize, Token, TokenType } from "../frontend/lexer.ts";

export default class Parser {
    private tokens : Token[] = [];

    private notEOF() : boolean {
        return this.tokens[0].type != TokenType.EOF;
    }
    private at(){
        return this.tokens[0] as Token;
    }
    private pop(){
        const prev = this.tokens.shift() as Token;
        return prev;
    }
    private expectedPop(expectedToken : TokenType){
        const prev = this.pop();
        console.log(prev);
        if( !prev || prev.type != expectedToken ){
            console.error(`Program expects token type: ${expectedToken}. Found type ${prev.type}`);
            Deno.exit(1);
        }
        return prev;
    }
    private parseStmt() : Stmt {
        //return stmt;
        switch( this.at().type ){
            case TokenType.Let:
                return this.parseVarDeclaration();
            default:
                return this.parseExpr();
        }

        //skip to parse expressions for nows
        return this.parseExpr();
    }
    private parseVarDeclaration() : Stmt{
        this.pop();
        const identifier = this.expectedPop(TokenType.Ident).value;
        // if(this.at().type == TokenType.SemiColon){
        // }
        if(this.at().type == TokenType.Equal){
            this.pop();
            const expr = this.parseExpr();
            console.log("Declared successfully");
            return {kind: "VarDeclaration", constant: false, identifier: identifier, value: expr} as VarDeclaration; 
        }
        else{
            console.error("Variable is not defined");
            Deno.exit(0);
        }
    }
    private parseExpr() : Expr {
        return this.parseAssignmentExpr();
    }

    // Orders of Prescidence
    // Additive
    // Multiplicative
    // Unary
    // Primary (highest)
    
    private parseAssignmentExpr() : Expr {
        const left = this.parseObjectExpr(); //swtich this out with objectExpr
        if(this.at().type == TokenType.Equal){
            this.pop();
            const value = this.parseAssignmentExpr(); // allows chaining (e.g: a = b = c = 4)
            return { value: value, assigne: left, kind: "AssignmentExpr"} as AssignmentExpr;
        }
        return left;
    }
    private parseObjectExpr() : Expr {
        if(this.at().type != TokenType.OpenBrace)
            return this.parseAdditiveExpr();
        this.pop(); // Opening Brace
        const properties = new Array<PropertyLiteral>();
        while(this.notEOF() && this.at().type != TokenType.CloseBrace){
            const key = this.expectedPop(TokenType.Ident).value;

            if(this.at().type == TokenType.Comma){
                this.pop();
                properties.push({kind: "PropertyLiteral", key: key} as PropertyLiteral);
                continue;
            }
            else if(this.at().type == TokenType.CloseBrace){
                properties.push({kind: "PropertyLiteral", key: key} as PropertyLiteral);
                break;
            }
            this.expectedPop(TokenType.Colon);
            const value = this.parseExpr();
            properties.push({kind: "PropertyLiteral", key: key, value: value} as PropertyLiteral);
            if(this.at().type != TokenType.CloseBrace){
                this.expectedPop(TokenType.Comma);
            }
        }
        this.expectedPop(TokenType.CloseBrace); // Closing Brace
        return {kind: "ObjectLiteral", properties: properties} as ObjectLiteral;
    }
    private parseAdditiveExpr() : Expr {
        let left = this.parseMultiplicativeExpr();

        while (this.at().value == "+" || this.at().value == "-"){
            const operator = this.pop().value;
            const right = this.parseMultiplicativeExpr();

            left =  {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }
        return left;
    }
    private parseMultiplicativeExpr() : Expr {
        let left = this.parsePrimaryExpr();

        while (this.at().value == "*" || this.at().value == "/"){
            const operator = this.pop().value;
            const right = this.parsePrimaryExpr();

            left =  {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr;
        }
        return left;
    }

    private parsePrimaryExpr() : Expr{
        
        const token = this.at().type;

        switch (token){
            case TokenType.Ident:
                return { kind: "Identifier", symbol: this.pop().value } as Identifier;
            case TokenType.Number:
                return { kind: "NumericLiteral", value: parseFloat(this.pop().value)} as NumericLiteral;
            case TokenType.OpenParen:
                this.pop(); // Opening Paren
                const value = this.parseExpr();
                this.expectedPop(TokenType.CloseParen); // Closing paren
                return value;
            case TokenType.Null:
                this.pop();
                return {kind: "NullLiteral", value: "null"} as NullLiteral;
            // case TokenType.Let:
            //     return { kind: "NumericLiteral", value: parseFloat(this.pop().value)} as ;
            default:
                console.error("Unexpected token found during parsing: ", this.at());
                Deno.exit(1);
        }
    }
    public produceAST( sourceCode : string) : Program {
        this.tokens = tokenize(sourceCode);
        const program : Program = {
            kind: "Program",
            body: [],
        }

        while ( this.notEOF() ){
            //Append to Program body every statement we find
            program.body.push(this.parseStmt());
        }

        return program;
    }
}