function copy_text(val) {
    var element=document.getElementById("aux_elem")
    element.innerHTML=val
    var range, selection, worked;

    if (document.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(element);
      range.select();
    } else if (window.getSelection) {
      selection = window.getSelection();        
      range = document.createRange();
      range.selectNodeContents(element);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    try {
      document.execCommand('copy');
    }
    catch (err) {
      alert('unable to copy text');
    }
  }

function search_for_val(variables,val){
    for(var i=0;i<=variables.length;i++)
        if(variables[i]==val)
            return true;
    return false;
}
function conjunction(a,b){
    return (a && b);
}
function disjunction(a,b){
    return (a || b);
}
function nand(a,b){
    return !(a && b);
}
function nor(a,b){
    return !(a || b);
}
function implication(a,b){
    if(!b && a)
        return false
    return true
}
function equivalence(a,b){
    return (a==b);
}
function xor(a,b){
    return !(a==b);
}
function not(a,irr){
    return !a;
}
function equals(a,b){
    return (a==b);
}
function display_truth(val){
    if(val)return 'T'
    return 'F'
}
function check_for_operation_sign(val){
    //getting opperations ⌐, ^ , ⌄ , → , ↔ , ↑ , ↓, ⊕
if(val=='⌐')return true;
if(val=='^')return true;
if(val=='⌄')return true;
if(val=='→')return true;
if(val=='↔')return true;
if(val=='↑')return true;
if(val=='↓')return true;
if(val=='⊕')return true;
if(val=='=')return true;
return false
}
function setCharAt(str,index,chr) {
if(index > str.length-1) return str;
return str.substring(0,index) + chr + str.substring(index+1);
}
function nr_of_digits(val){
var nr=0;
while(val!=0){
    nr++;
    val=Math.floor(val/10);
}
return nr;
}
function trans(val){
    return (val==1)
}
function add_value(i,j,solved_table){
    console.log(i+" "+j)
    setTimeout(()=> 
    document.getElementById("cell_"+i+"_"+j).innerHTML=display_truth(solved_table[i][j])
    ,1000);
}
function add_value_in_column(i,variables,solved_table){
    setTimeout(()=>{
    for(var j=0;j<solved_table[i].length;j++){
        document.getElementById("cell_"+i+"_"+j).innerHTML=display_truth(solved_table[i][j]);}},1000)
}
function populate_truth_table(solved_table,_old_opperations,variables){
    var max_nr=(2 <<(variables.length-1))-1 ;
    for(var i=0;i<=max_nr;i++)
        for(var j=0;j<variables.length;j++){
            document.getElementById("cell_"+i+"_"+j).innerHTML=display_truth(solved_table[i][j]);
    }
    for(var i=0;i<=max_nr;i++)
        add_value_in_column(i,variables,solved_table)

}
function solve_a_line(functions,truth_values){
    var functions_results_by_line=[];
    for(var i=0;i<functions.length;i++){
        var left_opperand=functions[i]['opperands'][0];
        var right_opperand=functions[i]['opperands'][1];
        if(left_opperand[0]=='&'){
            var index_value=functions[i]['opperands'][0].slice(1);
            index_value=parseInt(index_value);
            left_opperand=functions_results_by_line[index_value];
        }
        if(right_opperand[0]=='&'){
            var index_value=functions[i]['opperands'][1].slice(1);
            index_value=parseInt(index_value);
            right_opperand=functions_results_by_line[index_value];
        }
        if(left_opperand!=true && left_opperand!=false){
            left_opperand=truth_values[functions[i]['opperands'][0]];
        }
        if(right_opperand!=true && right_opperand!=false){
            right_opperand=truth_values[functions[i]['opperands'][1]];
        }
        _result=functions[i]['function'](left_opperand,right_opperand);
        functions_results_by_line.push(_result)
    }
    return functions_results_by_line;
}
function get_element_at_index(variables,_index){
    var counter=-1;
    for (var variable in variables) {
        counter++;
        if(_index==counter){
            return variables[variable];
        }
      }
}
function generate_option(val,max_nr){
    var _value=[];
    for(var i=0;i<max_nr;i++)
        _value[i]=0
    var position=max_nr-1;
    while(val!=0){
        _value[position]=val%2
        val=Math.floor(val/2)
        position--;
    }
    return _value;
}

function convert_object_to_string(obj){
    var arr=[];
    for (var key in obj) {
        arr.push(obj[key]);
      }
    return arr;
}
function solve(functions,variables){
    var solved_table=[];
    var max_nr=(2 <<(variables.length-1))-1
    for(var i=max_nr; i>=0;i-- ){
        var truth_values={};
        _value=generate_option(i,variables.length);
        for (var j=0;j<variables.length;j++) {
            truth_values[get_element_at_index(variables,j)]=trans(_value[j])
            }
        
            var arr_truth_values=convert_object_to_string(truth_values)
            var result_line=solve_a_line(functions,truth_values);
            solved_table.push(arr_truth_values.concat(result_line));
}
return solved_table;
}
function get_functions_text(_functions){
    var _aux_list=[]
    for(var i=0;i<_functions.length;i++){
        _aux_list.push(_functions[i]['text']);
    }
    return _aux_list;
}
function generate_header(variables,functions,_old_opperations){
    var _header=convert_object_to_string(variables);
    var _functions=functions.slice();
    for(var i=0;i<_functions.length;i++){
        
        for(var j=0;j<_functions[i]['text'].length;j++){
            if(_functions[i]['text'][j]=='&'){
                var _aux=j+1;
                var _number=''
                while(!check_for_operation_sign(_functions[i]['text'][_aux]) && _aux<_functions[i]['text'].length){
                    _number+=_functions[i]['text'][_aux];
                    _aux++;
                }
                _number=parseInt(_number);
                _aux--;
                _functions[i]['text']=setCharAt(_functions[i]['text'],_aux,"("+_functions[_number]['text']+")")
                for(k=_aux-1;k>=j;k--){
                    _functions[i]['text']=setCharAt(_functions[i]['text'],j,'')
                }
                j= j-(_aux-j+1)-nr_of_digits(_number)+_functions[_number]['text'].length-1;
            }

            if(_functions[i]['text'][j]=='@'){
                var _aux=j+1;
                var _number=''
                while(!check_for_operation_sign(_functions[i]['text'][_aux]) && _aux<_functions[i]['text'].length){
                    _number+=_functions[i]['text'][_aux];
                    _aux++;
                }
                _number=parseInt(_number);
                _aux--;
                _number= parseInt(_old_opperations[_number].slice(1))
                _functions[i]['text']=setCharAt(_functions[i]['text'],_aux,"("+_functions[_number]['text']+")")
                for(k=_aux-1;k>=j;k--){
                    _functions[i]['text']=setCharAt(_functions[i]['text'],j,'')
                }
                j= j-(_aux-j+1)-nr_of_digits(_number)+_functions[_number]['text'].length-1;
            }
        }
    }
    var _functions_text=get_functions_text(_functions)
    _header=_header.concat(_functions_text);
    return _header;
}
function add_header(_header,variables){
    document.getElementById('truth_table').innerHTML='';
    var table = document.getElementById('truth_table');
    var header = table.createTHead();
    var row = header.insertRow(0);
    for(var i=0;i<_header.length;i++){
        var cell = row.insertCell(i);
        cell.innerHTML = _header[i];
    }
    var max_nr=(2 <<(variables.length-1))-1
    for(var i=0;i<=max_nr;i++){
        var table = document.getElementById('truth_table');
        var row = table.insertRow(i+1);
    for(j=0;j<_header.length;j++){
        var cell = row.insertCell(j);
        cell.innerHTML=' ';
        cell.id="cell_"+i+"_"+j;
    }
    }
    document.getElementById('truth_table').style.position="absolute";
    document.getElementById('truth_table').style.left="50%";
    document.getElementById('truth_table').style.transform="translate(-50%)";
}
function submit(){
    var _input_data=document.getElementById("input_data").value
    _input_data=_input_data.split(' ').join('')
    var variables=[]
    //getting the variables
    var k=0
    for(var i=0;i<_input_data.length;i++)
            if(_input_data[i].match(/[a-z]/i)){
                if(!search_for_val(variables,_input_data[i])){
                    variables[k]=_input_data[i];
                    k++;
                }
            }
    //getting opperations ⌐, ^ , ⌄ , -> , <-> , ↑ , ↓, ⊕
    var functions=[]
    var operations=[_input_data];
    operations=operations.concat(get_paranthesis(_input_data))
     var _old_opperations=[];       
    for(var i=0;i<operations.length;i++){
        for(var j=0;j<operations.length;j++){
            operations[j]=operations[j].split('('+operations[i]+')').join("@"+i)
        }
    }
    var _result=get_functions(operations);
    operations=_result['operations'].slice();
    var functions=_result['functions'].slice()
    for(var i=0;i<functions.length;i++){
        if(functions[i]['opperands'][0][0]=='@'){
            var index_value=functions[i]['opperands'][0].slice(1);
            index_value=parseInt(index_value);
            functions[i]['opperands'][0]=operations[index_value];
        }
        if(functions[i]['opperands'][1][0]=='@'){
            var index_value=functions[i]['opperands'][1].slice(1);
            index_value=parseInt(index_value);
            functions[i]['opperands'][1]=operations[index_value];
        }
    }
    _old_opperations=operations.slice();
    var _header=generate_header(variables,functions,_old_opperations)
    add_header(_header,variables)
    var solved_table=solve(functions,variables)
    console.log(solved_table);
    populate_truth_table(solved_table,_old_opperations,variables);
}

function get_paranthesis(_input_data){
    var i=0
    var operations=[]
    while(i<_input_data.length) {
        var _operation=""
        if(_input_data[i]=='('){
            var nr_of_parenthesis=1;
            var aux_index=i+1;
            while(nr_of_parenthesis>0){
                if(_input_data[aux_index]=='('){
                    nr_of_parenthesis++;
                }

                if(_input_data[aux_index]==')'){
                    nr_of_parenthesis--;
                }   
                _operation+=_input_data[aux_index];
                aux_index++;
            }
            _operation=_operation.slice(0, -1);
            operations.push(_operation);
        }
        i++;
    }    
    return operations;
}

function get_functions(_operations){
    var nr_of_functions=0;
    var functions=[];
    //checking for ⌐
for(var i=_operations.length-1;i>=0;i--){
    for(var j=0;j<_operations[i].length;j++){
        if(_operations[i][j]=='⌐'){
            var right_opperand="";
            var right_aux=j+1;
            while(!check_for_operation_sign(_operations[i][right_aux]) && right_aux<_operations[i].length){
                right_opperand+=_operations[i][right_aux];
                right_aux++;
            }
            functions.push({'function':not, 'opperands':[right_opperand,-1],'text':'⌐'+right_opperand});
            nr_of_functions++;
            right_aux--;
            _operations[i]=setCharAt(_operations[i],right_aux,'&'+(nr_of_functions-1));
            for(k=right_aux-1;k>=j;k--){
                _operations[i]=setCharAt(_operations[i],j,'');
            }
            j= j- (right_aux-j+1)+nr_of_digits(nr_of_functions)
        }
    }
}
    ///checking for ^ ⌄ ↑ ↓
   for(var i=_operations.length-1;i>=0;i--){
        for(var j=0;j<_operations[i].length;j++){
            if(_operations[i][j]=='^' || _operations[i][j]=='⌄' || _operations[i][j]=='↑' || _operations[i][j]=='↓'){
                var left_opperand="";
                var right_opperand="";
                var left_aux=j-1;
                while(!check_for_operation_sign(_operations[i][left_aux]) && left_aux>=0){
                    left_opperand=_operations[i][left_aux]+left_opperand;
                    left_aux--;
                }
                var right_aux=j+1;
                while(!check_for_operation_sign(_operations[i][right_aux]) && right_aux<_operations[i].length){
                    right_opperand+=_operations[i][right_aux];
                    right_aux++;
                }
                if(_operations[i][j]=='^'){
                    functions.push({'function':conjunction, 'opperands':[left_opperand,right_opperand],'text':left_opperand+'^'+right_opperand});
                    nr_of_functions++;
                }
                if(_operations[i][j]=='⌄'){
                    functions.push({'function':disjunction, 'opperands':[left_opperand,right_opperand],'text':left_opperand+'⌄'+right_opperand})
                    nr_of_functions++;
                }
                if(_operations[i][j]=='↑'){
                    functions.push({'function':nand, 'opperands':[left_opperand,right_opperand],'text':left_opperand+'↑'+right_opperand})
                    nr_of_functions++;
                }
                if(_operations[i][j]=='↓'){
                    functions.push({'function':nor, 'opperands':[left_opperand,right_opperand],'text':left_opperand+'↓'+right_opperand})
                    nr_of_functions++;
                }
                left_aux++;
                right_aux--;
                _operations[i]=setCharAt(_operations[i],right_aux,'&'+(nr_of_functions-1));
                for(k=right_aux-1;k>=left_aux;k--){
                    _operations[i]=setCharAt(_operations[i],left_aux,'');
                }
                j= j- (right_aux-left_aux+1)+nr_of_digits(nr_of_functions-1)
            }
        }
   }
//// checking for  → , ↔ , ⊕
   for(var i=_operations.length-1;i>=0;i--){
    for(var j=0;j<_operations[i].length;j++){
        if(_operations[i][j]=='→' || _operations[i][j]=='↔' || _operations[i][j]=='⊕'){
            var left_opperand="";
            var right_opperand="";
            var left_aux=j-1;
            while(!check_for_operation_sign(_operations[i][left_aux]) && left_aux>=0){
                left_opperand=_operations[i][left_aux]+left_opperand;
                left_aux--;
            }
            var right_aux=j+1;
            while(!check_for_operation_sign(_operations[i][right_aux]) && right_aux<_operations[i].length){
                right_opperand+=_operations[i][right_aux];
                right_aux++;
            }
            if(_operations[i][j]=='→'){
                functions.push({'function':implication, 'opperands':[left_opperand,right_opperand],'text':left_opperand+'→'+right_opperand});
                nr_of_functions++;
            }
            if(_operations[i][j]=='↔'){
                functions.push({'function':equivalence, 'opperands':[left_opperand,right_opperand],'text':left_opperand+'↔'+right_opperand})
                nr_of_functions++;
            }
            if(_operations[i][j]=='⊕'){
                functions.push({'function':xor, 'opperands':[left_opperand,right_opperand],'text':left_opperand+'⊕'+right_opperand})
                nr_of_functions++;
            }
            left_aux++;
            right_aux--;
            _operations[i]=setCharAt(_operations[i],right_aux,'&'+(nr_of_functions-1));
            for(k=right_aux-1;k>=left_aux;k--){
                _operations[i]=setCharAt(_operations[i],left_aux,'');
            }
            j= j- (right_aux-left_aux+1)+nr_of_digits(nr_of_functions)
        }
    }
}
for(var i=_operations.length-1;i>=0;i--){
    for(var j=0;j<_operations[i].length;j++){
        if(_operations[i][j]=='='){
            var left_opperand="";
            var right_opperand="";
            var left_aux=j-1;
            while(!check_for_operation_sign(_operations[i][left_aux]) && left_aux>=0){
                left_opperand=_operations[i][left_aux]+left_opperand;
                left_aux--;
            }
            var right_aux=j+1;
            while(!check_for_operation_sign(_operations[i][right_aux]) && right_aux<_operations[i].length){
                right_opperand+=_operations[i][right_aux];
                right_aux++;
            }
                functions.push({'function':equals, 'opperands':[left_opperand,right_opperand],'text':left_opperand+'='+right_opperand});
                nr_of_functions++;
            left_aux++;
            right_aux--;
            _operations[i]=setCharAt(_operations[i],right_aux,'&'+(nr_of_functions-1));
            for(k=right_aux-1;k>=left_aux;k--){
                _operations[i]=setCharAt(_operations[i],left_aux,'');
            }
            j= j- (right_aux-left_aux+1)+nr_of_digits(nr_of_functions)
        }
    }
}
   return {'functions':functions,'operations':_operations}
}