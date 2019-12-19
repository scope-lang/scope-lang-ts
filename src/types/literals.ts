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
export class V_Literal implements ScopeValue,V_ValueHolder {
  properties: { [key: string]: [VariableType, ScopeValue]; };
  get(this: V_Literal, key: string): ScopeValue {
    if(key=="length"){
      return new V_Literal(this.value.length);
    }
    if(!isNaN(parseInt(key))){
      return new V_Literal(this.value[parseInt(key)]);
    }
    return new V_Undefined();
  }
  pointer(this: V_ValueHolder, key: string): V_VariablePointer {
    return new V_VariablePointer(this,[key]);
  }
  set(this: V_Literal, type: VariableType, key: string, value: ScopeValue): ScopeValue {
    if(key=="length"){
      return new V_Literal(this.value.length);
      
    }
    if(!isNaN(parseInt(key))){
      var nv=(this.value as String).split("");
      nv[parseInt(key)]=(value.base() as V_Literal).value.toString()[0];
      this.value=nv.join("");
      return new V_Literal(nv[parseInt(key)]);
    }
    return new V_Undefined();
  }
  has(this: V_ValueHolder, key: string): boolean {
    if(key=="length"){
      return true;
    }
    if(!isNaN(parseInt(key))){
      return true;
    }
    return false;
  }
  knows(this: V_ValueHolder, key: string): boolean {
    console.log("GET K",key)
    if(key=="length"){
      return true;
    }
    if(!isNaN(parseInt(key))){
      return true;
    }
   return false;
  }
  self: V_ValueHolder;
  base(this: ScopeValue): ScopeValue {
    return this;
  }
  value: Number|string|boolean;
  constructor(value:Number|string|boolean) {
    this.value=value;
  }
  toString(this:V_Literal):string{
    return (this.value||"").toString();
  }
}
export class E_Literal implements ScopeExpression,Sco{
  base(this: ScopeValue): ScopeValue {
    return this;
  }
  start: Number;
  end: Number;
  value: Number|string|boolean;
  eval(this: E_Number, context: V_ValueHolder): ScopeValue {
    return new V_Literal(this.value);
  }
  constructor(value:Number|string|boolean) {
    this.value=value;
  }
}
