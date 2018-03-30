import { ScopeValue } from "./value";
import { VariableType, V_VariablePointer } from "./variables";
export interface V_ValueHolder extends ScopeValue {
  properties: { [key: string]: [VariableType,ScopeValue] };
  get(this: V_ValueHolder, key: string): ScopeValue;
  pointer(this: V_ValueHolder, key: string): V_VariablePointer;
  set(this: V_ValueHolder, type:VariableType,key: string, value: ScopeValue): ScopeValue;
  has(this: V_ValueHolder, key: string): boolean;
  knows(this: V_ValueHolder, key: string): boolean;
}
export class V_Scope implements V_ValueHolder {
  base(this: V_Scope): ScopeValue {
    return this;
  }
  pointer(this: V_Scope, key: string): V_VariablePointer {
    if(this.has(key)){
      return new V_VariablePointer(this,[key]);
    }
    if(this.parent){
      return this.parent.pointer(key);
    }
    return new V_VariablePointer(this,[key]);
  }
  public parent?: V_ValueHolder;
  knows(this: V_Scope, key: string): boolean {
    if (this.parent) {
      return this.has(key) || this.parent.knows(key);
    }
    return this.has(key);
  }
  has(this: V_ValueHolder, key: string): boolean {
    return !(!this.properties[key]);
  }
  get(this: V_Scope, key: string): ScopeValue {
    if (this.has(key)) {
      return this.properties[key][1];
    }
    if (this.parent.knows(key)) {
      return this.parent.get(key);
    }
    throw "undefined";
    //return new V_Undefined();
  }
  set(this: V_Scope,  type:VariableType, key: string, value: ScopeValue): ScopeValue {
    if (this.has(key)) {
      if(this.properties[key][0]==VariableType.VAR){
        return this.properties[key][1]=value;
      }else{
        throw "CANT CHANGE IT";
      }
    }
    if (this.parent && this.parent.knows(key)) {
      return this.parent.set(type,key, value);
    }
    return (this.properties[key] = [type,value])[1];
  }
  public properties: { [key: string]: [VariableType,ScopeValue] };
  constructor(parent?: V_ValueHolder) {
    this.properties = {};
    if (parent) {
      this.parent = parent;
    }
  }
}
