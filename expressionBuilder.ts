import { ScopeValue, V_Undefined } from "./src/types/value";
import { ScopeExpression, E_Undefined, E_Sequence } from "./src/types/expression";
import { VariableType, V_VariablePointer, E_VariablePointer, E_VariableDeclaration, E_VariableDeclarator, E_MemberExpression } from "./src/types/variables";
import { V_ValueHolder, V_Scope } from "./src/types/scopes";
import { V_PointerMap, ScopeCallee, E_Call, E_PointerMap } from "./src/types/callee";
import { V_Block, E_Block } from "./src/types/block";
import { C_Print } from "./src/types/print";
import { E_String, V_String, E_Number, V_Number, E_Literal } from "./src/types/literals";
import { E_BinaryExpression } from "./src/types/operations";
import { E_ForStatement, E_IfStatement } from "./src/types/control";
import { E_Object } from "./src/types/object";
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


    return new E_MemberExpression(parseToProg(p.object),parseToProg(p.property));
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
  if (p.type == "BinaryExpression") {

    return new E_BinaryExpression(parseToProg(p.left), parseToProg(p.right), p.operator);
  }

  if (p.type == "ForStatement") {

    return new E_ForStatement(parseToProg(p.init), parseToProg(p.test), parseToProg(p.update), parseToProg(p.body));
  }
  if (p.type == "IfStatement") {
    if(p.alternate){
      return new E_IfStatement( parseToProg(p.test), parseToProg(p.consequent),parseToProg(p.alternate));
    }else{
      return new E_IfStatement( parseToProg(p.test), parseToProg(p.consequent));
    }

  }
  if (p.type == "EmptyStatement") {

    return new E_Block();
  }

  /*
  if (p.type == "UpdateExpression") {

    return new Scope.ScopeUpdateExpression(parseToProg(p.argument), p.operator,p.prefix);
  }
  */
  if (p.type == "UndefinedLiteral") {

    return new E_Undefined();
  }
  throw ("No Map Yet For" + p + p.type);
  //return new Scope.V_Undefined();
}
