import {ScopeValue, V_Undefined} from "./value";
import { V_ValueHolder } from "./scopes";
export interface ScopeExpression {
  start:Number;
  end:Number;
  eval(this: ScopeExpression, context: V_ValueHolder): ScopeValue;
}
export class E_Undefined implements ScopeExpression {
  start: Number;
  end: Number;
  eval(this: E_Undefined, context: V_ValueHolder): ScopeValue {
    return new V_Undefined();
  }
}
