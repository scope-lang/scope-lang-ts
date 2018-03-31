import { ScopeValue, V_Undefined } from "./value";
import { ScopeExpression, E_Undefined } from "./expression";
import { VariableType, V_VariablePointer, E_VariablePointer, E_VariableDeclaration, E_VariableDeclarator } from "./variables";
import { V_ValueHolder, V_Scope } from "./scopes";
import { V_PointerMap, ScopeCallee, E_Call } from "./callee";
import { V_Block, E_Block } from "./block";
import { C_Print } from "./print";
import { E_String, V_String, E_Number, V_Number, E_Literal, V_Literal } from "./literals";
import { E_BinaryExpression } from "./operations";
export function falsey(v: ScopeValue): boolean {
  if (v instanceof V_Literal) {
    return !v.value;
  }
  if (v instanceof V_Undefined) {
    return true;
  }
  return false;
}
export class E_ForStatement implements ScopeExpression {
  init: ScopeExpression;
  test: ScopeExpression;
  update: ScopeExpression;
  body: ScopeExpression;
  start: Number;
  end: Number;
  eval(this: E_ForStatement, context: V_ValueHolder): ScopeValue {
    var subCtx = new V_Scope(context);
    this.init.eval(subCtx)
    //console.log("t",this.test.eval(subCtx));
    for (; !falsey(this.test.eval(subCtx).base()); this.update.eval(subCtx)) {
      var q = (this.body.eval(subCtx).base() as ScopeCallee).eval([], subCtx);
      //this.body.eval(subCtx);
    }
    return new V_Undefined();
  }
  target: ScopeExpression;
  constructor(init: ScopeExpression, test: ScopeExpression, update: ScopeExpression, body: ScopeExpression) {
    this.init = init;
    this.test = test;
    this.update = update;
    this.body = body;
  }
}
