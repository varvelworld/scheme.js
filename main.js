function atom(token){ // 原子
    if(!isNaN(token))
        return Number(token);
    else
        return String(token);
}

function tokenize(s) {
    return s.replace(/[(]/g, " ( ").replace(/[)]/g, " ) ").split(/[\s]+/g).slice(1,-1);
}

function parse(s) {
    return parse_from(tokenize(s));
}

function parse_from(tokens) {
    if(tokens.length === 0)
        console.log("syntax error");
    var token = tokens.shift();
    if("(" == token) {
        var list = [];
        while(tokens[0] != ')')
            list.push(parse_from(tokens));
        tokens.shift();
        return list;
    }
    else if(")" == token) {
        console.log("syntax error");
    }
    else {
        return atom(token);
    }
}

function Env(outer){
    this.outer = outer;;
}

function createGlobalEnv() {
    var globalEnv = new Env(null);
    globalEnv['+'] = function (args){
        var r = args[0];
        for(var i = 1; i < args.length; ++i)
            r += args[i];
        return r;
    }
    globalEnv['-'] = function (args){
        var r = args[0];
        for(var i = 1; i < args.length; ++i)
            r -= args[i];
        return r;
    }
    globalEnv['*'] = function (args){
        var r = args[0];
        for(var i = 1; i < args.length; ++i)
            r *= args[i];
        return r;
    }
    globalEnv['/'] = function (args){
        var r = args[0];
        for(var i = 1; i < args.length; ++i)
            r /= args[i];
        return r;
    }
    return globalEnv;
}

Env.prototype.find = function(x){
    if(x in this) return this;
    else
        return this.outer.find(x);
}

function eval(x, env) {
    switch (typeof(x)) {
        case 'string':
            return env.find(x)[x];
        case 'number':
            return x;
        case 'object':
            switch (x[0]) {
                case 'quote':
                    return x[1];
                case 'if':
                    if(eval(x[1]))
                        return eval(x[2], env);
                    else
                        return eval(x[3], env)
                case 'define':
                    env[x[1]] = eval(x[2], env);
                    return;
                case 'set!':
                    env.find(x[1])[x[1]] = eval(x[2], env);
                    break;
                case 'begin':
                    for(var i = 1; i < x.length - 1; ++i)
                        eval(x[i], env);
                    return eval(x[x.length - 1], env);
                default :
                    var args = [];
                    for(var i = 1; i < x.length; ++i)
                        args.push(eval(x[i], env));
                    return env.find(x[0])[x[0]](args);
            }
            break;
        default:
            console.log("error");
    }
}

var code = "(begin (define x 1) (* (+ x (- x (/ 1 2))) 2))";
console.log(code);
console.log(eval(parse(code), createGlobalEnv()));