import { ScopeValue, V_Undefined } from "./value";
import { ScopeExpression } from "./expression";
import { VariableType, V_VariablePointer } from "./variables";
import { V_ValueHolder, V_Scope } from "./scopes";
import { V_PointerMap, ScopeCallee } from "./callee";
export class C_Print implements ScopeCallee {
  base(this: ScopeValue): ScopeValue {
    return this;
  }
  parameterMap: V_PointerMap;
  eval(this: C_Print, parameters: ScopeExpression[], context: V_ValueHolder): ScopeValue {
    console.log(...parameters.map(x=>x.eval(context).base().toString()));
    return new V_Undefined();
  }
  constructor() {
    this.parameterMap= new V_PointerMap();
  }
}
