import { ScopeValue, V_Undefined } from "./value";
import { ScopeExpression } from "./expression";
import { VariableType, V_VariablePointer } from "./variables";
import { V_ValueHolder, V_Scope } from "./scopes";
import { V_PointerMap, ScopeCallee } from "./callee";
export class C_Custom implements ScopeCallee {
  base(this: ScopeValue): ScopeValue {
    return this;
  }
  parameterMap: V_PointerMap;
  natFunc:(parameters: ScopeValue[],context: V_ValueHolder)=>ScopeValue;
  eval(this: C_Custom, parameters: ScopeExpression[], context: V_ValueHolder): ScopeValue {
    //console.log(...parameters.map(x=>x.eval(context).base().toString()));
    return this.natFunc(parameters.map(x=>x.eval(context)),context);
  }
  constructor(func:(parameters: ScopeValue[],context: V_ValueHolder)=>ScopeValue) {
    this.parameterMap= new V_PointerMap();
    this.natFunc=func;
  }
}
