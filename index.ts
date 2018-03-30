import { SyntaxError, parse } from './scope-peg';
import { ScopeValue, V_Undefined } from "./src/types/value";
import { ScopeExpression, E_Undefined } from "./src/types/expression";
import { VariableType, V_VariablePointer, E_VariablePointer } from "./src/types/variables";
import { V_ValueHolder, V_Scope } from "./src/types/scopes";
import { V_PointerMap, ScopeCallee, E_Call } from "./src/types/callee";
import {V_Block, E_Block} from "./src/types/block";
import {C_Print} from "./src/types/print";
import {E_String, V_String,E_Number,V_Number} from "./src/types/literals";
import {parseToProg} from "./expressionBuilder";
import * as fs from "fs";
import * as path from "path";

function run(program: E_Block) {
  var global = new V_Scope();
  global.set(VariableType.CONST,"print", new C_Print());
  return program.eval(global).eval([], global);
}
function test() {
  var program: E_Block = new E_Block();
  program.expressions.push(new E_Call(new E_VariablePointer(["print"]), [new E_String("hello"), new E_Undefined(), new E_Number(10)]));
  run(program);
}
/*
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


    return new Scope.ScopeCall(parseToProg(p.callee), p.arguments.map(x => parseToProg(x)));
  }
  if (p.type == "Identifier") {


    return new Scope.ScopeIdentifier(p.name);
  }
  if (p.type == "Literal") {


    return new Scope.ScopeLiteral(p.value);
  }
  if (p.type == "ForStatement") {

    return new Scope.ScopeForStatement(parseToProg(p.init), parseToProg(p.test), parseToProg(p.update), parseToProg(p.body));
  }
  if (p.type == "VariableDeclaration") {

    return new Scope.ScopeVariableDeclaration(p.declarations.map(x => parseToProg(x)));
  }
  if (p.type == "VariableDeclarator") {

    return new Scope.ScopeVariableDeclarator(parseToProg(p.id), parseToProg(p.init));
  }
  if (p.type == "BinaryExpression") {

    return new Scope.ScopeBinaryExpression(parseToProg(p.left), parseToProg(p.right), p.operator);
  }
  if (p.type == "AssignmentExpression") {

    return new Scope.ScopeVariableDeclarator(parseToProg(p.left), parseToProg(p.right));
  }
  if (p.type == "UpdateExpression") {

    return new Scope.ScopeUpdateExpression(parseToProg(p.argument), p.operator,p.prefix);
  }
  if (p.type == "UndefinedLiteral") {

    return new Scope.V_Undefined();
  }
  throw ("No Map Yet For"+p);
  //return new Scope.V_Undefined();
}
*/

if (process.argv.length > 2) {
  try {
    fs.readFile(path.join(__dirname, process.argv[2]), function(err, contents) {
      if (err) {
                return console.error(err);
            }
      try {
        const sampleOutput = parse(contents.toString(), {});

        //const sampleOutput = parse('for(var i=0;i<10;i=i+1){var row="";for(var j=0;j<i+1;j=j+1){row=row+"*";};print("hello "+i,row);};', {});
        console.log("parsed", JSON.stringify(sampleOutput))
        var pp = parseToProg(sampleOutput);
        console.log("parsed p", JSON.stringify(pp))
        if (pp instanceof E_Block) {
          console.log("RUN");
          console.log(run(pp));
        }
      }
      catch (ex) {
        console.log("error parsing", ex)
        // Handle parsing error
        // [...]
      }
    });
  } catch (e) {

  }

} else {
  test();
}
