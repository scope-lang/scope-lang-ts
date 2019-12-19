import { ScopeValue, V_Undefined } from "./value";
import { ScopeExpression, E_Undefined } from "./expression";
import { VariableType, V_VariablePointer, E_VariablePointer, E_VariableDeclaration, E_VariableDeclarator } from "./variables";
import { V_ValueHolder, V_Scope } from "./scopes";
import { V_PointerMap, ScopeCallee, E_Call } from "./callee";
import { V_Block, E_Block, V_Return, ReturnType } from "./block";
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
    var q=new V_Undefined();
    for (; !falsey(this.test.eval(subCtx).base()); this.update.eval(subCtx)) {
      var nq = (this.body.eval(subCtx).base() as ScopeCallee).eval([], subCtx);
      if(nq instanceof V_Return){
        if(nq.rtype==ReturnType.Break){
          //q=new V_Undefined();
          return q;
          // break;
        }else if(nq.rtype==ReturnType.Return){
          q=nq;
          break;
        }else{
          
        }
      }
      //this.body.eval(subCtx);
    }
    return q;
  }
  target: ScopeExpression;
  constructor(init: ScopeExpression, test: ScopeExpression, update: ScopeExpression, body: ScopeExpression) {
    this.init = init;
    this.test = test;
    this.update = update;
    this.body = body;
  }
}
export class E_WhileStatement implements ScopeExpression {
  test: ScopeExpression;
  body: ScopeExpression;
  start: Number;
  end: Number;
  eval(this: E_WhileStatement, context: V_ValueHolder): ScopeValue {
    var subCtx = new V_Scope(context);
    //console.log("t",this.test.eval(subCtx));
    var q=new V_Undefined();
    while(!falsey(this.test.eval(subCtx).base())) {
      q = (this.body.eval(subCtx).base() as ScopeCallee).eval([], subCtx);
      if(q instanceof V_Return){
        if(q.rtype==ReturnType.Break){
          q=new V_Undefined();
          break;
        }else if(q.rtype==ReturnType.Return){
          break;
        }else{
          
        }
      }
      //this.body.eval(subCtx);
    }
    return q;
  }
  target: ScopeExpression;
  constructor(test: ScopeExpression,  body: ScopeExpression) {
    this.test = test;
    this.body = body;
  }
}
export class E_IfStatement implements ScopeExpression {
  consequent: ScopeExpression;
  alternate:ScopeExpression;
  test: ScopeExpression;
  start: Number;
  end: Number;
  eval(this: E_IfStatement, context: V_ValueHolder): ScopeValue {
    var subCtx = new V_Scope(context);
    var q=new V_Undefined();
    //console.log("t",this.test.eval(subCtx));
    if(!falsey(this.test.eval(subCtx).base())) {
      q = (this.consequent.eval(subCtx).base() as ScopeCallee).eval([], subCtx);
      //this.body.eval(subCtx);
    }else{
      q = (this.alternate.eval(subCtx).base() as ScopeCallee).eval([], subCtx);
    }
    return q;
  }
  target: ScopeExpression;
  constructor(test: ScopeExpression, consequent: ScopeExpression,alternate?: ScopeExpression) {
    this.test = test;
    this.consequent=consequent;
    this.alternate=alternate?alternate:new E_Block();
  }
}
export class E_ReturnStatement implements ScopeExpression {
  argument?: ScopeExpression;
  start: Number;
  end: Number;
  rtype:ReturnType;
  eval(this: E_ReturnStatement, context: V_ValueHolder): ScopeValue {
    var subCtx = new V_Scope(context);
    //console.log("t",this.test.eval(subCtx));
    var q=new V_Undefined();
    if(this.argument){
      q=this.argument.eval(context);
    }
    return new V_Return(this.rtype ,q);
  }
  target: ScopeExpression;
  constructor(rtype:ReturnType,argument?: ScopeExpression) {
    this.argument=argument;
    this.rtype=rtype;
  }
}