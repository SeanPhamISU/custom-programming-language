import { Stmt, Program, Expr, BinaryExpr, Identifier, NumericLiteral, NullLiteral} from "../frontend/ast.ts";
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
        if( !prev || prev.type != expectedToken ){
            console.error("Program expects token type: ", expectedToken);
            Deno.exit(1);
        }
        return prev;
    }
    private parseStmt() : Stmt {
        //return stmt;

        //skip to parse expressions for nows
        return this.parseExpr();
    }
    private parseExpr() : Expr {
        return this.parseAdditiveExpr();
    }

    // Orders of Prescidence
    // Additive
    // Multiplicative
    // Unary
    // Primary (highest)
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