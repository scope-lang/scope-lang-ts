import { SyntaxError, parse } from './scope-peg';
import * as Scope from './types';

function run(program: Scope.ScopeBody) {
  var global = new Scope.ScopeScope();
  global.set("print",new Scope.ScopeNativePrint());
  return program.eval(global).eval([], global);
}
function test() {
  var program: Scope.ScopeBody = new Scope.ScopeBody();
  //program.expressions.push(new Scope.ScopeCall(new Scope.ScopeNativePrint(), [new Scope.ScopeString("hello"), new Scope.ScopeUndefined(), new Scope.ScopeNumber(10)]));
  run(program);
}
function parseToProg(p) {
  if (p.type == "Program") {
    var program: Scope.ScopeBody = new Scope.ScopeBody();
    program.expressions = p.body.map(x => parseToProg(x));
    return program;
  }
  if (p.type == "BlockStatement") {
    var program: Scope.ScopeBody = new Scope.ScopeBody();
    program.expressions = p.body.map(x => parseToProg(x));
    return program;
  }
  if (p.type == "ExpressionStatement") {


    return parseToProg(p.expression);
  }
  if (p.type == "CallExpression") {


    return new Scope.ScopeCall(parseToProg(p.callee),p.arguments.map(x=>parseToProg(x)));
  }
  if (p.type == "Identifier") {


    return new Scope.ScopeIdentifier(p.name);
  }
  if (p.type == "Literal") {


    return new Scope.ScopeLiteral(p.value);
  }
  if (p.type == "ForStatement") {

    return new Scope.ScopeForStatement(parseToProg(p.init),parseToProg(p.test),parseToProg(p.update),parseToProg(p.body));
  }
  if (p.type == "VariableDeclaration") {

    return new Scope.ScopeVariableDeclaration(p.declarations.map(x=>parseToProg(x)));
  }
  if (p.type == "VariableDeclarator") {

    return new Scope.ScopeVariableDeclarator(parseToProg(p.id),parseToProg(p.init));
  }
  if (p.type == "BinaryExpression") {

    return new Scope.ScopeBinaryExpression(parseToProg(p.left),parseToProg(p.right),p.operator);
  }
  if (p.type == "AssignmentExpression") {

    return new Scope.ScopeVariableDeclarator(parseToProg(p.left),parseToProg(p.right));
  }
  return new Scope.ScopeUndefined();
}
try {
  const sampleOutput = parse('for(var i=0;i<10;i=i+1){var row="";for(var j=0;j<i+1;j=j+1){row=row+"*";};print("hello "+i,row);};', {});
  console.log("parsed", JSON.stringify(sampleOutput))
  var pp = parseToProg(sampleOutput);
  console.log("parsed p", JSON.stringify(pp))
  if (pp instanceof Scope.ScopeBody) {
    console.log("RUN");
    console.log(run(pp));
  }
}
catch (ex) {
  console.log("error parsing", ex)
  // Handle parsing error
  // [...]
}
//test();
