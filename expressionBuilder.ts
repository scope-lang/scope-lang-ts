import { ScopeValue, V_Undefined } from "./src/types/value";
import { ScopeExpression, E_Undefined, E_Sequence, E_This } from "./src/types/expression";
import { VariableType, V_VariablePointer, E_VariablePointer, E_VariableDeclaration, E_VariableDeclarator, E_MemberExpression } from "./src/types/variables";
import { V_ValueHolder, V_Scope } from "./src/types/scopes";
import { V_PointerMap, ScopeCallee, E_Call, E_PointerMap } from "./src/types/callee";
import { V_Block, E_Block, ReturnType } from "./src/types/block";
import { C_Print } from "./src/types/print";
import { E_String, V_String, E_Number, V_Number, E_Literal } from "./src/types/literals";
import { E_BinaryExpression } from "./src/types/operations";
import { E_ForStatement, E_IfStatement, E_ReturnStatement, E_WhileStatement } from "./src/types/control";
import { E_Object } from "./src/types/object";
import { E_Array } from "./src/types/array";
import { E_Update } from "./src/types/update";
import { E_UnaryExpression } from "./src/types/unary";
export function parseToProg(p) {
  if (p.type == "Program") {
    var program: E_Block = new E_Block();
    program.expressions = p.body.map(x => parseToProg(x));
    return program;
  }
  if (p.type == "BlockStatement") {
    var obj: E_Object = new E_Object();
    if (p.map) {
      obj.parameterMap = parseToProg(p.map);
    }
    obj.expressions = p.body.map(x => parseToProg(x));
    return obj;
  }
  if (p.type == "ObjectExpression") {
    var pr={};
    p.properties.forEach(element => {
      pr[element.key.name]=[VariableType.VAR,parseToProg(element.value)];
    });
    var obj: E_Object = new E_Object(pr);
    // if (p.map) {
    //   obj.parameterMap = parseToProg(p.map);
    // }
    // obj.expressions = p.body.map(x => parseToProg(x));
    return obj;
  }
  if (p.type == "ArrayExpression") {
    var arr: E_Array = new E_Array(p.elements.map(x=>parseToProg(x)));
    // if (p.map) {
    //   obj.parameterMap = parseToProg(p.map);
    // }
    // obj.expressions = p.body.map(x => parseToProg(x));
    return arr;
  }
  if (p.type == "SequenceExpression") {

    var objs=new E_Sequence(p.expressions.map(x => parseToProg(x)));
    return objs;
  }
  if (p.type == "ExpressionStatement") {


    return parseToProg(p.expression);
  }
  if (p.type == "CallExpression") {


    return new E_Call(parseToProg(p.callee), p.arguments.map(x => parseToProg(x)));
  }
  if (p.type == "Identifier") {


    return new E_VariablePointer([p.name]);
  }
  if (p.type == "MemberExpression") {

// console.log("P",p)
    return new E_MemberExpression(parseToProg(p.object),parseToProg(p.property),p.computed);
    
  }
  if (p.type == "Literal") {


    return new E_Literal(p.value);
  }
  if (p.type == "PointerMapLiteral") {


    return new E_PointerMap(p.items.map(x => parseToProg(x)));
  }
  if (p.type == "VariableDeclaration") {

    return new E_VariableDeclaration(p.declarations.map(x => parseToProg(x)));
  }
  if (p.type == "VariableDeclarator") {

    return new E_VariableDeclarator(parseToProg(p.id), parseToProg(p.init));
  }
  if (p.type == "AssignmentExpression") {

    return new E_VariableDeclarator(parseToProg(p.left), parseToProg(p.right));
  }
  if (p.type == "UnaryExpression") {

    return new E_UnaryExpression(parseToProg(p.argument), p.operator);
  }

  if (p.type == "BinaryExpression"||p.type=="LogicalExpression") {

    return new E_BinaryExpression(parseToProg(p.left), parseToProg(p.right), p.operator);
  }

  if (p.type == "ForStatement") {

    return new E_ForStatement(parseToProg(p.init), parseToProg(p.test), parseToProg(p.update), parseToProg(p.body));
  }
  if (p.type == "WhileStatement") {

    return new E_WhileStatement( parseToProg(p.test), parseToProg(p.body));
  }
  if (p.type == "IfStatement") {
    if(p.alternate){
      return new E_IfStatement( parseToProg(p.test), parseToProg(p.consequent),parseToProg(p.alternate));
    }else{
      return new E_IfStatement( parseToProg(p.test), parseToProg(p.consequent));
    }

  }
  if (p.type == "ThisExpression") {
    return new E_This();

  }
  if (p.type == "EmptyStatement") {

    return new E_Block();
  }
  if (p.type == "BreakStatement") {
    return new E_ReturnStatement(ReturnType.Break);
  }
  if (p.type == "ReturnStatement") {
    return new E_ReturnStatement(ReturnType.Return,p.argument?parseToProg(p.argument):undefined);
  }
  if (p.type == "ContinueStatement") {
    return new E_ReturnStatement(ReturnType.Continue);
  }

  
  if (p.type == "UpdateExpression") {

    return new E_Update(parseToProg(p.argument), p.operator,p.prefix);
  }
  
  if (p.type == "UndefinedLiteral") {

    return new E_Undefined();
  }
  throw ("No Map Yet For" + JSON.stringify(p) + p.type);
  //return new Scope.V_Undefined();
}
