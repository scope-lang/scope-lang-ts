import { SyntaxError, parse } from './scope-peg';
import { ScopeValue, V_Undefined } from "./src/types/value";
import { ScopeExpression, E_Undefined } from "./src/types/expression";
import { VariableType, V_VariablePointer, E_VariablePointer } from "./src/types/variables";
import { V_ValueHolder, V_Scope } from "./src/types/scopes";
import { V_PointerMap, ScopeCallee, E_Call } from "./src/types/callee";
import {V_Block, E_Block} from "./src/types/block";
import {C_Print} from "./src/types/print";
import {C_Custom} from "./src/types/native";
import {E_String, V_String,E_Number,V_Number,V_Literal} from "./src/types/literals";
import {parseToProg} from "./expressionBuilder";
import * as fs from "fs";
import * as path from "path";
import { V_Object } from './src/types/object';

function run(program: E_Block) {
  var global = new V_Scope();
  // global.set(VariableType.CONST,"print", new C_Print());
  // // global.set(VariableType.CONST,"Math", new V_Object(global));
  // global.set(VariableType.CONST,"sqrt", new C_Custom(function(parameters,context){
  //   return new V_Literal(Math.sqrt(parameters.map((x,i,a)=>{return ((x.value as number)||0)})[0]));
  // }));
  // global.set(VariableType.CONST,"sin", new C_Custom(function(parameters,context){
  //   return new V_Literal(Math.sin(...parameters.map((x,i,a)=>{return ((x.value as number)||0)})));
  // }));
  // global.set(VariableType.CONST,"cos", new C_Custom(function(parameters,context){
  //   return new V_Literal(Math.cos(...parameters.map((x,i,a)=>{return ((x.value as number)||0)})));
  // }));
  // global.set(VariableType.CONST,"pow", new C_Custom(function(parameters,context){
  //   return new V_Literal(Math.pow(...parameters.map((x,i,a)=>{return ((x.value as number)||0)})));
  // }));
  global.set(VariableType.CONST,"console", new V_Object(global));
  global.set(VariableType.CONST,"Math", new V_Object(global));
  (global.get("console") as V_Object).set(VariableType.CONST,"log", new C_Print());
  (global.get("console") as V_Object).set(VariableType.CONST,"size", new C_Custom(function(parameters,context){
    return new V_Object(global,{"columns":[VariableType.VAR, new V_Literal(process.stdout.columns)],"rows":[VariableType.VAR, new V_Literal(process.stdout.rows)]});
  }));
  (global.get("Math") as V_Object).set(VariableType.CONST,"sqrt", new C_Custom(function(parameters,context){
    return new V_Literal(Math.sqrt(parameters.map((x,i,a)=>{return ((x.value as number)||0)})[0]));
  }));
  (global.get("Math") as V_Object).set(VariableType.CONST,"atan2", new C_Custom(function(parameters,context){
    return new V_Literal(Math.atan2(parameters.map((x,i,a)=>{return ((x.value as number)||0)})[0]));
  }));
  (global.get("Math") as V_Object).set(VariableType.CONST,"sin", new C_Custom(function(parameters,context){
    return new V_Literal(Math.sin(...parameters.map((x,i,a)=>{return ((x.value as number)||0)})));
  }));
  (global.get("Math") as V_Object).set(VariableType.CONST,"cos", new C_Custom(function(parameters,context){
    return new V_Literal(Math.cos(...parameters.map((x,i,a)=>{return ((x.value as number)||0)})));
  }));
  (global.get("Math") as V_Object).set(VariableType.CONST,"pow", new C_Custom(function(parameters,context){
    return new V_Literal(Math.pow(...parameters.map((x,i,a)=>{return ((x.value as number)||0)})));
  }));
  return program.eval(global).eval([], global);
}
function test() {
  var program: E_Block = new E_Block();
  program.expressions.push(new E_Call(new E_VariablePointer(["print"]), [new E_String("hello"), new E_Undefined(), new E_Number(10)]));
  run(program);
}

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
          run(pp)
          // console.log(run(pp));
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
