import {ScopeValue} from "./value";
import { V_ValueHolder } from "./scopes";
import { ScopeExpression } from "./expression";
export enum VariableType {
  VAR,
  CONST,
  CHANGE
}
export class V_VariablePointer implements ScopeValue {
  base(this: V_VariablePointer): ScopeValue {
    return this.getValue().base();
  }
  targetHolder:V_ValueHolder;
  targetPath:string[];
  setValue(type:VariableType,value:ScopeValue,context:V_ValueHolder):ScopeValue{
    if(type==VariableType.CHANGE){
      return this.targetHolder.set(VariableType.VAR,this.targetPath[0],value);
    }else{
      return context.set(type,this.targetPath[0],value);
    }
  }
  getValue():ScopeValue{
    return this.targetHolder.get(this.targetPath[0]);
  }
  constructor(targetHolder:V_ValueHolder,targetPath:string[]) {
    this.targetHolder=targetHolder;
    this.targetPath=targetPath;
  }
}
export class E_VariablePointer implements ScopeExpression {
  start: Number;
  end: Number;
  eval(this: E_VariablePointer, context: V_ValueHolder): V_VariablePointer {
    return context.pointer(this.targetPath[0]);
  }
  targetPath:string[];
  constructor(targetPath:string[]) {
    this.targetPath=targetPath;
  }
}

export class E_VariableDeclaration implements ScopeExpression {
  start: Number;
  end: Number;
  declarations: Array<E_VariableDeclarator>;
  eval(this: E_VariableDeclaration, context: V_ValueHolder): ScopeValue {
    return this.declarations.map(x=>x.eval(context))[0];
  }
  constructor(declarations: Array<E_VariableDeclarator>) {
    this.declarations=declarations;
  }
}
export class E_VariableDeclarator implements ScopeExpression {
  start: Number;
  end: Number;
  init: ScopeExpression;
  id:E_VariablePointer;
  eval(this: E_VariableDeclarator, context: V_ValueHolder): ScopeValue {
    return this.id.eval(context).setValue(VariableType.VAR,this.init.eval(context),context);//context.set(this.id.eval(),this.init.eval(context));
  }
  constructor(id:E_VariablePointer,init:ScopeExpression) {
    this.id=id;
    this.init=init;
  }
}
