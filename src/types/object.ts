import { ScopeValue, V_Undefined } from "./value";
import { ScopeExpression } from "./expression";
import { VariableType, V_VariablePointer } from "./variables";
import { V_ValueHolder, V_Scope } from "./scopes";
import { V_PointerMap, ScopeCallee, E_PointerMap } from "./callee";
import { V_Block } from "./block";
export class E_Object implements ScopeExpression {
  start: Number;
  end: Number;
  properties: { [key: string]: [VariableType, ScopeExpression] };
  eval(this: E_Object, context: V_ValueHolder): V_Block {
    var builtProps:{ [key: string]: [VariableType, ScopeValue] }={};
    for (let key in this.properties) {
      builtProps[key]=[this.properties[key][0],this.properties[key][1].eval(context)];
    }
    return new V_Object(context,builtProps,this.expressions,this.parameterMap.eval(context));
  }
  expressions: Array<ScopeExpression>;
  parameterMap: E_PointerMap;
  constructor(properties?:{ [key: string]: [VariableType, ScopeExpression] },expressions?:Array<ScopeExpression>,parameterMap?:E_PointerMap) {
    this.expressions = expressions?expressions:new Array<ScopeExpression>();
    this.parameterMap=parameterMap?parameterMap: new E_PointerMap([]);
    this.properties=properties;
  }
}
export class V_Object extends V_Block implements ScopeCallee, V_ValueHolder {
  base(this: V_Object): ScopeValue {
    return this;
  }
  eval(this: V_Object, parameters: Array<ScopeExpression>, context: V_ValueHolder): ScopeValue {
    var subCtx=this.protoCopy();
    subCtx.parent=this.context;
    if (this.properties["action"]) {
      if (this.properties["action"][1]) {
        var action = this.properties["action"][1];
        var v=action;
        //console.log("T",v,"ddffd",v as ScopeCallee,"ddffd",v.parameterMap)
        if (action as ScopeCallee) {
          var act=action as ScopeCallee;
          var sc = new V_Scope();
          if(action instanceof V_Block){
            this.expressions=action.expressions;
            this.parameterMap=action.parameterMap;
            this.parameterMap.apply(parameters.map(function(x) { return x.eval(context) }),subCtx);
            var value: ScopeValue = new V_Undefined();
            for (var statement of this.expressions) {
              value=statement.eval(subCtx);
            }
            return value;
          }
        }
      }else{
        console.log("EREER",this.properties["action"])
      }
    }
    return new V_Undefined();
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
      if(this.properties[key][1] instanceof V_Object){
        console.log("Key",key);
        (this.properties[key][1] as V_Object).self=this;
      }
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
  set(this: V_Object,  type:VariableType, key: string, value: ScopeValue): ScopeValue {
    if(key=="action"){
      return this.setAction(value);
    }else{

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
    }
    return (this.properties[key] = [type,value])[1];
  }

  public properties: { [key: string]: [VariableType, ScopeValue] };
  setAction(this: V_Object, value: ScopeValue): ScopeValue {
    var v=value.base();
    //console.log("T",v,v as ScopeCallee,v.parameterMap);
    if (v as ScopeCallee) {
      if (this.properties["action"]){
        if (this.properties["action"][0] == VariableType.VAR) {
          return (this.properties["action"] = [VariableType.VAR,v])[1];
        } else {
          throw "CANT CHANGE IT";
        }
      }else{
        return (this.properties["action"] = [VariableType.VAR,v])[1];
      }
    }
    throw "CANT CHANGE IT TO NON ACTION";
  }
  public parameterMap: V_PointerMap;
  constructor(context: V_ValueHolder, properties?: { [key: string]: [VariableType, ScopeValue] },expressions?:Array<ScopeExpression>,parameterMap?:V_PointerMap) {
    super(context,expressions,parameterMap);
    this.properties = {};
    this.properties["action"] = [VariableType.VAR, new V_Block(context,expressions,parameterMap)];
    if (properties) {
      this.properties = properties;
    }
    if (this.properties["action"] && (this.properties["action"][1].parameterMap)) {

    } else {
      this.properties["action"] = [VariableType.VAR, new V_Block(context,expressions,parameterMap)];
    }
    this.self=this;
  }
  self:V_ValueHolder;
  toString(this:V_Object):string{
    var stringProps=[];
    for (var key in this.properties) {
      stringProps.push(key+":"+this.properties[key][1].toString());
    }
    return "{"+stringProps.join(",")+"}"
  }
  protoCopy(this:V_Object):V_Object{
    var cloneProps={};
    for (var key in this.properties) {
      cloneProps[key]=[this.properties[key][0],this.properties[key][1].base()];
    }
    var c=new V_Object(this.context,cloneProps,[],this.parameterMap);
    /*for (var key in c.properties) {
      if(c.properties[key][1] instanceof V_Object){

        //(c.properties[key][1] as V_Object).self=this;
      }
    }*/
    return c;
  }
}
