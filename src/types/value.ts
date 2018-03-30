export interface ScopeValue {
  base(this:ScopeValue):ScopeValue;
}
export class V_Undefined implements ScopeValue {
  base(this: ScopeValue): ScopeValue {
    return this;
  }
  toString(this:V_Undefined):string{
    return undefined;
  }
}
