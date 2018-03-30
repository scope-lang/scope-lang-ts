import { ScopeValue, V_Undefined } from "./value";
import { ScopeExpression } from "./expression";
import { VariableType, V_VariablePointer } from "./variables";
import { V_ValueHolder, V_Scope } from "./scopes";
import { V_PointerMap, ScopeCallee } from "./callee";
export class V_Block implements ScopeValue, ScopeCallee {
  base(this: ScopeValue): ScopeValue {
    return this;
  }
  name: string;
  parameterMap: V_PointerMap;
  context:V_ValueHolder;
  expressions: Array<ScopeExpression>;
  eval(this: V_Block, parameters: ScopeExpression[], context: V_ValueHolder): ScopeValue {
    //console.log(...parameters.map(x=>x.eval(context).toString()));
    var subCtx=new V_Scope(this.context);
    this.parameterMap.apply(parameters.map(function(x) { return x.eval(context) }),subCtx);
    var value: ScopeValue = new V_Undefined();
    for (var statement of this.expressions) {
      statement.eval(subCtx);
    }
    return value;
    //return new V_Undefined();
  }
  constructor(expressions:Array<ScopeExpression>,context: V_ValueHolder,parameterMap?:V_PointerMap) {
    this.parameterMap=parameterMap?parameterMap: new V_PointerMap();
    this.expressions=expressions;
    this.context=context;
  }
}
export class E_Block implements ScopeExpression {
  start:Number;
  end:Number;
  eval(this: E_Block, context: V_ValueHolder): V_Block {
    return new V_Block(this.expressions,context);
  }
  expressions: Array<ScopeExpression>;
  constructor(expressions?:Array<ScopeExpression>) {
    this.expressions = expressions?expressions:new Array<ScopeExpression>();
  }
}
