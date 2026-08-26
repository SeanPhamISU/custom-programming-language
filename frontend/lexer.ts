//Define a token interface - What a token is
export enum TokenType{
    Null,
    Let,
    Ident,
    Equal,
    SemiColon,
    Number,

    OpenParen, CloseParen,
    BinaryOperator,
    EOF, //The end of file token
}

const KEYWORDS: Record<string, TokenType> = {
    "let": TokenType.Let,
    "null": TokenType.Null,
}


export interface Token{
    value: string,
    type: TokenType,
}

function token (value = "", type: TokenType) : Token{
    return {value, type};
}

function isalpha (src: string) {
    return src.toUpperCase() != src.toLowerCase();
}

function isnum( src: string){
    const c = src.charCodeAt(0);
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)]
    return ( c >= bounds[0] && c <= bounds[1]);
}

function isskippable( src: string){
    return src == ' ' || src == "\n" || src == " \t";
}

export function tokenize( sourceCode: string) : Token[]{
    const tokens = new Array<Token>();

    //Not the best way, but it works. Can be replaced with 2 pointer
    const src = sourceCode.split("");
    while(src.length > 0){
        if( src[0] == "(" ){
            tokens.push(token(src.shift(), TokenType.OpenParen));
        }
        else if (src[0] == ")"){
            tokens.push(token(src.shift(), TokenType.CloseParen));            
        }
        else if (src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/"){
            tokens.push(token(src.shift(), TokenType.BinaryOperator));
        }
        else if (src[0] == "="){
            tokens.push(token(src.shift(), TokenType.Equal));
        }
        else if (src[0] == ";"){
            tokens.push(token(src.shift(), TokenType.SemiColon));
        }
        else {
            //Multicharacter tokesn (variables, <=, etc)
            if( isnum(src[0]) ){
                //Build a number token
                let num = "";
                while ( src.length > 0 && isnum(src[0])){
                    num += src.shift();
                }
                tokens.push(token(num, TokenType.Number))
            }
            else if (isalpha(src[0])){
                let str = "";
                while ( src.length > 0 && isalpha(src[0])){
                    str += src.shift();
                }
                let reservedType = TokenType.Ident;
                if( KEYWORDS[str] != undefined){
                    reservedType = KEYWORDS[str];
                }
                tokens.push(token(str, reservedType))
            }
            else if (isskippable(src[0])){
                src.shift(); //Skip character
            }
            else{
                console.log("Unrecognized character. found in source: ", src[0]);
                Deno.exit(1);
            }
        }
        //Build token until source code is empty (end of file)
    }

    tokens.push({type: TokenType.EOF, value: "EOF"});
    return tokens;
}

// const source = await Deno.readTextFile("./test.txt");
// for(const token of tokenize(source)){
//     console.log(token);
// }