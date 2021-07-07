DSO.defineMode('deadfish-tilde',(code,input,args,output,debug) => {
    var join = '', acc = 0,execute = true;
    function findMatch(string,index,[open,close]){
        var depth = 1;
        while(depth > 0 && index < string.length){
            index++;
            var char = string[index]
            if(char == open) depth++;
            if(char == close) depth--;
        }
        return index + 1 > string.length ? -1 : index;
    }
    if(args.includes('n')) join = '\n';
    if(args.includes('s')) join = ' ';
    for(var index = 0; index < code.length; index++){
        if(char == ')') execute = true
        if(!execute) continue;
        var char = code[index];
        if(char == 'i') acc++;
        if(char == 'd') acc--;
        if(char == 's') acc *= acc;
        if(char == 'o') output(acc + join)
        if(char == 'c') output(String.fromCharCode(acc))
        if(char == 'w') output('Hello, world!') 
        if(char == 'h') break;
        if(char == '{'){
            var new_index = findMatch(code,index,'{}');
            code = code.slice(0,index)+code.slice(index--+1,new_index).repeat(10) + code.slice(new_index)
        }
        if(char = '(' && acc == 0) execute = false;
        if(acc == 256 || acc < 0) acc = 0;
    }
})