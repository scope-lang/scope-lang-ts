import { ScopeValue, V_Undefined } from "./value";
import { ScopeExpression, E_Undefined } from "./expression";
import { VariableType, V_VariablePointer, E_VariablePointer, E_VariableDeclaration, E_VariableDeclarator } from "./variables";
import { V_ValueHolder, V_Scope } from "./scopes";
import { V_PointerMap, ScopeCallee, E_Call } from "./callee";
import {V_Block, E_Block} from "./block";
import {C_Print} from "./print";
import {E_String, V_String,E_Number,V_Number, E_Literal, V_Literal} from "./literals";
export class E_BinaryExpression implements ScopeExpression {
  start: Number;
  end: Number;
  left: ScopeExpression;
  right: ScopeExpression;
  operator:string
  name: string;
  eval(this: E_BinaryExpression, context: V_ValueHolder): ScopeValue {
    if(this.operator=="+"){
      var l=this.left.eval(context).base();
      var r=this.right.eval(context).base();
      if(l instanceof V_Literal && r instanceof V_Literal){
        try{
          return new V_Literal(l.value+r.value);
        }catch(e){

        }
      }
    }
    if(this.operator=="*"){
      var l=this.left.eval(context).base();
      var r=this.right.eval(context).base();
      if(l instanceof V_Literal && r instanceof V_Literal){
        try{
          return new V_Literal(l.value*r.value);
        }catch(e){

        }
      }
    }
    if(this.operator=="/"){
      var l=this.left.eval(context).base();
      var r=this.right.eval(context).base();
      if(l instanceof V_Literal && r instanceof V_Literal){
        try{
          return new V_Literal(l.value/r.value);
        }catch(e){

        }
      }
    }
    if(this.operator=="<"){
      var l=this.left.eval(context).base();
      //console.log(context)
      //console.log("tsdgf",this.left,l);
      var r=this.right.eval(context).base();
      if(l instanceof V_Literal && r instanceof V_Literal){
        try{
          return new V_Literal(l.value<r.value);
        }catch(e){

        }
      }
    }
    if(this.operator=="<="){
      var l=this.left.eval(context).base();
      //console.log(context)
      //console.log("tsdgf",this.left,l);
      var r=this.right.eval(context).base();
      if(l instanceof V_Literal && r instanceof V_Literal){
        try{
          return new V_Literal(l.value<=r.value);
        }catch(e){

        }
      }
    }
    if(this.operator=="-"){
      var l=this.left.eval(context).base();
      var r=this.right.eval(context).base();
      if(l instanceof V_Literal && r instanceof V_Literal){
        try{
          return new V_Literal(l.value-r.value);
        }catch(e){

        }
      }
    }
    if(this.operator==">"){
      var l=this.left.eval(context).base();
      //console.log(context)
      //console.log("tsdgf",this.left,l);
      var r=this.right.eval(context).base();
      if(l instanceof V_Literal && r instanceof V_Literal){
        try{
          return new V_Literal(l.value>r.value);
        }catch(e){

        }
      }
    }
    if(this.operator==">="){
      var l=this.left.eval(context).base();
      //console.log(context)
      //console.log("tsdgf",this.left,l);
      var r=this.right.eval(context).base();
      if(l instanceof V_Literal && r instanceof V_Literal){
        try{
          return new V_Literal(l.value>=r.value);
        }catch(e){

        }
      }
    }
    if(this.operator=="%"){
      var l=this.left.eval(context).base();
      //console.log(context)
      //console.log("tsdgf",this.left,l);
      var r=this.right.eval(context).base();
      if(l instanceof V_Literal && r instanceof V_Literal){
        try{
          return new V_Literal(l.value%r.value);
        }catch(e){

        }
      }
    }
    var l=this.left.eval(context).base();
    //console.log(context)
    //console.log("tsdgf",this.left,l);
    var r=this.right.eval(context).base();
    throw this.operator+" wont work here"+"("+l+","+r+")";
  }
  parameters: Array<ScopeExpression>;
  constructor(left:ScopeExpression,right:ScopeExpression,operator:string) {
    this.left=left;
    this.right=right;
    this.operator=operator;
    this.name = "BinExp";
  }
}
