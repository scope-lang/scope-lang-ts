import { ScopeValue, V_Undefined } from "./value";
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
    var pList=this.parentList();
    if(this.has(key)){
      return new V_VariablePointer(this,[key]);
    }
    if (pList.length>0) {
      for(var p of pList){
        if(p.knows(key)){
          return new V_VariablePointer(p,[key]);
        }
      }
    }
    return new V_VariablePointer(this,[key]);
  }
  public parent?: V_ValueHolder;
  public parents?:V_ValueHolder[];
  parentList(this:V_Scope):V_ValueHolder[]{
    if (this.parent) {
      return [this.parent].concat(this.parents?this.parents:[]);
    }else{
      return this.parents?this.parents:[];
    }
  }
  knows(this: V_Scope, key: string): boolean {
    var pList=this.parentList();
    if(this.has(key)){
      return true;
    }
    if (pList.length>0) {
      for(var p of pList){
        if(p.knows(key)){
          return true;
        }
      }
    }
    return false;
  }
  has(this: V_ValueHolder, key: string): boolean {
    return !(!this.properties[key]);
  }
  get(this: V_Scope, key: string): ScopeValue {
    var pList=this.parentList();
    if(this.has(key)){
      return this.properties[key][1];
    }
    if (pList.length>0) {
      for(var p of pList){
        if(p.knows(key)){
          return p.get(key);
        }
      }
    }

    //throw "undefined get :"+key;
    return new V_Undefined();
  }
  set(this: V_Scope,  type:VariableType, key: string, value: ScopeValue): ScopeValue {
    if (this.has(key)) {
      if(this.properties[key][0]==VariableType.VAR){
        return this.properties[key][1]=value;
      }else{
        throw "CANT CHANGE IT";
      }
    }
    var pList=this.parentList();
    if (pList.length>0) {
      for(var p of pList){
        if(p.knows(key)){
          return p.set(type,key, value);
        }
      }
    }
    return (this.properties[key] = [type,value])[1];
  }
  public properties: { [key: string]: [VariableType,ScopeValue] };
  constructor(parent?: V_ValueHolder,parents?: V_ValueHolder[]) {
    this.properties = {};
    if (parent) {
      this.parent = parent;
    }
    if (parents) {
      this.parents = parents;
    }
  }
}
