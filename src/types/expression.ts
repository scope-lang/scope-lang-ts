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
export class E_This implements ScopeExpression {
  start: Number;
  end: Number;
  eval(this: E_This, context: V_ValueHolder): ScopeValue {
    return context;
  }
}
export class E_Sequence implements ScopeExpression {
  start:Number;
  end:Number;
  eval(this: E_Sequence, context: V_ValueHolder): ScopeValue {
    var out=new V_Undefined();
    for(var i of this.expressions){
      out=i.eval(context);
    }
    return out;
  }
  expressions: Array<ScopeExpression>;
  constructor(expressions?:Array<ScopeExpression>) {
    this.expressions = expressions?expressions:new Array<ScopeExpression>();
  }
}
