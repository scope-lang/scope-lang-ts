import { ScopeExpression } from "./expression";
import { ScopeValue, V_Undefined } from "./value";
import { V_ValueHolder } from "./scopes";
import { V_Literal, E_Literal } from "./literals";
import { V_VariablePointer, E_VariableDeclaration, E_VariableDeclarator, E_VariablePointer, VariableType } from "./variables";

export class E_Update implements ScopeExpression {
    argument: ScopeExpression;
    right: ScopeExpression;
    operator:string
    name: string;
    prefix:boolean;
    eval(this: E_Update, context: V_ValueHolder): ScopeValue {
      if(this.operator=="++"){
        var l=this.argument.eval(context).getValue();
  
        if(l instanceof V_Literal){
          try{
            var out=new V_Literal(l.value);
            var outa=new V_Literal(l.value+1);
            var as=new E_VariableDeclaration( [new E_VariableDeclarator( this.argument,new E_Literal(l.value+1),VariableType.CHANGE)]).eval(context);
            if(this.prefix){
              return outa;
            }else{
              return out;
            }
          }catch(e){
  
          }
        }
      }
      if(this.operator=="--"){
        var l=this.argument.eval(context).getValue();
  
        if(l instanceof V_Literal){
          try{
            var out=new V_Literal(l.value);
            var outa=new V_Literal(l.value-1);
            var as=new E_VariableDeclaration( [new E_VariableDeclarator( this.argument,new E_Literal(l.value-1),VariableType.CHANGE)]).eval(context);
            if(this.prefix){
              return outa;
            }else{
              return out;
            }
          }catch(e){
  
          }
        }
      }
      console.log("oops")
      return new V_Undefined();
    }
    parameters: Array<ScopeExpression>;
    constructor(argument:ScopeExpression,operator:string,prefix:boolean) {
      this.argument=argument;
      this.operator=operator;
      this.prefix=prefix;
      this.name = "UpExp";
    }
  }