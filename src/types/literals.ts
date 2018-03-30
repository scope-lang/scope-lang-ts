import { ScopeValue, V_Undefined } from "./value";
import { ScopeExpression } from "./expression";
import { VariableType, V_VariablePointer } from "./variables";
import { V_ValueHolder, V_Scope } from "./scopes";
import { V_PointerMap, ScopeCallee } from "./callee";
import {V_Block} from "./block";
export class V_String implements ScopeValue {
  base(this: ScopeValue): ScopeValue {
    return this;
  }
  value: string;
  constructor(value:string) {
    this.value=value;
  }
  toString(this:V_String):string{
    return this.value;
  }
}
export class E_String implements ScopeExpression{
  base(this: ScopeValue): ScopeValue {
    return this;
  }
  start: Number;
  end: Number;
  value: string;
  eval(this: E_String, context: V_ValueHolder): ScopeValue {
    return new V_String(this.value);
  }
  constructor(value:string) {
    this.value=value;
  }
}
export class V_Number implements ScopeValue {
  base(this: ScopeValue): ScopeValue {
    return this;
  }
  value: Number;
  constructor(value:Number) {
    this.value=value;
  }
  toString(this:V_Number):string{
    return this.value.toString();
  }
}
export class E_Number implements ScopeExpression{
  base(this: ScopeValue): ScopeValue {
    return this;
  }
  start: Number;
  end: Number;
  value: Number;
  eval(this: E_Number, context: V_ValueHolder): ScopeValue {
    return new V_Number(this.value);
  }
  constructor(value:Number) {
    this.value=value;
  }
}
export class V_Literal implements ScopeValue {
  base(this: ScopeValue): ScopeValue {
    return this;
  }
  value: Number|string;
  constructor(value:Number|string) {
    this.value=value;
  }
  toString(this:V_Literal):string{
    return this.value.toString();
  }
}
export class E_Literal implements ScopeExpression{
  base(this: ScopeValue): ScopeValue {
    return this;
  }
  start: Number;
  end: Number;
  value: Number|string;
  eval(this: E_Number, context: V_ValueHolder): ScopeValue {
    return new V_Literal(this.value);
  }
  constructor(value:Number|string) {
    this.value=value;
  }
}
