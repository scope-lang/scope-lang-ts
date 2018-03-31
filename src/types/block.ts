import { ScopeValue, V_Undefined } from "./value";
import { ScopeExpression } from "./expression";
import { VariableType, V_VariablePointer } from "./variables";
import { V_ValueHolder, V_Scope } from "./scopes";
import { V_PointerMap, ScopeCallee, E_PointerMap } from "./callee";
import { V_Object} from "./object";
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
    subCtx.self=this.context.self;
    this.parameterMap.apply(parameters.map(function(x) { return x.eval(context) }),subCtx);
    var value: ScopeValue = new V_Undefined();
    for (var statement of this.expressions) {
      value=statement.eval(subCtx);
    }
    return value;
    //return new V_Undefined();
  }
/*  evalProto(this: V_Block, parameters: ScopeExpression[], context: V_ValueHolder,proto: V_Object): ScopeValue {
    //console.log(...parameters.map(x=>x.eval(context).toString()));
    var subCtx=new V_Scope(proto);
    this.parameterMap.apply(parameters.map(function(x) { return x.eval(context) }),subCtx);
    var value: ScopeValue = new V_Undefined();
    for (var statement of this.expressions) {
      value=statement.eval(subCtx);
    }
    return subCtx;
    //return new V_Undefined();
  }*/
  constructor(context: V_ValueHolder,expressions?:Array<ScopeExpression>,parameterMap?:V_PointerMap) {
    this.parameterMap=parameterMap?parameterMap: new V_PointerMap();
    this.expressions=expressions?expressions:new Array<ScopeExpression>();
    this.context=context;
  }
}
export class E_Block implements ScopeExpression {
  start:Number;
  end:Number;
  eval(this: E_Block, context: V_ValueHolder): V_Block {
    return new V_Block(context,this.expressions,this.parameterMap.eval(context));
  }
  expressions: Array<ScopeExpression>;
  parameterMap: E_PointerMap;
  constructor(expressions?:Array<ScopeExpression>,parameterMap?:E_PointerMap) {
    this.expressions = expressions?expressions:new Array<ScopeExpression>();
    this.parameterMap=parameterMap?parameterMap: new E_PointerMap([]);
  }
}
