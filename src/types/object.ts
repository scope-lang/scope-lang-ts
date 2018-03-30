import { ScopeValue, V_Undefined } from "./value";
import { ScopeExpression } from "./expression";
import { VariableType, V_VariablePointer } from "./variables";
import { V_ValueHolder, V_Scope } from "./scopes";
import { V_PointerMap, ScopeCallee } from "./callee";
import {V_Block} from "./block";
export class E_Object implements ScopeExpression {
  start: Number;
  end: Number;
  eval(this: E_Object, context: V_ValueHolder): ScopeValue {
    return new V_Object(context);
  }
  constructor() {

  }
}
export class V_Object implements ScopeCallee, V_ValueHolder {
  base(this: V_Object): ScopeValue {
    return this;
  }
  eval(this: V_Object, parameters: Array<ScopeExpression>, context: V_ValueHolder): ScopeValue {
    var sc = new V_Scope();
    return this.body.eval(parameters, sc);
  }
  pointer(this: V_Object, key: string): V_VariablePointer {
    if (this.has(key)) {
      return new V_VariablePointer(this, [key]);
    }
    return new V_VariablePointer(this, [key]);
  }
  knows(this: V_Object, key: string): boolean {
    return this.has(key);
  }
  has(this: V_ValueHolder, key: string): boolean {
    return !(!this.properties[key]);
  }
  get(this: V_Object, key: string): ScopeValue {
    if (this.has(key)) {
      return this.properties[key][1];
    }
    throw "undefined";
  }
  set(this: V_Object, type: VariableType, key: string, value: ScopeValue): ScopeValue {
    if (this.has(key)) {
      if (this.properties[key][0] == VariableType.VAR) {
        return this.properties[key][1] = value;
      } else {
        throw "CANT CHANGE IT";
      }
    }
    return (this.properties[key] = [type, value])[1];
  }
  public properties: { [key: string]: [VariableType, ScopeValue] };
  setAction(this: V_Object, value: ScopeCallee): void {
    this.body=value;
  }
  public parameterMap: V_PointerMap;
  public body: ScopeCallee;
  constructor(context: V_ValueHolder, parameterMap?: V_PointerMap) {
    this.parameterMap = new V_PointerMap();
    this.body = new V_Block([], context);
  }
}
