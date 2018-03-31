import { ScopeValue, V_Undefined } from "./value";
import { ScopeExpression } from "./expression";
import { VariableType, V_VariablePointer, E_VariablePointer } from "./variables";
import { V_ValueHolder, V_Scope } from "./scopes";
export interface ScopeCallee extends ScopeValue {
  parameterMap: V_PointerMap;
  eval(this: ScopeCallee, parameters: Array<ScopeExpression>, context: V_ValueHolder): ScopeValue;
}
export class V_PointerMap implements ScopeValue {
  base(this: ScopeValue): ScopeValue {
    return this;
  }
  keys: Array<V_VariablePointer>;
  constructor() {
    this.keys = new Array<V_VariablePointer>();
  }
  apply(this: V_PointerMap, parameters: Array<ScopeValue>, context: V_ValueHolder) {
    for (var i = 0; i < Math.min(parameters.length, this.keys.length); i++) {
      //context[this.keys[i]]=parameters[i];
      this.keys[i].setValue(VariableType.VAR,parameters[i],context);
    }
  }
}
export class E_PointerMap implements ScopeExpression {
  start: Number;
  end: Number;
  eval(this: E_PointerMap, context: V_ValueHolder): V_PointerMap{
    var p=new V_PointerMap();
    p.keys=this.keys.map(x=>x.eval(context));
    return p;
  }
  keys: Array<E_VariablePointer>;
  constructor(keys:Array<E_VariablePointer>) {
    this.keys = keys;
  }
}
export class E_Call implements ScopeExpression {
  start: Number;
  end: Number;
  eval(this: E_Call, context: V_ValueHolder): ScopeValue {
    //console.log("CALL",this.target.eval(context));
    //console.log("PARMA",this.parameters);
    return (this.target.eval(context).base() as ScopeCallee).eval(this.parameters, context);
  }
  target: ScopeExpression;
  parameters: Array<ScopeExpression>;
  constructor(target: ScopeExpression, parameters: Array<ScopeExpression>) {
    this.target = target;
    this.parameters=parameters;
  }
}
